import Text from "@/components/Text";
import { Col, Flex, Form, Input, Row, Select } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

const CFormAddress = () => {
  const { t } = useTranslation();
  return (
    <Flex vertical gap={8}>
      <Text type="TITLE3">{t("Địa chỉ")}</Text>
      <Row gutter={[12, 0]}>
        <Col span={8}>
          <Form.Item label={t("Tỉnh/ Thành phố")} name="city">
            <Select placeholder={t("Chọn tỉnh/ thành phố")} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t("Quận/ Huyện")} name="district">
            <Select placeholder={t("Chọn quận/ huyện")} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t("Phường/ Xã")} name="ward">
            <Select placeholder={t("Chọn phường/ xã")} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label={t("Địa chỉ")} name="address">
            <Input placeholder={t("Chọn phường/ xã")} />
          </Form.Item>
        </Col>
      </Row>
    </Flex>
  );
};

export default React.memo(CFormAddress);
