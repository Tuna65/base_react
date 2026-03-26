import { ResPagination } from "@/models";
import { InventoryReceipt } from "@/types/inventoryReceipt";
import { message } from "antd";
import http from "./http";

const path = `/inventory-receipt` as const;

export const inventoryReceiptApi = {
  async create(body: Partial<InventoryReceipt>): Promise<InventoryReceipt | any> {
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

  async query(): Promise<ResPagination<InventoryReceipt> | any> {
    try {
      const res = await http.get(`${path}`);
      if (res?.status > 201) throw Error(res as any);
      return res;
    } catch (error: any) {
      console.log(error);
      const messages = error.data.message;
      message.error(messages);
    }
  },

  async remove(id: number): Promise<ResPagination<InventoryReceipt> | any> {
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
