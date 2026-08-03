import { jiraApi } from "@/apis/jira";
import { llmApi } from "@/apis/llm";
import { API_URL } from "@/configs/env";
import useApi from "@/apis/useApi";
import {
  SyncOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  ReloadOutlined,
  PaperClipOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  FileOutlined,
  FileImageOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Drawer,
  Empty,
  Flex,
  Input,
  message,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  TableProps,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Link, useSearchParams } from "react-router-dom";
import { PATHNAME } from "@/utils/Pathname";
import Overview from "./components/Overview";
import TestDesign from "./components/TestDesign";
import TestDesignHeader from "./components/TestDesignHeader";
import RequirementDrawer from "./components/RequirementDrawer";
import {
  ISSUE_TYPE_OPTIONS,
  JiraIssue,
  SyncFormState,
  formatBytes,
  filterIssues,
  getDocumentNamesByIssue,
  getIssuesFromResponse,
  getIssuesTotal,
  getStringValue,
  issueTypeColor,
  priorityColor,
} from "./helper";

const { Title, Text } = Typography;

// ===== Types =====
const statusIcon: Record<string, React.ReactNode> = {
  "To Do": <ClockCircleOutlined style={{ color: "#8c8c8c" }} />,
  "In Progress": <SyncOutlined spin style={{ color: "#1890ff" }} />,
  Done: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
};

// Helper để trích xuất chuỗi từ string hoặc object Jira API
const LegacyGeneralOverview = ({ detailData }: { detailData: Record<string, unknown> }) => {
  const issueKey = getStringValue(detailData.key) || "---";
  const requirementId = getStringValue(detailData.requirementId || detailData.requirement_id) || "---";
  const issueType = getStringValue(detailData.issueType || detailData.issuetype) || "Task";
  const sprint = getStringValue(detailData.sprint) || "TES Sprint 4";
  const lastSync = getStringValue(detailData.updated || detailData.updatedAt) || "---";
  const details = [["Requirement ID", requirementId], ["Type", issueType], ["Sprint", sprint], ["Assignee", getStringValue(detailData.assignee) || "---"], ["Sync status", "Synced"], ["Test design", "See /test-design"], ["Labels", "—"], ["Last sync", lastSync]];

  return <div className="-mx-6 -mt-6 text-[#1a2638]"><div className="border-b border-solid border-[#e5eaf1] px-6 pb-4 pt-3"><div className="mb-2 flex items-center gap-2 text-[12px] text-[#4f7fb8]"><span>{issueKey} ↗</span><span>•</span><span>{requirementId}</span><span>•</span><Tag className="!m-0 !border-blue-200 !bg-blue-50 !text-[#4f7fb8]">{issueType}</Tag></div><h2 className="m-0 text-[18px] font-bold">{getStringValue(detailData.summary) || "Untitled requirement"}</h2><div className="mt-2 text-[12px] text-[#66758d]">{sprint} • Last sync {lastSync}</div></div><div className="flex h-10 items-end gap-5 border-b border-solid border-[#e5eaf1] px-6 text-[13px] font-semibold text-[#64748b]"><span className="flex h-full items-center border-b-2 border-[#4f7fb8] text-[#4f7fb8]">▣ &nbsp; Overview</span><span className="flex h-full items-center">☷ &nbsp; Sub-tasks</span><span className="flex h-full items-center">♙ &nbsp; Test Design</span><span className="flex h-full items-center">⌘ &nbsp; Test Cases (0)</span><span className="flex h-full items-center">◴ &nbsp; Versions</span></div><div className="space-y-5 px-6 py-6 text-[13px]"><section><h3 className="mb-2 text-[12px] font-bold uppercase text-[#65738b]">Description</h3><p className="m-0 whitespace-pre-wrap leading-6">{getStringValue(detailData.description) || "---"}</p></section><section className="grid grid-cols-2 gap-x-10 gap-y-3">{details.map(([label, value]) => <div key={label} className="flex justify-between"><span className="font-bold uppercase text-[#65738b]">{label}</span><span>{value}</span></div>)}</section><section><h3 className="mb-2 text-[12px] font-bold uppercase text-[#65738b]">Traceability</h3><div className="space-y-2 rounded-lg border border-solid border-[#e1e8f0] bg-[#fbfaf7] p-3"><div>Jira: <span className="text-[#4f7fb8]">{issueKey}</span></div><div>↔ Requirement: {requirementId}</div><div>↔ Test Cases: 0 cases</div></div></section><section><div className="mb-2 flex justify-between"><h3 className="m-0 text-[12px] font-bold uppercase text-[#65738b]">Test Case Status</h3><span className="text-[#65738b]">Total: 0 · Pass rate <span className="text-[#4f7fb8]">0%</span></span></div><div className="rounded-lg border border-dashed border-[#cfd9e6] bg-[#fbfaf7] py-4 text-center text-[#69778d]">No test cases have been generated yet.</div></section><section><h3 className="mb-2 text-[12px] font-bold uppercase text-[#65738b]">▣ Test Data</h3><div className="rounded-lg border border-dashed border-[#cfd9e6] bg-[#fbfaf7] p-3 text-[#69778d]">No dataset linked to this requirement yet.</div></section><section><h3 className="mb-1 text-[12px] font-bold uppercase text-[#65738b]">RSD Documents</h3><div className="flex items-center justify-between"><div><div className="font-semibold">Related RSD Documents</div><div className="mt-1 text-[#69778d]">0 document(s) · 0 active · Linked to {requirementId}</div></div><div className="flex gap-2"><Button size="small">↗ &nbsp; Confluence link</Button><Button type="primary" size="small" className="!bg-[#5b83bb]">⇧ &nbsp; Upload RSD</Button></div></div><div className="mt-4 rounded-lg border border-dashed border-[#cfd9e6] bg-[#fbfaf7] py-8 text-center text-[#69778d]">▧<div className="mt-2 font-semibold text-[#1a2638]">No documents yet</div></div></section></div></div>;
};

void LegacyGeneralOverview;

const LegacyOverview = ({ detailData, onTestDesign }: { detailData: Record<string, unknown>; onTestDesign: () => void }) => {
  const issueKey = getStringValue(detailData.key) || "---";
  const requirementId = getStringValue(detailData.requirementId || detailData.requirement_id) || "---";
  const issueType = getStringValue(detailData.issueType || detailData.issuetype) || "Task";
  const sprint = getStringValue(detailData.sprint) || "TES Sprint 4";
  const lastSync = getStringValue(detailData.updated || detailData.updatedAt) || "---";
  const facts = [["Requirement ID", requirementId], ["Type", issueType], ["Sprint", sprint], ["Assignee", getStringValue(detailData.assignee) || "---"], ["Sync status", "Synced"], ["Test design", "See /test-design"], ["Labels", "—"], ["Last sync", lastSync]];

  return <div className=" text-[#1a2638]"><div className="px-6 pb-4 pt-3"><div className="mb-2 flex gap-2 text-[12px] text-[#4f7fb8]"><span>{issueKey} ↗</span><span>•</span><span>{requirementId}</span><Tag className="!m-0 !border-blue-200 !bg-blue-50 !text-[#4f7fb8]">{issueType}</Tag></div><h2 className="m-0 text-[18px] font-bold">{getStringValue(detailData.summary) || "Untitled requirement"}</h2><div className="mt-2 text-[12px] text-[#66758d]">{sprint} • Last sync {lastSync}</div></div><div className="flex h-10 items-end gap-5 border-b border-solid border-[#e5eaf1] px-6 text-[13px] font-semibold text-[#64748b]"><button type="button" className="h-full border-0 border-b-2 border-[#4f7fb8] bg-transparent px-0 text-[#4f7fb8]">Overview</button><button type="button" className="h-full border-0 bg-transparent">Sub-tasks</button><button type="button" onClick={onTestDesign} className="h-full cursor-pointer border-0 bg-transparent">Test Design</button><button type="button" className="h-full border-0 bg-transparent">Test Cases (0)</button><button type="button" className="h-full border-0 bg-transparent">Versions</button></div><div className="space-y-5 px-6 py-6 text-[13px]"><section><h3 className="mb-2 text-[12px] font-bold uppercase text-[#65738b]">Description</h3><p className="m-0 whitespace-pre-wrap">{getStringValue(detailData.description) || "---"}</p></section><section className="grid grid-cols-2 gap-x-10 gap-y-3">{facts.map(([label, value]) => <div key={label} className="flex justify-between"><span className="font-bold uppercase text-[#65738b]">{label}</span><span>{value}</span></div>)}</section><section><h3 className="mb-2 text-[12px] font-bold uppercase text-[#65738b]">Traceability</h3><div className="space-y-2 rounded-lg border border-solid border-[#e1e8f0] bg-[#fbfaf7] p-3">Jira: <span className="text-[#4f7fb8]">{issueKey}</span><div>↔ Requirement: {requirementId}</div><div>↔ Test Cases: 0 cases</div></div></section><section><h3 className="mb-2 text-[12px] font-bold uppercase text-[#65738b]">Test Case Status</h3><div className="rounded-lg border border-dashed border-[#cfd9e6] bg-[#fbfaf7] py-4 text-center text-[#69778d]">No test cases have been generated yet.</div></section><section><h3 className="mb-2 text-[12px] font-bold uppercase text-[#65738b]">Test Data</h3><div className="rounded-lg border border-dashed border-[#cfd9e6] bg-[#fbfaf7] p-3 text-[#69778d]">No dataset linked to this requirement yet.</div></section><section><h3 className="mb-2 text-[12px] font-bold uppercase text-[#65738b]">RSD Documents</h3><div className="rounded-lg border border-dashed border-[#cfd9e6] bg-[#fbfaf7] py-8 text-center text-[#69778d]">No documents yet</div></section></div></div>;
};

const LegacyTestDesignContent = ({ planLoading, planResult, verifyLoading, verifyResult, onPlan, onVerify }: { planLoading: boolean; planResult: unknown; verifyLoading: boolean; verifyResult: unknown; onPlan: () => void; onVerify: () => void }) => {
  const contentOf = (value: unknown) => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && "content" in value) return String((value as { content?: unknown }).content || "");
    return "";
  };
  const renderContent = (content: string, empty: string) => content ? <article className="markdown-body rounded-lg border border-gray-200 bg-white p-5"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown></article> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={empty} />;
  return <div className="px-6 py-5"><Tabs items={[{ key: "plan", label: <span><CalendarOutlined /> &nbsp;Plan</span>, children: <div><div className="mb-4 flex justify-end"><Button type="primary" loading={planLoading} onClick={onPlan} className="!bg-[#5b83bb]">{planResult ? "Regen Plan" : "Create Plan"}</Button></div>{planLoading ? <div className="py-12 text-center"><Spin /><div className="mt-3 text-[#66758d]">Đang tạo plan...</div></div> : renderContent(contentOf(planResult), "No plan has been generated yet.")}</div> }, { key: "verify", label: <span><SafetyCertificateOutlined /> &nbsp;Verify</span>, children: <div><div className="mb-4 flex justify-end"><Button type="primary" loading={verifyLoading} onClick={onVerify} className="!bg-[#5b83bb]">{verifyResult ? "Regen Verify" : "Run Verify"}</Button></div>{verifyLoading ? <div className="py-12 text-center"><Spin /><div className="mt-3 text-[#66758d]">Đang verify tài liệu...</div></div> : renderContent(contentOf(verifyResult), "No verification has been generated yet.")}</div> }]} /></div>;
};

const RequirementContextHeader = ({ detailData, onOverview }: { detailData: Record<string, unknown>; onOverview: () => void }) => {
  const issueKey = getStringValue(detailData.key) || "---";
  const requirementId = getStringValue(detailData.requirementId || detailData.requirement_id) || "---";
  const issueType = getStringValue(detailData.issueType || detailData.issuetype) || "Task";
  const sprint = getStringValue(detailData.sprint) || "TES Sprint 4";
  const lastSync = getStringValue(detailData.updated || detailData.updatedAt) || "---";
  return <div className="-mx-6 -mt-6 border-b border-solid border-[#e5eaf1] text-[#1a2638]"><div className="px-6 pb-4 pt-3"><div className="mb-2 flex gap-2 text-[12px] text-[#4f7fb8]"><span>{issueKey} ↗</span><span>•</span><span>{requirementId}</span><Tag className="!m-0 !border-blue-200 !bg-blue-50 !text-[#4f7fb8]">{issueType}</Tag></div><h2 className="m-0 text-[18px] font-bold">{getStringValue(detailData.summary) || "Untitled requirement"}</h2><div className="mt-2 text-[12px] text-[#66758d]">{sprint} • Last sync {lastSync}</div></div><div className="flex h-10 items-end gap-5 border-t border-solid border-[#e5eaf1] px-6 text-[13px] font-semibold text-[#64748b]"><button type="button" onClick={onOverview} className="h-full cursor-pointer border-0 bg-transparent px-0">Overview</button><button type="button" className="h-full border-0 bg-transparent">Sub-tasks</button><button type="button" className="h-full border-0 border-b-2 border-[#4f7fb8] bg-transparent px-0 text-[#4f7fb8]">Test Design</button><button type="button" className="h-full border-0 bg-transparent">Test Cases (0)</button><button type="button" className="h-full border-0 bg-transparent">Versions</button></div></div>;
};

void LegacyGeneralOverview;
void LegacyOverview;
void LegacyTestDesignContent;
void RequirementContextHeader;

const JiraPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  // ===== States =====
  const [issueList, setIssueList] = useState({ items: [] as JiraIssue[], total: 0, currentPage: 1, pageSize: 20 });
  const [loading, setLoading] = useState({ issues: false, sync: false, detail: false, plan: false, verify: false });
  const [sync, setSync] = useState({
    modalOpen: false,
    form: { projectKey: "TES", defaultSprint: "4", issueTypes: ["Task", "Story", "Bug"] } as SyncFormState,
  });
  const [drawer, setDrawer] = useState({
    open: false,
    data: null as any,
    tab: "general",
    section: "overview" as "overview" | "test-design",
  });
  const [testDesign, setTestDesign] = useState({ planResult: null as any, verifyResult: null as any });
  const [filters, setFilters] = useState({ projectKey: "TES", sprint: "4", issueTypes: [] as string[], searchTerm: "" });
  const { items: issues, total: totalCount, currentPage, pageSize } = issueList;
  const { issues: issuesLoading, sync: syncing, detail: detailLoading, plan: planLoading, verify: verifyLoading } = loading;
  const { modalOpen: syncModalOpen, form: syncForm } = sync;
  const { open: detailDrawerOpen, data: detailData, tab: detailTab, section: detailSection } = drawer;
  const { planResult, verifyResult } = testDesign;
  const { projectKey: filterProjectKey, sprint: filterSprint, issueTypes: filterIssueTypes, searchTerm } = filters;
  const updateIssueList = (next: Partial<typeof issueList>) => setIssueList((current) => ({ ...current, ...next }));
  const updateLoading = (next: Partial<typeof loading>) => setLoading((current) => ({ ...current, ...next }));
  const updateSync = (next: Partial<typeof sync>) => setSync((current) => ({ ...current, ...next }));
  const updateDrawer = (next: Partial<typeof drawer>) => setDrawer((current) => ({ ...current, ...next }));
  const updateTestDesign = (next: Partial<typeof testDesign>) => setTestDesign((current) => ({ ...current, ...next }));
  const urlIssueKey = searchParams.get("issueKey");
  const [documentNamesByIssue, setDocumentNamesByIssue] = useState<Record<string, string[]>>({});
  const { execute: requestIssues } = useApi<unknown>(jiraApi.getIssues);
  const { execute: requestSync } = useApi<unknown>(jiraApi.sync);
  const { execute: requestPlan } = useApi<unknown>(llmApi.plan);
  const { execute: requestVerify } = useApi<unknown>(llmApi.verify);
  const { execute: requestPlanState } = useApi<unknown>(jiraApi.updatePlanState);
  const { execute: requestVerifyState } = useApi<unknown>(jiraApi.updateVerifyState);
  const { execute: requestDocuments } = useApi<unknown>(() => axios.get(`${API_URL}/document`));

  const loadSavedPlan = async (issueKey: string) => {
    const response = await jiraApi.getPlan(issueKey);
    updateTestDesign({ planResult: response?.data || null });
  };

  const loadSavedVerify = async (issueKey: string) => {
    const response = await jiraApi.getVerify(issueKey);
    updateTestDesign({ verifyResult: response?.data || null });
  };

  // ===== LLM Plan API Call (POST /api/v1/llm/plan) =====
  const handleCreatePlan = async () => {
    if (!detailData) return;
    updateLoading({ plan: true });
    try {
      const payload = {
        issueKey: getStringValue(detailData.key),
      };
      const planState = await requestPlanState(payload.issueKey, "CREATING");
      if (!planState) return;
      const data = (await requestPlan(payload)) as { message?: string } | undefined;
      if (data?.message) {
        message.warning(data.message);
        return;
      }
      if (data) {
        await loadSavedPlan(payload.issueKey);
        message.success("Tạo Plan thành công!");
      }
    } catch (err: any) {
      console.error("Lỗi khi tạo Plan:", err);
    } finally {
      updateLoading({ plan: false });
    }
  };

  // ===== LLM Verify API Call (POST /api/v1/llm/verify) =====
  const handleVerify = async () => {
    if (!detailData) return;
    updateLoading({ verify: true });
    try {
      const payload = {
        issueKey: getStringValue(detailData.key),
      };
      const verifyState = await requestVerifyState(payload.issueKey, "VERIFYING");
      if (!verifyState) return;
      const data = await requestVerify(payload);
      if (data) {
        await loadSavedVerify(payload.issueKey);
        message.success("Verify task thành công!");
      }
    } catch (err: any) {
      console.error("Lỗi khi verify task:", err);
    } finally {
      updateLoading({ verify: false });
    }
  };

  const approvePlan = async (): Promise<boolean> => {
    const issueKey = getStringValue(detailData?.key);
    if (!issueKey) return false;

    const result = await requestPlanState(issueKey, "PASSED");
    if (!result) return false;
    updateTestDesign({ planResult: result });
    message.success("Plan đã được duyệt.");
    return true;
  };

  const approveVerify = async (): Promise<boolean> => {
    const issueKey = getStringValue(detailData?.key);
    if (!issueKey) return false;

    const result = await requestVerifyState(issueKey, "PASSED");
    if (!result) return false;
    updateTestDesign({ verifyResult: result });
    message.success("Verify đã được duyệt. Bạn có thể tạo Plan.");
    return true;
  };

  // ===== 1. GET /api/v1/jira/issues =====
  const fetchIssues = async (page = currentPage, limit = pageSize) => {
    updateLoading({ issues: true });
    try {
      const data = await requestIssues({
        projectKey: filterProjectKey || undefined,
        sprint: filterSprint || undefined,
        issueTypes: filterIssueTypes.length ? filterIssueTypes : undefined,
        maxResults: limit,
        startAt: (page - 1) * limit,
      });

      const issueList = getIssuesFromResponse(data);
      updateIssueList({ items: issueList, total: getIssuesTotal(data, issueList.length) });
    } catch (err: any) {
      console.error("Lỗi khi tải danh sách issues:", err);
      message.error(err?.response?.data?.message || "Không thể kết nối đến máy chủ API");
      updateIssueList({ items: [], total: 0 });
    } finally {
      updateLoading({ issues: false });
    }
  };

  // ===== 2. GET /api/v1/jira/issue?key=TES-123 (Detail) =====
  const handleOpenDetail = async (issueKey: string) => {
    if (!issueKey) return;
    updateDrawer({ open: true, data: null, tab: "general", section: "overview" });
    updateLoading({ detail: true });
    updateTestDesign({ planResult: null, verifyResult: null });

    try {
      void loadSavedPlan(issueKey);
      void loadSavedVerify(issueKey);
      const res = await jiraApi.getIssueDetail(issueKey);
      if (res && res.data) {
        updateDrawer({ data: res.data });
      } else {
        // Fallback search in list if detail API returns empty
        const found = issues.find(
          (item) => getStringValue(item.key) === issueKey || getStringValue(item.id) === issueKey
        );
        updateDrawer({ data: found || null });
      }
    } catch (err: any) {
      console.error("Lỗi khi lấy chi tiết task:", err);
    } finally {
      updateLoading({ detail: false });
    }
  };

  useEffect(() => {
    if (urlIssueKey) void handleOpenDetail(urlIssueKey);
  }, [urlIssueKey]);

  // ===== 3. POST /api/v1/jira/sync =====
  const handleSync = async () => {
    updateLoading({ sync: true });
    try {
      const payload = {
        projectKey: syncForm.projectKey,
        defaultSprint: syncForm.defaultSprint,
        issueTypes: syncForm.issueTypes,
      };

      const data = (await requestSync(payload)) as
        | { syncedCount?: number; count?: number }
        | undefined;
      const syncedCount = data?.syncedCount ?? data?.count;
      message.success(`Đồng bộ Jira thành công! ${syncedCount !== undefined ? `(${syncedCount} tasks)` : ""}`);
      updateSync({ modalOpen: false });
      await fetchIssues(1, pageSize);
    } catch (err: any) {
      console.error("Lỗi khi sync task Jira:", err);
      message.error(err?.response?.data?.message || "Đồng bộ thất bại");
    } finally {
      updateLoading({ sync: false });
    }
  };

  // Tự động load danh sách khi mở trang
  useEffect(() => {
    fetchIssues(1, pageSize);
  }, []);

  useEffect(() => {
    const loadDocumentNames = async () => {
      try {
        const data = await requestDocuments();
        setDocumentNamesByIssue(getDocumentNamesByIssue(data));
      } catch {
        setDocumentNamesByIssue({});
      }
    };

    void loadDocumentNames();
  }, []);

  // ===== Columns configuration =====
  const columns: TableProps<JiraIssue>["columns"] = [
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
      width: 120,
      render: (val: any) => {
        const str = getStringValue(val);
        return (
          <Text
            strong
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDetail(str);
            }}
          >
            {str || "---"}
          </Text>
        );
      },
    },
    {
      title: "Loại Task",
      dataIndex: "issuetype",
      key: "issuetype",
      width: 140,
      align: "center",
      render: (val: any, record: any) => {
        const targetVal = val || record.issueType;
        const name = typeof targetVal === "object" ? targetVal?.name : targetVal;
        const iconUrl = typeof targetVal === "object" ? targetVal?.iconUrl : undefined;
        const displayTitle = name || getStringValue(targetVal) || "---";

        return (
          <Tag color={issueTypeColor[displayTitle] || "default"} className="rounded-full px-3 py-0.5 inline-flex items-center gap-1.5">
            {iconUrl && (
              <img
                src={iconUrl}
                alt={displayTitle}
                style={{ width: 14, height: 14, objectFit: "contain", verticalAlign: "middle" }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            )}
            <span>{displayTitle}</span>
          </Tag>
        );
      },
    },
    {
      title: "Tiêu đề",
      dataIndex: "summary",
      key: "summary",
      ellipsis: true,
      render: (val: any) => {
        const summaryStr = getStringValue(val);
        return (
          <Tooltip title={summaryStr}>
            <Text>{summaryStr || "---"}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      align: "center",
      render: (val: any) => {
        const statusStr = getStringValue(val);
        return (
          <Space>
            {statusIcon[statusStr] || <ExclamationCircleOutlined style={{ color: "#faad14" }} />}
            <Text>{statusStr || "---"}</Text>
          </Space>
        );
      },
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 120,
      align: "center",
      render: (val: any) => {
        const priorityStr = getStringValue(val);
        return <Tag color={priorityColor[priorityStr] || "default"}>{priorityStr || "---"}</Tag>;
      },
    },
    {
      title: "Người thực hiện",
      dataIndex: "assignee",
      key: "assignee",
      width: 160,
      render: (val: any) => {
        const assigneeStr = getStringValue(val);
        return <Text>{assigneeStr || "Chưa gán"}</Text>;
      },
    },
    {
      title: "Sprint",
      dataIndex: "sprint",
      key: "sprint",
      width: 110,
      render: (val: any) => {
        const sprintStr = getStringValue(val);
        return <Text>{sprintStr || "---"}</Text>;
      },
    },
    {
      title: "Story Points",
      dataIndex: "storyPoints",
      key: "storyPoints",
      width: 110,
      align: "center",
      render: (val: any) => {
        const pts = typeof val === "number" ? val : typeof val === "object" ? val?.value || val?.points : undefined;
        return pts ? <Badge count={pts} style={{ backgroundColor: "#5932ea" }} /> : <Text type="secondary">---</Text>;
      },
    },
  ];

  const requirementColumns: TableProps<JiraIssue>["columns"] = [
    { title: "Key", width: 100, render: (_, record) => { const key = getStringValue(record.key); return key ? <a href={`https://jira.alphawaytech.com/browse/${encodeURIComponent(key)}`} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="text-[12px] font-medium text-[#4f7fb8] hover:underline">{key} ↗</a> : "-"; } },
    { title: "Summary", render: (_, record) => <Text className="text-[13px] text-[#071b3b]">{getStringValue(record.summary) || "-"}</Text> },
    { title: "Type", width: 100, align: "center", render: (_, record) => { const type = getStringValue(record.issuetype || record.issueType); return <Tag className={`!m-0 !rounded-md !px-2 !py-0 !text-[12px] ${type === "Bug" ? "!border-pink-200 !bg-pink-50 !text-pink-600" : type === "Story" ? "!border-emerald-200 !bg-emerald-50 !text-emerald-700" : "!border-blue-200 !bg-blue-50 !text-blue-600"}`}>{type || "Task"}</Tag>; } },
    { title: "Sprint", width: 140, render: (_, record) => <Text className="text-[13px]">{getStringValue(record.sprint) || "TES Sprint 4"}</Text> },
    { title: "Assignee", width: 170, render: (_, record) => <Text className="text-[13px]">{getStringValue(record.assignee) || "-"}</Text> },
    { title: "Status", width: 150, render: (_, record) => <span className={`inline-flex min-w-[128px] items-center justify-between rounded-md border px-2.5 py-1 text-[12px] ${getStringValue(record.status) === "In Progress" ? "border-[#bfd6ef] bg-[#eef6ff] text-[#4678b5]" : "border-[#eadfc5] bg-[#f2ead8] text-[#071b3b]"}`}>{getStringValue(record.status) || "To Do"}<span className="text-[#7d8796]">⌄</span></span> },
    { title: "Documents", width: 210, render: (_, record) => { const key = getStringValue(record.key); const names = documentNamesByIssue[key] || []; return names.length ? <Link to={`${PATHNAME.KNOWLEDGE}?issueKey=${encodeURIComponent(key)}`} onClick={(event) => event.stopPropagation()} className="block truncate text-[12px] font-medium text-[#5b83bb] hover:underline" title={names.join(", ")}>{names[0]}{names.length > 1 ? ` +${names.length - 1}` : ""}</Link> : "---"; } },
    { title: "ACTIONS", width: 190, align: "center", render: (_, record) => { const key = getStringValue(record.key); return <div className="flex items-center justify-center gap-2"><Button type="text" size="small" onClick={(event) => { event.stopPropagation(); void handleOpenDetail(key); }} className="!h-7 !bg-[#f7faff] !px-2 !text-[12px] !text-[#5b83bb]">✧ Design</Button><Button type="text" size="small" className="!h-7 !bg-[#f8fffb] !px-2 !text-[12px] !text-[#64b69a]">♧ Cases</Button></div>; } },
  ];

  const visibleIssues = filterIssues(issues, searchTerm, filterIssueTypes);

  return (
    <div className="w-full px-0 py-1 text-[#071b3b]">
      {false && (<><Flex vertical gap={24}>
        {/* ===== Top Header Bar ===== */}
        <Flex justify="space-between" align="center">
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Quản lý Jira Tasks
            </Title>
            <Text type="secondary">Danh sách tasks đồng bộ từ hệ thống Jira (Nhấn vào hàng để xem chi tiết)</Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => fetchIssues(currentPage, pageSize)} loading={issuesLoading}>
              Tải lại
            </Button>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => updateSync({ modalOpen: true })} size="large">
              Sync task từ Jira
            </Button>
          </Space>
        </Flex>

        {/* ===== Filter Card ===== */}
        <Card size="small">
          <Flex gap={16} align="center" wrap="wrap">
            <Space>
              <FilterOutlined />
              <Text strong>Bộ lọc:</Text>
            </Space>
            <Input
              placeholder="Project Key (VD: TES)"
              value={filterProjectKey}
              onChange={(e) => setFilters((current) => ({ ...current, projectKey: e.target.value }))}
              style={{ width: 180 }}
              allowClear
            />
            <Input
              placeholder="Sprint (VD: 9)"
              value={filterSprint}
              onChange={(e) => setFilters((current) => ({ ...current, sprint: e.target.value }))}
              style={{ width: 140 }}
              allowClear
            />
            <Select
              mode="multiple"
              placeholder="Loại Issue"
              value={filterIssueTypes}
              onChange={(issueTypes) => setFilters((current) => ({ ...current, issueTypes }))}
              options={ISSUE_TYPE_OPTIONS}
              style={{ minWidth: 220 }}
              allowClear
            />
            <Button
              type="primary"
              onClick={() => {
                updateIssueList({ currentPage: 1 });
                fetchIssues(1, pageSize);
              }}
              loading={issuesLoading}
            >
              Lọc
            </Button>
          </Flex>
        </Card>

        {/* ===== Issues Table ===== */}
        <div className="border border-solid border-black border-opacity-10 rounded-lg overflow-hidden">
          <Table
            columns={columns}
            dataSource={issues}
            rowKey={(record, index) => {
              const k = getStringValue(record.key) || getStringValue(record.id);
              return k || `task-${index}`;
            }}
            loading={issuesLoading}
            onRow={(record) => ({
              onClick: () => {
                const k = getStringValue(record.key) || getStringValue(record.id);
                if (k) handleOpenDetail(k);
              },
              style: { cursor: "pointer" },
            })}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalCount,
              onChange: (page, size) => {
                updateIssueList({ currentPage: page, pageSize: size });
                fetchIssues(page, size);
              },
              showSizeChanger: true,
              showTotal: (total) => `Tổng số ${total} tasks`,
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Chưa có task nào. Hãy nhấn 'Sync task từ Jira'!"
                />
              ),
            }}
            bordered
            scroll={{ x: 1000 }}
          />
        </div>
      </Flex></>)}

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[12px] text-[#526889]"><span className="rounded-md bg-[#d7e7f6] px-2 py-0.5 font-semibold text-[#4f7fb8]">Workspace_16/07/2026</span><span>Sync Jira tasks/stories into Requirements so QA can generate Test Designs &amp; Test Cases.</span></div>
          <div className="flex items-center gap-2"><SyncOutlined className="text-[18px] text-[#4f7fb8]" /><h1 className="m-0 text-[22px] font-bold">Requirements</h1></div>
        </div>
        <div className="flex gap-2"><Link to={PATHNAME.KNOWLEDGE}><Button className="!h-9 !rounded-lg !font-semibold">KnowledgeHub</Button></Link><Button className="!h-9 !rounded-lg !font-semibold">⌘ &nbsp; Mapped: TES</Button><Button disabled className="!h-9 !rounded-lg !font-semibold">⇧ &nbsp; Push to Jira</Button><Button type="primary" loading={syncing} onClick={() => updateSync({ modalOpen: true })} className="!h-9 !rounded-lg !bg-[#5b83bb] !px-4 !font-semibold">⟳ &nbsp; Sync Tasks</Button></div>
      </div>

      <div className="mb-6 rounded-xl border border-solid border-[#e1e8f0] bg-white px-4 py-4"><div className="flex items-center gap-3"><CheckCircleOutlined className="text-[17px] text-[#10a360]" /><div><div className="text-[14px] font-semibold">Ready to sync · Jira Project: TES</div><div className="mt-1 text-[12px] text-[#526889]">https://jira.alphawaytech.com · Shared across all projects in this workspace</div></div></div></div>

      <div className="mb-6 grid grid-cols-4 gap-3">{[
        ["SYNCED ITEMS", `${totalCount || issues.length}`, `/ ${totalCount || issues.length}`],
        ["TEST DESIGN APPROVED", "0", `/ ${totalCount || issues.length}`],
        ["TEST CASES GENERATED", "113", ""],
        ["LAST SYNC", "2026-07-30T08:35:55.041Z", ""],
      ].map(([label, value, suffix]) => <div key={label} className="min-h-[88px] rounded-xl border border-solid border-[#e1e8f0] bg-white px-4 py-4"><div className="text-[11px] font-semibold text-[#526889]">{label}</div><div className={`${label === "LAST SYNC" ? "mt-1 text-[14px]" : "mt-1 text-[24px]"} font-bold`}>{value}<span className="ml-1 text-[12px] font-medium text-[#526889]">{suffix}</span></div></div>)} </div>

      <div className="mb-6 flex items-center gap-2"><div className="flex h-9 w-[448px] items-center gap-2 rounded-md border border-solid border-[#d9e2ef] bg-white px-3"><SearchOutlined className="text-[#71809a]" /><input value={searchTerm} onChange={(event) => setFilters((current) => ({ ...current, searchTerm: event.target.value }))} placeholder="Search by Jira key or summary..." className="h-full w-full border-0 bg-transparent text-[13px] outline-none placeholder:text-[#71809a]" /></div><Select value={filterIssueTypes[0] || "all"} onChange={(value) => setFilters((current) => ({ ...current, issueTypes: value === "all" ? [] : [value] }))} options={[{ label: "All types", value: "all" }, ...ISSUE_TYPE_OPTIONS]} className="w-[140px]" /><Select value={filterSprint || "4"} onChange={(sprint) => setFilters((current) => ({ ...current, sprint }))} options={[{ label: "TES Sprint 4", value: "4" }, { label: "All sprints", value: "" }]} className="w-[140px]" /></div>

      <div className="overflow-hidden rounded-xl border border-solid border-[#e1e8f0] bg-white"><Table className="app-data-table" columns={requirementColumns} dataSource={visibleIssues} loading={issuesLoading} rowKey={(record, index) => getStringValue(record.key) || getStringValue(record.id) || `issue-${index}`} onRow={(record) => ({ onClick: () => { const key = getStringValue(record.key) || getStringValue(record.id); if (key) void handleOpenDetail(key); }, className: "cursor-pointer" })} pagination={{ current: currentPage, pageSize, total: totalCount, onChange: (page, size) => { updateIssueList({ currentPage: page, pageSize: size }); void fetchIssues(page, size); }, showSizeChanger: true }} locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No synced requirements" /> }} scroll={{ x: 1050 }} /></div>

      {/* ===== Sync Modal ===== */}
      <Modal
        title={
          <Space>
            <SyncOutlined style={{ color: "#1890ff" }} />
            <span>Đồng bộ Task từ Jira</span>
          </Space>
        }
        open={syncModalOpen}
        onCancel={() => updateSync({ modalOpen: false })}
        onOk={handleSync}
        confirmLoading={syncing}
        okText="Bắt đầu Sync"
        cancelText="Hủy"
        width={480}
      >
        <Flex vertical gap={16} style={{ paddingTop: 16 }}>
          <div>
            <Text strong>Project Key</Text>
            <Input
              placeholder="VD: TES"
              value={syncForm.projectKey}
              onChange={(e) => updateSync({ form: { ...syncForm, projectKey: e.target.value } })}
              size="large"
              style={{ marginTop: 4 }}
            />
          </div>

          <div>
            <Text strong>Default Sprint</Text>
            <Input
              placeholder="VD: 9"
              value={syncForm.defaultSprint}
              onChange={(e) => updateSync({ form: { ...syncForm, defaultSprint: e.target.value } })}
              size="large"
              style={{ marginTop: 4 }}
            />
          </div>

          <div>
            <Text strong>Issue Types</Text>
            <Select
              mode="multiple"
              placeholder="Chọn loại issue"
              value={syncForm.issueTypes}
              onChange={(issueTypes) => updateSync({ form: { ...syncForm, issueTypes } })}
              options={ISSUE_TYPE_OPTIONS}
              style={{ width: "100%", marginTop: 4 }}
              size="large"
            />
          </div>
        </Flex>
      </Modal>

      {/* ===== Issue Detail Drawer ===== */}
      {false && <Drawer
        title={null}
        closable={false}
        styles={{ header: { display: "none" } }}
        width="50%"
        open={detailDrawerOpen}
        onClose={() => updateDrawer({ open: false })}
      >
        {detailLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Spin size="large" />
            <Text type="secondary">Đang tải chi tiết task...</Text>
          </div>
        ) : detailData ? (
          <>
            {detailSection === "overview" ? <Overview detailData={detailData} /> : <><TestDesignHeader detailData={detailData} onOverview={() => updateDrawer({ section: "overview" })} onTestDesign={() => updateDrawer({ section: "test-design" })} /><TestDesign planLoading={planLoading} planResult={planResult} verifyLoading={verifyLoading} verifyResult={verifyResult} onPlan={() => void handleCreatePlan()} onVerify={() => void handleVerify()} onApprovePlan={approvePlan} onApproveVerify={approveVerify} /></>}
            {false && <Tabs
            className="requirements-detail-tabs"
            activeKey={detailTab}
            onChange={(tab) => updateDrawer({ tab })}
            items={[
              {
                key: "general",
                label: (
                  <span>
                    <InfoCircleOutlined /> Overview
                  </span>
                ),
                children: (
                  <>
                    <Overview detailData={detailData} />
                    {false && (
                  <Flex vertical gap={20} style={{ paddingTop: 8 }}>
                    {/* Header Summary Card */}
                    <Card size="small" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}>
                      <Title level={4} style={{ marginTop: 0, marginBottom: 8 }}>
                        {getStringValue(detailData.summary) || "Chưa có tiêu đề"}
                      </Title>
                      <Flex gap={8} wrap="wrap">
                        <Tag color={issueTypeColor[getStringValue(detailData.issueType || detailData.issuetype)] || "default"}>
                          {getStringValue(detailData.issueType || detailData.issuetype) || "Task"}
                        </Tag>
                        <Tag color="blue">{getStringValue(detailData.status) || "Status"}</Tag>
                        <Tag color={priorityColor[getStringValue(detailData.priority)] || "default"}>
                          {getStringValue(detailData.priority) || "Priority"}
                        </Tag>
                        {detailData.projectKey && <Tag color="purple">Project: {getStringValue(detailData.projectKey)}</Tag>}
                      </Flex>
                    </Card>

                    {/* Comprehensive Descriptions Table */}
                    <Descriptions title="Thông tin chung" bordered column={2} size="small">
                      <Descriptions.Item label="Issue Key">{getStringValue(detailData.key) || "---"}</Descriptions.Item>
                      <Descriptions.Item label="Jira ID">{getStringValue(detailData.jiraId || detailData.id) || "---"}</Descriptions.Item>
                      <Descriptions.Item label="Project Key">{getStringValue(detailData.projectKey) || "---"}</Descriptions.Item>
                      <Descriptions.Item label="Loại Issue">{getStringValue(detailData.issueType || detailData.issuetype) || "---"}</Descriptions.Item>
                      <Descriptions.Item label="Trạng thái">{getStringValue(detailData.status) || "---"}</Descriptions.Item>
                      <Descriptions.Item label="Độ ưu tiên">{getStringValue(detailData.priority) || "---"}</Descriptions.Item>
                      <Descriptions.Item label="Người thực hiện (Assignee)">{getStringValue(detailData.assignee) || "Chưa gán"}</Descriptions.Item>
                      <Descriptions.Item label="Người báo cáo (Reporter)">{getStringValue(detailData.reporter) || "---"}</Descriptions.Item>
                      <Descriptions.Item label="Người tạo (Creator)">{getStringValue(detailData.creator) || "---"}</Descriptions.Item>
                      <Descriptions.Item label="Sprint">{getStringValue(detailData.sprint) || "---"}</Descriptions.Item>
                      <Descriptions.Item label="Story Points">{detailData.storyPoints ?? "---"}</Descriptions.Item>
                      <Descriptions.Item label="Resolution">{getStringValue(detailData.resolution) || "Unresolved"}</Descriptions.Item>
                      <Descriptions.Item label="Ngày tạo">{detailData.created || detailData.createdAt || "---"}</Descriptions.Item>
                      <Descriptions.Item label="Ngày cập nhật">{detailData.updated || detailData.updatedAt || "---"}</Descriptions.Item>
                      {detailData.labels && (
                        <Descriptions.Item label="Nhãn (Labels)" span={2}>
                          {Array.isArray(detailData.labels)
                            ? detailData.labels.map((lbl: any, idx: number) => <Tag key={idx} color="cyan">{getStringValue(lbl)}</Tag>)
                            : getStringValue(detailData.labels)}
                        </Descriptions.Item>
                      )}
                      {detailData.components && (
                        <Descriptions.Item label="Thành phần (Components)" span={2}>
                          {Array.isArray(detailData.components)
                            ? detailData.components.map((comp: any, idx: number) => <Tag key={idx} color="geekblue">{getStringValue(comp)}</Tag>)
                            : getStringValue(detailData.components)}
                        </Descriptions.Item>
                      )}
                    </Descriptions>

                    {/* Mô tả chi tiết */}
                    {detailData.description && (
                      <div>
                        <Text strong style={{ display: "block", marginBottom: 8, fontSize: 15 }}>
                          Mô tả chi tiết (Description):
                        </Text>
                        <Card size="small" style={{ background: "#f9fafb", borderRadius: 8 }}>
                          <Text style={{ whiteSpace: "pre-wrap" }}>{getStringValue(detailData.description)}</Text>
                        </Card>
                      </div>
                    )}

                    {/* Tệp đính kèm (Attachments) */}
                    {((detailData.attachment && Array.isArray(detailData.attachment) && detailData.attachment.length > 0) ||
                      (detailData.attachments && Array.isArray(detailData.attachments) && detailData.attachments.length > 0)) && (
                      <div>
                        <Text strong style={{ display: "block", marginBottom: 8, fontSize: 15 }}>
                          <PaperClipOutlined style={{ marginRight: 6 }} />
                          Tệp đính kèm ({((detailData.attachment || detailData.attachments) as any[]).length}):
                        </Text>
                        <Flex vertical gap={8}>
                          {((detailData.attachment || detailData.attachments) as any[]).map((file: any, idx: number) => {
                            const isPdf = file.mimeType?.includes("pdf") || file.filename?.endsWith(".pdf");
                            const isImage = file.mimeType?.includes("image") || /\.(png|jpe?g|gif|webp)$/i.test(file.filename);

                            return (
                              <Card key={file.id || idx} size="small" style={{ background: "#f8fafc" }}>
                                <Flex justify="space-between" align="center">
                                  <Flex align="center" gap={10} style={{ overflow: "hidden" }}>
                                    {isPdf ? (
                                      <FilePdfOutlined style={{ fontSize: 20, color: "#ff4d4f" }} />
                                    ) : isImage ? (
                                      <FileImageOutlined style={{ fontSize: 20, color: "#52c41a" }} />
                                    ) : (
                                      <FileOutlined style={{ fontSize: 20, color: "#1890ff" }} />
                                    )}
                                    <div style={{ overflow: "hidden" }}>
                                      <Text strong ellipsis style={{ display: "block" }}>
                                        {file.filename || file.name || "Tệp đính kèm"}
                                      </Text>
                                      {file.size && (
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                          {formatBytes(file.size)}
                                        </Text>
                                      )}
                                    </div>
                                  </Flex>
                                  {file.content && (
                                    <Button
                                      type="primary"
                                      ghost
                                      size="small"
                                      icon={<DownloadOutlined />}
                                      href={file.content}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Tải về
                                    </Button>
                                  )}
                                </Flex>
                              </Card>
                            );
                          })}
                        </Flex>
                      </div>
                    )}

                    {/* Các trường mở rộng khác */}
                    {Object.keys(detailData).filter(
                      (k) =>
                        ![
                          "key",
                          "id",
                          "jiraId",
                          "projectKey",
                          "project",
                          "summary",
                          "description",
                          "status",
                          "issueType",
                          "issuetype",
                          "priority",
                          "assignee",
                          "reporter",
                          "creator",
                          "sprint",
                          "storyPoints",
                          "created",
                          "createdAt",
                          "updated",
                          "updatedAt",
                          "resolution",
                          "labels",
                          "components",
                          "attachment",
                          "attachments",
                        ].includes(k) &&
                        detailData[k] !== null &&
                        detailData[k] !== undefined
                    ).length > 0 && (
                      <div>
                        <Text strong style={{ display: "block", marginBottom: 8, fontSize: 15 }}>
                          Thông tin bổ sung khác:
                        </Text>
                        <Descriptions bordered column={1} size="small">
                          {Object.keys(detailData)
                            .filter(
                              (k) =>
                                ![
                                  "key",
                                  "id",
                                  "jiraId",
                                  "projectKey",
                                  "project",
                                  "summary",
                                  "description",
                                  "status",
                                  "issueType",
                                  "issuetype",
                                  "priority",
                                  "assignee",
                                  "reporter",
                                  "creator",
                                  "sprint",
                                  "storyPoints",
                                  "created",
                                  "createdAt",
                                  "updated",
                                  "updatedAt",
                                  "resolution",
                                  "labels",
                                  "components",
                                  "attachment",
                                  "attachments",
                                ].includes(k) &&
                                detailData[k] !== null &&
                                detailData[k] !== undefined
                            )
                            .map((k) => {
                              const val = detailData[k];
                              const str = getStringValue(val);
                              return (
                                <Descriptions.Item key={k} label={k}>
                                  {str || "---"}
                                </Descriptions.Item>
                              );
                            })}
                        </Descriptions>
                      </div>
                    )}
                  </Flex>
                    )}
                  </>
                ),
              },
              {
                key: "plan",
                label: (
                  <span>
                    <CalendarOutlined /> Plan
                  </span>
                ),
                children: (
                  <Flex vertical gap={20} style={{ paddingTop: 8 }}>
                    <Flex justify="space-between" align="center">
                      <Title level={5} style={{ margin: 0 }}>Kế hoạch thực hiện (LLM Plan)</Title>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        loading={planLoading}
                        onClick={handleCreatePlan}
                      >
                        {planResult ? "Regen Plan" : "Tạo Plan với AI"}
                      </Button>
                    </Flex>

                    {planLoading ? (
                      <Card size="small" style={{ textAlign: "center", padding: 24 }}>
                        <Spin size="large" />
                        <div style={{ marginTop: 12 }}>
                          <Text type="secondary">Đang tạo plan...</Text>
                        </div>
                      </Card>
                    ) : planResult ? (
                      <Flex vertical gap={16}>
                        {(Array.isArray(planResult) ? planResult : [planResult]).map((item: any, idx: number) => {
                          const markdownContent = typeof item === "string" ? item : item?.response || item?.plan || item?.content || JSON.stringify(item, null, 2);
                          const title = item?.fileName || item?.filename || `Plan #${idx + 1}`;
                          return (
                            <Card key={idx} size="small" title={title} style={{ background: "#f8fafc" }}>
                              <article className="markdown-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                  {markdownContent}
                                </ReactMarkdown>
                              </article>
                            </Card>
                          );
                        })}
                      </Flex>
                    ) : (
                      <Flex vertical align="center" justify="center" gap={16} style={{ padding: "32px 16px" }}>
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description={<Text type="secondary">Chưa có plan nào được khởi tạo cho task này</Text>}
                        />
                        <Button
                          type="primary"
                          size="large"
                          icon={<PlusOutlined />}
                          loading={planLoading}
                          onClick={handleCreatePlan}
                        >
                          Tạo Plan
                        </Button>
                      </Flex>
                    )}
                  </Flex>
                ),
              },
              {
                key: "verify",
                label: (
                  <span>
                    <SafetyCertificateOutlined /> Verify
                  </span>
                ),
                children: (
                  <Flex vertical gap={20} style={{ paddingTop: 8 }}>
                    <Flex justify="space-between" align="center">
                      <Title level={5} style={{ margin: 0 }}>Kiểm thử & Xác nhận (LLM Verify)</Title>
                      <Button
                        type="primary"
                        icon={<SafetyCertificateOutlined />}
                        loading={verifyLoading}
                        onClick={handleVerify}
                      >
                        {verifyResult ? "Regen Verify" : "Chạy Verify"}
                      </Button>
                    </Flex>

                    {verifyLoading ? (
                      <Card size="small" style={{ textAlign: "center", padding: 24 }}>
                        <Spin size="large" />
                        <div style={{ marginTop: 12 }}>
                          <Text type="secondary">Đang verify tài liệu...</Text>
                        </div>
                      </Card>
                    ) : verifyResult ? (
                      <Flex vertical gap={16}>
                        {(Array.isArray(verifyResult) ? verifyResult : [verifyResult]).map((item: any, idx: number) => {
                          const markdownContent = typeof item === "string" ? item : item?.response || item?.verify || item?.result || item?.content || JSON.stringify(item, null, 2);
                          const title = item?.fileName || item?.filename || `Verify #${idx + 1}`;
                          return (
                            <Card key={idx} size="small" title={title} style={{ background: "#f8fafc" }}>
                              <article className="markdown-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                  {markdownContent}
                                </ReactMarkdown>
                              </article>
                            </Card>
                          );
                        })}
                      </Flex>
                    ) : (
                      <Flex vertical align="center" justify="center" gap={16} style={{ padding: "32px 16px" }}>
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description={<Text type="secondary">Chưa thực hiện Verify cho task này</Text>}
                        />
                        <Button
                          type="primary"
                          size="large"
                          icon={<SafetyCertificateOutlined />}
                          loading={verifyLoading}
                          onClick={handleVerify}
                        >
                          Chạy Verify với AI
                        </Button>
                      </Flex>
                    )}
                  </Flex>
                ),
              },
            ]}
          />}
          </>
        ) : (
          <Empty description="Không tìm thấy thông tin chi tiết task" />
        )}
      </Drawer>}
      <RequirementDrawer open={detailDrawerOpen} loading={detailLoading} detailData={detailData} documents={detailData ? documentNamesByIssue[getStringValue(detailData.key)] || [] : []} onClose={() => updateDrawer({ open: false })} planLoading={planLoading} planResult={planResult} verifyLoading={verifyLoading} verifyResult={verifyResult} onPlan={() => void handleCreatePlan()} onVerify={() => void handleVerify()} onApprovePlan={approvePlan} onApproveVerify={approveVerify} />
    </div>
  );
};

export default JiraPage;
