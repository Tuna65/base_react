import Container from "@/components/Container";
import Status from "@/components/Status";
import Text from "@/components/Text";
import { IShop } from "@/models/shop";
import { Col, Flex, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

interface ICShopInfoProps {
  shop: IShop;
  isLoading?: boolean;
}

const CShopInfo = (props: ICShopInfoProps) => {
  const { shop, isLoading } = props;
  const { t } = useTranslation();
  return (
    <Container type="SPIN" isLoading={isLoading}>
      <Flex className="p-4 bg-white rounded-lg shadow-box" vertical gap={12}>
        <Text type="TITLE3">{t("Gói sửa dụng")}</Text>

        <Row gutter={[12, 12]} align="middle">
          <Col span={12}>
            <Flex align="center" gap={8}>
              <Text type="BODY" className="">
                {t("Tên cửa hàng")}:
              </Text>
              <Text type="HEADLINE">{shop?.name}</Text>
            </Flex>
          </Col>
          <Col span={12}>
            <Flex align="center" gap={8}>
              <Text type="BODY" className="">
                {t("Trạng thái")}:
              </Text>
              <Status type={shop?.status as any} />
            </Flex>
          </Col>
          <Col span={12}>
            <Flex align="center" gap={8}>
              <Text type="BODY" className="">
                {t("Số điện thoại")}:
              </Text>
              <Text type="HEADLINE">{shop?.phone ?? "---"}</Text>
            </Flex>
          </Col>
          <Col span={12}>
            <Flex align="center" gap={8}>
              <Text type="BODY" className="">
                {t("Địa chỉ")}:
              </Text>
              <Text type="HEADLINE">{`${shop?.address ?? "---"}, ${shop?.ward ?? "---"}, ${shop?.district ?? "---"}, ${
                shop?.city ?? "---"
              }`}</Text>
            </Flex>
          </Col>
        </Row>
      </Flex>
    </Container>
  );
};

export default React.memo(CShopInfo);
