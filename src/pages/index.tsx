import { Spin } from "antd";
import { Suspense, lazy } from "react";
import { PATHNAME } from "@/utils/Pathname";
import { TRouterList } from "@/models";

const LazyLayout = (importStatement: () => Promise<any>) => {
  const Component = lazy(importStatement);

  return (
    <Suspense
      fallback={
        <div className="flex-center h-full">
          <Spin size="large" />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
};
export const Dashboard = () => LazyLayout(() => import("./dashboard"));
export const Users = () => LazyLayout(() => import("./nhan-vien"));
export const Login = () => LazyLayout(() => import("./auth/Login"));
export const Register = () => LazyLayout(() => import("./auth/Register"));
export const Shop = () => LazyLayout(() => import("./mock-create-shop"));
export const NhapHang = () => LazyLayout(() => import("./nhap-hang"));
export const TaoDonNhapHang = () => LazyLayout(() => import("./nhap-hang/TaoDonNhapHang"));
export const SanPham = () => LazyLayout(() => import("./san-pham"));
export const ThemMoiSanPham = () => LazyLayout(() => import("./san-pham/ThemMoiSanPham"));
export const PhanLoai = () => LazyLayout(() => import("./phan-loai"));
export const ThemMoiPhanLoai = () => LazyLayout(() => import("./phan-loai/ThemMoiPhanLoai"));
export const ChinhSuaSanPham = () => LazyLayout(() => import("./san-pham/ChinhSuaSanPham"));
export const ChiTietSanPham = () => LazyLayout(() => import("./san-pham/ChiTietSanPham"));
export const Order = () => LazyLayout(() => import("./don-hang"));
export const ThemMoiDonHang = () => LazyLayout(() => import("./don-hang/ThemMoiDonHang"));
export const KhachHang = () => LazyLayout(() => import("./khach-hang"));

export const routerList: TRouterList[] = [
  {
    component: <KhachHang />,
    path: PATHNAME.KHACH_HANG.INDEX,
  },
  {
    component: <Order />,
    path: PATHNAME.ORDER.INDEX,
  },
  {
    component: <ThemMoiDonHang />,
    path: PATHNAME.ORDER.CREATE,
  },
  {
    component: <ChiTietSanPham />,
    path: PATHNAME.SAN_PHAM.DETAIL,
  },
  {
    component: <ChinhSuaSanPham />,
    path: PATHNAME.SAN_PHAM.EDIT,
  },
  {
    component: <ThemMoiPhanLoai />,
    path: PATHNAME.PHAN_LOAI.CREATE,
  },
  {
    component: <PhanLoai />,
    path: PATHNAME.PHAN_LOAI.INDEX,
  },
  {
    component: <ThemMoiSanPham />,
    path: PATHNAME.SAN_PHAM.CREATE,
  },
  {
    component: <SanPham />,
    path: PATHNAME.SAN_PHAM.INDEX,
  },
  {
    component: <TaoDonNhapHang />,
    path: PATHNAME.NHAP_HANG.CREATE,
  },
  {
    component: <NhapHang />,
    path: PATHNAME.NHAP_HANG.INDEX,
  },
  {
    component: <Users />,
    path: PATHNAME.USER.INDEX,
  },

  {
    component: <Dashboard />,
    path: PATHNAME.DASHBOARD,
  },
];
