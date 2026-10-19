import http from "./gateway-http";
export interface ManagedBranch {
  id: number;
  name: string;
  ocr_ccu: number;
  llm_ccu: number;
  createdAt?: string;
  updateAt?: string;
}
export type SaveBranch = Pick<ManagedBranch, "name" | "ocr_ccu" | "llm_ccu">;
export type BranchOption = Pick<ManagedBranch, "id" | "name">;
export interface BranchList {
  items: ManagedBranch[];
  total: number;
  page: number;
  pageSize: number;
}
const path = "/admin/branches";
const payload = (body: SaveBranch) => ({ name: body.name.trim(), ocr_ccu: body.ocr_ccu, llm_ccu: body.llm_ccu });
export const branchApi = {
  async options(signal?: AbortSignal) {
    return (await http.get<BranchOption[]>(`${path}/options`, { signal })).data;
  },
  async list(params: { search?: string; page?: number; pageSize?: number }, signal?: AbortSignal) {
    return (await http.get<BranchList>(path, { params, signal })).data;
  },
  async detail(id: number) {
    return (await http.get<ManagedBranch>(`${path}/${id}`)).data;
  },
  async create(body: SaveBranch) {
    return (await http.post<ManagedBranch>(path, payload(body))).data;
  },
  async update(id: number, body: SaveBranch) {
    return (await http.patch<ManagedBranch>(`${path}/${id}`, payload(body))).data;
  },
  async remove(id: number) {
    return (await http.delete<{ deleted: boolean }>(`${path}/${id}`)).data;
  },
};
