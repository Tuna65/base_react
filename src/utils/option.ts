import { EPackage } from "@/enum/EPackage";
import { EShopStatus } from "@/enum/EShopStatus";
import { EStatus } from "@/enum/EStatus";
import { ETime } from "@/enum/ETime";
import { Option } from "@/models";

export const OptionPackage: Option[] = [
  {
    label: "Bình thường",
    value: EPackage.NORMAL,
  },
  {
    label: "Cơ bản",
    value: EPackage.BASIC,
  },
  {
    label: "Nâng cao",
    value: EPackage.ADVANCE,
  },
  {
    label: "Cao cấp",
    value: EPackage.PRO,
  },
];

export const OptionShopStatus: Option[] = [
  {
    label: "Hoạt động",
    value: EShopStatus.ACTIVE,
  },
  {
    label: "Chờ duyệt",
    value: EShopStatus.PENDING,
  },
  {
    label: "Ngừng hoạt động",
    value: EShopStatus.INACTIVE,
  },
];

export const TimeOption: Option[] = [
  {
    label: "1 tháng",
    value: ETime.ONE_MONTH,
  },
  {
    label: "3 tháng",
    value: ETime.THREE_MONTH,
  },
  {
    label: "6 tháng",
    value: ETime.SIX_MONTH,
  },
  {
    label: "1 năm",
    value: ETime.ONE_YEAR,
  },
];

export const OptionStatus: Option[] = [
  {
    label: "Hoạt động",
    value: EStatus.ACTIVE,
  },
  {
    label: "Ngừng hoạt động",
    value: EStatus.INACTIVE,
  },
];
