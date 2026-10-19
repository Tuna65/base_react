import { Alert, Button, Form, InputNumber, Spin } from "@/components";
import type { OcrQueueSettings } from "@/apis/ocr";
type QueueForm = ReturnType<typeof Form.useForm<OcrQueueSettings>>[0];
type Props = { stage?: "ocr" | "llm"; form: QueueForm; loading: boolean; saving: boolean; canEdit: boolean; onSave: (values: OcrQueueSettings) => void };
export default function QueueSettingsPanel({ stage = "ocr", form, loading, saving, canEdit, onSave }: Props) {
  const fields = [
    { name: "batch_size", label: "Batch size", min: 1, max: 100, hint: "Maximum jobs admitted per scheduler pass. Shared by OCR and LLM." },
    { name: "ocr_global_ccu", label: "OCR Global CCU", min: 0, max: 10000, hint: "Maximum OCR pages running across all branches. Set to the OCR model capacity. 0 pauses OCR dispatch." },
    { name: "llm_global_ccu", label: "LLM Global CCU", min: 0, max: 10000, hint: "Maximum LLM jobs running across all branches. Set to the LLM model capacity. 0 pauses LLM dispatch." },
    { name: "max_attempts", label: "Maximum attempts", min: 1, max: 10, hint: "Total attempts including the first attempt. Shared by OCR and LLM." },
    { name: "retry_delay_seconds", label: "Retry delay (seconds)", min: 1, max: 3600, hint: "Initial retry delay with exponential backoff. Shared by OCR and LLM." },
    { name: "lease_seconds", label: "Worker lease (seconds)", min: 30, max: 3600, hint: "Expired worker leases return jobs to the queue. Active workers renew leases." },
  ].filter(field => stage !== "llm" || field.name !== "ocr_global_ccu");
  return <div className="rounded-xl border border-solid border-[#e7e5ee] bg-white p-5 dark:border-[#27252e] dark:bg-[#111015] sm:p-6">
    <h2 className="mb-4 text-lg font-semibold">{stage === "llm" ? "LLM queue" : "OCR queue"}</h2>
    <Alert className="mb-5" type="info" showIcon title={stage === "llm" ? "LLM jobs must fit both the branch LLM CCU and the global LLM CCU. Batch size and retry settings are shared with OCR. The LLM transport is not integrated yet." : "OCR CCU limits pages running per branch. Files wait until more pages are needed to fill available slots. Batch size and retry settings are shared with LLM."} />
    <Spin spinning={loading}><Form form={form} layout="vertical" requiredMark={false} disabled={saving || loading || !canEdit} onFinish={onSave}>
      <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">{fields.map(field => <Form.Item key={field.name} name={field.name} label={field.label} extra={field.hint} rules={[{ required: true, type: "number", min: field.min, max: field.max }, { validator: (_, value) => Number.isInteger(value) ? Promise.resolve() : Promise.reject(new Error("Enter a whole number.")) }]}><InputNumber className="!w-full" min={field.min} max={field.max} precision={0} /></Form.Item>)}</div>
      <Button type="primary" htmlType="submit" loading={saving} disabled={!canEdit}>Save queue settings</Button>
    </Form></Spin>
  </div>;
}
