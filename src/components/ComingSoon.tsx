import { Flex, Result } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import Text from "./Text";

const ComingSoon = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Result
        status="404"
        title={
          <Flex vertical gap={10}>
            <Text type="TITLE3" className="mt-4">{t("Coming Soon!")}</Text>
          </Flex>
        }
      />
    </div>
  );
};

export default React.memo(ComingSoon);
