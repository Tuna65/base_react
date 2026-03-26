import { ProductOption, QueryProduct } from "@/types/product";
import { message } from "antd";
import http from "./http";

const path = `/product-option` as const;

export const productOptionApi = {
  async create(body: ProductOption): Promise<ProductOption | any> {
    try {
      const res = await http.post(`${path}`, body);
      if (res?.status > 201) throw Error(res as any);
      return res;
    } catch (error: any) {
      console.log(error);
      const messages = error.data.message;
      message.error(messages);
    }
  },

  async query(params: QueryProduct): Promise<ProductOption | any> {
    try {
      const res = await http.get(`${path}`, { params });
      if (res?.status > 201) throw Error(res as any);
      return res;
    } catch (error: any) {
      console.log(error);
      const messages = error.data.message;
      message.error(messages);
    }
  },
};
