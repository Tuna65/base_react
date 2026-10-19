import { Button, Table, Tag } from "@/components";
import type { ManagedBranch } from "@/apis/branch";
type Props = {
  branches: ManagedBranch[];
  loading: boolean;
  busy: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  page: number;
  total: number;
  onPage: (page: number) => void;
  onEdit: (branch: ManagedBranch) => void;
  onDelete: (branch: ManagedBranch) => void;
};
export default function BranchTable({
  branches,
  loading,
  busy,
  canUpdate,
  canDelete,
  page,
  total,
  onPage,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Table<ManagedBranch>
      rowKey="id"
      loading={loading}
      dataSource={branches}
      scroll={{ x: 800 }}
      className="[&_.ant-table]:!bg-transparent [&_.ant-table-thead>tr>th]:!px-5 [&_.ant-table-thead>tr>th]:!py-3 [&_.ant-table-thead>tr>th]:!normal-case [&_.ant-table-tbody>tr>td]:!px-5 [&_.ant-table-tbody>tr>td]:!py-4 [&_.ant-table-tbody>tr>td_*]:!text-[13px] dark:[&_.ant-table]:!text-[#eeedf5] dark:[&_.ant-table-thead>tr>th]:!bg-[#1b1a20] dark:[&_.ant-table-thead>tr>th]:!text-[#eeedf5] dark:[&_.ant-table-thead>tr>th]:!border-[#27252e] dark:[&_.ant-table-tbody>tr>td]:!border-[#27252e] dark:[&_.ant-table-tbody>tr:hover>td]:!bg-[#19171f]"
      pagination={{
        current: page,
        total,
        pageSize: 10,
        showSizeChanger: false,
        onChange: onPage,
        showTotal: (total) => `${total} branches`,
      }}
      columns={[
        {
          title: "Branch",
          dataIndex: "name",
          width: 190,
          render: (name) => (
            <div className="flex items-center gap-2">
              <span className="font-semibold">{name}</span>
            </div>
          ),
        },
        ...(["ocr_ccu", "llm_ccu"] as const).map((key) => ({
          title: key === "ocr_ccu" ? "OCR CCU" : "LLM CCU",
          dataIndex: key,
          width: 160,
          render: (value: number) =>
            value === 0 ? (
              <Tag className="!m-0 !rounded-full">Paused</Tag>
            ) : (
              <span className="font-medium tabular-nums">{value}</span>
            ),
        })),
        {
          title: "Created",
          dataIndex: "createdAt",
          width: 160,
          render: (value?: string) => (value ? new Date(value).toLocaleDateString() : "?"),
        },
        {
          title: "Actions",
          width: 160,
          render: (_, branch) => (
            <div className="flex gap-2">
              <Button size="small" disabled={busy || !canUpdate} onClick={() => onEdit(branch)}>
                Edit
              </Button>
              <Button size="small" danger disabled={busy || !canDelete} onClick={() => onDelete(branch)}>
                Delete
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
}
