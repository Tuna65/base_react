import { staffApi } from "@/apis/staff";
import useAsync from "@/apis/useApi";
import { EStatus } from "@/enum/EStatus";
import { Staff } from "@/types/staff";
import { UserOutlined } from "@ant-design/icons";
import { Form, message, Modal, Space } from "antd";
import React, { useEffect } from "react";
import FormData from "./FormData";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  initValue?: Partial<Staff>;
}

const ModalEdit = ({ open, onCancel, onSuccess, initValue }: Props) => {
  const [form] = Form.useForm();

  const { execute, loading } = useAsync<Staff>(staffApi.update, {
    onSucess: () => {
      message.success("Cập nhật thông tin nhân viên thành công!");
      form.resetFields();
      onSuccess();
      onCancel();
    },
    onFailed: (error: any) => {
      message.error(error?.message || "Lỗi: Không thể tạo nhân viên.");
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      execute({ ...values, id: initValue?.id });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  useEffect(() => {
    initValue && form.setFieldsValue(initValue);
  }, [initValue]);

  return (
    <Modal
      title={
        <Space>
          <UserOutlined className="text-blue-500" />
          <span>Thêm Nhân Viên Mới</span>
        </Space>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Xác nhận"
      cancelText="Hủy bỏ"
      width={650}
      centered
      destroyOnHidden
    >
      <Form form={form} layout="vertical" initialValues={{ status: EStatus.ACTIVE }} className="mt-6">
        <FormData isEdit={!!initValue} />
      </Form>
    </Modal>
  );
};

export default React.memo(ModalEdit);
