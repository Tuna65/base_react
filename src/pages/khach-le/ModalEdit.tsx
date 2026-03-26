import { customerApi } from "@/apis/customer";
import useAsync from "@/apis/useApi";
import { Customer } from "@/types/customer";
import { Form, Input, Modal, message } from "antd";
import React, { useEffect } from "react";

type Props = {
  customer: Customer | undefined;
  onCancel: () => void;
  onSuccess: () => void;
};

const ModalEdit = ({ customer, onCancel, onSuccess }: Props) => {
  const [form] = Form.useForm();

  const { execute, loading } = useAsync<Customer>(customerApi.update, {
    onSucess: () => {
      message.success("Cập nhật khách lẻ thành công!");
      onSuccess();
    },
    onFailed: (error: any) => {
      message.error(error?.message || "Lỗi: Không thể cập nhật.");
    },
  });

  useEffect(() => {
    if (customer) {
      form.setFieldsValue(customer);
    }
  }, [customer, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      execute({ ...values, id: customer?.id });
    });
  };

  return (
    <Modal
      title="Chỉnh sửa khách lẻ"
      open={!!customer}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Lưu"
      cancelText="Hủy"
      width={520}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" name="form_edit_customer">
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

export default React.memo(ModalEdit);
