import { productApi } from "@/apis/product";
import useAsync from "@/apis/useApi";
import ContainerTablePage from "@/components/ContainerTablePage";
import { useSearchQuery } from "@/hooks/useQuery";
import { useTitle } from "@/hooks/useTitle";
import { ResPagination } from "@/models";
import { Category } from "@/models/category";
import { Product, ProductOption } from "@/types/product";
import { defaultResPage } from "@/utils";
import { func } from "@/utils/func";
import { PATHNAME } from "@/utils/Pathname";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Col, Popconfirm, Row, Space, TableProps, Tag, Typography } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

type Props = {};

const SanPham = ({}: Props) => {
  const { t } = useTranslation();
  useTitle(t("Quản lý sản phẩm"));
  const { params } = useSearchQuery();
  const navigate = useNavigate();

  const { execute, loading, data } = useAsync<ResPagination<Product>>(productApi.query, {
    onSucess: (_) => {},
  });

  const { execute: deleted } = useAsync<ResPagination<Product>>(productApi.deleted, {
    onSucess: (_) => {
      execute(params);
    },
  });

  const columns: TableProps<Product>["columns"] = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Product) => (
        <Text
          className="cursor-pointer hover:underline"
          onClick={() => navigate(PATHNAME.SAN_PHAM.DETAIL_ID(record?.id as any))}
        >
          {text || "---"}
        </Text>
      ),
    },
    {
      title: "Phân loại",
      dataIndex: "category",
      key: "category",
      render: (category: Category) => <Text className="">{category.name || "---"}</Text>,
    },

    {
      title: "Số biến thể",
      dataIndex: "options",
      key: "options",
      align: "center",
      render: (text: ProductOption[]) => <Text className="">{text?.length || "---"}</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => {
        const color = status === "ACTIVE" ? "green" : "volcano";
        return (
          <Tag color={color} className="rounded-full px-3">
            {status?.toUpperCase() || "N/A"}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (value: string) => {
        if (!value) return "-";
        const date = new Date(value);
        return (
          <Text>
            {date.toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 150,
      render: (_: any, record: Product) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined className="text-blue-500" />}
            onClick={() => navigate(PATHNAME.SAN_PHAM.EDIT_ID(record.id as any))}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa phiếu nhập?"
            description="Hành động này có thể ảnh hưởng đến tồn kho hiện tại."
            onConfirm={() => deleted(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
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
        actionCreate={() => navigate(PATHNAME.SAN_PHAM.CREATE)}
        expandedRowRender={expandedRowRender}
        rowExpandable={(record) => record.options && record.options.length > 0}
      />
    </div>
  );
};
export default React.memo(SanPham);

const expandedRowRender = (record: any) => {
  return (
    <div style={{ padding: "6px", background: "#f8f9fa", borderRadius: "8px" }}>
      <Row gutter={[10, 10]}>
        {record.options?.map((opt: any) => (
          <Col xs={24} sm={12} md={8} lg={6} key={opt.id}>
            <Card
              hoverable
              size="small"
              className="variant-card"
              style={{ borderRadius: 8, border: "1px solid #e8e8e8" }}
              bodyStyle={{ padding: "12px" }}
            >
              {/* Tên biến thể & Trạng thái kho */}
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}
              >
                <Text strong style={{ fontSize: 15, color: "#262626" }}>
                  {opt.name}
                </Text>
                <Badge
                  status={opt.stock > 10 ? "success" : opt.stock > 0 ? "warning" : "error"}
                  text={
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Tồn: {opt.stock}
                    </Text>
                  }
                />
              </div>

              {/* Thông số giá */}
              <div style={{ background: "#ffffff", padding: "8px", borderRadius: 6, border: "1px dashed #d9d9d9" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Giá bán:
                  </Text>
                  <Text strong style={{ color: "#52c41a" }}>
                    {func.numberWithDots(opt.price?.toLocaleString())}đ
                  </Text>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Giá vốn:
                  </Text>
                  <Text style={{ fontSize: 12 }}>{func.numberWithDots(opt.costPrice?.toLocaleString())}đ</Text>
                </div>
              </div>

              {/* Thanh hiển thị phần trăm kho (Optional) */}
              <div style={{ marginTop: 10, height: 4, background: "#f0f0f0", borderRadius: 2, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${Math.min((opt.stock / 100) * 100, 100)}%`,
                    height: "100%",
                    background: opt.stock > 0 ? "#1890ff" : "#ff4d4f",
                  }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
