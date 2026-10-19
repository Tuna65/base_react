// Compatibility entry point. All LLM requests use the authenticated gateway client.
export { llmApi as llmManagementApi } from "./llm";
export type { LlmSettings, LlmSkill, LlmAgent, LlmKind } from "./llm";
