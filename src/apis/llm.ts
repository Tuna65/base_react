import { message } from "antd";
import axios from "axios";

const llmHttp = axios.create({
  baseURL: "http://localhost:8001/api/v1/llm",
  headers: {
    "Content-Type": "application/json",
  },
});

export const llmApi = {
  async plan(body: { issueKey: string; [key: string]: any }): Promise<any> {
    try {
      const res = await llmHttp.post("/plan", body);
      return res;
    } catch (error: any) {
      console.log(error);
      const messages = error?.response?.data?.message || error?.message || "Lỗi tạo Plan từ LLM";
      message.error(messages);
      return null;
    }
  },

  async verify(body: { issueKey: string; [key: string]: any }): Promise<any> {
    try {
      const res = await llmHttp.post("/verify", body);
      return res;
    } catch (error: any) {
      console.log(error);
      const messages = error?.response?.data?.message || error?.message || "Lỗi Verify từ LLM";
      message.error(messages);
      return null;
    }
  },
};
