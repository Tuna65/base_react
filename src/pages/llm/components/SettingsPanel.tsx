import { Button, Form, Input, Spin, Tag } from "@/components";
import type { LlmSettings } from "@/apis/llm";
import type { LlmForm, SettingsValues } from "./types";
import { panel } from "./styles";

type Props = {
  settings: LlmSettings;
  settingsForm: LlmForm<SettingsValues>;
  loading: boolean;
  saving: boolean;
  saveSettings: (values: SettingsValues) => Promise<void>;
};

export default function SettingsPanel(props: Props) {
  const { settings, settingsForm, loading, saving, saveSettings } = props;
  return (
    <div className={panel}>
      <div className="mb-5 flex items-center gap-3">
        <h2 className="m-0 text-lg font-semibold">Model connection</h2>
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
              { required: true, message: "Enter the model API URL." },
              { type: "url", message: "Enter a valid HTTP or HTTPS URL." },
            ]}
          >
            <Input placeholder="https://api.example.com/v1" />
          </Form.Item>
          <Form.Item
            name="key"
            label="API key"
            extra={
              settings.hasKey ? "Leave blank to keep the existing key." : "Your key is hidden after saving."
            }
            rules={[{ required: !settings.hasKey, whitespace: true, message: "Enter an API key." }]}
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
            <Input placeholder="Model identifier" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>
            Save settings
          </Button>
        </Form>
      </Spin>
    </div>
  );
}
