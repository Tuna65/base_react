import { STORAGE } from "@/configs/storage";
import { cookieStorageUtil, sessionStorageUtil } from "@/service/storage";
import { API_URL } from "@/configs/env";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

type RefreshTokenResponse = {
  access_token: string;
  refresh_token: string;
};

let refreshRequest: Promise<string> | null = null;

const http = axios.create({
  baseURL: API_URL,
});

http.interceptors.request.use(
  (config) => {
    const token = cookieStorageUtil.get(STORAGE.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.url?.includes("/auth/me")) {
      config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
      config.headers["Pragma"] = "no-cache";
      config.headers["Expires"] = "0";
    } else if (config.method?.toUpperCase() === "GET") {
      config.headers["Cache-Control"] = "public, max-age=10";
    } else {
      config.headers["Cache-Control"] = "no-store";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetriableRequestConfig | undefined;
    const refreshToken = cookieStorageUtil.get(STORAGE.REFRESH_TOKEN_KEY);
    const isAuthRequest = request?.url?.includes("/auth/login") || request?.url?.includes("/auth/refresh-token");

    if (
      !request ||
      request._retry ||
      isAuthRequest ||
      (error.response?.status !== 401 && error.response?.status !== 403) ||
      !refreshToken
    ) {
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      refreshRequest ??= axios
        .post<RefreshTokenResponse>(`${API_URL}/auth/refresh-token`, {
          refresh_token: refreshToken,
        })
        .then(({ data }) => {
          cookieStorageUtil.set(data.access_token, STORAGE.TOKEN_KEY, { expires: 1 });
          cookieStorageUtil.set(data.refresh_token, STORAGE.REFRESH_TOKEN_KEY, { expires: 7 });
          return data.access_token;
        });

      const accessToken = await refreshRequest;
      request.headers.Authorization = `Bearer ${accessToken}`;
      return http(request);
    } catch (refreshError) {
      cookieStorageUtil.remove(STORAGE.TOKEN_KEY);
      cookieStorageUtil.remove(STORAGE.REFRESH_TOKEN_KEY);
      sessionStorageUtil.remove(STORAGE.USER_KEY);
      return Promise.reject(refreshError);
    } finally {
      refreshRequest = null;
    }
  },
);

export default http;
