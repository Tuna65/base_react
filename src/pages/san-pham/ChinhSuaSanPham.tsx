import { productApi } from "@/apis/product";
import useAsync from "@/apis/useApi";
import useGetCategory from "@/hooks/modules/useGetCategory";
import { Product } from "@/types/product";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
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
  Spin,
  Typography,
} from "antd";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const { Title } = Typography;

const ChinhSuaSanPham = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const { cateOptions } = useGetCategory({});

  const { execute: update, loading: updating } = useAsync<Product>(productApi.edit, {
    onSucess: () => {
      message.success("Cập nhật sản phẩm thành công!");
      navigate(-1);
    },
  });

  const {
    execute: getDetail,
    loading: fetching,
    data,
  } = useAsync<Product>(productApi.detail, {
    onSucess: (data) => {
      form.setFieldsValue({
        name: data.name,
        categoryId: data.categoryId,
        options: data.options,
      });
    },
  });

  useEffect(() => {
    if (id) getDetail(id);
  }, [id]);

  const onFinish = async (values: any) => {
    try {
      const payload: Partial<Product> = {
        id: id as any,
        name: values.name,
        categoryId: values.categoryId,
        shopId: data?.shopId,
        options: values.options.map((opt: any) => ({
          id: opt.id,
          name: opt.name,
          price: opt.price,
          costPrice: opt.costPrice,
          stock: opt.stock,
        })),
      };

      update(payload);
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  if (fetching) return <Spin tip="Đang tải dữ liệu..." style={{ width: "100%", marginTop: 50 }} />;

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card>
          <Title level={3}>Chỉnh Sửa Sản Phẩm</Title>
          <Divider />

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
              >
                <Input placeholder="Tên sản phẩm..." size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Danh mục" name="categoryId">
                <Select options={cateOptions} placeholder="Chọn danh mục" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Danh sách biến thể (Options)</Divider>

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
                          Xóa
                        </Button>
                      )
                    }
                  >
                    <Row gutter={16}>
                      <Form.Item {...restField} name={[name, "id"]} hidden>
                        <Input />
                      </Form.Item>

                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          label="Tên biến thể"
                          name={[name, "name"]}
                          rules={[{ required: true, message: "Bắt buộc" }]}
                        >
                          <Input placeholder="Size/Màu..." />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          label="Giá bán (đ)"
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
                        <Form.Item {...restField} label="Số lượng tồn" name={[name, "stock"]}>
                          <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm biến thể mới
                </Button>
              </>
            )}
          </Form.List>

          <Divider />

          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={() => navigate(-1)}>Hủy bỏ</Button>
            <Button type="primary" size="large" icon={<SaveOutlined />} htmlType="submit" loading={updating}>
              Cập nhật Sản Phẩm
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
};

export default React.memo(ChinhSuaSanPham);
