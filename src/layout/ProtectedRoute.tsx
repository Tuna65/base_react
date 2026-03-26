import { authSaleApi } from "@/apis/auth";
import useAsync from "@/apis/useApi";
import { STORAGE } from "@/configs/storage";
import { IUser } from "@/models/user";
import { cookieStorageUtil } from "@/service/storage";
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

  const { execute: detailToken, loading } = useAsync(authSaleApi.me, {
    onSucess: (response: IUser) => {
      dispatch(authActions.setUser(response));
    },
    onFailed: (_error) => {},
  });

  React.useEffect(() => {
    const token = cookieStorageUtil.get(STORAGE.TOKEN_KEY);
    if (!token) naviage(PATHNAME.AUTH.LOGIN);
    token && detailToken();
  }, []);

  return <div>{loading ? <Spin size="small" /> : <Outlet />}</div>;
};

export default ProtectedRoute;
