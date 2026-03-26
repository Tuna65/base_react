import { EPackage } from "@/enum/EPackage";
import { IBasePagination } from ".";
import { IBaseEntity } from "@/models";

export interface ICreateShopProps {}

export interface QueryShop extends IBasePagination {
  name?: string;
}

export interface BodyUpPackage {
  id: string;
  key: EPackage;
  expiredDate: Date;
}

export interface Shop extends IBaseEntity {
  name: string;

  alias: string;

  // products?: Product[];

  // staffs: Staff[];

  // users: User[];

  // categories: Category[];

  // orders: Order[];
}
