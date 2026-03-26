import { productApi } from "@/apis/product";
import useAsync from "@/apis/useApi";
import useGetCategory from "@/hooks/modules/useGetCategory";
import { Product } from "@/types/product";
import { DeleteOutlined, InfoCircleOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ThemMoiSanPham = () => {
  const [form] = Form.useForm();
  const { cateOptions } = useGetCategory({});
  const navigate = useNavigate();

  const { execute, loading } = useAsync<Product>(productApi.create, {
    onSucess: (_) => {
      message.success("Thêm sản phẩm thành công!");
      form.resetFields();
      navigate(-1);
    },
    onFailed: (_error) => {},
  });

  const onFinish = async (values: any) => {
    try {
      const payload: Partial<Product> = {
        name: values.name,
        categoryId: values.categoryId,
        options: values.options.map((opt: any) => ({
          name: opt.name,
          price: opt.price,
          costPrice: opt.costPrice,
          stock: opt.stock,
        })),
      };

      execute(payload);

      form.resetFields();
      
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
    }
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ options: [{ name: "Mặc định", price: 0, costPrice: 0, stock: 0 }] }}
      >
        <Card>
          <Title level={3}>Thêm Sản Phẩm Mới</Title>
          <Divider />

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
              >
                <Input placeholder="Ví dụ: Áo thun Cotton 4 chiều" size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Danh mục" name="categoryId">
                <Select options={cateOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Danh sách biến thể (Options)</Divider>
          <Text type="secondary" style={{ marginBottom: 16, display: "block" }}>
            Mỗi sản phẩm cần ít nhất một biến thể (Ví dụ: Size M, Màu Đỏ hoặc đơn giản là "Mặc định").
          </Text>

          <Form.List name="options">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    type="inner"
                    key={key}
                    style={{ marginBottom: 16, background: "#fafafa" }}
                    extra={
                      fields.length > 1 && (
                        <Button type="text" danger onClick={() => remove(name)} icon={<DeleteOutlined />}>
                          Xóa biến thể
                        </Button>
                      )
                    }
                  >
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          label="Tên biến thể"
                          name={[name, "name"]}
                          rules={[{ required: true, message: "VD: Size M / Màu Đỏ" }]}
                        >
                          <Input placeholder="Size/Màu..." />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          label={
                            <span>
                              Giá bán (đ)&nbsp;
                              <Tooltip title="Giá hiển thị cho khách hàng">
                                <InfoCircleOutlined />
                              </Tooltip>
                            </span>
                          }
                          name={[name, "price"]}
                          rules={[{ required: true, message: "Bắt buộc" }]}
                        >
                          <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item {...restField} label="Giá vốn (đ)" name={[name, "costPrice"]}>
                          <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item {...restField} label="Tồn kho ban đầu" name={[name, "stock"]}>
                          <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}

                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ marginBottom: 24 }}>
                  Thêm biến thể mới
                </Button>
              </>
            )}
          </Form.List>

          <Divider />

          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button size="large">Hủy bỏ</Button>
            <Button type="primary" size="large" icon={<SaveOutlined />} htmlType="submit" loading={loading}>
              Lưu Sản Phẩm
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
};

export default React.memo(ThemMoiSanPham);
