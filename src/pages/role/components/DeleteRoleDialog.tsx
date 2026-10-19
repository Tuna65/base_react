import { Alert, Dialog } from "@/components";
import type { ManagedRole } from "@/apis/role";
type Props = { role: ManagedRole | null; saving: boolean; error: string; onCancel: () => void; onDelete: () => void };
export default function DeleteRoleDialog({ role, saving, error, onCancel, onDelete }: Props) {
  return (
    <Dialog
      open={!!role}
      title={`Delete role ${role?.name ?? ""}?`}
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
      <p>Remove this role from users before deleting it.</p>
    </Dialog>
  );
}
