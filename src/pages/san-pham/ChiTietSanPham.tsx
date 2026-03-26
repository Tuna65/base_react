import { productApi } from "@/apis/product";
import useAsync from "@/apis/useApi";
import useGetCategory from "@/hooks/modules/useGetCategory";
import { Product } from "@/types/product";
import { func } from "@/utils/func";
import { PATHNAME } from "@/utils/Pathname";
import { ArrowLeftOutlined, EditOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Col, Descriptions, Divider, Flex, Row, Space, Spin, Tag, Typography } from "antd";
import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

const { Title, Text } = Typography;

const ChiTietSanPham = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cateOptions } = useGetCategory({});

  const {
    execute: getDetail,
    loading: fetching,
    data,
  } = useAsync<Product>(productApi.detail, {
    onSucess: (data) => {
      console.log("Dữ liệu sản phẩm:", data);
    },
  });

  useEffect(() => {
    if (id) getDetail(id);
  }, [id]);

  // Tìm tên danh mục từ cateOptions
  const categoryName = useMemo(() => {
    return cateOptions?.find((c) => c.value === data?.categoryId)?.label || "Chưa phân loại";
  }, [cateOptions, data]);

  if (fetching) {
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        <Spin size="large" tip="Đang tải chi tiết sản phẩm..." />
      </div>
    );
  }

  if (!data) return <div>Không tìm thấy dữ liệu sản phẩm.</div>;

  return (
    <div style={{ margin: "0 auto" }}>
      {/* Header điều hướng */}
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại danh sách
        </Button>
        <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(PATHNAME.SAN_PHAM.EDIT_ID(id))}>
          Chỉnh sửa sản phẩm
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Cột trái: Thông tin chung */}
        <Col span={24} lg={8}>
          <Card bordered={false} className="shadow-sm">
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: "#e6f7ff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <ShoppingOutlined style={{ fontSize: 40, color: "#1890ff" }} />
              </div>
              <Title level={4}>{data.name}</Title>
              <Tag color="blue">{categoryName}</Tag>
            </div>

            <Divider />

            <Descriptions column={1} size="small">
              <Descriptions.Item label="Mã sản phẩm">#{data.id}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">{new Date().toLocaleDateString("vi-VN")}</Descriptions.Item>
              <Descriptions.Item label="Tổng số biến thể">{data.options?.length || 0}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Cột phải: Danh sách biến thể */}
        <Col span={24} lg={16}>
          <Card title="Cấu hình các biến thể (Variants)" bordered={false} className="shadow-sm">
            <Row gutter={[16, 16]}>
              {data.options?.map((opt) => (
                <Col span={24} key={opt.id}>
                  <Row className="">
                    <Col span={16}>
                      <Space vertical size={0}>
                        <Text strong style={{ fontSize: 16 }}>
                          {opt.name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          ID: {opt.id}
                        </Text>
                      </Space>
                    </Col>

                    <Col span={8}>
                      <Row className="text-right">
                        <Col span={8}>
                          <Flex vertical>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Giá bán
                            </Text>
                            <Text strong style={{ color: "#52c41a" }}>
                              {func.numberWithDots(opt.price?.toLocaleString())} đ
                            </Text>
                          </Flex>
                        </Col>
                        <Col span={8}>
                          <Flex vertical>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Giá vốn
                            </Text>
                            <Text>{func.numberWithDots(opt.costPrice?.toLocaleString())} đ</Text>
                          </Flex>
                        </Col>
                        <Col span={8}>
                          <Flex vertical justify="center">
                            <Text type="secondary" style={{ fontSize: 12 }} className="text-center">
                              Tồn kho
                            </Text>
                            <div className="flex justify-center">
                              <Badge
                                count={opt.stock}
                                showZero
                                color={opt.stock > 0 ? "#1890ff" : "#f5222d"}
                                overflowCount={9999}
                              />
                            </div>
                          </Flex>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default React.memo(ChiTietSanPham);
