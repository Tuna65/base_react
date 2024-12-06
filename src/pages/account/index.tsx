import { accountApi } from "@/apis/account";
import ContainerTablePage from "@/components/ContainerTablePage";
import { useSearchQuery } from "@/hooks/useQuery";
import { useTitle } from "@/hooks/useTitle";
import { PATHNAME } from "@/utils/Pathname";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useUserService from "./useAccountService";
import { useSelector } from "react-redux";
import { keySelector } from "@/store/modules/tanstackKey/selector";

const Users = () => {
  const { t } = useTranslation();
  useTitle(t("Quản lý nhân viên"));
  const navigate = useNavigate();
  const { params, onParams } = useSearchQuery();
  const { columns } = useUserService();
  const key = useSelector(keySelector);

  const { isPending, error, data, isFetching, isLoading } = useQuery({
    queryKey: [key.account, params],
    queryFn: accountApi.find,
    staleTime: 600000,
    enabled: !!Object.values(params)?.length,
    retry: 1,
  });

  return (
    <ContainerTablePage
      data={data as any}
      column={columns as any}
      loading={isLoading}
      actionCreate={() => navigate(PATHNAME.USER.CREATE)}
    />
  );
};

export default React.memo(Users);
