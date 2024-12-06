import { Pagination as PaginationAntd } from "antd";
import React from "react";
import { IMetaData } from "../models";

interface IPaginationProps {
  metaData?: IMetaData;
  onChange: (page: number, size: number) => void;
}

const Pagination = (props: IPaginationProps) => {
  const { metaData, onChange } = props;
  return (
    <div>
      <div className="flex justify-end mt-3">
        <PaginationAntd
          onChange={(page, size) => {
            onChange(page, size);
          }}
          total={metaData?.totalItems}
          current={metaData?.currentPage}
          pageSize={metaData?.itemsPerPage}
        />
      </div>
    </div>
  );
};

export default React.memo(Pagination);
