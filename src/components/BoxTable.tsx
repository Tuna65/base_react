import { ResPagination } from "@/models";
import { Skeleton, Table as TableAntd } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "./Container";
import Nodata from "./Nodata";
import Pagination from "./Pagination";
import { useSearchQuery } from "@/hooks/useQuery";

interface ITableProps {
  isLoading?: boolean;
  columns: ColumnsType<any>;
  data?: ResPagination<any>;
  isSelectRow?: boolean;
}

const BoxTable = (props: ITableProps) => {
  const { isLoading, columns, data, isSelectRow } = props;
  const { t } = useTranslation();
  const { params, onParams } = useSearchQuery<any>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div className="pb-4 bg-white shadow-box rounded-lg">
      <div className="border border-solid border-black border-opacity-10 rounded-lg overflow-hidden">
        <Container type="SPIN" isLoading={isLoading}>
          {!isSelectRow ? (
            <TableAntd
              columns={columns}
              dataSource={data?.items}
              locale={{
                emptyText: <Nodata />,
              }}
              pagination={false}
            />
          ) : (
            <TableAntd
              columns={columns}
              dataSource={data?.items}
              locale={{
                emptyText: <Nodata />,
              }}
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
              pagination={false}
            />
          )}
        </Container>
      </div>
      <div className="flex justify-end mt-3">
        <Pagination
          onChange={(page, size) => onParams({ ...params, page, limit: size })}
          metaData={data?.meta as any}
        />
      </div>
    </div>
  );
};

export default React.memo(BoxTable);

export const TableLoading = () => {
  return (
    <div>
      <div className="grid grid-cols-8 gap-y-3 px-4 bg-white py-6 rounded-lg">
        {new Array(32).fill({}).map((i, idx) => (
          <div className="col-span-1" key={`table-loading-${idx}`}>
            <Skeleton.Input active size="default" />
          </div>
        ))}
      </div>
    </div>
  );
};
