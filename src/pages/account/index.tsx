import { useTitle } from "@/hooks/useTitle";
import React from "react";
import { useTranslation } from "react-i18next";

const Users = () => {
  const { t } = useTranslation();
  useTitle(t("Quản lý nhân viên"));

  return (
    // <ContainerTablePage
    //   data={}
    //   column={columns as any}
    //   loading={false}
    //   actionCreate={() => navigate(PATHNAME.USER.CREATE)}
    // />
    <div className=""></div>
  );
};

export default React.memo(Users);
