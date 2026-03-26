import { Shop } from "@/types/shop";
import { IBaseEntity } from ".";
import { Product } from "@/types/product";
import { IBasePagination } from "@/types";

export interface Category extends IBaseEntity {
  name: string;

  description: string;

  slug: string;

  shop?: Shop;

  products?: Product[];
}

export interface QueryCate extends IBasePagination {}
