import { accountApi } from "@/apis/account";
import useAsync from "@/apis/useApi";
import PageContainer from "@/components/PageContainer";
import { EStatus } from "@/enum/EStatus";
import { useTitle } from "@/hooks/useTitle";
import { IUser } from "@/models/user";
import { Button, Flex, Form } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const EditAccount = () => {
  const { t } = useTranslation();
  useTitle(t("Chỉnh sửa nhân viên"));
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const [detailData, setDetailData] = useState<IUser>();

  const { execute: editAccount, loading } = useAsync(accountApi.update, {
    onSucess: (response: any) => {
      if (response.status !== 200) {
        return;
      }
    },
    onFailed: (_error) => {},
  });

  const { execute: detailAccount, loading: isLoadingDetail } = useAsync(accountApi.detail, {
    onSucess: (response: any) => {
      if (response.status !== 200) {
        return;
      }
    },
    onFailed: (_error) => {},
  });

  const onFinish = (v: IUser) => {
    v.status = true ? EStatus.ACTIVE : EStatus.INACTIVE;
    editAccount(id ?? "", v);
  };

  useEffect(() => {
    id && detailAccount(id);
  }, []);

  return (
    <PageContainer
      actions={
        <Flex align="center" gap={10}>
          <Button type="default" onClick={() => navigate(-1)}>
            {t("Hủy")}
          </Button>
          <Button loading={loading} type="primary" onClick={() => form.submit()}>
            {t("Lưu")}
          </Button>
        </Flex>
      }
    >
      {detailData && <Form layout="vertical" form={form} onFinish={onFinish} initialValues={detailData}></Form>}
    </PageContainer>
  );
};

export default React.memo(EditAccount);
