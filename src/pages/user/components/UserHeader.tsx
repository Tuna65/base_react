import { Button } from "@/components";
import { PlusOutlined } from "@/components/Icons";
type Props = { disabled: boolean; onAdd: () => void };
export default function UserHeader({ disabled, onAdd }: Props) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h1 className="m-0 text-lg font-semibold">User</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="!h-[42px] !rounded-lg !px-4"
        disabled={disabled}
        onClick={onAdd}
      >
        Add New
      </Button>
    </div>
  );
}
