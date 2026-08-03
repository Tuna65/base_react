import {
  CloudUploadOutlined,
  EyeOutlined,
  FileTextOutlined,
  ProfileOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Collapse,
  Drawer,
  Empty,
  List,
  Modal,
  Spin,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import type { UploadProps } from "antd";
import axios from "axios";
import { Children, cloneElement, isValidElement, useEffect, useState } from "react";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const { Dragger } = Upload;
const { Paragraph, Text, Title } = Typography;

const API_BASE_URL = "http://localhost:8001/api/v1";

type DocumentPayload = {
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

type DocumentSummary = DocumentPayload & {
  fileName?: string;
  filename?: string;
  state?: string;
  status?: string;
  createdAt?: string;
};

type MarkdownPage = {
  page: number;
  markdown: string;
};

type MarkdownHeading = {
  label: string;
  level: number;
  page: number;
  title: string;
};

const normalizeMarkdown = (value: string) =>
  value
    .replace(/\r\n?/g, "\n")
    .replace(/\*\*\s+([^*\n]+?)\s*\*\*/g, "**$1**")
    .replace(/\*\*([^*\n]*?\S)\s+\*\*/g, "**$1**")
    .replace(/__\s+([^_\n]+?)\s*__/g, "__$1__")
    .replace(/__([^_\n]*?\S)\s+__/g, "__$1__")
    .replace(/~~\s+([^~\n]+?)\s*~~/g, "~~$1~~")
    .replace(/~~([^~\n]*?\S)\s+~~/g, "~~$1~~");

    // @ts-ignore
const renderTableCellContent = (children: ReactNode) =>// @ts-ignore
  Children.map(children, (child) => {
    if (typeof child === "string") {
      return child
        .split(/(~~[^~]+~~|\*\*[^*]+\*\*)/g)
        .map((part, index) => {
          if (part.startsWith("~~") && part.endsWith("~~")) {
            return <del key={`${part}-${index}`}>{part.slice(2, -2)}</del>;
          }
          // if (part.startsWith("**") && part.endsWith("**")) {
          //   return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
          // }
          return part;
        });
    }

    if (isValidElement<{ children?: ReactNode }>(child)) {
      return cloneElement(child, undefined, renderTableCellContent(child.props.children));
    }

    return child;
  });

const cleanHeadingTitle = (value: string) =>
  value
    .replace(/<[^>]+>/g, "")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~`]/g, "")
    .trim();

const extractMarkdownHeadings = (pages: MarkdownPage[]) => {
  const headings: MarkdownHeading[] = [];
  const seen = new Set<string>();

  const addHeading = (
    page: number,
    label: string,
    level: number,
    rawTitle: string,
  ) => {
    const title = cleanHeadingTitle(rawTitle);
    const key = `${page}:${title.toLocaleLowerCase()}`;

    if (title && !seen.has(key)) {
      seen.add(key);
      headings.push({ label, level, page, title });
    }
  };

  pages.forEach(({ page, markdown }) => {
    const markdownHeadingRegex = /^(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/gm;
    const htmlHeadingRegex =
      /<h([1-6])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>/gi;
    const markdownImportantRegex =
      /(\*\*|__)([^*\n_]+?)\1|(?<!\*)\*([^*\n]+?)\*(?!\*)/g;
    const htmlImportantRegex =
      /<(strong|b)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
    const matches: Array<{
      index: number;
      label: string;
      level?: number;
      title: string;
    }> = [];

    for (const match of markdown.matchAll(markdownHeadingRegex)) {
      matches.push({
        index: match.index,
        label: `H${match[1].length}`,
        level: match[1].length,
        title: match[2],
      });
    }

    for (const match of markdown.matchAll(htmlHeadingRegex)) {
      matches.push({
        index: match.index,
        label: `H${match[1]}`,
        level: Number(match[1]),
        title: match[2],
      });
    }

    for (const match of markdown.matchAll(markdownImportantRegex)) {
      matches.push({
        index: match.index,
        label: "Quan trọng",
        title: match[2] || match[3],
      });
    }

    for (const match of markdown.matchAll(htmlImportantRegex)) {
      matches.push({
        index: match.index,
        label: "Quan trọng",
        title: match[2],
      });
    }

    let currentHeadingLevel = 0;
    matches
      .sort((first, second) => first.index - second.index)
      .forEach((match) => {
        if (match.level) currentHeadingLevel = match.level;
        addHeading(
          page,
          match.label,
          (match.level ?? Math.min(currentHeadingLevel + 1, 6)) || 1,
          match.title,
        );
      });
  });

  return headings;
};

const getDocumentId = (payload: DocumentPayload) => {
  const data =
    payload.data && !Array.isArray(payload.data)
      ? (payload.data as DocumentPayload)
      : undefined;

  const documentId =
    payload.documentId ||
    payload.document_id ||
    payload.id ||
    data?.documentId ||
    data?.document_id ||
    data?.id;

  return documentId === undefined || documentId === null
    ? ""
    : String(documentId);
};

const getIssueKey = (payload: DocumentPayload): string => {
  const data =
    payload.data && !Array.isArray(payload.data)
      ? (payload.data as DocumentPayload)
      : undefined;

  return (
    payload.issueKey ||
    payload.issue_key ||
    data?.issueKey ||
    data?.issue_key ||
    ""
  );
};

const getMarkdownPages = (payload: DocumentPayload): MarkdownPage[] => {
  const nestedData =
    payload.data && !Array.isArray(payload.data)
      ? (payload.data as DocumentPayload)
      : undefined;
  const pageData =
    (Array.isArray(payload.content) && payload.content) ||
    (Array.isArray(payload.data) && payload.data) ||
    (Array.isArray(payload.pages) && payload.pages) ||
    (Array.isArray(nestedData?.content) && nestedData.content) ||
    (Array.isArray(nestedData?.pages) && nestedData.pages) ||
    (Array.isArray(nestedData?.data) && nestedData.data) ||
    [];

  const pages = pageData as Array<{
    page?: number;
    result?: string;
    markdown?: string;
    content?: string;
    text?: string;
  }>;

  const sortedPages = [...pages].sort(
    (first, second) => (first.page ?? 0) - (second.page ?? 0),
  );
  const pageOffset = sortedPages.some((page) => page.page === 0) ? 1 : 0;
  const pageResults = sortedPages
    .map((page, index) => ({
      page: page.page !== undefined ? page.page + pageOffset : index + 1,
      markdown: normalizeMarkdown(
        page.result || page.markdown || page.content || page.text || "",
      ),
    }))
    .filter((page) => Boolean(page.markdown));

  if (pageResults.length > 0) return pageResults;

  const singleMarkdown =
    payload.markdown ||
    payload.result ||
    nestedData?.markdown ||
    nestedData?.result ||
    "";

  return singleMarkdown
    ? [{ page: 1, markdown: normalizeMarkdown(singleMarkdown) }]
    : [];
};

const sliceHeadingSection = (
  fullText: string,
  heading: MarkdownHeading,
  allHeadings: MarkdownHeading[],
  headingIndex: number,
): string => {
  if (!heading || !fullText) return fullText;

  const currentLevel = heading.level ?? 1;
  const title = heading.title.trim();
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const startRegex = new RegExp(
    `(?:^(?:#{1,6}|<h[1-6][^>]*>|\\*\\*|__)\\s*.*?${escapedTitle}|.*?${escapedTitle})`,
    "im",
  );

  const startMatch = startRegex.exec(fullText);
  if (!startMatch) return fullText;

  const startIndex = startMatch.index;
  const contentFromHeading = fullText.slice(startIndex);
  const contentAfterHeader = contentFromHeading.slice(startMatch[0].length);

  // 1. Tìm tiêu đề tiếp theo trong danh sách có level <= currentLevel
  const nextHeading = allHeadings
    .slice(headingIndex + 1)
    .find((h) => h.level <= currentLevel);

  if (nextHeading && nextHeading.title) {
    const nextTitle = nextHeading.title.trim();
    const escapedNext = nextTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const nextRegex = new RegExp(
      `(?:^(?:#{1,6}|<h[1-6][^>]*>|\\*\\*|__)\\s*.*?${escapedNext}|.*?${escapedNext})`,
      "im",
    );

    const nextMatch = nextRegex.exec(contentAfterHeader);
    if (nextMatch) {
      const cutIndex = startMatch[0].length + nextMatch.index;
      return contentFromHeading.slice(0, cutIndex).trim();
    }
  }

  // 2. Fallback: Nếu không khớp tên tiêu đề chính xác, quét từng dòng tìm dòng tiêu đề có level <= currentLevel
  const lines = contentAfterHeader.split("\n");
  let cutLine = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const mdMatch = line.match(/^#{1,6}/);
    const htmlMatch = line.match(/^<h([1-6])/i);

    if (mdMatch) {
      const lineLevel = mdMatch[0].length;
      if (lineLevel <= currentLevel) {
        cutLine = i;
        break;
      }
    } else if (htmlMatch) {
      const lineLevel = Number(htmlMatch[1]);
      if (lineLevel <= currentLevel) {
        cutLine = i;
        break;
      }
    }
  }

  if (cutLine < lines.length) {
    const textBeforeCut = lines.slice(0, cutLine).join("\n");
    return (startMatch[0] + textBeforeCut).trim();
  }

  return contentFromHeading.trim();
};

export default function Preview() {
  const [markdown, setMarkdown] = useState("");
  const [markdownPages, setMarkdownPages] = useState<MarkdownPage[]>([]);
  const [documentId, setDocumentId] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [headings, setHeadings] = useState<MarkdownHeading[]>([]);
  const [headingModalOpen, setHeadingModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedHeadingIndex, setSelectedHeadingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  const uploadFile = async (file: File) => {
    setLoading(true);
    setError("");
    setMarkdown("");
    setMarkdownPages([]);
    setDocumentId("");
    setFileName(file.name);
    setSelectedHeadingIndex(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post<DocumentPayload>(
        `${API_BASE_URL}/document`,
        formData,
        {},
      );

      const uploadedDocumentId = getDocumentId(data);
      if (!uploadedDocumentId) {
        throw new Error("API không trả về documentId.");
      }

      setDocumentId(uploadedDocumentId);
      const pages = getMarkdownPages(data);
      setMarkdownPages(pages);
      setMarkdown(pages.map((page) => page.markdown).join("\n\n"));
      setHeadings(extractMarkdownHeadings(pages));
      setDetailDrawerOpen(true);
      message.success("Đã tải tài liệu lên thành công");
    } catch (err) {
      const detail = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ||
          err.message
        : err instanceof Error
          ? err.message
          : "Không thể tải tài liệu lên.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentDetail = async (
    selectedDocumentId = documentId,
    selectedFileName?: string,
  ) => {
    if (!selectedDocumentId) return;

    setDetailLoading(true);
    setDetailDrawerOpen(true);
    setSelectedHeadingIndex(null);
    setError("");
    setDocumentId(String(selectedDocumentId));
    if (selectedFileName) setFileName(selectedFileName);

    try {
      const { data } = await axios.get<DocumentPayload>(
        `${API_BASE_URL}/document/${encodeURIComponent(selectedDocumentId)}`,
      );

      const pages = getMarkdownPages(data);
      if (pages.length === 0) {
        throw new Error("Tài liệu chưa có kết quả Markdown.");
      }

      setMarkdownPages(pages);
      setMarkdown(pages.map((page) => page.markdown).join("\n\n"));
      setHeadings(extractMarkdownHeadings(pages));
      message.success("Đã lấy chi tiết tài liệu");
    } catch (err) {
      const detail = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ||
          err.message
        : err instanceof Error
          ? err.message
          : "Không thể lấy chi tiết tài liệu.";
      setError(detail);
    } finally {
      setDetailLoading(false);
    }
  };

  const getDocumentList = async () => {
    setListLoading(true);
    setError("");

    try {
      const { data } = await axios.get<
        DocumentSummary[] | {
          data?: DocumentSummary[];
          content?: DocumentSummary[];
        }
      >(`${API_BASE_URL}/document`);

      const documentList = Array.isArray(data)
        ? data
        : Array.isArray(data.content)
          ? data.content
          : Array.isArray(data.data)
            ? data.data
            : [];

      setDocuments(documentList);
      message.success(`Đã tải ${documentList.length} tài liệu`);
    } catch (err) {
      const detail = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ||
          err.message
        : err instanceof Error
          ? err.message
          : "Không thể lấy danh sách tài liệu.";
      setError(detail);
    } finally {
      setListLoading(false);
    }
  };

  // Tự động lấy danh sách tài liệu khi vào trang
  useEffect(() => {
    void getDocumentList();
  }, []);

  const uploadProps: UploadProps = {
    accept:
      ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    multiple: false,
    showUploadList: false,
    disabled: loading,
    beforeUpload: (file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      const isSupportedFile = extension === "pdf" || extension === "docx";

      if (!isSupportedFile) {
        message.error("Vui lòng chọn file PDF hoặc DOCX");
        return Upload.LIST_IGNORE;
      }

      void uploadFile(file as File);
      return false;
    },
  };

  const reset = () => {
    setMarkdown("");
    setMarkdownPages([]);
    setDocumentId("");
    setFileName("");
    setHeadings([]);
    setHeadingModalOpen(false);
    setError("");
  };

  const showHeadings = () => {
    const pages = markdownPages.length
      ? markdownPages
      : [{ page: 1, markdown }];
    setHeadings(extractMarkdownHeadings(pages));
    setHeadingModalOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <Title level={2} className="!mb-1">
            Nhận dạng tài liệu
          </Title>
          <Button
            icon={<UnorderedListOutlined />}
            loading={listLoading}
            onClick={() => void getDocumentList()}
          >
            Lấy danh sách
          </Button>
        </div>
        <Paragraph type="secondary" className="!mb-0">
          Tải lên một file PDF hoặc DOCX để chuyển nội dung thành Markdown.
        </Paragraph>
      </div>

      <Card className="mb-6">
        <Dragger {...uploadProps} className="!py-8">
          <p className="ant-upload-drag-icon">
            <CloudUploadOutlined />
          </p>
          <p className="ant-upload-text">
            Nhấn hoặc kéo thả file PDF, DOCX vào đây
          </p>
          <p className="ant-upload-hint">
            Mỗi lần xử lý một tài liệu PDF hoặc DOCX
          </p>
        </Dragger>
      </Card>

      {error && (
        <Alert
          className="mb-6"
          type="error"
          showIcon
          message="Không thể xử lý tài liệu"
          description={error}
        />
      )}

      {documents.length > 0 && (
        <Card title="Danh sách tài liệu" className="mb-6">
          <Table
            rowKey={(record) => String(getDocumentId(record))}
            dataSource={documents}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 700 }}
            columns={[
              {
                title: "ID",
                render: (_, record) => getDocumentId(record) || "—",
              },
              {
                title: "Tên file",
                render: (_, record) =>
                  record.fileName || record.filename || "—",
              },
              {
                title: "Issue Key",
                render: (_, record) => getIssueKey(record) || "—",
              },
              {
                title: "Trạng thái",
                render: (_, record) =>
                  record.state || record.status || "—",
              },
              {
                title: "Ngày tạo",
                dataIndex: "createdAt",
                render: (value?: string) =>
                  value ? new Date(value).toLocaleString("vi-VN") : "—",
              },
              {
                title: "",
                align: "right",
                render: (_, record) => {
                  const id = getDocumentId(record);
                  return (
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      disabled={!id}
                      onClick={() =>
                        void getDocumentDetail(
                          id,
                          record.fileName || record.filename,
                        )
                      }
                    >
                      Chi tiết
                    </Button>
                  );
                },
              },
            ]}
          />
        </Card>
      )}

      {/* ===== Document Detail Drawer ===== */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-primary" />
            <Text ellipsis>{fileName || "Chi tiết tài liệu OCR"}</Text>
            {documents.find((doc) => String(getDocumentId(doc)) === documentId) && (
              (() => {
                const doc = documents.find((doc) => String(getDocumentId(doc)) === documentId);
                const issueKeyVal = doc ? getIssueKey(doc) : "";
                return issueKeyVal ? (
                  <Tag color="blue" className="ml-2">
                    {issueKeyVal}
                  </Tag>
                ) : null;
              })()
            )}
          </div>
        }
        width="70%"
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
      >
        {detailLoading ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 py-16">
            <Spin size="large" />
            <Text type="secondary">Đang nhận dạng nội dung tài liệu...</Text>
          </div>
        ) : markdown ? (
          <div className="flex gap-6 items-start">
            {/* Left 30%: Table of Contents (Sticky) */}
            <div className="w-[30%] min-w-[240px] sticky top-0 self-start max-h-[calc(100vh-80px)] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                <ProfileOutlined className="text-blue-500 text-base" />
                <Text strong className="text-base text-gray-800">
                  Mục lục tài liệu
                </Text>
                <Tag color="blue" className="!ml-auto !mr-0">
                  {headings.length} mục
                </Tag>
              </div>

              {headings.length > 0 ? (
                <List
                  size="small"
                  dataSource={headings}
                  renderItem={(heading, idx) => {
                    const isSelected = selectedHeadingIndex === idx;
                    return (
                      <List.Item className="!border-0 !py-1 !px-0">
                        <div
                          className={`flex w-full items-center gap-2 cursor-pointer p-1.5 rounded-md transition-all ${
                            isSelected
                              ? "bg-blue-100 text-blue-700 font-semibold"
                              : "hover:bg-gray-200 text-gray-700"
                          }`}
                          style={{ paddingLeft: (heading.level - 1) * 12 + 6 }}
                          onClick={() => setSelectedHeadingIndex(idx)}
                        >
                          <Text
                            strong={heading.label.startsWith("H") || isSelected}
                            className={`max-w-[70%] text-sm ${isSelected ? "text-blue-700" : ""}`}
                            ellipsis={{ tooltip: heading.title }}
                          >
                            {heading.title}
                          </Text>
                          <span className="min-w-2 flex-1 border-b border-dotted border-gray-300" />
                          <Tag color={isSelected ? "blue" : "purple"} className="!m-0 text-xs">
                            Trang {heading.page}
                          </Tag>
                        </div>
                      </List.Item>
                    );
                  }}
                />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có mục lục" />
              )}
            </div>

            {/* Right 70%: Markdown Content Data */}
            <div className="w-[70%] flex flex-col gap-4">
              {selectedHeadingIndex !== null && headings[selectedHeadingIndex] && (
                <Alert
                  type="info"
                  showIcon
                  className="!mb-2"
                  message={
                    <div className="flex items-center justify-between">
                      <span>
                        Đang xem mục: <strong>{headings[selectedHeadingIndex].title}</strong> (Trang {headings[selectedHeadingIndex].page})
                      </span>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => setSelectedHeadingIndex(null)}
                        className="!p-0 !h-auto font-medium"
                      >
                        Xem tất cả nội dung
                      </Button>
                    </div>
                  }
                />
              )}

              {selectedHeadingIndex !== null && headings[selectedHeadingIndex] ? (
                <article className="markdown-body relative overflow-x-auto rounded-lg border border-gray-200 bg-white px-6 pb-14 pt-6 shadow-sm">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    urlTransform={(url) => {
                      const normalizedUrl = url.trim();
                      const isSafeUrl = /^(https?:|blob:|\/|\.\/|\.\.\/|#)/i.test(normalizedUrl);
                      const isEmbeddedImage = /^data:image\//i.test(normalizedUrl);
                      return isSafeUrl || isEmbeddedImage ? normalizedUrl : "";
                    }}
                    components={{
                      a: ({ children, ...props }) => (
                        <a {...props} target="_blank" rel="noreferrer">
                          {children}
                        </a>
                      ),
                      img: ({ alt, ...props }) => (
                        <img {...props} alt={alt || "Ảnh trong tài liệu OCR"} loading="lazy" />
                      ),
                      table: ({ children, ...props }) => (
                        <div className="overflow-x-auto">
                          <table {...props}>{children}</table>
                        </div>
                      ),
                      th: ({ children, node: _node, ...props }) => (
                        <th {...props}>{renderTableCellContent(children)}</th>
                      ),
                      td: ({ children, node: _node, ...props }) => (
                        <td {...props}>{renderTableCellContent(children)}</td>
                      ),
                    }}
                  >
                    {normalizeMarkdown(
                      sliceHeadingSection(
                        markdown,
                        headings[selectedHeadingIndex],
                        headings,
                        selectedHeadingIndex
                      )
                    )}
                  </ReactMarkdown>
                  <Tag color="purple" className="!absolute !bottom-4 !right-4 !m-0">
                    Trang {headings[selectedHeadingIndex].page}
                  </Tag>
                </article>
              ) : (
                (markdownPages.length ? markdownPages : [{ page: 1, markdown }]).map((markdownPage) => (
                  <article
                    key={markdownPage.page}
                    className="markdown-body relative overflow-x-auto rounded-lg border border-gray-200 bg-white px-6 pb-14 pt-6 shadow-sm"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      urlTransform={(url) => {
                        const normalizedUrl = url.trim();
                        const isSafeUrl = /^(https?:|blob:|\/|\.\/|\.\.\/|#)/i.test(normalizedUrl);
                        const isEmbeddedImage = /^data:image\//i.test(normalizedUrl);
                        return isSafeUrl || isEmbeddedImage ? normalizedUrl : "";
                      }}
                      components={{
                        a: ({ children, ...props }) => (
                          <a {...props} target="_blank" rel="noreferrer">
                            {children}
                          </a>
                        ),
                        img: ({ alt, ...props }) => (
                          <img {...props} alt={alt || "Ảnh trong tài liệu OCR"} loading="lazy" />
                        ),
                        table: ({ children, ...props }) => (
                          <div className="overflow-x-auto">
                            <table {...props}>{children}</table>
                          </div>
                        ),
                        th: ({ children, node: _node, ...props }) => (
                          <th {...props}>{renderTableCellContent(children)}</th>
                        ),
                        td: ({ children, node: _node, ...props }) => (
                          <td {...props}>{renderTableCellContent(children)}</td>
                        ),
                      }}
                    >
                      {normalizeMarkdown(markdownPage.markdown)}
                    </ReactMarkdown>
                    <Tag color="purple" className="!absolute !bottom-4 !right-4 !m-0">
                      Trang {markdownPage.page}
                    </Tag>
                  </article>
                ))
              )}
            </div>
          </div>
        ) : (
          <Empty
            className="my-16"
            description="Chưa có kết quả Markdown cho tài liệu này"
          />
        )}
      </Drawer>
    </div>
  );
}
