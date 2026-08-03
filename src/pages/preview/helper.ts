import axios from "axios";
import { Children, cloneElement, createElement, isValidElement } from "react";
import type { ComponentProps, ReactNode } from "react";

export type DocumentPayload = {
  id?: string | number;
  documentId?: string | number;
  document_id?: string | number;
  markdown?: string;
  result?: string;
  content?: unknown;
  data?: unknown;
  pages?: unknown;
  issueKey?: string;
  issue_key?: string;
};

export type DocumentSummary = DocumentPayload & {
  fileName?: string;
  filename?: string;
  state?: string;
  status?: string;
  createdAt?: string;
};

export type MarkdownPage = {
  page: number;
  markdown: string;
};

export type MarkdownHeading = {
  label: string;
  level: number;
  page: number;
  title: string;
};

export const normalizeMarkdown = (value: string) =>
  value
    .replace(/\r\n?/g, "\n")
    .replace(/\*\*\s+([^*\n]+?)\s*\*\*/g, "**$1**")
    .replace(/\*\*([^*\n]*?\S)\s+\*\*/g, "**$1**")
    .replace(/__\s+([^_\n]+?)\s*__/g, "__$1__")
    .replace(/__([^_\n]*?\S)\s+__/g, "__$1__")
    .replace(/~~\s+([^~\n]+?)\s*~~/g, "~~$1~~")
    .replace(/~~([^~\n]*?\S)\s+~~/g, "~~$1~~");

export const getDocumentId = (payload: DocumentPayload) => {
  const data = payload.data && !Array.isArray(payload.data) ? (payload.data as DocumentPayload) : undefined;
  const documentId = payload.documentId || payload.document_id || payload.id || data?.documentId || data?.document_id || data?.id;
  return documentId === undefined || documentId === null ? "" : String(documentId);
};

export const getIssueKey = (payload: DocumentPayload): string => {
  const data = payload.data && !Array.isArray(payload.data) ? (payload.data as DocumentPayload) : undefined;
  return payload.issueKey || payload.issue_key || data?.issueKey || data?.issue_key || "";
};

export const getMarkdownPages = (payload: DocumentPayload): MarkdownPage[] => {
  const nestedData = payload.data && !Array.isArray(payload.data) ? (payload.data as DocumentPayload) : undefined;
  const pageData =
    (Array.isArray(payload.content) && payload.content) ||
    (Array.isArray(payload.data) && payload.data) ||
    (Array.isArray(payload.pages) && payload.pages) ||
    (Array.isArray(nestedData?.content) && nestedData.content) ||
    (Array.isArray(nestedData?.pages) && nestedData.pages) ||
    (Array.isArray(nestedData?.data) && nestedData.data) ||
    [];
  const pages = pageData as Array<{ page?: number; result?: string; markdown?: string; content?: string; text?: string }>;
  const sortedPages = [...pages].sort((first, second) => (first.page ?? 0) - (second.page ?? 0));
  const pageOffset = sortedPages.some((page) => page.page === 0) ? 1 : 0;
  const pageResults = sortedPages
    .map((page, index) => ({
      page: page.page !== undefined ? page.page + pageOffset : index + 1,
      markdown: normalizeMarkdown(page.result || page.markdown || page.content || page.text || ""),
    }))
    .filter((page) => Boolean(page.markdown));

  if (pageResults.length > 0) return pageResults;
  const singleMarkdown = payload.markdown || payload.result || nestedData?.markdown || nestedData?.result || "";
  return singleMarkdown ? [{ page: 1, markdown: normalizeMarkdown(singleMarkdown) }] : [];
};

const cleanHeadingTitle = (value: string) =>
  value.replace(/<[^>]+>/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_~`]/g, "").trim();

export const extractMarkdownHeadings = (pages: MarkdownPage[]): MarkdownHeading[] => {
  const headings: MarkdownHeading[] = [];
  const seen = new Set<string>();

  pages.forEach(({ page, markdown }) => {
    for (const match of markdown.matchAll(/^(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/gm)) {
      const title = cleanHeadingTitle(match[2]);
      const key = `${page}:${title.toLowerCase()}`;
      if (title && !seen.has(key)) {
        seen.add(key);
        headings.push({ label: `H${match[1].length}`, level: match[1].length, page, title });
      }
    }
  });

  return headings;
};

export const getRequestErrorMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError(error)
    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
    : error instanceof Error ? error.message : fallback;

export const getDocumentList = (
  payload: DocumentSummary[] | { data?: DocumentSummary[]; content?: DocumentSummary[] },
) => (Array.isArray(payload) ? payload : payload.content || payload.data || []);

export const getDocumentContent = (payload: DocumentPayload) => {
  const pages = getMarkdownPages(payload);
  if (!pages.length) throw new Error("Document has no Markdown result.");

  return {
    pages,
    markdown: pages.map((page) => page.markdown).join("\n\n"),
    headings: extractMarkdownHeadings(pages),
  };
};

export const filterDocuments = (
  documents: DocumentSummary[],
  searchTerm: string,
  statusFilter: string,
) => {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  return documents.filter((document) => {
    const search = [document.fileName, document.filename, getIssueKey(document), getDocumentId(document)]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const status = String(document.state || document.status || "ready").toLowerCase();
    return (!normalizedSearch || search.includes(normalizedSearch)) && (statusFilter === "all" || status === statusFilter);
  });
};

export const getSafeMarkdownUrl = (url: string) => {
  const value = url.trim();
  return /^(https?:|blob:|\/|\.\/|\.\.\/|#|data:image\/)/i.test(value) ? value : "";
};

export const renderMarkdownTableCell = (children: ReactNode): ReactNode =>
  Children.map(children, (child) => {
    if (typeof child === "string") {
      return child.split(/(~~[^~]+~~)/g).map((part, index) =>
        part.startsWith("~~") && part.endsWith("~~")
          ? createElement("del", { key: `${part}-${index}` }, part.slice(2, -2))
          : part,
      );
    }

    return isValidElement<{ children?: ReactNode }>(child)
      ? cloneElement(child, undefined, renderMarkdownTableCell(child.props.children))
      : child;
  });

export const markdownComponents = {
  a: ({ children, ...props }: ComponentProps<"a">) =>
    createElement("a", { ...props, target: "_blank", rel: "noreferrer" }, children),
  img: ({ alt, ...props }: ComponentProps<"img">) =>
    createElement("img", { ...props, alt: alt || "Image in OCR document", loading: "lazy" }),
  table: ({ children, ...props }: ComponentProps<"table">) =>
    createElement("div", { className: "overflow-x-auto" }, createElement("table", props, children)),
  th: ({ children, node, ...props }: ComponentProps<"th"> & { node?: unknown }) => {
    void node;
    return createElement("th", props, renderMarkdownTableCell(children));
  },
  td: ({ children, node, ...props }: ComponentProps<"td"> & { node?: unknown }) => {
    void node;
    return createElement("td", props, renderMarkdownTableCell(children));
  },
};

export const getHeadingSection = (
  markdown: string,
  heading: MarkdownHeading,
  allHeadings: MarkdownHeading[],
  headingIndex: number,
) => {
  const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const title = escapeRegExp(heading.title.trim());
  const currentMatch = new RegExp(`^(#{1,6})\\s+.*${title}.*$`, "im").exec(markdown);
  if (!currentMatch) return markdown;

  const start = currentMatch.index;
  const currentLevel = currentMatch[1].length;
  const nextHeading = allHeadings
    .slice(headingIndex + 1)
    .find((item) => item.level <= currentLevel && item.title);

  if (!nextHeading) return markdown.slice(start).trim();

  const nextTitle = escapeRegExp(nextHeading.title.trim());
  const remainder = markdown.slice(start + currentMatch[0].length);
  const nextMatch = new RegExp(`^#{1,6}\\s+.*${nextTitle}.*$`, "im").exec(remainder);
  return nextMatch ? markdown.slice(start, start + currentMatch[0].length + nextMatch.index).trim() : markdown.slice(start).trim();
};
