import { IBaseLoading } from "@/types";

export const configAntdProvider = {
  token: {
    colorPrimary: "#5932EA",
    borderRadius: 6,
    colorBgContainer: "#fff",
    fontFamily: '"Geist Variable", "Geist", sans-serif',
  },
};

export const defaultResPage = {
  items: [],
  meta: {
    currentPage: 1,
    itemCount: 18,
    itemsPerPage: 20,
    totalItems: 18,
    totalPages: 1,
  },
};

export const baseLoading: IBaseLoading = {
  create: false,
  delete: false,
  edit: false,
  find: false,
  detail: false,
};
