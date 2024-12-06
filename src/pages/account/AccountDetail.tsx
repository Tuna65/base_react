import { accountApi } from "@/apis/account";
import useAsync from "@/apis/useApi";
import Container from "@/components/Container";
import PageContainer from "@/components/PageContainer";
import { IUser } from "@/models/user";
import { Flex } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CDetailInfo from "./components/CDetailInfo";
import COrderAccount from "./components/COrderAccount";

type Props = {};

const AccountDetail = (props: Props) => {
  const { id } = useParams();

  const [detailData, setDetailData] = useState<IUser>();

  const { execute: detailAccount, loading: isLoadingDetail } = useAsync(accountApi.detail, {
    onSucess: (response: any) => {
      if (response.status !== 200) {
        return;
      }
    },
    onFailed: (_error) => {},
  });

  useEffect(() => {
    id && detailAccount(id);
  }, []);

  return (
    <PageContainer>
      <Flex vertical gap={24}>
        <Container isLoading={isLoadingDetail} type="SPIN">
          <CDetailInfo detailData={detailData as IUser} />
        </Container>
        <COrderAccount />
      </Flex>
    </PageContainer>
  );
};

export default React.memo(AccountDetail);
