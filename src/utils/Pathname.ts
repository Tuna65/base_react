export const PATHNAME = {
  HOME: "/home",
  DASHBOARD: "/dashboard",
  SALE: "/sale",
  COMMING_SOON: "/comming-soon",
  KNOWLEDGE: "/knowledge",
  REQUIREMENTS: "/requirements",
  JIRA: {
    INDEX: "/jira",
  },
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
  },
  SHOP: {
    INDEX: "/shop",
    CREATE: "/shop/create",
    DETAIL: "/shop/:id",
    EDIT: "/shop/edit/:id",
    EDIT_ID: (id?: string) => `/shop/edit/${id}`,
    DETAIL_ID: (id?: string) => `/shop/${id}`,
  },

  USER: {
    INDEX: "/employee",
    CREATE: "/employee/create",
    DETAIL: "/employee/:id",
    EDIT: "/employee/edit/:id",
    EDIT_ID: (id?: string) => `/employee/edit/${id}`,
    DETAIL_ID: (id?: string) => `/employee/${id}`,
  },

  ROLE: {
    INDEX: "/role",
    CREATE: "/role/create",
    DETAIL: "/role/:id",
    EDIT: "/role/edit/:id",
    EDIT_ID: (id?: string) => `/role/edit/${id}`,
    DETAIL_ID: (id?: string) => `/role/${id}`,
  },
};
