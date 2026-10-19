import { Alert, Button, Dialog, Upload } from "@/components";
import { UploadOutlined } from "@/components/Icons";
import type { ManagedDocument } from "@/apis/document";
type Props = {
  open: boolean;
  document: ManagedDocument | null;
  uploading: boolean;
  error: string;
  onUpload: (file: File) => void;
  onCancel: () => void;
};
export default function DocumentEditor({ open, document, uploading, error, onUpload, onCancel }: Props) {
  return (
    <Dialog
      width={650}
      open={open}
      title={document ? "Replace document file" : "Upload document"}
      onCancel={onCancel}
      closable={!uploading}
      maskClosable={!uploading}
      keyboard={!uploading}
      footer={
        <Button disabled={uploading} onClick={onCancel}>
          Cancel
        </Button>
      }
    >
      {error && <Alert className="mb-4" type="error" title={error} showIcon />}
      {document && <p className="mb-4 text-sm">{document.filename}</p>}
      <Upload.Dragger
        accept="*/*"
        showUploadList={false}
        disabled={uploading}
        beforeUpload={(file) => {
          onUpload(file);
          return Upload.LIST_IGNORE;
        }}
      >
        <div className="px-5 py-8">
          <UploadOutlined className="text-3xl" />
          <p className="mt-4 text-base font-medium">{uploading ? "Uploading..." : "Click or drag a file here"}</p>
          <p className="mt-2 text-sm opacity-70">Maximum 10 MB. Document fields are loaded automatically.</p>
        </div>
      </Upload.Dragger>
    </Dialog>
  );
}
