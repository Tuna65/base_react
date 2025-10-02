import { useMemo, useState } from "react";
import dataProvince from "../apis/province.json";
import { Option } from "@/models";

let districtsData: any[] | undefined = undefined;
interface ProvinceOption extends Option {
  bs?: string;
}

const useProvince = () => {
  const provinceWithBs = useMemo(() => {
    // @ts-ignore
    return dataProvince?.map((p) => ({
      ...p,
      bs: bs.find((b) => b.id === p.id)?.bs,
    }));
  }, [dataProvince]);

  const [districts, setDistricts] =
    useState<{ value: string; label: string }[]>();
  const [wards, setWards] = useState<{ value: string; label: string }[]>();
  const province: ProvinceOption[] = useMemo(() => {
    // @ts-ignore
    return provinceWithBs?.map((value) => ({
      value: value?.bs ?? value.id,
      label: `${value?.bs} - ${value?.name}`,
      bs: value?.bs,
    }));
  }, [provinceWithBs]);

  const onChangeProvince = (name: string) => {
    // @ts-ignore
    const dataDistricts = provinceWithBs?.find(
      (province: any) => province?.name === name
    )?.districts;
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
    const dataWards = districtsData?.find(
      (value: any) => value?.name === name
    )?.wards;
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

const bs = [
  {
    name: "Hồ Chí Minh",
    id: "1",
    bs: "59",
  },
  {
    name: "Hà Nội",
    id: "2",
    bs: "29",
  },
  {
    name: "Đà Nẵng",
    id: "3",
    bs: "43",
  },
  {
    name: "Bình Dương",
    id: "4",
    bs: "61",
  },
  {
    name: "Đồng Nai",
    id: "5",
    bs: "60",
  },
  {
    name: "Khánh Hòa",
    id: "6",
    bs: "79",
  },
  {
    name: "Hải Phòng",
    id: "7",
    bs: "15",
  },
  {
    name: "Long An",
    id: "8",
    bs: "62",
  },
  {
    name: "Quảng Nam",
    id: "9",
    bs: "92",
  },
  {
    name: "Bà Rịa Vũng Tàu",
    id: "10",
    bs: "72",
  },
  {
    name: "Đắk Lắk",
    id: "11",
    bs: "47",
  },
  {
    name: "Cần Thơ",
    id: "12",
    bs: "65",
  },
  {
    name: "Bình Thuận  ",
    id: "13",
    bs: "86",
  },
  {
    name: "Lâm Đồng",
    id: "14",
    bs: "49",
  },
  {
    name: "Thừa Thiên Huế",
    id: "15",
    bs: "75",
  },
  {
    name: "Kiên Giang",
    id: "16",
    bs: "68",
  },
  {
    name: "Bắc Ninh",
    id: "17",
    bs: "99",
  },
  {
    name: "Quảng Ninh",
    id: "18",
    bs: "14",
  },
  {
    name: "Thanh Hóa",
    id: "19",
    bs: "36",
  },
  {
    name: "Nghệ An",
    id: "20",
    bs: "37",
  },
  {
    name: "Hải Dương",
    id: "21",
    bs: "34",
  },
  {
    name: "Gia Lai",
    id: "22",
    bs: "81",
  },
  {
    name: "Bình Phước",
    id: "23",
    bs: "93",
  },
  {
    name: "Hưng Yên",
    id: "24",
    bs: "89",
  },
  {
    name: "Bình Định",
    id: "25",
    bs: "77",
  },
  {
    name: "Tiền Giang",
    id: "26",
    bs: "63",
  },
  {
    name: "Thái Bình",
    id: "27",
    bs: "17",
  },
  {
    name: "Bắc Giang",
    id: "28",
    bs: "98",
  },
  {
    name: "Hòa Bình",
    id: "29",
    bs: "28",
  },
  {
    name: "An Giang",
    id: "30",
    bs: "67",
  },
  {
    name: "Vĩnh Phúc",
    id: "31",
    bs: "88",
  },
  {
    name: "Tây Ninh",
    id: "32",
    bs: "70",
  },
  {
    name: "Thái Nguyên",
    id: "33",
    bs: "20",
  },
  {
    name: "Lào Cai",
    id: "34",
    bs: "24",
  },
  {
    name: "Nam Định",
    id: "35",
    bs: "18",
  },
  {
    name: "Quảng Ngãi",
    id: "36",
    bs: "76",
  },
  {
    name: "Bến Tre",
    id: "37",
    bs: "71",
  },
  {
    name: "Đắk Nông",
    id: "38",
    bs: "48",
  },
  {
    name: "Cà Mau",
    id: "39",
    bs: "69",
  },
  {
    name: "Vĩnh Long",
    id: "40",
    bs: "64",
  },
  {
    name: "Ninh Bình",
    id: "41",
    bs: "35",
  },
  {
    name: "Phú Thọ",
    id: "42",
    bs: "19",
  },
  {
    name: "Ninh Thuận",
    id: "43",
    bs: "85",
  },
  {
    name: "Phú Yên",
    id: "44",
    bs: "78",
  },
  {
    name: "Hà Nam",
    id: "45",
    bs: "90",
  },
  {
    name: "Hà Tĩnh",
    id: "46",
    bs: "38",
  },
  {
    name: "Đồng Tháp",
    id: "47",
    bs: "66",
  },
  {
    name: "Sóc Trăng",
    id: "48",
    bs: "83",
  },
  {
    name: "Kon Tum",
    id: "49",
    bs: "82",
  },
  {
    name: "Quảng Bình",
    id: "50",
    bs: "73",
  },
  {
    name: "Quảng Trị",
    id: "51",
    bs: "74",
  },
  {
    name: "Trà Vinh",
    id: "52",
    bs: "84",
  },
  {
    name: "Hậu Giang",
    id: "53",
    bs: "95",
  },
  {
    name: "Sơn La",
    id: "54",
    bs: "26",
  },
  {
    name: "Bạc Liêu",
    id: "55",
    bs: "94",
  },
  {
    name: "Yên Bái",
    id: "56",
    bs: "21",
  },
  {
    name: "Tuyên Quang",
    id: "57",
    bs: "22",
  },
  {
    name: "Điện Biên",
    id: "58",
    bs: "27",
  },
  {
    name: "Lai Châu",
    id: "59",
    bs: "25",
  },
  {
    name: "Lạng Sơn",
    id: "60",
    bs: "12",
  },
  {
    name: "Hà Giang",
    id: "61",
    bs: "23",
  },
  {
    name: "Bắc Kạn",
    id: "62",
    bs: "97",
  },
  {
    name: "Cao Bằng",
    id: "63",
    bs: "11",
  },
];
