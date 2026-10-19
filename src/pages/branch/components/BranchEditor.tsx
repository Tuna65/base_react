import { Alert, Dialog, Form, Input, InputNumber } from "@/components";
import type { ManagedBranch, SaveBranch } from "@/apis/branch";
type Props = {
  open: boolean;
  branch: ManagedBranch | null;
  form: ReturnType<typeof Form.useForm<SaveBranch>>[0];
  saving: boolean;
  error: string;
  onSave: (values: SaveBranch) => void;
  onCancel: () => void;
};
export default function BranchEditor({ open, branch, form, saving, error, onSave, onCancel }: Props) {
  return (
    <Dialog
      forceRender
      open={open}
      title={branch ? `Edit branch: ${branch.name}` : "Add branch"}
      onOk={() => form.submit()}
      onCancel={onCancel}
      confirmLoading={saving}
      okText="Save"
      cancelButtonProps={{ disabled: saving }}
      closable={!saving}
      maskClosable={!saving}
      keyboard={!saving}
    >
      {error && <Alert className="mb-4" type="error" title={error} showIcon />}
      <Form form={form} layout="vertical" requiredMark={false} disabled={saving} onFinish={onSave}>
        <Form.Item name="name" label="Branch name" rules={[{ required: true, whitespace: true, max: 255 }]}>
          <Input maxLength={255} placeholder="Branch name" />
        </Form.Item>
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          {(["ocr_ccu", "llm_ccu"] as const).map((key) => (
            <Form.Item
              key={key}
              name={key}
              label={key === "ocr_ccu" ? "OCR CCU" : "LLM CCU"}
              extra="Set to 0 to pause this stage."
              rules={[
                { required: true, type: "number", min: 0, max: 2147483647 },
                {
                  validator: (_, value) =>
                    Number.isInteger(value) ? Promise.resolve() : Promise.reject(new Error("Enter a whole number.")),
                },
              ]}
            >
              <InputNumber className="!w-full" min={0} max={2147483647} precision={0} />
            </Form.Item>
          ))}
        </div>
      </Form>
    </Dialog>
  );
}
