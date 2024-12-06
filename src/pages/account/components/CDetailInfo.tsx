import Text from "@/components/Text";
import { IUser } from "@/models/user";
import { func } from "@/utils/func";
import { Avatar, Col, Flex, Row, Switch } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

interface ICDetailInfoProps {
  detailData: IUser;
}

const CDetailInfo = (props: ICDetailInfoProps) => {
  const { t } = useTranslation();
  const { detailData } = props;
  return (
    <Flex vertical gap={24} className="bg-white shadow-box p-4 rounded-md">
      <Text type="TITLE3">{t("Thông tin chung")}</Text>
      <Flex align="center" gap={12}>
        <Avatar size="large" src={func.avatar(detailData?.name, detailData?.image)} />
        <Flex vertical gap={4}>
          <Text type="HEADLINE">{detailData?.name}</Text>
          <Flex align="center" gap={4}>
            <Text type="CAPTION4">{t("Vai trò")}:</Text>
            <Text type="CAPTION1" className="text-primary">
              {detailData?.isOwner ? t("Chủ cửa hàng") : detailData?.role?.name ?? "---"}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Flex align="center" gap={10}>
            <Text type="BODY">{t("Email")}:</Text>
            <Text type="HEADLINE">{detailData?.email ?? "---"}</Text>
          </Flex>
        </Col>
        <Col span={12}>
          <Flex align="center" gap={10}>
            <Text type="BODY">{t("Số điện thoại")}:</Text>
            <Text type="HEADLINE">{detailData?.phone ?? "---"}</Text>
          </Flex>
        </Col>
        <Col span={12}>
          <Flex align="center" gap={10}>
            <Text type="BODY">{t("Giới tính")}:</Text>
            <Text type="HEADLINE">{detailData?.gender ?? "---"}</Text>
          </Flex>
        </Col>
        <Col span={12}>
          <Flex align="center" gap={10}>
            <Text type="BODY">{t("Địa chỉ")}:</Text>
            <Text type="HEADLINE">{detailData?.address ?? "---"}</Text>
          </Flex>
        </Col>
      </Row>
      <Flex align="center" gap={10}>
        <Text type="BODY">{t("Trạng thái")}:</Text>
        <Switch value={detailData?.status as boolean} />
      </Flex>
    </Flex>
  );
};

export default React.memo(CDetailInfo);
