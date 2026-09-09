import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { STORAGE } from "@/configs/storage";
import { cookieStorageUtil, sessionStorageUtil } from "@/service/storage";
import { LoginResponse } from "@/types/auth";

export const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL ?? "http://127.0.0.1:9961/api/v1";
const gatewayHttp = axios.create({ baseURL: GATEWAY_URL, timeout: 15000 });
type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };
let refreshing: Promise<LoginResponse> | null = null;

export function clearAuth() {
  cookieStorageUtil.remove(STORAGE.TOKEN_KEY);
  cookieStorageUtil.remove(STORAGE.REFRESH_TOKEN_KEY);
  cookieStorageUtil.remove("remember_login");
  sessionStorageUtil.remove(STORAGE.USER_KEY);
}

export function saveAuth(response: LoginResponse, remember = false) {
  const options = { sameSite: "lax" as const, secure: window.location.protocol === "https:" };
  cookieStorageUtil.set(response.access_token, STORAGE.TOKEN_KEY, { ...options, ...(remember ? { expires: response.expires_in / 86400 } : {}) });
  cookieStorageUtil.set(response.refresh_token, STORAGE.REFRESH_TOKEN_KEY, { ...options, ...(remember ? { expires: 7 } : {}) });
  cookieStorageUtil.set(String(remember), "remember_login", { ...options, ...(remember ? { expires: 7 } : {}) });
  sessionStorageUtil.set(response.user, STORAGE.USER_KEY);
}

gatewayHttp.interceptors.request.use((config) => {
  const token = cookieStorageUtil.get(STORAGE.TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

gatewayHttp.interceptors.response.use((response) => response, async (error: AxiosError) => {
  const config = error.config as RetryConfig | undefined;
  const token = cookieStorageUtil.get(STORAGE.REFRESH_TOKEN_KEY);
  if (!config || config._retry || error.response?.status !== 401 || config.url?.includes("/auth/login") || config.url?.includes("/auth/register")) return Promise.reject(error);
  if (!token) {
    clearAuth();
    window.dispatchEvent(new Event("auth:expired"));
    return Promise.reject(error);
  }
  config._retry = true;
  try {
    refreshing ??= axios.post<LoginResponse>(`${GATEWAY_URL}/auth/refresh-token`, { refresh_token: token }, { timeout: 15000 }).then(({ data }) => {
      saveAuth(data, cookieStorageUtil.get("remember_login") === "true");
      return data;
    }).finally(() => { refreshing = null; });
    const refreshed = await refreshing;
    config.headers.Authorization = `Bearer ${refreshed.access_token}`;
    return gatewayHttp(config);
  } catch (failure) {
    if (axios.isAxiosError(failure) && [401, 403].includes(failure.response?.status ?? 0)) {
      clearAuth();
      window.dispatchEvent(new Event("auth:expired"));
    }
    return Promise.reject(failure);
  }
});

export default gatewayHttp;
