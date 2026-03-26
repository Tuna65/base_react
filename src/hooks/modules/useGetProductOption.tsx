import { productOptionApi } from "@/apis/productOption";
import useAsync from "@/apis/useApi";
import { ResPagination } from "@/models";
import { ProductOption } from "@/types/product";
import { useEffect, useMemo } from "react";

const useGetProductOption = ({ name }: { name?: string }) => {
  const { execute, data } = useAsync<ResPagination<ProductOption>>(productOptionApi.query, {
    onSucess: (_) => {},
    onFailed: (_error) => {},
  });

  useEffect(() => {
    execute({ page: 1, size: 20, name });
  }, [name]);

  const options = useMemo(() => {
    if (!data || (data && data.items.length == 0)) return [];
    return data.items.map((item) => ({ label: item.name, value: item.id }));
  }, [data]);

  return { options, dataList: data?.items || [] };
};

export default useGetProductOption;
