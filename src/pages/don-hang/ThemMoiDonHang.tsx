import { orderApi } from "@/apis/order";
import { productApi } from "@/apis/product";
import useAsync from "@/apis/useApi";
import { useTitle } from "@/hooks/useTitle";
import { ResPagination } from "@/models";
import { Product } from "@/types/product";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Flex, Form, Input, InputNumber, message, Row, Select, Typography } from "antd";
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ThemMoiDonHang = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  useTitle("Tạo mới đơn hàng");

  const { data: products, execute: product } = useAsync<ResPagination<Product>>(productApi.query, {
    onSucess: () => {},
  });
  const { execute } = useAsync(orderApi.create, {
    onSucess: () => {
      message.success("Tạo đơn hàng thành công!");
      navigate("/orders");
    },
  });

  useEffect(() => {
    product({ page: 1, limit: 20 });
  }, []);

  const productOptions = useMemo(() => {
    return (
      products?.items?.flatMap((p: any) =>
        p.options?.map((opt: any) => ({
          label: (
            <Flex justify="space-between">
              <Flex vertical>
                <Text>{p.name}</Text>
                <Text className="text-gray-400 text-xs">@{opt.name}</Text>
              </Flex>
              <Text>Kho: {opt.stock}</Text>
            </Flex>
          ),
          value: opt.id,
          price: opt.price,
          stock: opt.stock,
        })),
      ) || []
    );
  }, [products]);

  const handleProductChange = (optionId: number, fieldName: number) => {
    const selected = productOptions.find((o) => o.value === optionId);
    if (selected) {
      const items = form.getFieldValue("items");
      items[fieldName].price = selected.price;
      form.setFieldsValue({ items });
    }
  };

  const items = Form.useWatch("items", form);
  const totalAmount = useMemo(() => {
    return (
      items?.reduce((sum: number, item: any) => {
        return sum + Number(item?.price || 0) * Number(item?.quantity || 0);
      }, 0) || 0
    );
  }, [items]);

  const onFinish = async (values: any) => {
    try {
      execute(values);
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo đơn");
    }
  };

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ items: [{}] }}>
        <Row gutter={24}>
          <Col span={16}>
            <Card title="Danh sách sản phẩm" bordered={false}>
              <Form.List name="items">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key}>
                        <Row gutter={12} align="bottom">
                          <Col span={10}>
                            <Form.Item
                              {...restField}
                              name={[name, "productOptionId"]}
                              label={name === 0 ? "Sản phẩm & Biến thể" : ""}
                              rules={[{ required: true, message: "Chọn sản phẩm" }]}
                            >
                              <Select
                                showSearch
                                placeholder="Tìm sản phẩm..."
                                options={productOptions}
                                optionFilterProp="label"
                                onChange={(val) => handleProductChange(val, name)}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={5}>
                            <Form.Item {...restField} name={[name, "price"]} label={name === 0 ? "Đơn giá" : ""}>
                              <InputNumber
                                style={{ width: "100%" }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                disabled
                              />
                            </Form.Item>
                          </Col>
                          <Col span={5}>
                            <Form.Item
                              {...restField}
                              name={[name, "quantity"]}
                              label={name === 0 ? "Số lượng" : ""}
                              rules={[{ required: true, message: "Nhập số lượng" }]}
                            >
                              <InputNumber min={1} style={{ width: "100%" }} />
                            </Form.Item>
                          </Col>
                          <Col span={2}>
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => remove(name)}
                              style={{ marginBottom: name === 0 ? 0 : 24 }}
                              disabled={fields.length === 1}
                            />
                          </Col>
                        </Row>
                        {fields.length > 1 && <Divider style={{ margin: "12px 0" }} />}
                      </div>
                    ))}
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Thêm sản phẩm
                    </Button>
                  </>
                )}
              </Form.List>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Thông tin đơn hàng" bordered={false}>
              <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true }]}>
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>
              <Form.Item name="customerPhone" label="Số điện thoại" rules={[{ required: true }]}>
                <Input placeholder="090..." />
              </Form.Item>
              <Form.Item name="shippingAddress" label="Địa chỉ giao hàng">
                <Input.TextArea rows={2} />
              </Form.Item>

              <Divider />

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <Text>Tổng tiền tạm tính:</Text>
                <Text strong style={{ fontSize: 20, color: "#f5222d" }}>
                  {totalAmount.toLocaleString()}đ
                </Text>
              </div>

              <Button type="primary" size="large" block htmlType="submit">
                Xác nhận tạo đơn
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default React.memo(ThemMoiDonHang);
