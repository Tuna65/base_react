import { EShopStatus } from "@/enum/EShopStatus";
import { IBaseEntity } from ".";

export interface IShop extends IBaseEntity {
  status: EShopStatus;
  name: string;
  shopAlias: string;
  phone: string;
  image: string;
  packageId: string;
  address: Date;
  city: Date;
  district: Date;
  ward: Date;
}
