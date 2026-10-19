import { useCallback, useEffect, useState } from "react";
import { Alert, Form, Tabs } from "@/components";
import { llmApi, LlmAgent, LlmKind, LlmSettings, LlmSkill } from "@/apis/llm";
import { settingsError } from "@/apis/settings";
import { useSearchQuery } from "@/hooks/useQuery";
import AgentsPanel from "./components/AgentsPanel";
import SkillsPanel from "./components/SkillsPanel";
import SettingsPanel from "./components/SettingsPanel";
import EditorDialog from "./components/EditorDialog";
import DeleteDialog from "./components/DeleteDialog";
import LlmHeader from "./components/LlmHeader";
import QueueSettingsPanel from "./components/QueueSettingsPanel";
import type { Editor, EditorValues, SettingsValues } from "./components/types";

export default function LlmPage() {
  const { params, onParams } = useSearchQuery();
  const tab = params.tab === "agents" || params.tab === "skills" || params.tab === "queue" ? params.tab : "settings";
  const [settings, setSettings] = useState<LlmSettings>({ url: "", modelName: "", hasKey: false });
  const [agents, setAgents] = useState<LlmAgent[]>([]);
  const [skills, setSkills] = useState<LlmSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [deleting, setDeleting] = useState<Editor | null>(null);
  const [query, setQuery] = useState("");
  const [settingsForm] = Form.useForm<SettingsValues>();
  const [editorForm] = Form.useForm<EditorValues>();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await llmApi.load();
      setSettings(data.settings);
      setAgents(data.agents);
      setSkills(data.skills);
      settingsForm.setFieldsValue({ ...data.settings, key: "" });
    } catch (failure) {
      setError(settingsError(failure));
    } finally {
      setLoading(false);
    }
  }, [settingsForm]);
  useEffect(() => {
    void load();
  }, [load]);

  const saveSettings = async (values: SettingsValues) => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const saved = await llmApi.saveSettings(values);
      setSettings(saved);
      settingsForm.setFieldsValue({ ...saved, key: "" });
      setSuccess("LLM settings saved.");
    } catch (failure) {
      setError(settingsError(failure));
    } finally {
      setSaving(false);
    }
  };
  const openEditor = (kind: LlmKind, record?: LlmAgent | LlmSkill) => {
    setError("");
    setSuccess("");
    editorForm.resetFields();
    editorForm.setFieldsValue(
      kind === "agents"
        ? record
          ? {
              name: (record as LlmAgent).name,
              agent_id: (record as LlmAgent).agent_id,
              skill: (record as LlmAgent).skill?.id ?? null,
            }
          : { skill: null }
        : record
          ? { name: record.name, description: (record as LlmSkill).description, systemPrompt: (record as LlmSkill).systemPrompt }
          : { description: "" },
    );
    setEditor({ kind, record });
  };
  const saveEditor = async () => {
    if (!editor) return;
    let values: Record<string, unknown>;
    try {
      values = await editorForm.validateFields();
    } catch {
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await llmApi.save(editor.kind, values, editor.record?.id);
      setEditor(null);
      setSuccess(`${editor.kind === "agents" ? "Agent" : "Skill"} saved.`);
      await load();
    } catch (failure) {
      setError(settingsError(failure));
    } finally {
      setSaving(false);
    }
  };
  const remove = async () => {
    if (!deleting?.record) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await llmApi.remove(deleting.kind, deleting.record.id);
      setDeleting(null);
      setSuccess("Record deleted.");
      await load();
    } catch (failure) {
      setError(settingsError(failure));
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="w-full min-w-0">
      <LlmHeader loading={loading} saving={saving} onRefresh={() => void load()} />
      {error && <Alert className="mb-4" type="error" showIcon title={error} />}
      {success && !error && <Alert className="mb-4" type="success" showIcon title={success} />}
      <Tabs
        activeKey={tab}
        onChange={(key) => {
          onParams({ ...params, tab: key });
          setQuery("");
          setSuccess("");
        }}
        items={[
          {
            key: "settings",
            label: "Settings",
            children: <SettingsPanel settings={settings} settingsForm={settingsForm} loading={loading} saving={saving} saveSettings={saveSettings} />,
          },
          {
            key: "queue",
            label: "Queue & CCU",
            children: <QueueSettingsPanel />,
          },
          {
            key: "agents",
            label: `Agents (${agents.length})`,
            children: <AgentsPanel agents={agents} query={query} loading={loading} saving={saving} onQueryChange={setQuery} onEdit={openEditor} onDelete={setDeleting} />,
          },
          {
            key: "skills",
            label: `Skills (${skills.length})`,
            children: <SkillsPanel skills={skills} query={query} loading={loading} saving={saving} onQueryChange={setQuery} onEdit={openEditor} onDelete={setDeleting} />,
          },
        ]}
      />
      <EditorDialog editor={editor} editorForm={editorForm} skills={skills} error={error} saving={saving} onCancel={() => !saving && setEditor(null)} onSave={() => void saveEditor()} />
      <DeleteDialog deleting={deleting} error={error} saving={saving} onCancel={() => !saving && setDeleting(null)} onDelete={() => void remove()} />
    </section>
  );
}
