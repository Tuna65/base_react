import { useEffect, useState } from "react";
import { Alert, Button, Checkbox, Form, Input } from "@/components";
import { ArrowRightOutlined, LockOutlined, UserOutlined } from "@/components/Icons";
import axios from "axios";
import { authSaleApi } from "@/apis/auth";
import { clearAuth, saveAuth } from "@/apis/gateway-http";
import { BodySaleLogin } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { PATHNAME } from "@/utils/Pathname";
import { STORAGE } from "@/configs/storage";
import { cookieStorageUtil, sessionStorageUtil } from "@/service/storage";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const expired = () => {
      setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    };
    window.addEventListener("auth:expired", expired);
    if (cookieStorageUtil.get(STORAGE.TOKEN_KEY) || cookieStorageUtil.get(STORAGE.REFRESH_TOKEN_KEY)) {
      setLoading(true);
      void authSaleApi.me(controller.signal).then((detail) => {
        if (controller.signal.aborted) return;
        sessionStorageUtil.set(detail, STORAGE.USER_KEY);
        navigate(PATHNAME.DASHBOARD, { replace: true });
      }).catch((failure) => {
        if (controller.signal.aborted) return;
        if (axios.isAxiosError(failure) && [401, 403].includes(failure.response?.status ?? 0)) clearAuth();
        setError("Không thể xác minh phiên đăng nhập. Vui lòng thử lại.");
      }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }
    return () => {
      controller.abort();
      window.removeEventListener("auth:expired", expired);
    };
  }, [navigate]);
  const [form] = Form.useForm<BodySaleLogin & { remember: boolean }>();

  async function onFinish(values: BodySaleLogin & { remember: boolean }) {
    setLoading(true);
    setError("");
    try {
      const result = await authSaleApi.login({ username: values.username.trim(), password: values.password });
      saveAuth(result, values.remember);
      const detail = await authSaleApi.me();
      sessionStorageUtil.set(detail, STORAGE.USER_KEY);
      navigate(PATHNAME.DASHBOARD, { replace: true });
      form.resetFields(["password"]);
    } catch (failure) {
      const detail: unknown = axios.isAxiosError(failure) ? failure.response?.data?.message : undefined;
      setError(typeof detail === "string" ? detail : "Không thể đăng nhập. Kiểm tra kết nối và thử lại.");
    } finally { setLoading(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-5 py-12">
    <section className="w-full max-w-[440px] rounded-2xl border border-solid border-[#e2e8f0] bg-white px-7 py-9 shadow-[0_12px_48px_rgba(15,23,42,0.06)] sm:px-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#153e75] text-white" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 3L17 11L25 14L17 17L14 25L11 17L3 14L11 11L14 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
        </div>
        <h1 className="text-[26px] font-semibold tracking-tight text-[#112b4f]">AI solution</h1>
        <p className="mt-2 text-sm text-slate-500">Đăng nhập để quản lý agent và cấu hình AI.</p>
      </div>
      {error && <Alert className="!mb-5" type="error" showIcon title={error} />}
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ remember: true }} disabled={loading} requiredMark={false}>
        <Form.Item name="username" label="Username hoặc email" rules={[{ required: true, whitespace: true, message: "Nhập username hoặc email." }]}>
          <Input size="large" prefix={<UserOutlined className="!mr-1 !text-slate-400" />} placeholder="username hoặc email@example.com" autoComplete="username" autoFocus />
        </Form.Item>
        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Nhập mật khẩu." }]}>
          <Input.Password size="large" prefix={<LockOutlined className="!mr-1 !text-slate-400" />} placeholder="Nhập mật khẩu" autoComplete="current-password" />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked"><Checkbox>Ghi nhớ đăng nhập</Checkbox></Form.Item>
        <Button type="primary" htmlType="submit" size="large" block loading={loading} className="!h-11 !bg-[#153e75] !font-semibold" icon={<ArrowRightOutlined />} iconPlacement="end">Đăng nhập</Button>
      </Form>
      <p className="mt-6 text-center text-xs leading-5 text-slate-500">Sử dụng tài khoản được cấp để truy cập hệ thống.</p>
    </section>
  </main>;
}
