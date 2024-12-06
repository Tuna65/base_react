import { IconOrder } from "@/assets/Icon";
import Text from "@/components/Text";
import { Option } from "@/models";
import { func } from "@/utils/func";
import { Col, Flex, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {};

const CReport = (props: Props) => {
  const { t } = useTranslation();

  const list = [
    { label: "Doanh số", value: 1000, icon: <IconOrder /> },
    { label: "Đơn hàng", value: 1000, icon: <IconOrder /> },
  ];
  return (
    <Row gutter={[24, 24]}>
      {list.map((l, idx) => (
        <Col span={6} key={`report-${idx}`}>
          <Flex className="rounded-lg !bg-white shadow-box p-4">
            <Flex vertical gap={10}>
              <Text type="BODY">{t(l.label)}</Text>
              <Text type="TITLE3">{func.numberWithDots(l.value, "")}</Text>
            </Flex>
            {/* <Flex>{l.icon}</Flex> */}
          </Flex>
        </Col>
      ))}
    </Row>
  );
};

export default React.memo(CReport);
