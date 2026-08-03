import { BodySaleLogin, LoginResponse } from "@/types/auth";
import http from "./http";

const path = `/auth` as const;

export const authSaleApi = {
  async login(body: BodySaleLogin): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>(`${path}/login`, body);
    return data;
  },

  async me() {
    const { data } = await http.get(`${path}/me`);
    return data;
  },
};
