import { inventoryReceiptApi } from "@/apis/inventoryReceipt";
import useAsync from "@/apis/useApi";
import ContainerTablePage from "@/components/ContainerTablePage";
import Text from "@/components/Text";
import { EStatus } from "@/enum/EStatus";
import { useSearchQuery } from "@/hooks/useQuery";
import { useTitle } from "@/hooks/useTitle";
import { ResPagination } from "@/models";
import { InventoryReceipt, ReceiptItem } from "@/types/inventoryReceipt";
import { defaultResPage } from "@/utils";
import { PATHNAME } from "@/utils/Pathname";
import { func } from "@/utils/func";
import { DeleteOutlined, EditOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Popconfirm, Row, Space, Tag } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type Props = {};

const NhapHang = ({}: Props) => {
  const { t } = useTranslation();
  useTitle(t("Quản lý nhập hàng"));
  const { params } = useSearchQuery();
  const navigate = useNavigate();

  const { execute, loading, data } = useAsync<ResPagination<InventoryReceipt>>(inventoryReceiptApi.query, {
    onSucess: (_) => {},
    onFailed: (_error) => {},
  });

  const { execute: remove } = useAsync<ResPagination<InventoryReceipt>>(inventoryReceiptApi.remove, {
    onSucess: (_) => {
      execute(params);
    },
    onFailed: (_error) => {},
  });

  const columns = [
    {
      title: "Số hóa đơn",
      dataIndex: "receiptNumber",
      key: "receiptNumber",
      align: "center",
    },
    {
      title: "Ngày nhập",
      dataIndex: "createdAt",
      align: "center",
      width: "20%",
      render: (value: unknown) => {
        if (!value) return "-";
        const date = new Date(value as string);
        date.setHours(date.getHours() + 7);

        return (
          <Text>
            {date.toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </Text>
        );
      },
    },

    {
      title: "Tổng tiền hàng",
      dataIndex: "totalCost",
      key: "totalCost",
      align: "right",
      render: (text: string, _: InventoryReceipt) => (
        <div className="flex items-end justify-end gap-1">
          <div className="text-red-500 text-right">{func.numberWithDots(text) ?? "---"}</div>
        </div>
      ),
    },
    {
      title: "Thương hiệu",
      dataIndex: "supplierName",
      align: "center",
      key: "supplierName",
    },
    {
      title: "Số sản phẩm",
      dataIndex: "items",
      align: "center",
      key: "items",
      render: (items: ReceiptItem[], _: InventoryReceipt) => items.reduce((acc, crr) => (acc += crr.quantity), 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      key: "status",
      render: (status: string) => (
        <Tag color={status === EStatus.ACTIVE ? "green" : "red"}>{status?.toUpperCase()}</Tag>
      ),
    },

    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 150,
      render: (_: any, record: InventoryReceipt) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(PATHNAME.NHAP_HANG.EDIT_ID(record.id as any))}
          >
            Sửa
          </Button>
          <Popconfirm
            title={
              <Space vertical>
                <Text>
                  Bạn có chắc chắn muốn xóa phiếu nhập hàng <b>{record.receiptNumber}</b>.
                </Text>
                <Text>Thao tác không thể khôi phục</Text>
              </Space>
            }
            onConfirm={() => remove(record.id)}
            okText="Xóa"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    params.page && execute(params);
  }, [params]);

  return (
    <div>
      <ContainerTablePage
        data={data || (defaultResPage as any)}
        column={columns as any}
        loading={loading}
        actionCreate={() => navigate(PATHNAME.NHAP_HANG.CREATE)}
        expandedRowRender={expandedRowRender}
        rowExpandable={(record) => record.items && record.items.length > 0}
      />
    </div>
  );
};

export default React.memo(NhapHang);

const expandedRowRender = (record: InventoryReceipt) => {
  return (
    <div style={{ padding: "16px 24px", borderRadius: "8px" }}>
      <Row style={{ padding: "8px 0", borderBottom: "2px solid #eee", color: "#8c8c8c", fontWeight: 500 }}>
        <Col span={10}>Sản phẩm</Col>
        <Col span={4} style={{ textAlign: "center" }}>
          Số lượng
        </Col>
        <Col span={5} style={{ textAlign: "right" }}>
          Đơn giá
        </Col>
        <Col span={5} style={{ textAlign: "right" }}>
          Thành tiền
        </Col>
      </Row>

      {record?.items?.map((item: ReceiptItem, index: number) => {
        const subTotal = Number(item.quantity) * Number(item.importPrice);

        return (
          <Row
            key={index}
            align="middle"
            style={{
              padding: "12px 0",
              borderBottom: "1px dashed #e8e8e8",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f5ff")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {/* Cột sản phẩm */}
            <Col span={10}>
              <Space>
                <Avatar
                  shape="square"
                  size={40}
                  icon={<ShoppingOutlined />}
                  style={{ backgroundColor: "#e6f7ff", color: "#1890ff" }}
                />
                <div>
                  <div style={{ fontWeight: 500 }}>{item.productOption?.name}</div>
                  <Tag color="blue" style={{ fontSize: "10px", lineHeight: "16px" }}>
                    Sản phẩm gốc
                  </Tag>
                </div>
              </Space>
            </Col>

            {/* Cột số lượng */}
            <Col span={4} style={{ textAlign: "center" }}>
              <Text>{item.quantity}</Text>
            </Col>

            {/* Cột đơn giá */}
            <Col span={5} style={{ textAlign: "right" }}>
              <Text>{Number(item.importPrice).toLocaleString()}đ</Text>
            </Col>

            {/* Cột thành tiền */}
            <Col span={5} style={{ textAlign: "right" }}>
              <Text>{subTotal.toLocaleString()}đ</Text>
            </Col>
          </Row>
        );
      })}

      {/* Footer tổng kết */}
      <div
        style={{
          marginTop: 16,
          padding: "12px",
          background: "#fff",
          borderRadius: "4px",
          border: "1px solid #f0f0f0",
        }}
      >
        <Row justify="end" gutter={32}>
          <Col>
            <Text>Tổng mặt hàng:</Text>
            <Text className="text-center">{record?.items?.length}</Text>
          </Col>
          <Col>
            <Text>Tổng giá trị phiếu:</Text>
            <Text className="font-bold text-right text-xl text-red-500">
              {Number(record.totalCost).toLocaleString()}đ
            </Text>
          </Col>
        </Row>
      </div>
    </div>
  );
};
