import { Input } from "@/components";
import { SearchOutlined } from "@/components/Icons";
export default function RoleToolbar({ search, onSearch }: { search: string; onSearch: (value: string) => void }) {
  return (
    <div className="flex min-h-[54px] items-center px-5">
      <Input
        variant="borderless"
        className="!max-w-sm !bg-transparent !p-0 !text-sm"
        aria-label="Search roles"
        placeholder="Search roles..."
        prefix={<SearchOutlined className="text-[#93909f]" />}
        allowClear
        value={search}
        onChange={(event) => onSearch(event.target.value)}
      />
    </div>
  );
}
