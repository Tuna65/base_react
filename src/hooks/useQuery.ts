import queryString from 'query-string';
import { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

export const useSearchQuery = <D extends object = any>() => {
  const [_, setSearchParams] = useSearchParams();
  const location = useLocation();

  const onParams = (query: D) => {
    const serializeQuery = queryString.stringify(query);
    setSearchParams(serializeQuery);
  };

  const params = useMemo(() => {
    return queryString.parse(location?.search);
  }, [location?.search]);

  return {
    params,
    onParams,
  };
};
