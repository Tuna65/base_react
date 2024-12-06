import { IBaseEntity } from ".";
import { IInventory } from "./inventory";

export interface IProduct extends IBaseEntity {
  name: string;

  description: string;

  images: string[];

  price: number;

  sku: string;

  barcode: number;

  quantity: number;

  unit: number;

  inventories: IInventory[];
}
