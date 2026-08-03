import Cookies from "js-cookie";

export const localStorageUtil = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : undefined;
    } catch {
      return undefined;
    }
  },
  set: (token: string, key: string) => localStorage.setItem(key, JSON.stringify(token)),
  remove: (key: string) => localStorage.removeItem(key),
};

export const cookieStorageUtil = {
  get: (key: string) => {
    try {
      const value = Cookies.get(key);
      return value ? JSON.parse(value) : undefined;
    } catch {
      return Cookies.get(key);
    }
  },
  set: (token: string, key: string, configs?: Cookies.CookieAttributes) =>
    Cookies.set(key, JSON.stringify(token), {
      ...configs,
    }),
  remove: (key: string) => Cookies.remove(key),
};
