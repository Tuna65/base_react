import { EPackage } from "@/enum/EPackage";
import { IBasePagination } from ".";

export interface ICreateShopProps {}

export interface QueryShop extends IBasePagination {
  name?: string;
}

export interface BodyUpPackage {
  id: string;
  key: EPackage;
  expiredDate: Date;
}
