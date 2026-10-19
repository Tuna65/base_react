import { Button } from "@/components";
import { PlusOutlined } from "@/components/Icons";
type Props = { loading: boolean; busy: boolean; canCreate: boolean; onAdd: () => void; onRefresh: () => void };
export default function BranchHeader({ loading, busy, canCreate, onAdd, onRefresh }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="m-0 text-lg font-semibold">Branches</h1>
        <p className="mt-2 text-sm text-[#797586] dark:text-[#93909f]">
          Manage branches and their OCR / LLM concurrency.
        </p>
      </div>
      <div className="flex gap-2">
        <Button loading={loading} disabled={busy} onClick={onRefresh}>
          Refresh
        </Button>
        <Button type="primary" icon={<PlusOutlined />} disabled={loading || busy || !canCreate} onClick={onAdd}>
          Add Branch
        </Button>
      </div>
    </div>
  );
}
