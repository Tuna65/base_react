import { EStatus } from "@/enum/EStatus";
import { IBasePagination } from ".";

export interface IQueryProduct {
  queryKey: [string, QueryKey];
  signal: Signal;
}

export interface QueryKey extends IBasePagination {
  name?: string;
  locationId?: string;
  status?: EStatus;
}

export interface Signal {}
