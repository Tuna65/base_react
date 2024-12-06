import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Text from "./Text";

type Props = {
  type: "ACTIVE" | "INACTIVE" | "PAID" | "UNPAID" | "IN_PROGRESS" | "COMPLETED";
};

const Status = (props: Props) => {
  const { t } = useTranslation();
  const { type } = props;
  const statusStyle = useMemo(() => {
    switch (type) {
      case "ACTIVE": {
        return {
          text: t("Active"),
          border: "bg-green-100",
          textColor: "text-green-500",
        };
      }
      case "COMPLETED": {
        return {
          text: t("Hoàn thành"),
          border: "bg-green-100",
          textColor: "text-green-500",
        };
      }
      case "INACTIVE": {
        return {
          text: t("Inactive"),
          border: " bg-gray-100",
          textColor: "text-gary-500",
        };
      }

      case "PAID": {
        return {
          text: t("Paid"),
          border: "bg-green-100",
          textColor: "text-green-500",
        };
      }
      case "UNPAID": {
        return {
          text: t("UnPaid"),
          border: " bg-gray-100",
          textColor: "text-gary-500",
        };
      }
      case "IN_PROGRESS": {
        return {
          text: t("In Progress"),
          border: " bg-orange bg-opacity-10",
          textColor: "text-orange",
        };
      }
    }
  }, [type]);
  return (
    <div>
      <div className={`px-3 py-2  rounded-lg inline-block ${statusStyle?.border}`}>
        <Text className={`${statusStyle?.textColor}`} type="CAPTION2">
          {statusStyle?.text}
        </Text>
        {/* <p className={`font-medium text-md ${statusStyle?.textColor}`}>{statusStyle?.text}</p> */}
      </div>
    </div>
  );
};

export default React.memo(Status);
