import { IBaseEntity } from ".";

export interface IInventory extends IBaseEntity {
  stock: number;

  mac: number;

  locationId: string;

  locationName: string;

  productId?: string;
}
