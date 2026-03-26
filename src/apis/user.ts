import { ResPagination } from "@/models";
import { QueryStaff, Staff } from "@/types/staff";
import { message } from "antd";
import http from "./http";

const path = `/user` as const;

export const userApi = {
  async query(params?: QueryStaff): Promise<ResPagination<Staff> | any> {
    try {
      const res = await http.get(`${path}`, { params });
      if (res?.status > 201) throw Error(res as any);
      return res;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },

  async create(body: Staff): Promise<Staff | any> {
    try {
      const res = await http.post(`${path}`, body);
      if (res?.status > 201) throw Error(res as any);
      return res;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },

  async update( body: Staff): Promise<Staff | any> {
    try {
      const res = await http.put(`${path}`, body);
      if (res?.status > 201) throw Error(res as any);
      return res;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },

  async changePassword(body: any): Promise<any | any> {
    try {
      const res = await http.put(`${path}/change-password`, body);
      if (res?.status > 201) throw Error(res as any);
      return res;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },

  async detail(id: string): Promise<Staff | any> {
    try {
      const res = await http.get(`${path}/${id}`);
      if (res?.status > 201) throw Error(res as any);
      return res;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },

  async delete(id: string): Promise<any | any> {
    try {
      const res = await http.delete(`${path}/${id}`);
      if (res?.status !== 200) throw Error(res as any);
      return res.data;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },
};
