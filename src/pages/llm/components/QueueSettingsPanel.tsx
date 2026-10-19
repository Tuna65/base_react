import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Form } from "@/components";
import QueueSettingsForm from "@/components/QueueSettingsPanel";
import { ocrApi, type OcrQueueSettings } from "@/apis/ocr";
import { roleApi } from "@/apis/role";
import { settingsError } from "@/apis/settings";

export default function QueueSettingsPanel() {
  const [form] = Form.useForm<OcrQueueSettings>();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const canRead = permissions.includes("ocr.queue_settings.read");
  const canEdit = permissions.includes("ocr.queue_settings.update");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const mine = await roleApi.myPermissions();
      setPermissions(mine);
      if (mine.includes("ocr.queue_settings.read")) {
        const { ocr_global_ccu: _ocr, ...values } = await ocrApi.getQueueSettings();
        form.setFieldsValue(values);
      }
    } catch (failure) {
      setError(settingsError(failure));
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (values: OcrQueueSettings) => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const saved = await ocrApi.saveQueueSettings({
        llm_global_ccu: values.llm_global_ccu,
        batch_size: values.batch_size,
        max_attempts: values.max_attempts,
        retry_delay_seconds: values.retry_delay_seconds,
        lease_seconds: values.lease_seconds,
      });
      const { ocr_global_ccu: _ocr, ...queue } = saved;
      form.setFieldsValue(queue);
      setSuccess("LLM queue settings saved.");
    } catch (failure) {
      setError(settingsError(failure));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button loading={loading} disabled={saving} onClick={() => void load()}>Refresh queue settings</Button>
      </div>
      {error && <Alert className="mb-4" type="error" showIcon title={error} />}
      {success && !error && <Alert className="mb-4" type="success" showIcon title={success} />}
      {!loading && !canRead
        ? <Alert type="info" showIcon title="You need queue settings read permission to view this configuration." />
        : <QueueSettingsForm stage="llm" form={form} loading={loading} saving={saving} canEdit={canEdit} onSave={values => void save(values)} />}
    </div>
  );
}
