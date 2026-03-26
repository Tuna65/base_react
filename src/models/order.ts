import { Shop } from "@/types/shop";
import { IBaseEntity } from ".";
import { Product, ProductOption } from "@/types/product";

export interface Orders extends IBaseEntity {
  orderNumber: string; // Mã đơn hàng (VD: ORD-123456)

  totalAmount: number; // Tổng tiền đơn hàng

  orderStatus: OrderStatus;

  shippingAddress: string;

  customerNote: string;

  isPaid: boolean;

  paymentMethod: string;

  shop: Shop;

  userId: number;

  user: any;

  items: OrderItem[];
}

export interface CreateOrderDTO {
  orderNumber?: string;

  totalAmount: number;

  orderStatus?: OrderStatus;

  shippingAddress: string;

  customerNote?: string;

  isPaid?: boolean;

  paymentMethod?: string;

  shopId: number;

  userId: number;

  items: CreateOrderItemDTO[];
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface CreateOrderItemDTO {
  quantity: number;

  price: number;

  productId: number;

  productOptionId: number;
}

export interface OrderItem extends IBaseEntity {
  quantity: number;

  price: number;

  orderId: number;

  productOptionId: number;

  order: Orders;

  product: Product;

  productOption: ProductOption;
}
