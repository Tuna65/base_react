import Cookies from 'js-cookie';

const localStorageUtil = {
  get: (key: string) => JSON.parse(localStorage.getItem(key) as string),
  set: (token: string, key: string) => localStorage.setItem(key, JSON.stringify(token)),
  remove: (key: string) => localStorage.removeItem(key),
};

const cookieStorageUtil = {
  get: (key: string) => (Cookies.get(key) ? JSON.parse(Cookies.get(key) as string) : undefined),
  set: (token: string, key: string, configs?: Cookies.CookieAttributes) =>
    Cookies.set(key, JSON.stringify(token), {
      ...configs,
    }),
  remove: (key: string) => Cookies.remove(key),
};
export { localStorageUtil, cookieStorageUtil };
