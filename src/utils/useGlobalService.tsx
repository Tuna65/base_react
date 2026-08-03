import { IconAccount, IconProduct, IconSale } from "@/assets/Icon";
import Text from "@/components/Text";
import { PATHNAME } from "@/utils/Pathname";
import { MenuProps } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

const useGlobalService = () => {
  const { t } = useTranslation();
  const rulesForm = {
    name: [
      {
        required: true,
        message: t("Tên không được để trống"),
      },
    ],
    username: [
      {
        required: true,
        message: t("Tên đăng nhập không được để trống"),
      },
      {
        pattern: /^[a-z0-9.@]+$/,
        message: 'Tên đăng nhập chỉ viết thường, ký tự ". @" và số',
      },
    ],
    password: [
      {
        required: true,
        message: t("Mật khẩu không được để trống"),
      },
    ],
    phone: [
      {
        required: true,
        message: t("Số điện thoại không được để trống"),
      },
    ],
    email: [
      {
        required: true,
        message: t("Email không được để trống"),
      },
      {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Email không hợp lệ!",
      },
    ],
    alias: [
      {
        required: true,
        message: t("Địa chỉ truy cập không được để trống"),
      },
      {
        pattern: /^[a-z0-9.-]+$/,
        message: 'Alias chỉ được chứa chữ thường và ký tự ".", "-"',
      },
    ],
    keyPackage: [
      {
        required: true,
        message: t("Key không được để trống"),
      },
    ],
    totalLocationPackage: [
      {
        required: true,
        message: t("Giới hạn chi nhánh không được để trống"),
      },
    ],
    pricePackage: [
      {
        required: true,
        message: t("Giá tiền không được để trống"),
      },
    ],
    totalUserPackage: [
      {
        required: true,
        message: t("Giói hạn thành viên không được để trống"),
      },
    ],
    expiredDate: [
      {
        required: true,
        message: t("Thời gian không được để trống"),
      },
    ],
    city: [
      {
        required: true,
        message: t("Thành phố không được để trống"),
      },
    ],
    district: [
      {
        required: true,
        message: t("Quận/ huyện không được để trống"),
      },
    ],
    ward: [
      {
        required: true,
        message: t("Xã/ Phường không được để trống"),
      },
    ],
    address: [
      {
        required: true,
        message: t("Địa chỉ không được để trống"),
      },
    ],
    unit: [
      {
        required: true,
        message: t("Đơn vị không được để trống"),
      },
    ],
    price: [
      {
        required: true,
        message: t("Giá không được để trống"),
      },
    ],
    quantity: [
      {
        required: true,
        message: t("Số lượng không được để trống"),
      },
    ],
  };

  return { rulesForm, navItem };
};

export default useGlobalService;

export const navItem = (t: any): MenuProps["items"] => [
  {
    key: PATHNAME.PREVIEW,
    icon: React.createElement(IconProduct),
    label: `Document`,
  },
  {
    key: PATHNAME.JIRA.INDEX,
    icon: React.createElement(IconSale),
    label: `Jira`,
  },
];
