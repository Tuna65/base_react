import { Shop } from "@/types/shop";
import { IBaseEntity } from ".";
import { Orders } from "./order";

export interface IUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: "admin" | "user";
  status: "ACTIVE" | "INACTIVE";
}

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
