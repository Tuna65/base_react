import { categoryApi } from "@/apis/category";
import useAsync from "@/apis/useApi";
import { Category } from "@/models/category";
import { FolderAddOutlined, LinkOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Space } from "antd";
import React from "react";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const ThemMoiPhanLoai = ({ open, onCancel, onSuccess }: Props) => {
  const [form] = Form.useForm();

  const { execute, loading } = useAsync<Category>(categoryApi.create, {
    onSucess: (_) => {
      message.success("Thêm danh mục mới thành công!");
      form.resetFields();
      onSuccess();
      onCancel();
    },
    onFailed: (_error) => {},
  });

  const convertToSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/([^0-9a-z-\s])/g, "")
      .replace(/(\s+)/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameValue = e.target.value;
    form.setFieldsValue({ slug: convertToSlug(nameValue) });
  };

  const onFinish = async (values: any) => {
    try {
      execute(values);
    } catch (error) {
      message.error("Lỗi khi thêm danh mục");
    } finally {
    }
  };

  return (
    <Modal
      title={
        <Space>
          <FolderAddOutlined className="text-blue-500" />
          <span>Thêm Mới Danh Mục</span>
        </Space>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ description: "" }} className="mt-4">
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
        >
          <Input
            prefix={<FolderAddOutlined className="text-gray-400" />}
            placeholder="Ví dụ: Cần câu tay, Mồi giả..."
            onChange={handleNameChange}
          />
        </Form.Item>

        <Form.Item
          label="Đường dẫn (Slug)"
          name="slug"
          rules={[{ required: true, message: "Slug không được để trống!" }]}
          extra="Đường dẫn này sẽ hiển thị trên thanh địa chỉ (SEO)"
        >
          <Input disabled prefix={<LinkOutlined className="text-gray-400" />} placeholder="can-cau-tay" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} placeholder="Nhập mô tả ngắn về danh mục này..." />
        </Form.Item>

        <Form.Item className="mb-0 text-right">
          <Space>
            <Button onClick={onCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Xác nhận thêm
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(ThemMoiPhanLoai);
