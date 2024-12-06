import BoxTable from "@/components/BoxTable";
import Text from "@/components/Text";
import { ResPagination } from "@/models";
import { defaultResPage } from "@/utils";
import { Flex } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type ICOrderAccountProps = {};

const COrderAccount = (props: ICOrderAccountProps) => {
  const { t } = useTranslation();
  const [order, setOrder] = useState<ResPagination<any>>(defaultResPage);

  const column = [
    {
      title: t("Mã đơn hàng"),
      dataIndex: "name",
      key: "name",
      render: (name: any, record: any) => (
        <Flex
          align="center"
          gap={4}
          className="group cursor-pointer"
          //   onClick={() => navigate(PATHNAME.USER.DETAIL_ID(user.id ?? ""))}
        >
          .
        </Flex>
      ),
    },
    {
      title: t("Tên khách hàng"),
      dataIndex: "name",
      key: "name",
      render: (name: any, record: any) => (
        <Flex
          align="center"
          gap={4}
          className="group cursor-pointer"
          //   onClick={() => navigate(PATHNAME.USER.DETAIL_ID(user.id ?? ""))}
        >
          .
        </Flex>
      ),
    },
    {
      title: t("Trạng thái"),
      dataIndex: "name",
      key: "name",
      render: (name: any, record: any) => (
        <Flex
          align="center"
          gap={4}
          className="group cursor-pointer"
          //   onClick={() => navigate(PATHNAME.USER.DETAIL_ID(user.id ?? ""))}
        >
          .
        </Flex>
      ),
    },
    {
      title: t("Số sản phẩm"),
      dataIndex: "name",
      key: "name",
      render: (name: any, record: any) => (
        <Flex
          align="center"
          gap={4}
          className="group cursor-pointer"
          //   onClick={() => navigate(PATHNAME.USER.DETAIL_ID(user.id ?? ""))}
        >
          .
        </Flex>
      ),
    },
    {
      title: t("Tổng tiền hàng"),
      dataIndex: "name",
      key: "name",
      render: (name: any, record: any) => (
        <Flex
          align="center"
          gap={4}
          className="group cursor-pointer"
          //   onClick={() => navigate(PATHNAME.USER.DETAIL_ID(user.id ?? ""))}
        >
          .
        </Flex>
      ),
    },
  ];
  return (
    <Flex vertical gap={24} className="bg-white shadow-box p-4 rounded-md">
      <Text type="TITLE3">{t("Đơn hàng")}</Text>
      <BoxTable data={order} columns={column as any} />
    </Flex>
  );
};

export default React.memo(COrderAccount);
