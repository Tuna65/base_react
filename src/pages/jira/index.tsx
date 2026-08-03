import { jiraApi } from "@/apis/jira";
import { llmApi } from "@/apis/llm";
import { JiraIssueTypeDto } from "@/models/jira.model";
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

const { Title, Text } = Typography;

const API_BASE = "http://localhost:8001/api/v1/jira";

// ===== Types =====
export interface JiraIssue {
  id?: number | string;
  jiraId?: string;
  key: any;
  projectKey?: any;
  summary: any;
  status: any;
  issueType: any;
  issuetype?: any;
  priority?: any;
  assignee?: any;
  sprint?: any;
  storyPoints?: any;
  created?: any;
  updated?: any;
  description?: any;
}

interface SyncFormState {
  projectKey: string;
  defaultSprint: string;
  issueTypes: string[];
}

const ISSUE_TYPE_OPTIONS = [
  { label: "Task", value: "Task" },
  { label: "Story", value: "Story" },
  { label: "Bug", value: "Bug" },
  { label: "Epic", value: "Epic" },
  { label: "Sub-task", value: "Sub-task" },
];

const issueTypeColor: Record<string, string> = {
  Task: "blue",
  Story: "green",
  Bug: "red",
  Epic: "purple",
  "Sub-task": "cyan",
};

const priorityColor: Record<string, string> = {
  Highest: "red",
  High: "orange",
  Medium: "gold",
  Low: "blue",
  Lowest: "default",
};

const statusIcon: Record<string, React.ReactNode> = {
  "To Do": <ClockCircleOutlined style={{ color: "#8c8c8c" }} />,
  "In Progress": <SyncOutlined spin style={{ color: "#1890ff" }} />,
  Done: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
};

// Helper để trích xuất chuỗi từ string hoặc object Jira API
const getStringValue = (val: any): string => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    return val.name || val.displayName || val.value || val.label || val.summary || "";
  }
  return String(val);
};

const formatBytes = (bytes: number): string => {
  if (!bytes || isNaN(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const JiraPage: React.FC = () => {
  // ===== States =====
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  const [loading, setLoading] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncModalOpen, setSyncModalOpen] = useState<boolean>(false);

  // ===== Detail State =====
  const [detailDrawerOpen, setDetailDrawerOpen] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<any>(null);

  // ===== LLM Plan & Verify States =====
  const [planLoading, setPlanLoading] = useState<boolean>(false);
  const [planResult, setPlanResult] = useState<any>(null);

  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  // ===== Sync Form State =====
  const [syncForm, setSyncForm] = useState<SyncFormState>({
    projectKey: "TES",
    defaultSprint: "9",
    issueTypes: ["Task", "Story", "Bug"],
  });

  // ===== Filter States =====
  const [filterProjectKey, setFilterProjectKey] = useState<string>("TES");
  const [filterSprint, setFilterSprint] = useState<string>("9");
  const [filterIssueTypes, setFilterIssueTypes] = useState<string[]>([]);

  // ===== LLM Plan API Call (POST /api/v1/llm/plan) =====
  const handleCreatePlan = async () => {
    if (!detailData) return;
    setPlanLoading(true);
    try {
      const payload = {
        issueKey: getStringValue(detailData.key),
      };
      const res = await llmApi.plan(payload);
      if (res && res.data) {
        setPlanResult(res.data);
        message.success("Tạo Plan thành công!");
      }
    } catch (err: any) {
      console.error("Lỗi khi tạo Plan:", err);
    } finally {
      setPlanLoading(false);
    }
  };

  // ===== LLM Verify API Call (POST /api/v1/llm/verify) =====
  const handleVerify = async () => {
    if (!detailData) return;
    setVerifyLoading(true);
    try {
      const payload = {
        issueKey: getStringValue(detailData.key),
      };
      const res = await llmApi.verify(payload);
      if (res && res.data) {
        setVerifyResult(res.data.results || []);
        message.success("Verify task thành công!");
      }
    } catch (err: any) {
      console.error("Lỗi khi verify task:", err);
    } finally {
      setVerifyLoading(false);
    }
  };

  // ===== 1. GET /api/v1/jira/issues =====
  const fetchIssues = async (page = currentPage, limit = pageSize) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterProjectKey) params.append("projectKey", filterProjectKey);
      if (filterSprint) params.append("sprint", filterSprint);
      filterIssueTypes.forEach((type) => params.append("issueTypes", type));
      params.append("maxResults", String(limit));
      params.append("startAt", String((page - 1) * limit));

      const response = await axios.get(`${API_BASE}/issues?${params.toString()}`);
      const data = response.data;

      if (Array.isArray(data)) {
        setIssues(data);
        setTotalCount(data.length);
      } else if (data && typeof data === "object") {
        const issueList = data.issues || data.items || data.content || [];
        setIssues(Array.isArray(issueList) ? issueList : []);
        setTotalCount(data.total || (Array.isArray(issueList) ? issueList.length : 0));
      } else {
        setIssues([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      console.error("Lỗi khi tải danh sách issues:", err);
      message.error(err?.response?.data?.message || "Không thể kết nối đến máy chủ API");
      setIssues([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // ===== 2. GET /api/v1/jira/issue?key=TES-123 (Detail) =====
  const handleOpenDetail = async (issueKey: string) => {
    if (!issueKey) return;
    setDetailDrawerOpen(true);
    setDetailLoading(true);
    setDetailData(null);
    setPlanResult(null);
    setVerifyResult(null);

    try {
      const res = await jiraApi.getIssueDetail(issueKey);
      if (res && res.data) {
        setDetailData(res.data);
      } else {
        // Fallback search in list if detail API returns empty
        const found = issues.find(
          (item) => getStringValue(item.key) === issueKey || getStringValue(item.id) === issueKey
        );
        setDetailData(found || null);
      }
    } catch (err: any) {
      console.error("Lỗi khi lấy chi tiết task:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  // ===== 3. POST /api/v1/jira/sync =====
  const handleSync = async () => {
    setSyncing(true);
    try {
      const payload = {
        projectKey: syncForm.projectKey,
        defaultSprint: syncForm.defaultSprint,
        issueTypes: syncForm.issueTypes,
      };

      const res = await axios.post(`${API_BASE}/sync`, payload);
      const syncedCount = res.data?.syncedCount ?? res.data?.count;
      message.success(`Đồng bộ Jira thành công! ${syncedCount !== undefined ? `(${syncedCount} tasks)` : ""}`);
      setSyncModalOpen(false);
      await fetchIssues(1, pageSize);
    } catch (err: any) {
      console.error("Lỗi khi sync task Jira:", err);
      message.error(err?.response?.data?.message || "Đồng bộ thất bại");
    } finally {
      setSyncing(false);
    }
  };

  // Tự động load danh sách khi mở trang
  useEffect(() => {
    fetchIssues(1, pageSize);
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

  return (
    <div style={{ padding: 16 }}>
      <Flex vertical gap={24}>
        {/* ===== Top Header Bar ===== */}
        <Flex justify="space-between" align="center">
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Quản lý Jira Tasks
            </Title>
            <Text type="secondary">Danh sách tasks đồng bộ từ hệ thống Jira (Nhấn vào hàng để xem chi tiết)</Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => fetchIssues(currentPage, pageSize)} loading={loading}>
              Tải lại
            </Button>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => setSyncModalOpen(true)} size="large">
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
              onChange={(e) => setFilterProjectKey(e.target.value)}
              style={{ width: 180 }}
              allowClear
            />
            <Input
              placeholder="Sprint (VD: 9)"
              value={filterSprint}
              onChange={(e) => setFilterSprint(e.target.value)}
              style={{ width: 140 }}
              allowClear
            />
            <Select
              mode="multiple"
              placeholder="Loại Issue"
              value={filterIssueTypes}
              onChange={setFilterIssueTypes}
              options={ISSUE_TYPE_OPTIONS}
              style={{ minWidth: 220 }}
              allowClear
            />
            <Button
              type="primary"
              onClick={() => {
                setCurrentPage(1);
                fetchIssues(1, pageSize);
              }}
              loading={loading}
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
            loading={loading}
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
                setCurrentPage(page);
                setPageSize(size);
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
      </Flex>

      {/* ===== Sync Modal ===== */}
      <Modal
        title={
          <Space>
            <SyncOutlined style={{ color: "#1890ff" }} />
            <span>Đồng bộ Task từ Jira</span>
          </Space>
        }
        open={syncModalOpen}
        onCancel={() => setSyncModalOpen(false)}
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
              onChange={(e) => setSyncForm({ ...syncForm, projectKey: e.target.value })}
              size="large"
              style={{ marginTop: 4 }}
            />
          </div>

          <div>
            <Text strong>Default Sprint</Text>
            <Input
              placeholder="VD: 9"
              value={syncForm.defaultSprint}
              onChange={(e) => setSyncForm({ ...syncForm, defaultSprint: e.target.value })}
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
              onChange={(val) => setSyncForm({ ...syncForm, issueTypes: val })}
              options={ISSUE_TYPE_OPTIONS}
              style={{ width: "100%", marginTop: 4 }}
              size="large"
            />
          </div>
        </Flex>
      </Modal>

      {/* ===== Issue Detail Drawer ===== */}
      <Drawer
        title={
          detailData ? (
            <Space align="center">
              <Tag color="blue">{getStringValue(detailData.key)}</Tag>
              <span>{getStringValue(detailData.summary) || "Chi tiết Task Jira"}</span>
            </Space>
          ) : (
            "Chi tiết Task Jira"
          )
        }
        width="50%"
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
      >
        {detailLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Spin size="large" />
            <Text type="secondary">Đang tải chi tiết task...</Text>
          </div>
        ) : detailData ? (
          <Tabs
            defaultActiveKey="general"
            items={[
              {
                key: "general",
                label: (
                  <span>
                    <InfoCircleOutlined /> General
                  </span>
                ),
                children: (
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
                        Tạo Plan với AI
                      </Button>
                    </Flex>

                    {planLoading ? (
                      <Card size="small" style={{ textAlign: "center", padding: 24 }}>
                        <Spin size="large" />
                        <div style={{ marginTop: 12 }}>
                          <Text type="secondary">Đang gọi AI tạo Plan (`POST /api/v1/llm/plan`)...</Text>
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
                        Chạy Verify
                      </Button>
                    </Flex>

                    {verifyLoading ? (
                      <Card size="small" style={{ textAlign: "center", padding: 24 }}>
                        <Spin size="large" />
                        <div style={{ marginTop: 12 }}>
                          <Text type="secondary">Đang gọi AI chạy Verify (`POST /api/v1/llm/verify`)...</Text>
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
          />
        ) : (
          <Empty description="Không tìm thấy thông tin chi tiết task" />
        )}
      </Drawer>
    </div>
  );
};

export default JiraPage;
