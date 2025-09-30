import { accountApi } from "@/apis/account";
import useAsync from "@/apis/useApi";
import { STORAGE } from "@/configs/storage";
import { cookieStorageUtil } from "@/service/storage";
import { PATHNAME } from "@/utils/Pathname";
import React from "react";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const naviage = useNavigate();

  const { execute: detailToken, loading } = useAsync(accountApi.detailByToken, {
    onSucess: (response: any) => {
      if (response) {
        // dispatch(authActions.setUser(res));
      }
    },
    onFailed: (_error) => {},
  });

  React.useEffect(() => {
    const token = cookieStorageUtil.get(STORAGE.TOKEN_KEY);
    if (!token) naviage(PATHNAME.AUTH.LOGIN);
    token && detailToken();
  }, []);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ProtectedRoute;
