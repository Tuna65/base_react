import { ILineItem } from "@/types/pos";
import { IBaseEntity } from ".";

export interface IOrder extends IBaseEntity {
  shopId: string;

  createdByName: string;

  locationId: string;

  locationName: string;

  note: string;

  code: string;

  discount: number;

  status: string;

  lineItems: ILineItem[];
}
