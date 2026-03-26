import { IBaseEntity } from "@/models";
import { IBasePagination } from ".";

export interface Customer extends IBaseEntity {
  name: string;
  phone: string;
  address: string;
}

export interface QueryCustomer extends IBasePagination {
  name?: string;
}
