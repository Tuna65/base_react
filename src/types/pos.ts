import { IBaseEntity } from "@/models";

export type Tab = {
  id: number;
  isActive: boolean;
  lineItems: ILineItem[];
  discount: number;
  refund: number;
  note?: string;
};

export interface ILineItem extends IBaseEntity {
  productId: string;

  quantity: number;

  price: number;

  name: string;

  image: string;

  sku: string;

  stock: number;
}
