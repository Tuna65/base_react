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
  expandedRowRender?: (record: any) => React.ReactNode;
  rowExpandable?: (record: any) => boolean;
}

const BoxTable = (props: ITableProps) => {
  const { isLoading, columns, data, isSelectRow, expandedRowRender, rowExpandable } = props;
  const { t } = useTranslation();
  const { params, onParams } = useSearchQuery<any>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  // Hàm xử lý khi bấm mở/đóng
  const onExpand = (expanded: boolean, record: any) => {
    const key = record.id; // Hoặc record.key nếu data của bạn dùng field key
    setExpandedRowKeys(
      expanded
        ? [key] // Thêm vào mảng để mở
        : [], // Xóa khỏi mảng để đóng
    );
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div className="pb-4 rounded-lg">
      <div className="border border-solid border-black border-opacity-10 rounded-lg overflow-hidden">
        <Container type="SPIN" isLoading={isLoading}>
          {!isSelectRow ? (
            <TableAntd
              columns={columns}
              rowKey="id"
              dataSource={data?.items}
              locale={{
                emptyText: <Nodata />,
              }}
              pagination={false}
              bordered
              expandable={
                expandedRowRender
                  ? {
                      expandedRowRender,
                      rowExpandable,
                      expandRowByClick: true,
                      expandedRowKeys, // Truyền state vào đây để kiểm soát
                      onExpand: onExpand, // Cập nhật state khi click
                    }
                  : undefined
              }
            />
          ) : (
            <TableAntd
              columns={columns}
              rowKey="id"
              dataSource={data?.items}
              locale={{
                emptyText: <Nodata />,
              }}
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
              pagination={false}
              bordered
              expandable={
                expandedRowRender
                  ? {
                      expandedRowRender,
                      rowExpandable,
                      expandRowByClick: true,
                      expandedRowKeys, // Truyền state vào đây để kiểm soát
                      onExpand: onExpand, // Cập nhật state khi click
                    }
                  : undefined
              }
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
