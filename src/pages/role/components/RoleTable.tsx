import { Button, Table, Tag, Tooltip } from "@/components";
import type { ManagedRole } from "@/apis/role";
type Props = {
  roles: ManagedRole[];
  loading: boolean;
  busy: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  page: number;
  onPage: (page: number) => void;
  onEdit: (role: ManagedRole) => void;
  onDelete: (role: ManagedRole) => void;
};
export default function RoleTable({
  roles,
  loading,
  busy,
  canUpdate,
  canDelete,
  page,
  onPage,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Table<ManagedRole>
      rowKey="id"
      loading={loading}
      dataSource={roles}
      scroll={{ x: 800 }}
      className="[&_.ant-table]:!bg-transparent [&_.ant-table-thead>tr>th]:!px-5 [&_.ant-table-thead>tr>th]:!py-3 [&_.ant-table-thead>tr>th]:!normal-case [&_.ant-table-tbody>tr>td]:!px-5 [&_.ant-table-tbody>tr>td]:!py-4 [&_.ant-table-tbody>tr>td_*]:!text-[13px] dark:[&_.ant-table]:!text-[#eeedf5] dark:[&_.ant-table-thead>tr>th]:!bg-[#1b1a20] dark:[&_.ant-table-thead>tr>th]:!text-[#eeedf5] dark:[&_.ant-table-thead>tr>th]:!border-[#27252e] dark:[&_.ant-table-tbody>tr>td]:!border-[#27252e] dark:[&_.ant-table-tbody>tr:hover>td]:!bg-[#19171f]"
      pagination={{
        current: page,
        pageSize: 10,
        showSizeChanger: false,
        onChange: onPage,
        showTotal: (total) => `${total} roles`,
      }}
      columns={[
        {
          title: "Role",
          dataIndex: "name",
          width: 190,
          render: (name) => (
            <div className="flex items-center gap-2">
              <span className="font-semibold">{name}</span>
              {name === "admin" && (
                <Tag color="purple" className="!m-0 !rounded-full">
                  Default
                </Tag>
              )}
            </div>
          ),
        },
        { title: "Description", dataIndex: "description", ellipsis: true },
        {
          title: "Permissions",
          width: 300,
          render: (_, role) => (
            <div className="flex flex-wrap gap-1">
              {role.permissions.slice(0, 2).map((permission) => (
                <Tag key={permission} className="!m-0 !rounded-full">
                  {permission}
                </Tag>
              ))}
              {role.permissions.length > 2 && (
                <Tooltip title={role.permissions.join(", ")}>
                  <Tag className="!m-0 !rounded-full">+{role.permissions.length - 2} more</Tag>
                </Tooltip>
              )}
              {!role.permissions.length && <span className="text-[#93909f]">No permissions</span>}
            </div>
          ),
        },
        {
          title: "Actions",
          width: 160,
          render: (_, role) => (
            <div className="flex gap-2">
              <Button size="small" disabled={busy || !canUpdate} onClick={() => onEdit(role)}>
                Edit
              </Button>
              <Button
                size="small"
                danger
                disabled={busy || !canDelete || role.name === "admin"}
                onClick={() => onDelete(role)}
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
