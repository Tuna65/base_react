import { IBasePagination } from ".";

export interface IQueryAccount {
  queryKey: [string, QueryKey];
  signal: Signal;
}

export interface QueryKey extends IBasePagination {
  name?: string;
}

export interface Signal {}
