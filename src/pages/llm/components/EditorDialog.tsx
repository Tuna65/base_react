import { Alert, Dialog, Form, Input, Select } from "@/components";
import type { LlmSkill } from "@/apis/llm";
import type { Editor, LlmForm } from "./types";

type Props = {
  editor: Editor | null;
  editorForm: LlmForm;
  skills: LlmSkill[];
  error: string;
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
};

export default function EditorDialog(props: Props) {
  const { editor, editorForm, skills, error, saving, onCancel, onSave } = props;
  return (
    <Dialog
      forceRender
      open={!!editor}
      title={`${editor?.record ? "Edit" : "Add"} ${editor?.kind === "agents" ? "agent" : "skill"}`}
      onCancel={onCancel}
      onOk={onSave}
      confirmLoading={saving}
      cancelButtonProps={{ disabled: saving }}
      closable={!saving}
      maskClosable={!saving}
      keyboard={!saving}
    >
      {error && <Alert className="mb-4" type="error" showIcon title={error} />}
      <Form form={editorForm} layout="vertical" disabled={saving} requiredMark={false}>
        {editor?.kind === "agents" ? (
          <>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, whitespace: true, message: "Enter an agent name." }]}
            >
              <Input placeholder="Main agent" />
            </Form.Item>
            <Form.Item
              name="agent_id"
              label="Agent ID"
              rules={[{ required: true, whitespace: true, message: "Enter an agent ID." }]}
            >
              <Input placeholder="main" />
            </Form.Item>
            <Form.Item name="skill" label="Skill">
              <Select
                allowClear
                placeholder="Select a skill (optional)"
                options={skills.map((skill) => ({ label: skill.name, value: skill.id }))}
              />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item
              name="name"
              label="Skill name"
              rules={[{ required: true, whitespace: true, message: "Enter a skill name." }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="systemPrompt"
              label="System prompt"
              rules={[{ required: true, whitespace: true, message: "Enter a system prompt." }]}
            >
              <Input.TextArea rows={7} placeholder="Instructions for the agent..." />
            </Form.Item>
          </>
        )}
        {editor?.kind === "skills" && (
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
        )}
      </Form>
    </Dialog>
  );
}
