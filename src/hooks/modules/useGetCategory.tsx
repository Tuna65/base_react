import { categoryApi } from "@/apis/category";
import useAsync from "@/apis/useApi";
import { ResPagination } from "@/models";
import { Category } from "@/models/category";
import { useEffect, useMemo } from "react";

const useGetCategory = ({ name }: { name?: string }) => {
  const { execute, data } = useAsync<ResPagination<Category>>(categoryApi.query, {
    onSucess: (_) => {},
    onFailed: (_error) => {},
  });

  useEffect(() => {
    execute({ page: 1, size: 20, name });
  }, [name]);

  const cateOptions = useMemo(() => {
    if (!data || (data && data.items.length == 0)) return [];
    return data.items.map((item) => ({ label: item.name, value: item.id }));
  }, [data]);

  return { cateOptions, categories: data?.items };
};

export default useGetCategory;
