import { IconAccount, IconLocation, IconOrder, IconPieChart, IconProduct, IconRole, IconSale } from "@/assets/Icon";
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

  const navItem: MenuProps["items"] = [
    {
      key: PATHNAME.SALE,
      icon: React.createElement(IconSale),
      label: `Bán hàng`,
    },
    {
      key: PATHNAME.DASHBOARD,
      icon: React.createElement(IconPieChart),
      label: `Dashboard`,
    },
    {
      key: PATHNAME.ORDER.INDEX,
      icon: React.createElement(IconOrder),
      label: <Text type="HEADLINE">{t("Đơn hàng")}</Text>,
      // children: [
      //   {
      //     key: PATHNAME.ORDER.INDEX,
      //     label: <Text type="HEADLINE">{"Order"}</Text>,
      //   },
      // ],
    },
    {
      key: "PATHNAME.PRODUCT",
      icon: React.createElement(IconProduct),
      label: <Text type="HEADLINE">{t("Sản phẩm")}</Text>,
      children: [
        {
          key: PATHNAME.PRODUCT.INDEX,
          label: <Text type="HEADLINE">{t("Sản phẩm")}</Text>,
        },
        {
          key: PATHNAME.PRODUCT_GROUP.INDEX,
          label: <Text type="HEADLINE">{t("Nhóm sản phẩm")}</Text>,
        },
      ],
    },
    {
      key: PATHNAME.USER.INDEX,
      icon: React.createElement(IconAccount),
      label: <Text type="HEADLINE">{t("Tài khoản")}</Text>,
      // children: [
      //   {
      //     key: PATHNAME.USER.INDEX,
      //     label: <Text type="HEADLINE">{t("Tài khoản")}</Text>,
      //   },
      // ],
    },
    {
      key: PATHNAME.LOCATION.INDEX,
      icon: React.createElement(IconLocation),
      label: <Text type="HEADLINE">{t("Chi nhánh")}</Text>,
    },
    {
      key: PATHNAME.ROLE.INDEX,
      icon: (
        <div className="opacity-30">
          <IconRole />
        </div>
      ),
      label: <Text type="HEADLINE">{t("Vai trò")}</Text>,
    },
  ];
  return { rulesForm, navItem };
};

export default useGlobalService;
