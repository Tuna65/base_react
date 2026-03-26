import { EStatus } from "@/enum/EStatus";
import { IBaseEntity } from "@/models";
import { IBasePagination } from ".";

export interface Staff extends IBaseEntity {
  fullName: string;

  email: string;

  username: string;

  shopId: number;

  status: EStatus;
}

export interface QueryStaff extends IBasePagination {
  name?: string;
}
