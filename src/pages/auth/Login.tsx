import { IconGoogle } from "@/assets/Icon";
import Container from "@/components/Container";
import Text from "@/components/Text";
import { STORAGE } from "@/configs/storage";
import { cookieStorageUtil } from "@/service/storage";
import { PATHNAME } from "@/utils/Pathname";
import { Button, Flex, Form, Input } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useAuthService from "./useAuthService";
import useAsync from "@/apis/useApi";
import { authSaleApi } from "@/apis/auth";
import { ResLogin } from "@/models";
import { BodySaleLogin } from "@/types/auth";
import { func } from "@/utils/func";

const Login = () => {
  const { t } = useTranslation();
  const naviage = useNavigate();
  const [form] = Form.useForm();
  const { rulesForm } = useAuthService();
  const navigate = useNavigate();

  const { execute: login, loading } = useAsync<ResLogin>(authSaleApi.login, {
    onSucess: (response: ResLogin) => {
      cookieStorageUtil.set(response.accessToken, STORAGE.TOKEN_KEY, { expires: 1 });
      cookieStorageUtil.set(response.refreshToken, STORAGE.REFRESH_TOKEN_KEY, { expires: 7 });
      navigate(PATHNAME.DASHBOARD);
    },
    onFailed: (_error) => {},
  });

  const onFinish = (v: BodySaleLogin) => {
    v.shopAlias = func.getShopAlias();
    login(v);
  };

  useEffect(() => {
    const token = cookieStorageUtil.get(STORAGE.TOKEN_KEY);
    if (token) naviage(PATHNAME.DASHBOARD);
  }, []);

  return (
    <Container>
      <Flex vertical gap={30}>
        <Text type="H2">{t("Đăng nhập")}</Text>
        <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{ remember: true }}>
          <Form.Item label={t("Username")} name="username" rules={rulesForm.username}>
            <Input placeholder={t("Username")} />
          </Form.Item>
          <Form.Item label={t("Password")} name="password" rules={rulesForm.password}>
            <Input.Password placeholder={t("Password")} type="password" />
          </Form.Item>
          <Flex align="center" gap={20}>
            <Button type="primary" loading={loading} htmlType="submit" size="large" className="flex-1 h-16">
              {t("Sign in")}
            </Button>

            <div className="cursor-pointer">
              <IconGoogle />
            </div>
          </Flex>
        </Form>

        <Flex align="center" gap={4} className="mt-6" justify="center">
          <Text type="TITLE4">{t("Don't have account?")}</Text>
          <Text
            type="TITLE4"
            onClick={() => navigate(PATHNAME.AUTH.REGISTER)}
            className="text-primary font-semibold cursor-pointer hover:underline"
          >
            {t("Create account")}
          </Text>
        </Flex>
      </Flex>
    </Container>
  );
};

export default React.memo(Login);
