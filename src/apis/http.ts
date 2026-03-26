import { STORAGE } from "@/configs/storage";
import { cookieStorageUtil } from "@/service/storage";
import axios, { InternalAxiosRequestConfig } from "axios";

const REFRESH_TOKEN_URL = "/auth-staff/refresh-token";

let isRefreshing = false;
let failedQueue: {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const http = axios.create({
  baseURL: "http://localhost:3070/api/v1",
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
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const { response } = error;

    if (
      (response?.status === 401 || response?.status === 403) &&
      !originalRequest._retry &&
      cookieStorageUtil.get(STORAGE.REFRESH_TOKEN_KEY)
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers!.Authorization = `Bearer ${token}`;
            return http(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const currentRefreshToken = cookieStorageUtil.get(STORAGE.REFRESH_TOKEN_KEY);

        const refreshResponse = await axios.post(
          REFRESH_TOKEN_URL,
          {},
          {
            baseURL: originalRequest.baseURL,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentRefreshToken}`,
            },
          },
        );

        const { accessToken, refreshToken } = refreshResponse.data;

        if (accessToken) {
          const accessExpires = new Date(new Date().getTime() + 30 * 1000);
          const refreshExpires = new Date(new Date().getTime() + 100 * 60 * 60 * 1000);

          cookieStorageUtil.set(accessToken, STORAGE.TOKEN_KEY, {
            expires: accessExpires,
          });
          cookieStorageUtil.set(refreshToken || currentRefreshToken, STORAGE.REFRESH_TOKEN_KEY, {
            expires: refreshExpires,
          });

          processQueue(null, accessToken);

          originalRequest.headers!.Authorization = `Bearer ${accessToken}`;
          return http(originalRequest);
        } else {
          throw new Error("Invalid token response");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error?.response || error);
  },
);

export default http;
