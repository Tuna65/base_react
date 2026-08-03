import { authSaleApi } from "@/apis/auth";
import useApi from "@/apis/useApi";
import { STORAGE } from "@/configs/storage";
import { cookieStorageUtil, sessionStorageUtil } from "@/service/storage";
import { authActions } from "@/store/modules/auth";
import { PATHNAME } from "@/utils/Pathname";
import { Spin } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const naviage = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);
  const { execute: requestCurrentUser } = useApi<unknown>(authSaleApi.me);

  React.useEffect(() => {
    const token = cookieStorageUtil.get(STORAGE.TOKEN_KEY);
    const cachedUser = sessionStorageUtil.get(STORAGE.USER_KEY);

    if (!token) {
      naviage(PATHNAME.AUTH.LOGIN, { replace: true });
      return;
    }

    if (cachedUser) {
      dispatch(authActions.setUser(cachedUser));
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const user = await requestCurrentUser();
        if (!user) throw new Error("Unable to load the current user");
        sessionStorageUtil.set(user, STORAGE.USER_KEY);
        dispatch(authActions.setUser(user));
      } catch {
        cookieStorageUtil.remove(STORAGE.TOKEN_KEY);
        cookieStorageUtil.remove(STORAGE.REFRESH_TOKEN_KEY);
        sessionStorageUtil.remove(STORAGE.USER_KEY);
        naviage(PATHNAME.AUTH.LOGIN, { replace: true });
      } finally {
        setLoading(false);
      }
    };

    void loadUser();
  }, [dispatch, naviage, requestCurrentUser]);

  return <div>{loading ? <Spin size="small" /> : <Outlet />}</div>;
};

export default ProtectedRoute;
