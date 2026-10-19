import { Button, Form, Input, Spin, Tag } from "@/components";
import type { OcrSettings } from "@/apis/ocr";
import type { OcrForm, SettingsValues } from "./types";
const panel =
  "rounded-xl border border-solid border-[#e7e5ee] bg-white p-5 dark:border-[#27252e] dark:bg-[#111015] sm:p-6";

type Props = {
  settings: OcrSettings;
  settingsForm: OcrForm;
  loading: boolean;
  saving: boolean;
  saveSettings: (values: SettingsValues) => Promise<void>;
};

export default function SettingsPanel(props: Props) {
  const { settings, settingsForm, loading, saving, saveSettings } = props;
  return (
    <div className={panel}>
      <div className="mb-5 flex items-center gap-3">
        <h2 className="m-0 text-lg font-semibold">OCR connection</h2>
        {settings.hasKey && <Tag color="success">Key configured</Tag>}
      </div>
      <Spin spinning={loading}>
        <Form
          form={settingsForm}
          layout="vertical"
          onFinish={saveSettings}
          disabled={saving || loading}
          requiredMark={false}
          className="w-full"
        >
          <Form.Item
            name="url"
            label="URL"
            rules={[
              { required: true, message: "Enter the OCR API URL." },
              { type: "url", message: "Enter a valid HTTP or HTTPS URL." },
            ]}
          >
            <Input placeholder="http://localhost:8200" />
          </Form.Item>
          <Form.Item
            name="key"
            label="API key (optional)"
            extra={
              settings.hasKey
                ? "Leave blank to keep the existing key."
                : "Optional for services that do not require authentication."
            }
          >
            <Input.Password
              autoComplete="new-password"
              placeholder={settings.hasKey ? "Enter a new key to replace the existing one" : "API key"}
            />
          </Form.Item>
          <Form.Item
            name="modelName"
            label="Model name"
            rules={[{ required: true, whitespace: true, message: "Enter the model name." }]}
          >
            <Input placeholder="OCR model identifier" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>
            Save settings
          </Button>
        </Form>
      </Spin>
    </div>
  );
}
