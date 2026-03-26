import { Shop } from "@/types/shop";
import { IBaseEntity } from ".";
import { Orders } from "./order";

export interface User extends IBaseEntity {
  fullName: string;

  username: string;

  phoneNumber: string;

  orders: Orders[];

  shopId: number;

  shop: Shop;

  password: string;

  address: string;
}
