import { customerApi } from "@/apis/customer";
import useAsync from "@/apis/useApi";
import { Customer } from "@/types/customer";
import { Form, Input, Modal, message } from "antd";
import React from "react";

type Props = {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
};

const ModalCreate = ({ open, onCancel, onSuccess }: Props) => {
  const [form] = Form.useForm();

  const { execute, loading } = useAsync<Customer>(customerApi.create, {
    onSucess: () => {
      message.success("Tạo khách lẻ thành công!");
      form.resetFields();
      onSuccess();
    },
    onFailed: (error: any) => {
      message.error(error?.message || "Lỗi: Không thể tạo khách lẻ.");
    },
  });

  const handleOk = () => {
    form.validateFields().then((values) => {
      execute(values);
    });
  };

  return (
    <Modal
      title="Thêm mới khách lẻ"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Tạo mới"
      cancelText="Hủy"
      width={520}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" name="form_create_customer">
        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" },
          ]}
        >
          <Input placeholder="0901234567" />
        </Form.Item>

        <Form.Item name="address" label="Địa chỉ">
          <Input.TextArea rows={2} placeholder="123 Nguyễn Huệ, TP.HCM" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(ModalCreate);
