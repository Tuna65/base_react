import useAsync from "@/apis/useApi";
import { useTitle } from "@/hooks/useTitle";
import { IShop } from "@/models/shop";
import { Col, Row } from "antd";
import React, { useState } from "react";
import CReport from "./components/CReport";
import CShopInfo from "./components/CShopInfo";
import PackageInfo from "./components/PackageInfo";

const Dashboard = () => {
  useTitle("Dashboard");
  const [detailData, setDetailData] = useState<IShop>();

  const { execute: detailShop, loading } = useAsync(async () => {}, {
    onSucess: (response: any) => {
      if (response.status !== 200) {
        return;
      }
      setDetailData(response.data.data);
    },
    onFailed: (_error) => {},
  });

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <CReport />
      </Col>
      <Col span={17}>
        <CShopInfo shop={detailData as IShop} isLoading={loading} />
      </Col>
      <Col span={7}>
        <PackageInfo packageId={detailData?.packageId as string} />
      </Col>
    </Row>
  );
};

export default React.memo(Dashboard);
