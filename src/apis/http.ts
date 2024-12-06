import axios from "axios";
import { BASE_URL } from "../utils/env";
import { STORAGE } from "../configs/storage";
import { cookieStorageUtil } from "../service/storage";

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    // 'Accept-Language': localStorageUtil.get(IVIWORK_LANGUAGE_KEY)
    //   ? `${localStorageUtil.get(IVIWORK_LANGUAGE_KEY)}`
    //   : 'vi',
  },
});

http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 403 || error.response?.status === 401) &&
      !!!originalRequest._retry &&
      cookieStorageUtil.get(STORAGE.NAAT_TOKEN_KEY)
    ) {
      originalRequest._retry = true;
      try {
        return http(originalRequest);
      } catch (error) {
        cookieStorageUtil.remove(STORAGE.NAAT_TOKEN_KEY);
      }
    }
    return Promise.reject(error?.response);
  }
);

http.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${cookieStorageUtil.get(
      STORAGE.NAAT_TOKEN_KEY
    )}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
