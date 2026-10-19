import type { LlmAgent, LlmKind, LlmSkill } from "@/apis/llm";
import type { Form } from "@/components";

export type Editor = { kind: LlmKind; record?: LlmAgent | LlmSkill };
export type SettingsValues = { url: string; modelName: string; key?: string };
export type EditorValues = { name?: string; agent_id?: string; skill?: number | null; description?: string; systemPrompt?: string };
export type LlmForm<T = EditorValues> = ReturnType<typeof Form.useForm<T>>[0];
