import { Button, Table, Tag } from "@/components";
import type { ManagedDocument } from "@/apis/document";
import { stateLabel } from "./types";
type Props = {
  documents: ManagedDocument[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  busy: boolean;
  permissions: string[];
  onPage: (page: number, pageSize: number) => void;
  onView: (document: ManagedDocument) => void;
  onEdit: (document: ManagedDocument) => void;
  onDelete: (document: ManagedDocument) => void;
};
export default function DocumentTable({
  documents,
  total,
  page,
  pageSize,
  loading,
  busy,
  permissions,
  onPage,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Table<ManagedDocument>
      rowKey="id"
      dataSource={documents}
      loading={loading}
      scroll={{ x: 1100 }}
      className="[&_.ant-table]:!bg-transparent [&_.ant-table-thead>tr>th]:!px-5 [&_.ant-table-thead>tr>th]:!py-3 [&_.ant-table-thead>tr>th]:!normal-case [&_.ant-table-tbody>tr>td]:!px-5 [&_.ant-table-tbody>tr>td]:!py-4 [&_.ant-table-tbody>tr>td_*]:!text-[13px] dark:[&_.ant-table]:!text-[#eeedf5] dark:[&_.ant-table-thead>tr>th]:!bg-[#1b1a20] dark:[&_.ant-table-thead>tr>th]:!text-[#eeedf5] dark:[&_.ant-table-thead>tr>th]:!border-[#27252e] dark:[&_.ant-table-tbody>tr>td]:!border-[#27252e] dark:[&_.ant-table-tbody>tr:hover>td]:!bg-[#19171f]"
      pagination={{
        current: page,
        pageSize,
        total,
        pageSizeOptions: [10, 20, 50],
        showSizeChanger: true,
        onChange: onPage,
        showTotal: (count) => `${count} documents`,
      }}
      columns={[
        { title: "Name", dataIndex: "name", width: 220, ellipsis: true },
        { title: "Filename", dataIndex: "filename", width: 220, ellipsis: true },
        {
          title: "Type",
          width: 130,
          render: (_, row) => (typeof row.extract_data?.type === "string" ? row.extract_data.type : "-"),
        },
        {
          title: "State",
          width: 110,
          render: (_, row) => (
            <Tag
              color={
                row.state === "extracted"
                  ? "success"
                  : row.state === "extract_failed"
                    ? "error"
                    : row.state === "partial"
                      ? "warning"
                      : "default"
              }
            >
              {stateLabel(row.state)}
            </Tag>
          ),
        },
        {
          title: "Date",
          width: 130,
          render: (_, row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-GB") : "-"),
        },
        {
          title: "Actions",
          width: 300,
          render: (_, row) => (
            <div className="flex flex-wrap gap-2">
              <Button size="small" disabled={busy} onClick={() => onView(row)}>
                View
              </Button>
              <Button
                size="small"
                disabled={busy || !permissions.includes("document.update") || !permissions.includes("document.upload")}
                onClick={() => onEdit(row)}
              >
                Replace file
              </Button>
              <Button
                size="small"
                danger
                disabled={busy || !permissions.includes("document.delete")}
                onClick={() => onDelete(row)}
              >
                Delete
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
}
