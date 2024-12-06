import { ResPagination, VoidFunc } from "@/models";
import { Button, Flex } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import BoxTable from "./BoxTable";
import SearchBox from "./SearchBox";
import { useSearchQuery } from "@/hooks/useQuery";

type Props = {
  loading?: boolean;
  column: any;
  data: ResPagination<any>;
  actionCreate?: VoidFunc;
};

const ContainerTablePage = (props: Props) => {
  const { loading, data, column, actionCreate } = props;
  const { t } = useTranslation();
  const { params, onParams } = useSearchQuery();

  useEffect(() => {
    if (!params.page) onParams({ page: 1, limit: 20 });
  }, []);

  return (
    <Flex vertical gap={24}>
      <Flex justify="space-between" align="center">
        <Flex>
          <SearchBox
            placeholder={t("Tìm kiếm theo tên...")}
            value={params.name as string}
            onChange={(name) => onParams({ ...params, name })}
          />
        </Flex>
        <Flex>
          <Button size="large" type="primary" onClick={() => actionCreate && actionCreate()}>
            {t("Thêm mới")}
          </Button>
        </Flex>
      </Flex>

      <BoxTable data={data} columns={column} isLoading={loading} />
    </Flex>
  );
};

export default React.memo(ContainerTablePage);
