import { useCallback, useEffect, useState } from "react";
import { Alert, Form, Tabs } from "@/components";
import { ocrApi } from "@/apis/ocr";
import { roleApi } from "@/apis/role";
import { useSearchQuery } from "@/hooks/useQuery";
import QueueSettingsPanel from "./components/QueueSettingsPanel";
import type { OcrSettings, OcrQueueSettings } from "@/apis/ocr";
import { settingsError } from "@/apis/settings";
import OcrHeader from "./components/OcrHeader";
import SettingsPanel from "./components/SettingsPanel";
import type { SettingsValues } from "./components/types";

export default function OcrPage() {
  const { params, onParams } = useSearchQuery();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [queueForm] = Form.useForm<OcrQueueSettings>();
  const [queueSaving, setQueueSaving] = useState(false);
  const queueRead = permissions.includes("ocr.queue_settings.read");
  const tab = params.tab === "queue" && queueRead ? "queue" : "connection";
  const [settings, setSettings] = useState<OcrSettings>({ url: "", modelName: "", hasKey: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form] = Form.useForm<SettingsValues>();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const [saved, mine] = await Promise.all([ocrApi.getSettings(), roleApi.myPermissions()]);
      setPermissions(mine);
      if (mine.includes("ocr.queue_settings.read")) queueForm.setFieldsValue(await ocrApi.getQueueSettings());
      setSettings(saved);
      form.setFieldsValue({ ...saved, key: "" });
    } catch (failure) {
      setError(settingsError(failure));
    } finally {
      setLoading(false);
    }
  }, [form, queueForm]);

  useEffect(() => {
    void load();
  }, [load]);

  const saveSettings = async (values: SettingsValues) => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const saved = await ocrApi.saveSettings(values);
      setSettings(saved);
      form.setFieldsValue({ ...saved, key: "" });
      setSuccess("OCR settings saved.");
    } catch (failure) {
      setError(settingsError(failure));
    } finally {
      setSaving(false);
    }
  };

  const saveQueue = async (values: OcrQueueSettings) => {
    setQueueSaving(true); setError(""); setSuccess("");
    try { queueForm.setFieldsValue(await ocrApi.saveQueueSettings(values)); setSuccess("OCR queue settings saved."); }
    catch (failure) { setError(settingsError(failure)); }
    finally { setQueueSaving(false); }
  };
  return (
    <section className="w-full min-w-0">
      <OcrHeader loading={loading} saving={saving || queueSaving} onRefresh={() => void load()} />
      {error && <Alert className="mb-4" type="error" showIcon title={error} />}
      {success && !error && <Alert className="mb-4" type="success" showIcon title={success} />}
      <Tabs activeKey={tab} onChange={key => onParams({ ...params, tab: key })} items={[
        { key: "connection", label: "Connection", children: <SettingsPanel settings={settings} settingsForm={form} loading={loading} saving={saving} saveSettings={saveSettings} /> },
        { key: "queue", label: "Queue & CCU", disabled: !queueRead, children: <QueueSettingsPanel form={queueForm} loading={loading} saving={queueSaving} canEdit={permissions.includes("ocr.queue_settings.update")} onSave={values => void saveQueue(values)} /> },
      ]} />
    </section>
  );
}
