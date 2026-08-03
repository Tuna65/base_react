import { JiraIssueQuery } from "@/models/jira.model";
import { message } from "antd";
import axios from "axios";

const jiraHttp = axios.create({
  baseURL: "http://localhost:8001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

const path = `/jira` as const;

export const jiraApi = {
  async sync(body: {
    projectKey: string;
    defaultSprint: string;
    issueTypes: string[];
  }): Promise<any> {
    try {
      const res = await jiraHttp.post(`${path}/sync`, body);
      return res;
    } catch (error: any) {
      console.log(error);
      const messages = error?.response?.data?.message || error?.message || "Sync failed";
      message.error(messages);
      return null;
    }
  },

  async getIssues(params?: JiraIssueQuery): Promise<any> {
    try {
      const res = await jiraHttp.get(`${path}/issues`, { params });
      return res;
    } catch (error: any) {
      console.log(error);
      const messages = error?.response?.data?.message || error?.message || "Fetch issues failed";
      message.error(messages);
      return null;
    }
  },

  async getIssueDetail(key: string): Promise<any> {
    try {
      const res = await jiraHttp.get(`${path}/issue`, { params: { key } });
      return res;
    } catch (error: any) {
      console.log(error);
      const messages = error?.response?.data?.message || error?.message || "Fetch issue detail failed";
      message.error(messages);
      return null;
    }
  },
};
