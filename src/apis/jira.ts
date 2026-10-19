import { JiraIssueQuery } from "@/models/jira.model";
import { API_URL } from "@/configs/env";
import { message } from "@/components";
import axios from "axios";

const jiraHttp = axios.create({
  baseURL: API_URL,
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

  async getPlan(issueKey: string): Promise<any> {
    try {
      return await jiraHttp.get(`${path}/plan`, { params: { issueKey, _: Date.now() } });
    } catch (error: any) {
      console.log(error);
      const messages = error?.response?.data?.message || error?.message || "Fetch plan failed";
      message.error(messages);
      return null;
    }
  },

  async getVerify(issueKey: string): Promise<any> {
    try {
      return await jiraHttp.get(`${path}/verify`, { params: { issueKey, _: Date.now() } });
    } catch (error: any) {
      console.log(error);
      const messages = error?.response?.data?.message || error?.message || "Fetch verify failed";
      message.error(messages);
      return null;
    }
  },

  async updatePlanState(issueKey: string, state: "NOT_CREATED" | "CREATING" | "PASSED"): Promise<any> {
    return jiraHttp.patch(`${path}/plan/state`, { state }, { params: { issueKey } });
  },

  async updateVerifyState(issueKey: string, state: "NOT_CREATED" | "VERIFYING" | "PASSED"): Promise<any> {
    return jiraHttp.patch(`${path}/verify/state`, { state }, { params: { issueKey } });
  },
};
