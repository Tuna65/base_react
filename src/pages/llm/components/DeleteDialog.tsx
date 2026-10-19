import { Alert, Dialog } from "@/components";
import type { Editor } from "./types";

type Props = {
  deleting: Editor | null;
  error: string;
  saving: boolean;
  onCancel: () => void;
  onDelete: () => void;
};

export default function DeleteDialog(props: Props) {
  const { deleting, error, saving, onCancel, onDelete } = props;
  return (
    <Dialog
      open={!!deleting}
      title={`Delete ${deleting?.kind === "agents" ? "agent" : "skill"}?`}
      onCancel={onCancel}
      onOk={onDelete}
      okText="Delete"
      okButtonProps={{ danger: true }}
      confirmLoading={saving}
      cancelButtonProps={{ disabled: saving }}
      closable={!saving}
      maskClosable={!saving}
      keyboard={!saving}
    >
      {error && <Alert className="mb-4" type="error" showIcon title={error} />}
      <p>
        This action cannot be undone.
        {deleting?.kind === "skills" ? " Agents using this skill will have their skill assignment cleared." : ""}
      </p>
    </Dialog>
  );
}
