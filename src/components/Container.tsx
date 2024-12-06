import { Skeleton, Spin } from "antd";
import React, { ReactNode, useMemo } from "react";
import { TableLoading } from "./BoxTable";
import Text from "./Text";

interface IContainerProps {
  isLoading?: boolean;
  type?: "INPUT" | "CIRCLE" | "TABLE" | "IMAGE" | "CARD" | "NODE" | "PRODUCT_LIST" | "SPIN";
  children: ReactNode;
}

const Container = (props: IContainerProps) => {
  const { isLoading, type, children } = props;

  const loadingSkeleton = useMemo(() => {
    switch (type) {
      case "INPUT":
        return <Skeleton.Input active />;
      case "CIRCLE":
        return <Skeleton.Avatar active />;
      case "IMAGE":
        return <Skeleton.Image active />;
      case "TABLE":
        return (
          <div className="w-full py-2">
            <TableLoading />
          </div>
        );
      case "NODE":
        return (
          <div className="w-[120px]">
            <Skeleton.Node active />
          </div>
        );
      case "CARD":
        return (
          <div className="w-[120px]">
            <Skeleton.Node active />
          </div>
        );
      case "SPIN":
        return (
          <div className="flex gap-6 justify-center flex-col h-[300px] items-center bg-white shadow-box">
            <Spin></Spin>
            <Text type="TITLE4">{"Loading ..."}</Text>
          </div>
        );
      default:
        return (
          <div className="flex gap-6 justify-center flex-col h-[300px] items-center bg-white shadow-box">
            <Spin></Spin>
            <Text type="TITLE4">{"Loading ..."}</Text>
          </div>
        );
    }
  }, [type]);

  return <div>{isLoading ? loadingSkeleton : <div className="">{children}</div>}</div>;
};

export default React.memo(Container);
