import useAsync from "@/apis/useApi";
import { userApi } from "@/apis/user";
import { User } from "@/models/user";
import { Form, Input, Modal, message } from "antd";
import React from "react";

type Props = {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
};

const ModalCreate = ({ open, onCancel, onSuccess }: Props) => {
  const [form] = Form.useForm();

  const { execute, loading } = useAsync<User>(userApi.create, {
    onSucess: () => {
      message.success("Tạo khách hàng thành công!");
      form.resetFields();
      onSuccess();
    },
    onFailed: (error: any) => {
      message.error(error?.message || "Lỗi: Không thể tạo.");
    },
  });

  const handleOk = () => {
    form.validateFields().then((values) => {
      execute(values);
    });
  };

  return (
    <Modal
      title="Thêm mới khách hàng"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Tạo mới"
      cancelText="Hủy"
      width={600}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" name="form_create_user">
        <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}>
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          name="username"
          label="Tên đăng nhập"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input placeholder="vanna123" />
        </Form.Item>

        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
          <Input.Password placeholder="******" />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" },
          ]}
        >
          <Input placeholder="0901234567" />
        </Form.Item>

        <Form.Item name="address" label="Địa chỉ">
          <Input.TextArea rows={2} placeholder="Số 1, đường ABC..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(ModalCreate);
