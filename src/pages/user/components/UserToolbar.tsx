import { Button, Dropdown, IconButton, Input, Tooltip } from "@/components";
import { DeleteOutlined, FilterOutlined, SearchOutlined } from "@/components/Icons";
import type { UserStatus } from "@/apis/user";
type Props = {
  search: string;
  status?: UserStatus;
  selectedCount: number;
  disabled: boolean;
  onSearch: (value: string) => void;
  onStatus: (status?: UserStatus) => void;
  onDelete: () => void;
};
export default function UserToolbar({ search, status, selectedCount, disabled, onSearch, onStatus, onDelete }: Props) {
  return (
    <div className="flex min-h-[50px] items-center gap-3 px-4">
      <Tooltip title={selectedCount ? `Delete ${selectedCount} selected users` : "Select users to delete"}>
        <IconButton
          aria-label="Delete selected users"
          className="!border-0"
          disabled={disabled || !selectedCount}
          onClick={onDelete}
        >
          <DeleteOutlined />
        </IconButton>
      </Tooltip>
      <div className="h-5 w-px bg-[#e7e5ee] dark:bg-[#27252e]" />
      <Input
        variant="borderless"
        className="!max-w-sm !bg-transparent !p-0 !text-sm"
        prefix={<SearchOutlined className="text-[#93909f]" />}
        placeholder="Search here"
        aria-label="Search users"
        allowClear
        value={search}
        onChange={(event) => onSearch(event.target.value)}
      />
      <div className="ml-auto flex items-center gap-2">
        {selectedCount > 0 && (
          <span className="whitespace-nowrap text-xs text-[#93909f]">{selectedCount} selected</span>
        )}
        <Dropdown
          trigger={["click"]}
          menu={{
            selectable: true,
            selectedKeys: [status ?? "all"],
            items: [
              { key: "all", label: "All statuses" },
              { key: "ACTIVE", label: "Active" },
              { key: "INACTIVE", label: "Blocked" },
            ],
            onClick: ({ key }) => onStatus(key === "all" ? undefined : (key as UserStatus)),
          }}
        >
          <Button type="text" icon={<FilterOutlined />} disabled={disabled}>
            {status === "ACTIVE" ? "Active" : status === "INACTIVE" ? "Blocked" : "Filter"}
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}
