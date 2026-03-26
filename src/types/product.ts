import { EStatus } from "@/enum/EStatus";
import { IBasePagination } from ".";
import { IBaseEntity } from "@/models";
import { Shop } from "./shop";

export interface IQueryProduct {
  queryKey: [string, QueryKey];
  signal: Signal;
}

export interface QueryKey extends IBasePagination {
  name?: string;
  locationId?: string;
  status?: EStatus;
}

export interface Signal {}

export interface Product extends IBaseEntity {
  name: string;

  shopId: number;

  shop: Shop;

  categoryId: number;

  // category: Category;

  options: ProductOption[];
}

export interface ProductOption extends IBaseEntity {
  name: string; // Size M, Màu Xanh...

  price: number;

  productId: number;

  product: Product;

  costPrice: number; // GIÁ NHẬP: Dùng để tính lợi nhuận

  stock: number;
}

export interface QueryProduct extends IBasePagination {
  name: string;
}
