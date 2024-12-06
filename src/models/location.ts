import { EStatus } from "@/enum/EStatus";
import { IBaseEntity } from ".";

export interface ILocation extends IBaseEntity {
  name: string;

  phone: string;

  city: string;

  district: string;

  ward: string;

  address: string;

  isDefault: boolean;

  status: EStatus;
  
  shopId: string;
}
