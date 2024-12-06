import { accountApi } from "@/apis/account";
import useAsync from "@/apis/useApi";
import PageContainer from "@/components/PageContainer";
import UploadFile from "@/components/UploadFile";
import { useTitle } from "@/hooks/useTitle";
import { Button, Col, Flex, Form, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import CFormAddress from "./components/CFormAddress";
import CFormInfo from "./components/CFormInfo";

const CreatAccount = () => {
  const { t } = useTranslation();
  useTitle(t("Thêm nhân viên"));
  const [form] = Form.useForm();

  const { execute: create, loading } = useAsync(accountApi.create, {
    onSucess: (response: any) => {
      if (response.status !== 200) {
        return;
      }
    },
    onFailed: (_error) => {},
  });

  const onFinish = (v: any) => {
    create(v);
  };
  return (
    <PageContainer
      actions={
        <Button loading={loading} type="primary" onClick={() => form.submit()}>
          {t("Lưu")}
        </Button>
      }
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row className="bg-white shadow-box py-6 rounded-md" gutter={12}>
          <Col span={4}>
            <UploadFile onChange={() => {}} />
          </Col>
          <Col span={20}>
            <Flex vertical gap={6}>
              <CFormInfo />
              <CFormAddress />
            </Flex>
          </Col>
        </Row>
      </Form>
    </PageContainer>
  );
};

export default React.memo(CreatAccount);
