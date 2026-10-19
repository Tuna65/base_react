import http from "./gateway-http";

export interface ManagedRole {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  createdAt?: string;
  updateAt?: string;
}
export interface SaveRole {
  name: string;
  description: string;
  permissions: string[];
}
export interface PermissionOption {
  value: string;
  group: string;
  label: string;
  assignable: boolean;
}
export interface RoleOption {
  name: string;
  description: string;
}
const path = "/admin/roles";
const payload = (body: SaveRole) => ({
  name: body.name.trim().toLowerCase(),
  description: body.description.trim(),
  permissions: [...new Set(body.permissions)],
});
export const roleApi = {
  async list(search?: string, signal?: AbortSignal) {
    return (await http.get<ManagedRole[]>(path, { params: { search }, signal })).data;
  },
  async detail(id: number) {
    return (await http.get<ManagedRole>(`${path}/${id}`)).data;
  },
  async permissions(signal?: AbortSignal) {
    return (await http.get<PermissionOption[]>(`${path}/permissions`, { signal })).data;
  },
  async myPermissions(signal?: AbortSignal) {
    return (await http.get<string[]>(`${path}/my-permissions`, { signal })).data;
  },
  async options(signal?: AbortSignal) {
    return (await http.get<RoleOption[]>(`${path}/options`, { signal })).data;
  },
  async create(body: SaveRole) {
    return (await http.post<ManagedRole>(path, payload(body))).data;
  },
  async update(id: number, body: SaveRole) {
    return (await http.patch<ManagedRole>(`${path}/${id}`, payload(body))).data;
  },
  async remove(id: number) {
    return (await http.delete<{ deleted: boolean }>(`${path}/${id}`)).data;
  },
};
