import { ResPagination } from "@/models";
import { IUser } from "@/models/user";
import { IQueryAccount } from "@/types/account";
import { EStatus } from "@/enum/EStatus";
import { message } from "antd";
import http from "./http";

const path = `/account` as const;

export const accountApi = {
  async find(params?: IQueryAccount): Promise<ResPagination<IUser> | any> {
    console.log(params);

    try {
      const res = await http.get(`${path}`, { params: params?.queryKey[1] });
      return res.data;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },

  async query(): Promise<ResPagination<IUser> | any> {
    try {
      const res = await http.get(`${path}`);
      return res.data;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },

  async create(body: IUser): Promise<any | any> {
    try {
      const res = await http.post(`${path}`, body);
      if (res.data.code) throw Error(res.data.message);
      return res.data;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },

  async update(id: string, body: IUser): Promise<any | any> {
    try {
      const res = await http.put(`${path}/${id}`, body);
      if (res.data.code) throw Error(res.data.message);
      return res.data;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },

  async changePassword(body: any): Promise<any | any> {
    try {
      const res = await http.put(`${path}/change-password`, body);
      if (res.data.code) throw Error(res.data.message);
      return res.data;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },

  async detail(id: string): Promise<any | any> {
    try {
      const res = await http.get(`${path}/${id}`);
      const data = { ...res.data };
      data.status = data.status == EStatus.ACTIVE ? true : false;
      data.password = "******";
      return data;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },

  async detailByToken(businessId?: string, shopId?: string): Promise<any | any> {
    try {
      const res = await http.get(`${path}/me`, {
        params: { businessId, shopId },
      });
      return res.data;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },

  async delete(id: string): Promise<any | any> {
    try {
      const res = await http.delete(`${path}/${id}`);
      return res.data;
    } catch (error: any) {
      message.error(error?.data?.message ?? error?.data?.message[0]);
    }
  },
};
