import Text from "@/components/Text";
import { Col, Flex, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IPackage } from "@/models/package";
import { func } from "@/utils/func";
import { TIME_DISPLAYS } from "@/configs/date-format";
import Container from "@/components/Container";

interface IPackageInfoProps {
  packageId: string;
}

const PackageInfo = (props: IPackageInfoProps) => {
  const { packageId } = props;
  const { t } = useTranslation();
  const [detailData, setDetailData] = useState<IPackage>();

  useEffect(() => {}, [packageId]);

  return (
    <Container type="SPIN" isLoading={false}>
      <Flex className="p-4 bg-white rounded-lg shadow-box" vertical gap={12}>
        <Text type="TITLE3">{t("Gói sửa dụng")}</Text>
        <Row gutter={[6, 6]}>
          <Col span={12}>
            <Flex align="center" gap={8}>
              <Text type="BODY" className="">
                {t("Tên gói")}:
              </Text>
              <Text type="HEADLINE">{detailData?.name}</Text>
            </Flex>
          </Col>
          <Col span={12}>
            <Flex align="center" gap={8}>
              <Text type="BODY" className="">
                {t("Ngày hết hạn")}:
              </Text>
              <Text type="HEADLINE">{func.formatDate(detailData?.createdAt, TIME_DISPLAYS.DATE_ONLY)}</Text>
            </Flex>
          </Col>
          <Col span={12}>
            <Flex align="center" gap={8}>
              <Text type="BODY" className="">
                {t("Chi nhánh tối đa")}:
              </Text>
              <Text type="HEADLINE">{detailData?.totalLocation}</Text>
            </Flex>
          </Col>
          <Col span={12}>
            <Flex align="center" gap={8}>
              <Text type="BODY" className="">
                {t("Tài khoản tối đa")}:
              </Text>
              <Text type="HEADLINE">{detailData?.totalUser}</Text>
            </Flex>
          </Col>
        </Row>
      </Flex>
    </Container>
  );
};

export default React.memo(PackageInfo);
