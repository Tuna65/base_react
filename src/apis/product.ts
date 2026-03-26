import { IUser } from "@/models/user";
import { Product, QueryProduct } from "@/types/product";
import { message } from "antd";
import http from "./http";

const path = `/product` as const;

export const productApi = {
  async create(body: Product): Promise<Product | any> {
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

  async edit(body: Product): Promise<Product | any> {
    try {
      const res = await http.put(`${path}`, body);
      if (res?.status > 201) throw Error(res as any);
      return res;
    } catch (error: any) {
      console.log(error);
      const messages = error.data.message;
      message.error(messages);
    }
  },

  async query(params: QueryProduct): Promise<IUser | any> {
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

  async detail(id: number): Promise<IUser | any> {
    try {
      const res = await http.get(`${path}/${id}`);
      if (res?.status > 201) throw Error(res as any);
      return res;
    } catch (error: any) {
      console.log(error);
      const messages = error.data.message;
      message.error(messages);
    }
  },

  async deleted(id: number): Promise<IUser | any> {
    try {
      const res = await http.delete(`${path}/${id}`);
      if (res?.status > 201) throw Error(res as any);
      return res;
    } catch (error: any) {
      console.log(error);
      const messages = error.data.message;
      message.error(messages);
    }
  },
};
