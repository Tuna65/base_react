import { Alert, Dialog } from "@/components";
import type { ManagedDocument } from "@/apis/document";
type Props = {
  document: ManagedDocument | null;
  busy: boolean;
  error: string;
  onDelete: () => void;
  onCancel: () => void;
};
export default function DeleteDocumentDialog({ document, busy, error, onDelete, onCancel }: Props) {
  return (
    <Dialog
      open={!!document}
      title={`Delete ${document?.name ?? "document"}?`}
      onOk={onDelete}
      onCancel={onCancel}
      okText="Delete"
      okButtonProps={{ danger: true }}
      confirmLoading={busy}
      cancelButtonProps={{ disabled: busy }}
      closable={!busy}
      maskClosable={!busy}
      keyboard={!busy}
    >
      {error && <Alert className="mb-4" type="error" title={error} showIcon />}
      <p>The document and its extraction results will be removed from the list.</p>
    </Dialog>
  );
}
