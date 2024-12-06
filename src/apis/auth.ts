import { message } from "antd";
import http from "./http";
import { BodySaleLogin } from "@/types/auth";

const path = `/auth-shop/login` as const;

export const authSaleApi = {
  async login(body: BodySaleLogin) {
    try {
      const res = await http.post(`${path}`, body);
      return res.data;
    } catch (error: any) {
      console.log(error);
      const messages = error.data.message;
      message.error(messages);
    }
  },
};
