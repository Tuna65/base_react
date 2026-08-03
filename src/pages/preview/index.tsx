import {
  BookOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilePdfOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import { Alert, Button, Table, Tag, message } from "antd";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { API_URL } from "@/configs/env";
import useApi from "@/apis/useApi";
import { PATHNAME } from "@/utils/Pathname";
import KnowledgeDrawer from "./components/KnowledgeDrawer";
import KnowledgeUpload from "./components/KnowledgeUpload";
import {
  DocumentPayload,
  DocumentSummary,
  MarkdownHeading,
  MarkdownPage,
  filterDocuments,
  getDocumentContent,
  getDocumentId,
  getDocumentList,
  getIssueKey,
  getRequestErrorMessage as errorMessage,
} from "./helper";

export default function Knowledge() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [detail, setDetail] = useState({
    documentId: "",
    fileName: "",
    markdown: "",
    markdownPages: [] as MarkdownPage[],
    headings: [] as MarkdownHeading[],
    selectedHeadingIndex: null as number | null,
    drawerOpen: false,
  });
  const [loading, setLoading] = useState({ upload: false, detail: false, list: false });
  const [filters, setFilters] = useState({ searchTerm: "", status: "all" });
  const [error, setError] = useState("");
  const { execute: requestDocumentList } = useApi<unknown>(() => axios.get(`${API_URL}/document`));
  const { execute: uploadDocument } = useApi<unknown>((formData: FormData) => axios.post(`${API_URL}/document`, formData));
  const { execute: requestDocumentDetail } = useApi<unknown>((id: string) => axios.get(`${API_URL}/document/${encodeURIComponent(id)}`));
  const urlDocumentId = searchParams.get("id");
  const urlIssueKey = searchParams.get("issueKey");
  const updateDetail = (next: Partial<typeof detail>) => setDetail((current) => ({ ...current, ...next }));
  const updateLoading = (next: Partial<typeof loading>) => setLoading((current) => ({ ...current, ...next }));

  const setDocumentContent = (payload: DocumentPayload) => {
    const content = getDocumentContent(payload);
    const pages = content.pages;
    if (!pages.length) throw new Error("Tài liệu chưa có kết quả Markdown.");
    updateDetail({ markdownPages: pages, markdown: content.markdown, headings: content.headings });
  };

  const loadDocuments = async () => {
    updateLoading({ list: true });
    try {
      const data = await requestDocumentList() as DocumentSummary[] | { data?: DocumentSummary[]; content?: DocumentSummary[] };
      setDocuments(getDocumentList(data));
    } catch (requestError) {
      setError(errorMessage(requestError, "Không thể lấy danh sách tài liệu."));
    } finally {
      updateLoading({ list: false });
    }
  };

  useEffect(() => {
    void loadDocuments();
  }, []);

  const uploadFile = async (file: File) => {
    updateLoading({ upload: true });
    setError("");
    updateDetail({ selectedHeadingIndex: null, fileName: file.name });
    try {
      const formData = new FormData();
      formData.append("file", file);
      const data = await uploadDocument(formData) as DocumentPayload;
      const uploadedId = getDocumentId(data);
      if (!uploadedId) throw new Error("API không trả về documentId.");
      updateDetail({ documentId: uploadedId, drawerOpen: true });
      setDocumentContent(data);
      setSearchParams({ id: uploadedId });
      message.success("Đã tải tài liệu lên thành công");
      void loadDocuments();
    } catch (requestError) {
      setError(errorMessage(requestError, "Không thể tải tài liệu lên."));
    } finally {
      updateLoading({ upload: false });
    }
  };

  const openDocument = useCallback(
    async (id: string, name?: string, updateUrl = true) => {
      if (!id) return;
      updateLoading({ detail: true });
      updateDetail({ drawerOpen: true, selectedHeadingIndex: null, documentId: id, fileName: name || "" });
      if (updateUrl) setSearchParams({ id });
      try {
      const data = await requestDocumentDetail(id) as DocumentPayload;
        setDocumentContent(data);
      } catch (requestError) {
        setError(errorMessage(requestError, "Không thể lấy chi tiết tài liệu."));
      } finally {
        updateLoading({ detail: false });
      }
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (!urlDocumentId) {
      updateDetail({ drawerOpen: false });
      return;
    }

    if (urlDocumentId !== detail.documentId) {
      const document = documents.find((item) => getDocumentId(item) === urlDocumentId);
      void openDocument(urlDocumentId, document?.fileName || document?.filename, false);
    }
  }, [detail.documentId, documents, openDocument, urlDocumentId]);

  const closeDetailDrawer = () => {
    updateDetail({ drawerOpen: false });
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("id");
    setSearchParams(nextParams);
  };

  const filteredDocuments = useMemo(
    () =>
      filterDocuments(documents, filters.searchTerm, filters.status).filter(
        (document) => !urlIssueKey || getIssueKey(document) === urlIssueKey,
      ),
    [documents, filters.searchTerm, filters.status, urlIssueKey],
  );

  const documentTitle = documents.find((document) => getDocumentId(document) === detail.documentId);

  return (
    <div className="w-full px-0 py-1">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#5263b5] text-lg text-white shadow-sm">
            <BookOutlined />
          </span>
          <div>
            <h1 className="m-0 text-[22px] font-bold leading-7 text-[#071b3b]">KnowledgeHub</h1>
            <p className="mt-0.5 text-[13px] text-[#526889]">
              Business documents & AI-powered test design generation from the knowledge hub.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={PATHNAME.REQUIREMENTS}>
            <Button className="!h-9 !rounded-lg !font-semibold">Requirements</Button>
          </Link>
          <KnowledgeUpload loading={loading.upload} onUpload={uploadFile} />
        </div>
      </header>

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-solid border-[#e2e8f0] bg-white p-3 shadow-sm">
        <input
          value={filters.searchTerm}
          onChange={(event) => setFilters((current) => ({ ...current, searchTerm: event.target.value }))}
          placeholder="Search documents..."
          className="h-9 w-[448px] max-w-full rounded-md border border-solid border-[#cbd5e1] bg-white px-3 text-[14px] text-[#14213d] shadow-sm outline-none placeholder:text-[#64748b] focus:border-[#5b83bb]"
        />
        {[
          ["all", "All"],
          ["ingested", "Ingested"],
          ["processing", "Processing"],
          ["failed", "Failed"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilters((current) => ({ ...current, status: value }))}
            className={`h-8 rounded-md px-3 text-[13px] font-semibold ${filters.status === value ? "bg-[#d7e7f6] text-[#4774ac] shadow-sm" : "text-[#536985] hover:bg-[#f5f8fc]"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {error && <Alert className="mb-6" type="error" showIcon message="Không thể xử lý tài liệu" description={error} />}

      <div className="overflow-hidden rounded-lg border border-solid border-[#e2e8f0] bg-white shadow-sm">
        <Table
          className="app-data-table"
          rowKey={(record) => getDocumentId(record)}
          dataSource={filteredDocuments}
          loading={loading.list}
          scroll={{ x: 1180 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ["20", "50", "100"],
            showTotal: (total, [from, to]) => `Showing ${from}-${to} of ${total}`,
          }}
          columns={[
            {
              title: "Document",
              width: 420,
              render: (_, record) => {
                const name = record.fileName || record.filename || "Untitled document";
                const pdf = name.toLowerCase().endsWith(".pdf");
                return (
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-md ${pdf ? "bg-[#fff0f2] text-[#ff2d55]" : "bg-[#eef5ff] text-[#4b77b8]"}`}
                    >
                      {pdf ? <FilePdfOutlined /> : <FileWordOutlined />}
                    </span>
                    <span className="truncate text-[12px] font-semibold text-[#071b3b]">{name}</span>
                  </div>
                );
              },
            },
            {
              title: "Type",
              width: 90,
              render: (_, record) => (
                <Tag className="!m-0 !border-0 !bg-[#ece3ce] !px-3 !py-0.5 !text-[12px] !font-semibold !text-[#6a5222]">
                  {(record.fileName || record.filename || "").toLowerCase().endsWith(".pdf") ? "PDF-TEXT" : "DOCX"}
                </Tag>
              ),
            },
            {
              title: "Source",
              width: 80,
              render: (_, record) => (
                <Tag className="!m-0 !border-0 !bg-[#edf4fb] !px-2 !py-0.5 !text-[11px] !text-[#4872ae]">
                  {getIssueKey(record) ? "Jira" : "Upload"}
                </Tag>
              ),
            },
            {
              title: "Issue Key",
              width: 100,
              render: (_, record) => {
                const issueKey = getIssueKey(record);
                return issueKey ? (
                  <Link
                    to={`${PATHNAME.REQUIREMENTS}?issueKey=${encodeURIComponent(issueKey)}`}
                    className="text-[11px] font-semibold text-[#4f7fb8] hover:underline"
                  >
                    {issueKey} ↗
                  </Link>
                ) : (
                  "-"
                );
              },
            },
            { title: "Version", width: 70, align: "center", render: () => "v2" },
            { title: "Uploaded by", width: 95, align: "center", render: () => "-" },
            {
              title: "Upload Date",
              width: 115,
              render: (_, record) =>
                record.createdAt
                  ? new Date(record.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-",
            },
            {
              title: "AI Status",
              width: 90,
              render: (_, record) => (
                <Tag
                  className={`!m-0 !border-0 !px-2 !py-0.5 !text-[12px] !font-semibold ${String(record.state || record.status || "ready").toLowerCase() === "failed" ? "!bg-[#fff0f0] !text-[#d92d20]" : "!bg-[#ecfdf3] !text-[#027a48]"}`}
                >
                  {String(record.state || record.status || "Ready")}
                </Tag>
              ),
            },
            { title: "Generated TCs", width: 105, align: "center", render: () => "-" },
            {
              title: "Actions",
              width: 70,
              align: "center",
              render: (_, record) => {
                const id = getDocumentId(record);
                return (
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      disabled={!id}
                      onClick={() => void openDocument(id, record.fileName || record.filename)}
                    />
                    <Button type="text" size="small" icon={<DeleteOutlined />} disabled />
                  </div>
                );
              },
            },
          ]}
        />
      </div>

      <KnowledgeDrawer
        open={detail.drawerOpen}
        onClose={closeDetailDrawer}
        loading={loading.detail}
        fileName={detail.fileName}
        issueKey={getIssueKey(documentTitle || {})}
        markdown={detail.markdown}
        markdownPages={detail.markdownPages}
        headings={detail.headings}
        selectedHeadingIndex={detail.selectedHeadingIndex}
        onSelectedHeadingChange={(selectedHeadingIndex) => updateDetail({ selectedHeadingIndex })}
      />
    </div>
  );
}
