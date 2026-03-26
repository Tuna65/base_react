import { orderApi } from "@/apis/order";
import useAsync from "@/apis/useApi";
import ContainerTablePage from "@/components/ContainerTablePage";
import { useSearchQuery } from "@/hooks/useQuery";
import { useTitle } from "@/hooks/useTitle";
import { ResPagination } from "@/models";
import { Orders } from "@/models/order";
import { defaultResPage } from "@/utils";
import { PATHNAME } from "@/utils/Pathname";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Badge, Tag, Typography, Space, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const { Text } = Typography;

type Props = {};

const Order = (props: Props) => {
  const { t } = useTranslation();
  useTitle(t("Quản lý sản phẩm"));
  const { params } = useSearchQuery();
  const navigate = useNavigate();

  const { execute, loading, data } = useAsync<ResPagination<Orders>>(orderApi.query, {
    onSucess: (_) => {},
  });

  useEffect(() => {
    params.page && execute(params);
  }, [params]);

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (text: string) => (
        <Text strong color="blue">
          {text}
        </Text>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (_: any, record: Orders) => (
        <Space direction="vertical" size={0}>
          {/* <Text strong>{record.customerName}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.customerPhone}
          </Text> */}
        </Space>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right" as const,
      render: (amount: number) => (
        <Text strong style={{ color: "#f5222d" }}>
          {Number(amount).toLocaleString()} đ
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      align: "center" as const,
      render: (status: string) => {
        const statusConfig: any = {
          PENDING: { color: "warning", text: "Chờ xử lý" },
          CONFIRMED: { color: "blue", text: "Đã xác nhận" },
          SHIPPING: { color: "processing", text: "Đang giao" },
          DELIVERED: { color: "success", text: "Hoàn thành" },
          CANCELLED: { color: "error", text: "Đã hủy" },
        };
        const { color, text } = statusConfig[status] || { color: "default", text: status };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thanh toán",
      dataIndex: "isPaid",
      key: "isPaid",
      render: (isPaid: boolean) => (
        <Badge status={isPaid ? "success" : "error"} text={isPaid ? "Đã trả" : "Chưa trả"} />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
  ];

  return (
    <div>
      <ContainerTablePage
        data={data || (defaultResPage as any)}
        column={columns as any}
        loading={loading}
        actionCreate={() => navigate(PATHNAME.ORDER.CREATE)}
      />
    </div>
  );
};

export default Order;
