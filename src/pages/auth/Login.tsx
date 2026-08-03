import { STORAGE } from "@/configs/storage";
import { cookieStorageUtil, sessionStorageUtil } from "@/service/storage";
import { PATHNAME } from "@/utils/Pathname";
import { Button, Checkbox, Form, Input, Tabs } from "antd";
import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useAuthService from "./useAuthService";
import { authSaleApi } from "@/apis/auth";
import useApi from "@/apis/useApi";
import { BodySaleLogin } from "@/types/auth";

// ─── Logo SVG ────────────────────────────────────────────────────────────────

const TestFlowLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 28 L13 16 L20 24 L27 10 L35 20"
      stroke="url(#logoGrad)"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <defs>
      <linearGradient id="logoGrad" x1="5" y1="28" x2="35" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

const Login = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { rulesForm } = useAuthService();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ldap");
  const { execute: login, loading } = useApi(authSaleApi.login, {
    onFailed: (error) => {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Unable to sign in. Please try again.";
      message.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
    },
  });
  const username = Form.useWatch("username", form);
  const password = Form.useWatch("password", form);
  const canSignIn = Boolean(username?.trim() && password);

  const onFinish = async (values: BodySaleLogin) => {
    try {
      const response = await login(values);
      if (!response) return;
      cookieStorageUtil.set(response.access_token, STORAGE.TOKEN_KEY, { expires: 1 });
      cookieStorageUtil.set(response.refresh_token, STORAGE.REFRESH_TOKEN_KEY, { expires: 7 });
      sessionStorageUtil.remove(STORAGE.USER_KEY);
      navigate(PATHNAME.REQUIREMENTS);
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Unable to sign in. Please try again.";
      message.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
    }
  };

  useEffect(() => {
    const token = cookieStorageUtil.get(STORAGE.TOKEN_KEY);
    if (token) navigate(PATHNAME.REQUIREMENTS);
  }, [navigate]);

  const tabItems = [
    { key: "ldap", label: "LDAP" },
    { key: "standard", label: "Standard" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans">
      <div className="box-border min-h-[445px] w-[386px] rounded-[11px] border border-[#e4e7ec] bg-white p-8 shadow-[0_1px_3px_rgba(16,24,40,0.16)]">
          {/* Logo & App Name */}
          <div className="mb-[19px] flex flex-col items-center gap-[7px]">
            <TestFlowLogo />
            <h1 className="m-0 text-lg font-bold tracking-[-0.2px] text-[#020b2d]">TestFlow</h1>
          </div>

          {/* Tabs */}
          <Tabs
            className="w-full [&_.ant-tabs-nav]:!mb-5 [&_.ant-tabs-nav-list]:w-full [&_.ant-tabs-nav::before]:!border-b-[#e2e8f0] [&_.ant-tabs-tab]:!flex-1 [&_.ant-tabs-tab]:!justify-center [&_.ant-tabs-tab]:!px-0 [&_.ant-tabs-tab]:!pb-2 [&_.ant-tabs-tab]:!pt-1.5 [&_.ant-tabs-tab]:!text-sm [&_.ant-tabs-tab]:!font-semibold [&_.ant-tabs-tab]:!text-[#536582] [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-[#5b83bb] [&_.ant-tabs-ink-bar]:!h-0.5 [&_.ant-tabs-ink-bar]:!bg-[#4f73a8]"
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
          />

          {/* Form */}
          <Form
            className="[&_.ant-form-item-label>label]:!text-sm [&_.ant-form-item-label>label]:!font-semibold [&_.ant-form-item-label>label]:!text-[#020b2d]"
            layout="vertical"
            onFinish={onFinish}
            form={form}
            initialValues={{ remember: true }}
          >
            <Form.Item
              label={activeTab === "standard" ? "Username or primary email" : t("Username")}
              name="username"
              rules={
                activeTab === "standard"
                  ? [{ required: true, message: "Username or primary email is required" }]
                  : rulesForm.username
              }
              className="!mb-4"
            >
              <Input
                className="!min-h-9 !rounded-md !border-[#cbd5e1] !px-3 !py-1.5 !text-sm !text-[#1e293b] !shadow-[0_1px_2px_rgba(16,24,40,0.08)] placeholder:!text-[#66799a] hover:!border-[#5b83bb] focus:!border-[#5b83bb] focus:!shadow-[0_0_0_3px_rgba(91,131,187,0.12)]"
                placeholder={
                  activeTab === "ldap"
                    ? t("Your LDAP username")
                    : "username or you@company.com"
                }
              />
            </Form.Item>

            <Form.Item
              label={t("Password")}
              name="password"
              rules={rulesForm.password}
              className="!mb-3"
            >
              <Input.Password
                className="!min-h-9 !rounded-md !border-[#cbd5e1] !px-3 !py-1.5 !text-sm !text-[#1e293b] !shadow-[0_1px_2px_rgba(16,24,40,0.08)] hover:!border-[#5b83bb] focus-within:!border-[#5b83bb] focus-within:!shadow-[0_0_0_3px_rgba(91,131,187,0.12)] [&_.ant-input]:!min-h-0 [&_.ant-input]:!border-0 [&_.ant-input]:!bg-transparent [&_.ant-input]:!p-0 [&_.ant-input]:!text-sm [&_.ant-input]:!shadow-none [&_.ant-input]:placeholder:!text-[#66799a]"
                placeholder={t("Enter your password")}
              />
            </Form.Item>

            {/* Remember me */}
            <Form.Item className="!mb-5">
              <div className="flex w-full items-center justify-between">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="!text-sm !text-[#020b2d] [&_.ant-checkbox-checked_.ant-checkbox-inner]:!border-[#5b83bb] [&_.ant-checkbox-checked_.ant-checkbox-inner]:!bg-[#5b83bb]">
                    {t("Remember me")}
                  </Checkbox>
                </Form.Item>
                {activeTab === "standard" && (
                  <a className="text-sm text-[#5b83bb] hover:text-[#4f73a8] hover:underline" href="#forgot-password">
                    Forgot your password?
                  </a>
                )}
              </div>
            </Form.Item>

            {/* Sign in button */}
            <Form.Item className="!mb-0">
              <Button
                type="primary"
                loading={loading}
                disabled={!canSignIn || loading}
                htmlType="submit"
                className={`!h-9 !w-full !rounded-md !border-none !text-sm !font-semibold !tracking-[0.3px] transition ${
                  canSignIn
                    ? "!bg-[#5b83bb] hover:!bg-[#4f73a8] hover:-translate-y-px"
                    : "!bg-[#abc0da] hover:!bg-[#abc0da]"
                }`}
              >
                {t("Sign in")}
              </Button>
            </Form.Item>
          </Form>
      </div>
    </div>
  );
};

export default React.memo(Login);
