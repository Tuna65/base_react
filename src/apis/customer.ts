import { ResPagination } from "@/models";
import { Customer, QueryCustomer } from "@/types/customer";
import { message } from "antd";
import http from "./http";

const path = `/customer` as const;

export const customerApi = {
  async query(params?: QueryCustomer): Promise<ResPagination<Customer> | any> {
    try {
      const res = await http.get(`${path}`, { params });
      if (res?.status > 201) throw Error(res as any);
      return res;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },

  async create(body: Omit<Customer, "id">): Promise<Customer | any> {
    try {
      const res = await http.post(`${path}`, body);
      if (res?.status > 201) throw Error(res as any);
      return res;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },

  async detail(id: number | string): Promise<Customer | any> {
    try {
      const res = await http.get(`${path}/${id}`);
      if (res?.status > 201) throw Error(res as any);
      return res;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },

  async update(body: Customer): Promise<Customer | any> {
    try {
      const res = await http.put(`${path}`, body);
      if (res?.status > 201) throw Error(res as any);
      return res;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },

  async delete(id: number | string): Promise<any> {
    try {
      const res = await http.delete(`${path}/${id}`);
      if (res?.status !== 200) throw Error(res as any);
      return res.data;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },
};
