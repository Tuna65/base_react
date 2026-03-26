export const PATHNAME = {
  HOME: "/trang-chu",
  DASHBOARD: "/dashboard",
  SALE: "/ban-hang",
  COMMING_SOON: "/comming-soon",
  AUTH: {
    LOGIN: "/dang-nhap",
    REGISTER: "/dang-ky",
  },
  ORDER: {
    INDEX: "/don-hang",
    CREATE: "/don-hang/them-moi",
    DETAIL: "/don-hang/:id",
    EDIT: "/don-hang/chinh-sua/:id",
  },
  SHOP: {
    INDEX: "/shop",
    CREATE: "/shop/them-moi",
    DETAIL: "/shop/:id",
    EDIT: "/shop/chinh-sua/:id",
    EDIT_ID: (id?: string) => `/shop/chinh-sua/${id}`,
    DETAIL_ID: (id?: string) => `/shop/${id}`,
  },
  SAN_PHAM: {
    INDEX: "/san-pham",
    CREATE: "/san-pham/them-moi",
    DETAIL: "/san-pham/:id",
    EDIT: "/san-pham/chinh-sua/:id",
    EDIT_ID: (id?: string) => `/san-pham/chinh-sua/${id}`,
    DETAIL_ID: (id?: string) => `/san-pham/${id}`,
  },
  USER: {
    INDEX: "/nhan-vien",
    CREATE: "/nhan-vien/them-moi",
    DETAIL: "/nhan-vien/:id",
    EDIT: "/nhan-vien/chinh-sua/:id",
    EDIT_ID: (id?: string) => `/nhan-vien/chinh-sua/${id}`,
    DETAIL_ID: (id?: string) => `/nhan-vien/${id}`,
  },

  KHACH_HANG: {
    INDEX: "/khach-hang",
    CREATE: "/khach-hang/them-moi",
    DETAIL: "/khach-hang/:id",
    EDIT: "/khach-hang/chinh-sua/:id",
    EDIT_ID: (id?: string) => `/khach-hang/chinh-sua/${id}`,
    DETAIL_ID: (id?: string) => `/khach-hang/${id}`,
  },

  KHACH_LE: {
    INDEX: "/khach-le",
    CREATE: "/khach-le/them-moi",
    DETAIL: "/khach-le/:id",
    EDIT: "/khach-le/chinh-sua/:id",
    EDIT_ID: (id?: string) => `/khach-le/chinh-sua/${id}`,
    DETAIL_ID: (id?: string) => `/khach-le/${id}`,
  },

  LOCATION: {
    INDEX: "/chi-nhanh",
    CREATE: "/chi-nhanh/them-moi",
    DETAIL: "/chi-nhanh/:id",
    EDIT: "/chi-nhanh/chinh-sua/:id",
    EDIT_ID: (id?: string) => `/chi-nhanh/chinh-sua/${id}`,
    DETAIL_ID: (id?: string) => `/chi-nhanh/${id}`,
  },

  NHAP_HANG: {
    INDEX: "/nhap-hang",
    CREATE: "/nhap-hang/them-moi",
    DETAIL: "/nhap-hang/:id",
    EDIT: "/nhap-hang/chinh-sua/:id",
    EDIT_ID: (id?: string) => `/nhap-hang/chinh-sua/${id}`,
    DETAIL_ID: (id?: string) => `/nhap-hang/${id}`,
  },

  PHAN_LOAI: {
    INDEX: "/phan-loai",
    CREATE: "/phan-loai/them-moi",
    DETAIL: "/phan-loai/:id",
    EDIT: "/phan-loai/chinh-sua/:id",
    EDIT_ID: (id?: string) => `/phan-loai/chinh-sua/${id}`,
    DETAIL_ID: (id?: string) => `/phan-loai/${id}`,
  },

  PACKAGE: {
    INDEX: "/goi",
    CREATE: "/goi/them-moi",
    DETAIL: "/goi/:id",
    EDIT: "/goi/chinh-sua/:id",
    EDIT_ID: (id?: string) => `/goi/chinh-sua/${id}`,
    DETAIL_ID: (id?: string) => `/goi/${id}`,
  },

  ROLE: {
    INDEX: "/vai-tro",
    CREATE: "/vai-tro/them-moi",
    DETAIL: "/vai-tro/:id",
    EDIT: "/vai-tro/chinh-sua/:id",
    EDIT_ID: (id?: string) => `/vai-tro/chinh-sua/${id}`,
    DETAIL_ID: (id?: string) => `/vai-tro/${id}`,
  },

  PRODUCT_GROUP: {
    INDEX: "/nhom-san-pham",
    CREATE: "/nhom-san-pham/them-moi",
    DETAIL: "/nhom-san-pham/:id",
    EDIT: "/nhom-san-pham/chinh-sua/:id",
    EDIT_ID: (id?: string) => `/nhom-san-pham/chinh-sua/${id}`,
    DETAIL_ID: (id?: string) => `/nhom-san-pham/${id}`,
  },
};
