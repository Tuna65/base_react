import { Category, QueryCate } from "@/models/category";
import { message } from "antd";
import http from "./http";

const path = `/category` as const;

export const categoryApi = {
  async create(body: Category): Promise<Category | any> {
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
  async edit(body: Category): Promise<Category | any> {
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
  async delete(id: number): Promise<Category | any> {
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

  async query(params: QueryCate): Promise<Category | any> {
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
