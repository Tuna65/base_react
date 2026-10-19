import { useEffect, useState } from "react";
import { Alert, Button, Spin } from "@/components";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { authSaleApi } from "@/apis/auth";
import { clearAuth } from "@/apis/gateway-http";
import { STORAGE } from "@/configs/storage";
import { cookieStorageUtil, sessionStorageUtil } from "@/service/storage";
import { authActions } from "@/store/modules/auth";
import { PATHNAME } from "@/utils/Pathname";

export default function ProtectedRoute() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    const expired = () => {
      clearAuth();
      dispatch(authActions.clear());
      navigate(PATHNAME.AUTH.LOGIN, { replace: true });
    };
    window.addEventListener("auth:expired", expired);
    if (!cookieStorageUtil.get(STORAGE.TOKEN_KEY) && !cookieStorageUtil.get(STORAGE.REFRESH_TOKEN_KEY)) expired();
    else {
      setLoading(true);
      setError(false);
      void authSaleApi
        .me()
        .then((user) => {
          if (!active) return;
          sessionStorageUtil.set(user, STORAGE.USER_KEY);
          dispatch(authActions.setUser(user));
        })
        .catch((failure) => {
          if (!active) return;
          if (axios.isAxiosError(failure) && [401, 403].includes(failure.response?.status ?? 0)) expired();
          else setError(true);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }
    return () => {
      active = false;
      window.removeEventListener("auth:expired", expired);
    };
  }, [dispatch, navigate, retry]);
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  if (error)
    return (
      <div className="mt-12 box-border w-full max-w-none px-4">
        <Alert
          type="error"
          title="Không thể xác minh phiên đăng nhập"
          description="Kiểm tra kết nối gateway và thử lại."
          action={<Button onClick={() => setRetry((value) => value + 1)}>Thử lại</Button>}
        />
      </div>
    );
  return <Outlet />;
}
