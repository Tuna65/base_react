import Text from "@/components/Text";
import useGlobalService from "@/utils/useGlobalService";
import { Col, Flex, Form, Input, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

const CFormInfo = () => {
  const { rulesForm } = useGlobalService();
  const { t } = useTranslation();
  return (
    <Flex vertical gap={8}>
      <Text type="TITLE3">{t("Thông tin chung")}</Text>
      <Row gutter={[12, 0]}>
        <Col span={8}>
          <Form.Item label={t("Tên nhân viên")} name="name" rules={rulesForm.name}>
            <Input placeholder={t("Nhập tên nhân viên")} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t("Tên đăng nhập")} name="username" rules={rulesForm.username}>
            <Input placeholder={t("Nhập username nhân viên")} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t("Mật khẩu")} name="password" rules={rulesForm.password}>
            <Input placeholder={t("Nhập mật khẩu")} type="password" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t("Email")} name="email" rules={rulesForm.email}>
            <Input placeholder={t("Nhập email")} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t("Số điện thoại")} name="phone">
            <Input placeholder={t("Nhập số điện thoại")} />
          </Form.Item>
        </Col>
      </Row>
    </Flex>
  );
};

export default React.memo(CFormInfo);
