import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Form, Input, Row } from "antd";

type Props = { isEdit?: boolean };

const FormData = ({ isEdit }: Props) => {
  return (
    <div>
      <div className="">
        <Row gutter={16}>
          {/* Họ và tên */}
          <Col span={12}>
            <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: "Nhập đầy đủ họ tên" }]}>
              <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
            </Form.Item>
          </Col>

          {/* Tên đăng nhập */}
          <Col span={12}>
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[{ required: true, message: "Nhập tên đăng nhập" }]}
            >
              <Input disabled={isEdit} prefix={<UserOutlined />} placeholder="van_a_99" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, min: 6, message: "Mật khẩu tối thiểu 6 ký tự" }]}
            >
              <Input.Password disabled={isEdit} prefix={<LockOutlined />} placeholder="••••••" />
            </Form.Item>
          </Col>
          {/* Email */}
          <Col span={12}>
            <Form.Item
              name="email"
              label="Địa chỉ Email"
              rules={[
                { required: true, message: "Nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input disabled={isEdit} prefix={<MailOutlined />} placeholder="a.nguyen@company.com" />
            </Form.Item>
          </Col>
        </Row>

        {/* <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="status" label="Trạng thái tài khoản">
              <Select>
                <Select.Option value={EStatus.ACTIVE}>Đang hoạt động</Select.Option>
                <Select.Option value={EStatus.INACTIVE}>Tạm khóa</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row> */}
      </div>
    </div>
  );
};

export default FormData;
