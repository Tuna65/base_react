import http from "./gateway-http";

export interface LlmSettings { url: string; modelName: string; hasKey: boolean }
export interface LlmSkill { id: number; name: string; description: string; systemPrompt: string }
export interface LlmAgent { id: number; name: string; agent_id: string; skill: LlmSkill | null; createdBy?: number; status?: string }
export interface SaveLlmSettings { url: string; modelName: string; key?: string }
export type LlmKind = "agents" | "skills";
export interface RunLlmRequest { message: string; [key: string]: unknown }
export interface RunLlmResponse { agent_id: string; message: string }
const path = "/admin/llm";

export const llmApi = {
  async getSettings() { return (await http.get<LlmSettings>(`${path}/settings`)).data; },
  async getAgents() { return (await http.get<LlmAgent[]>(`${path}/agents`)).data; },
  async getSkills() { return (await http.get<LlmSkill[]>(`${path}/skills`)).data; },
  async load() {
    const [settings, agents, skills] = await Promise.all([llmApi.getSettings(), llmApi.getAgents(), llmApi.getSkills()]);
    return { settings, agents, skills };
  },
  async saveSettings(body: SaveLlmSettings) {
    const payload = { url: body.url.trim(), modelName: body.modelName.trim(), ...(body.key?.trim() ? { key: body.key.trim() } : {}) };
    return (await http.put<LlmSettings>(`${path}/settings`, payload)).data;
  },
  async save(kind: LlmKind, body: Record<string, unknown>, id?: number) {
    // Send only DTO fields. Hidden form values and database ownership fields stay local.
    const payload = kind === "agents"
      ? { name: body.name, agent_id: body.agent_id, skill: body.skill ?? null }
      : { name: body.name, description: body.description ?? "", systemPrompt: body.systemPrompt };
    const response = id === undefined
      ? await http.post<LlmAgent | LlmSkill>(`${path}/${kind}`, payload)
      : await http.patch<LlmAgent | LlmSkill>(`${path}/${kind}/${id}`, payload);
    return response.data;
  },
  async remove(kind: LlmKind, id: number) { await http.delete(`${path}/${kind}/${id}`); },
  async run(body: RunLlmRequest) {
    return (await http.post<RunLlmResponse>(`${path}/run`, body, { timeout: 130000 })).data;
  },
};
