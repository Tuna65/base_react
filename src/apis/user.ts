import gatewayHttp from "./gateway-http";
import { IUser } from "@/models/user";
export interface CreateUser { username: string; email: string; password: string; fullName?: string; role?: "admin" | "user" }
export const userApi = {
  async query() { return (await gatewayHttp.get<IUser[]>("/users")).data; },
  async detail(id: number) { return (await gatewayHttp.get<IUser>(`/users/${id}`)).data; },
  async create(body: CreateUser) { return (await gatewayHttp.post<IUser>("/users", body)).data; },
  async update(id: number, body: Partial<CreateUser> & { status?: "ACTIVE" | "INACTIVE" }) { return (await gatewayHttp.patch<IUser>(`/users/${id}`, body)).data; },
  async delete(id: number) { await gatewayHttp.delete(`/users/${id}`); },
  async me() { return (await gatewayHttp.get<IUser>("/users/me")).data; },
  async updateMe(body: Partial<Omit<CreateUser, "role">>) { return (await gatewayHttp.patch<IUser>("/users/me", body)).data; },
};
