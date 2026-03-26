import { BodySaleLogin } from "@/types/auth";
import { message } from "antd";
import http from "./http";
import { ResLogin } from "@/models";
import { IUser } from "@/models/user";

const path = `/auth-staff` as const;

export const authSaleApi = {
  async login(body: BodySaleLogin): Promise<ResLogin | any> {
    try {
      const res = await http.post(`${path}/login`, body);
      if (res?.status > 201) throw Error(res as any);
      return res;
    } catch (error: any) {
      console.log(error);
      const messages = error.data.message;
      message.error(messages);
    }
  },

  async me(): Promise<IUser | any> {
    try {
      const res = await http.get(`${path}/me`);
      if (res?.status > 201) throw Error(res as any);
      return res;
    } catch (error: any) {
      console.log(error);
      const messages = error.data.message;
      message.error(messages);
    }
  },
};
