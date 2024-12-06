import { IBasePagination } from ".";

export interface QueryOrder {
  queryKey: [string, QueryKey];
  signal: Signal;
}

export interface QueryKey extends IBasePagination {
  status?: string;
}
export interface Signal {}
