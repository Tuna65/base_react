import { Alert, Dialog } from "@/components";
import type { ManagedBranch } from "@/apis/branch";
type Props = {
  branch: ManagedBranch | null;
  saving: boolean;
  error: string;
  onCancel: () => void;
  onDelete: () => void;
};
export default function DeleteBranchDialog({ branch, saving, error, onCancel, onDelete }: Props) {
  return (
    <Dialog
      open={!!branch}
      title={`Delete branch ${branch?.name ?? ""}?`}
      okText="Delete"
      okButtonProps={{ danger: true }}
      onOk={onDelete}
      onCancel={onCancel}
      confirmLoading={saving}
      cancelButtonProps={{ disabled: saving }}
      closable={!saving}
      maskClosable={!saving}
      keyboard={!saving}
    >
      {error && <Alert className="mb-4" type="error" title={error} showIcon />}
      <p>Only branches without assigned users or documents can be deleted.</p>
    </Dialog>
  );
}
