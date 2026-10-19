import { Alert, Dialog } from "@/components";
import type { ManagedUser } from "@/apis/user";
type Props = { users: ManagedUser[]; saving: boolean; error: string; onCancel: () => void; onDelete: () => void };
export default function DeleteUsersDialog({ users, saving, error, onCancel, onDelete }: Props) {
  return (
    <Dialog
      open={users.length > 0}
      title={`Delete ${users.length === 1 ? users[0]?.username : `${users.length} users`}?`}
      okText="Delete"
      okButtonProps={{ danger: true }}
      onCancel={onCancel}
      onOk={onDelete}
      confirmLoading={saving}
      cancelButtonProps={{ disabled: saving }}
      closable={!saving}
      maskClosable={!saving}
      keyboard={!saving}
    >
      {error && <Alert className="mb-4" type="error" showIcon title={error} />}
      <p>These users will be removed from the list and will no longer be able to sign in.</p>
    </Dialog>
  );
}
