import type { BranchOption } from "@/apis/branch";
import type { Key } from "react";
import { Dropdown, IconButton, Table, Tag, Tooltip } from "@/components";
import { MoreOutlined } from "@/components/Icons";
import type { ManagedUser } from "@/apis/user";
import UserProfile from "./UserProfile";
import { formatDate, roleLabels } from "./types";

type Props = {
  users: ManagedUser[];
  branches: BranchOption[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  busy: boolean;
  actorId?: number;
  selected: Key[];
  onSelection: (keys: Key[]) => void;
  onPage: (page: number, pageSize: number) => void;
  onEdit: (user: ManagedUser) => void;
  onDelete: (users: ManagedUser[]) => void;
};
const tableClass =
  "[&_.ant-table]:!bg-transparent [&_.ant-table-thead>tr>th]:!bg-[#f1f0f5] [&_.ant-table-thead>tr>th]:!px-5 [&_.ant-table-thead>tr>th]:!py-3 [&_.ant-table-thead>tr>th]:!normal-case [&_.ant-table-thead>tr>th]:!font-normal [&_.ant-table-thead>tr>th_*]:!text-xs [&_.ant-table-tbody>tr>td]:!px-5 [&_.ant-table-tbody>tr>td]:!py-[16px] [&_.ant-table-tbody>tr>td_*]:!text-[13px] [&_.ant-table-tbody>tr>td]:!text-[13px] dark:[&_.ant-table]:!text-[#eeedf5] dark:[&_.ant-table-thead>tr>th]:!bg-[#1b1a20] dark:[&_.ant-table-thead>tr>th]:!text-[#eeedf5] dark:[&_.ant-table-thead>tr>th]:!border-[#27252e] dark:[&_.ant-table-tbody>tr>td]:!border-[#27252e] dark:[&_.ant-table-tbody>tr:hover>td]:!bg-[#19171f] dark:[&_.ant-table-expanded-row>td]:!bg-[#19171f] dark:[&_.ant-table-row-selected>td]:!bg-[#23202f]";
export default function UserTable({
  users,
  branches,
  total,
  page,
  pageSize,
  loading,
  busy,
  actorId,
  selected,
  onSelection,
  onPage,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Table<ManagedUser>
      className={tableClass}
      rowKey="id"
      loading={loading}
      dataSource={users}
      scroll={{ x: 1120 }}
      rowSelection={{
        selectedRowKeys: selected,
        onChange: onSelection,
        columnWidth: 48,
        getCheckboxProps: (user) => ({ disabled: busy || user.id === actorId || user.username === "super_admin" }),
      }}
      expandable={{
        columnWidth: 40,
        expandedRowRender: (user) => (
          <div className="flex flex-wrap gap-x-8 gap-y-2 px-4 text-sm">
            <span>Email: {user.email}</span>
            <span>ID: {user.id}</span>
            <span>Created: {formatDate(user.createdAt)}</span>
            <span>Updated: {formatDate(user.updateAt)}</span>
          </div>
        ),
      }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50],
        onChange: onPage,
        showTotal: (count) => `${count} users`,
      }}
      columns={[
        {
          title: "Profile",
          width: 250,
          sorter: (a, b) => (a.displayName || a.username).localeCompare(b.displayName || b.username),
          render: (_, user) => <UserProfile user={user} />,
        },
        {
          title: "Roles",
          width: 270,
          render: (_, user) => (
            <div className="flex flex-wrap items-center gap-1">
              <span>
                {user.roles
                  .slice(0, 2)
                  .map((role) => roleLabels[role] ?? role)
                  .join(", ") || "User"}
              </span>
              {user.roles.length > 2 && (
                <Tooltip
                  title={user.roles
                    .slice(2)
                    .map((role) => roleLabels[role])
                    .join(", ")}
                >
                  <Tag className="!m-0 !rounded-full !bg-transparent">+{user.roles.length - 2} more</Tag>
                </Tooltip>
              )}
            </div>
          ),
        },
        {
          title: "Branch",
          width: 180,
          render: (_, user) =>
            branches.find((branch) => branch.id === user.branch_id)?.name ??
            (user.branch_id ? `Branch #${user.branch_id}` : "Unassigned"),
        },
        {
          title: "Last Activity",
          width: 150,
          render: (_, user) => (
            <div>
              <span className="block">{user.updateAt && user.updateAt !== user.createdAt ? "Updated" : "Created"}</span>
              <span className="mt-0.5 block !text-xs text-[#797586] dark:text-[#93909f]">
                {formatDate(user.updateAt || user.createdAt)}
              </span>
            </div>
          ),
        },
        {
          title: "Date",
          width: 130,
          sorter: (a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""),
          render: (_, user) => formatDate(user.createdAt),
        },
        {
          title: "Status",
          width: 120,
          sorter: (a, b) => a.status.localeCompare(b.status),
          render: (_, user) => (
            <Tag
              className={`!m-0 !rounded-full !border-0 !px-2 ${user.status === "ACTIVE" ? "!bg-[#d9f7e6] !text-[#17643a] dark:!bg-[#083b1c] dark:!text-[#84f0a4]" : "!bg-[#ffe0e0] !text-[#a52a35] dark:!bg-[#54191e] dark:!text-[#ffb4ba]"}`}
            >
              {user.status === "ACTIVE" ? "Active" : "Blocked"}
            </Tag>
          ),
        },
        {
          title: "",
          width: 60,
          render: (_, user) => (
            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  { key: "edit", label: "Edit", onClick: () => onEdit(user) },
                  {
                    key: "delete",
                    label: "Delete",
                    danger: true,
                    disabled: user.id === actorId || user.username === "super_admin",
                    onClick: () => onDelete([user]),
                  },
                ],
              }}
            >
              <IconButton aria-label={`Actions for ${user.username}`} className="!border-0" disabled={busy}>
                <MoreOutlined />
              </IconButton>
            </Dropdown>
          ),
        },
      ]}
    />
  );
}
