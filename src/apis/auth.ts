import { BodySaleLogin, LoginResponse } from "@/types/auth";
import http, { clearAuth } from "./gateway-http";
import { IUser } from "@/models/user";

const path = `/auth` as const;

export const authSaleApi = {
  async login(body: BodySaleLogin): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>(`${path}/login`, body);
    return data;
  },

  async me(signal?: AbortSignal) {
    const { data } = await http.get<IUser>(`${path}/me`, { signal });
    return data;
  },
  async logout() { clearAuth(); },
};
