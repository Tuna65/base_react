import { useMemo, useState } from 'react';
import dataProvince from '../apis/province.json';

let districtsData: any[] | undefined = undefined;
const useProvince = () => {
  const [districts, setDistricts] = useState<{ value: string; label: string }[]>();
  const [wards, setWards] = useState<{ value: string; label: string }[]>();
  const province = useMemo(() => {
    // @ts-ignore
    return dataProvince?.map((value) => ({ value: value?.name, label: value?.name }));
  }, [dataProvince]);

  const onChangeProvince = (name: string) => {
    // @ts-ignore
    const dataDistricts = dataProvince?.find((province) => province?.name === name)?.districts;
    // @ts-ignore
    const resultDistricts = dataDistricts?.map((value) => ({
      value: value?.name,
      label: value?.name,
    }));
    districtsData = dataDistricts;
    setDistricts(resultDistricts);
    setWards(undefined);
    return true;
  };

  const onChangeDistricts = (name: string) => {
    const dataWards = districtsData?.find((value: any) => value?.name === name)?.wards;
    // @ts-ignore
    const resultWards = dataWards?.map((value) => ({
      value: `${value?.prefix} ${value?.name}`,
      label: `${value?.prefix} ${value?.name}`,
    }));
    setWards(resultWards);
  };

  return {
    province,
    districts,
    wards,
    onChangeProvince,
    onChangeDistricts,
  };
};

export default useProvince;
