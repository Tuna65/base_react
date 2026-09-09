import axios from "axios";
import settingsHttp from "./gateway-http";

export interface SkillConfig { id: number; name: string; description?: string; system_prompt: string }
export interface FuncallConfig {
  id: number; name: string; description?: string; url: string; method: string;
  headers: Record<string, string>; query: Record<string, unknown>; parameters: Record<string, unknown>; timeout: number;
}
export interface AgentConfig {
  id: number; agent_id: string; description?: string; skill_id: number | null;
  skill: SkillConfig | null; funcalls: FuncallConfig[];
}
export type ConfigKind = "agents" | "skills" | "funcalls";
export type ConfigRecord = AgentConfig | SkillConfig | FuncallConfig;


export const settingsApi = {
  async load() {
    const [agents, skills, funcalls] = await Promise.all([
      settingsHttp.get<AgentConfig[]>("/agents"), settingsHttp.get<SkillConfig[]>("/skills"), settingsHttp.get<FuncallConfig[]>("/funcalls"),
    ]);
    return { agents: agents.data, skills: skills.data, funcalls: funcalls.data };
  },
  async save(kind: ConfigKind, body: Record<string, unknown>, id?: number) {
    return id === undefined ? settingsHttp.post(`/${kind}`, body) : settingsHttp.patch(`/${kind}/${id}`, body);
  },
  async remove(kind: ConfigKind, id: number) { await settingsHttp.delete(`/${kind}/${id}`); },
};

export function settingsError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.message;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.join(". ");
    return "Không kết nối được gateway. Kiểm tra service và thử lại.";
  }
  return error instanceof Error ? error.message : "Không thể lưu thay đổi. Vui lòng thử lại.";
}
