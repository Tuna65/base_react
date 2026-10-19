import { Button } from "@/components";
import { PlusOutlined } from "@/components/Icons";
type Props = { loading: boolean; busy: boolean; canCreate: boolean; onAdd: () => void; onRefresh: () => void };
export default function DocumentHeader({ loading, busy, canCreate, onAdd, onRefresh }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="m-0 text-lg font-semibold">Documents</h1>
        <p className="mt-2 text-sm text-[#797586] dark:text-[#93909f]">Upload and manage your documents.</p>
      </div>
      <div className="flex gap-2">
        <Button loading={loading} disabled={busy} onClick={onRefresh}>
          Refresh
        </Button>
        <Button type="primary" icon={<PlusOutlined />} disabled={busy || loading || !canCreate} onClick={onAdd}>
          Upload Document
        </Button>
      </div>
    </div>
  );
}
