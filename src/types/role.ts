import { Option } from "@/models";
import { IBasePagination } from ".";

export interface QueryRole extends IBasePagination {
  name?: string;
}
export interface IPermissionOptions {
  name: string;
  key:
    | "SHOP"
    | "POLICY"
    | "FORMULA"
    | "USER"
    | "ROLE"
    | "ORDER"
    | "PRODUCT"
    | "CATEGORY"
    | "INVENTORY"
    | "DASHBOARD"
    | "REFERRING_TREE";
  permission: Option[];
}

export const permissions: IPermissionOptions[] = [
  {
    name: "Dashboard",
    permission: [{ value: "VIEW_DASHBOARD", label: "Xem Dashboard" }],
    key: "DASHBOARD",
  },
  {
    name: "User",
    permission: [
      { value: "VIEW_USER", label: "Xem thành viên" },
      { value: "CREATE_USER", label: "Thêm thành viên" },
      { value: "EDIT_USER", label: "Sửa thành viên" },
      { value: "DELETE_USER", label: "Xóa thành viên" },
    ],
    key: "USER",
  },
  {
    name: "Referring tree",
    permission: [
      { value: "VIEW_REFERRING_TREE", label: "Xem tree shop" },
      { value: "CREATE_REFERRING_TREE", label: "Thêm tree shop" },
      { value: "EDIT_REFERRING_TREE", label: "Sửa tree shop" },
      { value: "DELETE_REFERRING_TREE", label: "Xóa tree shop" },
    ],
    key: "REFERRING_TREE",
  },
  {
    name: "Đơn hàng",
    permission: [
      { value: "VIEW_ORDER", label: "Xem đơn hàng" },
      { value: "COMPLETED_ORDER", label: "Hoàn thành đơn hàng" },
    ],
    key: "ORDER",
  },
  {
    name: "Sản phẩm",
    permission: [
      { value: "VIEW_PRODUCT", label: "Xem sản phẩm" },
      { value: "CREATE_PRODUCT", label: "Thêm sản phẩm" },
      { value: "EDIT_PRODUCT", label: "Sửa sản phẩm" },
      { value: "DELETE_PRODUCT", label: "Xóa sản phẩm" },
    ],
    key: "PRODUCT",
  },
  {
    name: "Loại sản phẩm",
    permission: [
      { value: "VIEW_CATEGORY", label: "Xem thành viên" },
      { value: "CREATE_CATEGORY", label: "Xem thành viên" },
      { value: "EDIT_CATEGORY", label: "Xem thành viên" },
      { value: "DELETE_CATEGORY", label: "Xem thành viên" },
    ],
    key: "CATEGORY",
  },
  {
    name: "Role",
    permission: [
      { value: "VIEW_ROLE", label: "Xem vai trò" },
      { value: "CREATE_ROLE", label: "Thêm vai trò" },
      { value: "EDIT_ROLE", label: "Sửa vai trò" },
      { value: "DELETE_ROLE", label: "Xóa vai trò" },
    ],
    key: "ROLE",
  },
  {
    name: "Kho",
    permission: [{ value: "VIEW_INVENTORY", label: "Xem kho sản phẩm" }],
    key: "INVENTORY",
  },
];
