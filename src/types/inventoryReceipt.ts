import { IBaseEntity } from "@/models";
import { Shop } from "./shop";
import { ProductOption } from "./product";
import { IBasePagination } from ".";

export interface InventoryReceipt extends IBaseEntity {
  receiptNumber: string; // Mã phiếu nhập (VD: PN-001)

  importDate: Date;

  supplierName: string; // Tên nhà cung cấp

  totalCost: number; // Tổng tiền vốn bỏ ra cho cả đợt nhập

  shop: Shop;

  shopId: number;

  items?: ReceiptItem[];
}

export interface ReceiptItem extends IBaseEntity {
  quantity: number;

  importPrice: number; // Giá nhập riêng lẻ của món hàng tại thời điểm này

  receipt?: InventoryReceipt;
  productOptionId: number;
  productOption?: ProductOption;

  receiptNumber: number;
}

export interface QueryInventory extends IBasePagination {
  code?: string;
}
