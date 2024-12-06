import { EPackage } from "@/enum/EPackage";
import { IBaseEntity } from ".";

export interface IPackage extends IBaseEntity {
  name: string;
  key: EPackage;
  price: number;
  totalUser: number;
  totalLocation: number;
}
