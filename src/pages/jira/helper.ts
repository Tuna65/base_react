export interface JiraIssue {
  id?: number | string;
  jiraId?: string;
  key: unknown;
  projectKey?: unknown;
  summary: unknown;
  status: unknown;
  issueType: unknown;
  issuetype?: unknown;
  priority?: unknown;
  assignee?: unknown;
  sprint?: unknown;
  storyPoints?: unknown;
  created?: unknown;
  updated?: unknown;
  description?: unknown;
}

export interface SyncFormState {
  projectKey: string;
  defaultSprint: string;
  issueTypes: string[];
}

export const ISSUE_TYPE_OPTIONS = [
  { label: "Task", value: "Task" },
  { label: "Story", value: "Story" },
  { label: "Bug", value: "Bug" },
  { label: "Epic", value: "Epic" },
  { label: "Sub-task", value: "Sub-task" },
];

export const issueTypeColor: Record<string, string> = {
  Task: "blue", Story: "green", Bug: "red", Epic: "purple", "Sub-task": "cyan",
};

export const priorityColor: Record<string, string> = {
  Highest: "red", High: "orange", Medium: "gold", Low: "blue", Lowest: "default",
};

export const getStringValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    const item = value as Record<string, unknown>;
    return String(item.name || item.displayName || item.value || item.label || item.summary || "");
  }
  return String(value);
};

export const formatBytes = (bytes: number): string => {
  if (!bytes || Number.isNaN(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const getIssuesFromResponse = (data: unknown): JiraIssue[] => {
  if (Array.isArray(data)) return data as JiraIssue[];
  if (data && typeof data === "object") {
    const response = data as { issues?: unknown; items?: unknown; content?: unknown };
    const issues = response.issues || response.items || response.content;
    return Array.isArray(issues) ? issues as JiraIssue[] : [];
  }
  return [];
};

export const getIssuesTotal = (data: unknown, fallback: number): number => {
  if (data && typeof data === "object" && !Array.isArray(data) && "total" in data) {
    return Number((data as { total?: number }).total || fallback);
  }
  return fallback;
};

export const filterIssues = (issues: JiraIssue[], searchTerm: string, issueTypes: string[]): JiraIssue[] => {
  const query = searchTerm.trim().toLowerCase();
  return issues.filter((issue) => {
    const value = `${getStringValue(issue.key)} ${getStringValue(issue.summary)}`.toLowerCase();
    const type = getStringValue(issue.issuetype || issue.issueType);
    return value.includes(query) && (!issueTypes.length || issueTypes.includes(type));
  });
};

export const getDocumentNamesByIssue = (data: unknown): Record<string, string[]> => {
  const response = data as { data?: unknown[]; content?: unknown[] } | unknown[];
  const documents = Array.isArray(response) ? response : response.content || response.data || [];

  return documents.reduce<Record<string, string[]>>((result, item) => {
    const document = item as Record<string, unknown>;
    const nested = document.data as Record<string, unknown> | undefined;
    const issueKey = getStringValue(document.issueKey || document.issue_key || nested?.issueKey || nested?.issue_key);
    const name = getStringValue(document.fileName || document.filename || nested?.fileName || nested?.filename);
    if (issueKey && name) result[issueKey] = [...(result[issueKey] || []), name];
    return result;
  }, {});
};

export type MarkdownMajorSection = {
  title: string;
  start: number;
  level: number;
};

/** Extracts document-level headings and appendices from generated Markdown. */
export const extractMarkdownMajorSections = (markdown: string): MarkdownMajorSection[] => {
  const sections: MarkdownMajorSection[] = [];
  const pattern = /^(?:(#{1,6})\s+(.+?)|(?:#{1,6}\s*)?((?:phụ\s*lục|appendix)\b.*)|\*{0,2}((?:C\s*\d+(?:\.\d+)*|phase\s*\d+|giai\s*đoạn\s*\d+)\b.*)\*{0,2})\s*#*\s*$/gim;

  for (const match of markdown.matchAll(pattern)) {
    const title = (match[2] || match[3] || match[4] || "")
      .replace(/<[^>]+>/g, "")
      .replace(/[*_~`]/g, "")
      .trim();
    if (title) sections.push({ title, start: match.index ?? 0, level: match[1]?.length || 1 });
  }

  return sections;
};

/** Keeps the normal Plan outline, while hiding headings nested below C-level sections. */
export const extractPlanMajorSections = (markdown: string): MarkdownMajorSection[] => {
  // Stores the Markdown level of the current C section (for example, C1 or C2).
  let currentCLevel: number | null = null;

  // First extract the normal heading outline, then remove only child headings of a C section.
  return extractMarkdownMajorSections(markdown).filter((section) => {
    // A heading at the same or higher level ends the current C section scope.
    if (currentCLevel !== null && section.level <= currentCLevel) {
      currentCLevel = null;
    }

    // C1, C2, C3... remain visible and start a new scope that hides its children.
    if (/^C\s*\d+(?:\.\d+)*\s*[.:-]/i.test(section.title.trim())) {
      currentCLevel = section.level;
      return true;
    }

    // Keep normal headings outside a C scope; hide only headings nested inside it.
    return currentCLevel === null;
  });
};

export const getMarkdownMajorSection = (
  markdown: string,
  sections: MarkdownMajorSection[],
  sectionIndex: number,
) => {
  const current = sections[sectionIndex];
  if (!current) return markdown;
  const nextSection = sections
    .slice(sectionIndex + 1)
    .find((section) => section.level <= current.level);
  return markdown.slice(current.start, nextSection?.start).trim();
};
