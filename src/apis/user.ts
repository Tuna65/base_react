import http from "./gateway-http";

export type UserRole = string;
export type UserStatus = "ACTIVE" | "INACTIVE";
export interface ManagedUser {
  branch_id?: number | null;
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  roles: UserRole[];
  status: UserStatus;
  createdAt: string | null;
  updateAt: string | null;
}
export interface SaveUser {
  branch_id?: number;
  username: string;
  email: string;
  password?: string;
  displayName?: string;
  avatarUrl?: string | null;
  roles: UserRole[];
  status: UserStatus;
}
export interface UserList {
  items: ManagedUser[];
  total: number;
  page: number;
  pageSize: number;
}
const path = "/admin/users";
const payload = (body: SaveUser) => ({
  username: body.username.trim(),
  email: body.email.trim(),
  displayName: body.displayName?.trim() ?? "",
  avatarUrl: body.avatarUrl?.trim() || null,
  roles: body.roles,
  status: body.status,
  ...(body.branch_id !== undefined ? { branch_id: body.branch_id } : {}),
  ...(body.password ? { password: body.password } : {}),
});
export const userApi = {
  async list(params: { search?: string; status?: UserStatus; page: number; pageSize: number }, signal?: AbortSignal) {
    return (await http.get<UserList>(path, { params, signal })).data;
  },
  async detail(id: number) {
    return (await http.get<ManagedUser>(`${path}/${id}`)).data;
  },
  async create(body: SaveUser) {
    return (await http.post<ManagedUser>(path, payload(body))).data;
  },
  async update(id: number, body: SaveUser) {
    return (await http.patch<ManagedUser>(`${path}/${id}`, payload(body))).data;
  },
  async remove(ids: number[]) {
    return (await http.delete<{ deleted: number }>(path, { data: { ids } })).data;
  },
};
