import { EStatus } from "@/enum/EStatus";

export interface IBaseLoading {
  create: boolean;
  edit: boolean;
  find: boolean;
  delete: boolean;
  detail: boolean;
}

export interface IBasePagination {
  page?: string | number;
  limit?: string | number;
}

export interface IParamQuery extends IBasePagination {
  name?: string;
}

export interface IQuery {
  queryKey: [string, QueryKey];
  signal: Signal;
}

export interface QueryKey extends IBasePagination {
  name?: string;
  status?: EStatus;
}

export interface Signal {}
