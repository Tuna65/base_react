import { Button, ConfigProvider, IconButton, theme } from "@/components";
import {
  AppstoreOutlined,
  BookOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyOutlined,
  SendOutlined,
  TeamOutlined,
  UserOutlined,
} from "@/components/Icons";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import HeaderCustom from "./Header";

export type ThemeMode = "dark" | "light";

const groups = [
  {
    label: "Manage",
    items: [
      { label: "Dashboard", icon: <AppstoreOutlined />, path: "/dashboard" },
      { label: "Documents", icon: <BookOutlined />, path: "/documents" },
      // { label: "Blog", icon: <FileTextOutlined /> },
      // { label: "Setting", icon: <SettingOutlined /> },
    ],
  },
  {
    label: "Manage Accounts",
    items: [
      // { label: "Account", icon: <UserOutlined /> },
      { label: "Branches", icon: <AppstoreOutlined />, path: "/branches" },
      { label: "User", icon: <TeamOutlined />, path: "/users" },
      { label: "Roles & Permissions", icon: <SafetyOutlined />, path: "/roles" },
    ],
  },
  {
    label: "Setting",
    items: [
      { label: "LLM", icon: <UserOutlined />, path: "/llm" },
      { label: "OCR", icon: <TeamOutlined />, path: "/ocr" },
    ],
  },
];

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 640);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      return localStorage.getItem("app-theme") === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });
  useEffect(() => {
    // Portals (dialogs, dropdowns) also inherit Tailwind's dark theme.
    document.documentElement.classList.toggle("dark", mode === "dark");
    return () => document.documentElement.classList.remove("dark");
  }, [mode]);

  const toggleTheme = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    try {
      localStorage.setItem("app-theme", next);
    } catch {
      /* Theme remains usable without storage. */
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: mode === "dark" ? "#c4bfff" : "#7564d8",
          colorBgContainer: mode === "dark" ? "#111015" : "#ffffff",
          colorText: mode === "dark" ? "#eeedf5" : "#252331",
          colorBorder: mode === "dark" ? "#28262f" : "#e7e5ee",
          borderRadius: 8,
        },
      }}
    >
      <div
        className={`flex min-h-[100dvh] w-full max-w-none ${mode === "dark" ? "dark bg-[#0f0e14] text-[#eeedf5]" : "bg-[#f8f9fc] text-[#252331]"}`}
        data-theme={mode}
      >
        {!collapsed && (
          <Button
            className="!fixed !inset-0 !z-[19] !h-full !w-full !rounded-none !shadow-none !cursor-pointer !border-0 !bg-black/40 min-[641px]:!hidden"
            aria-label="Close navigation"
            onClick={() => setCollapsed(true)}
          />
        )}
        <aside
          className={`top-0 flex h-[100dvh] flex-col border-0 border-r border-solid border-[#e7e5ee] bg-white transition-[width,flex-basis] duration-200 dark:border-[#27252e] dark:bg-[#0f0e14] max-[640px]:fixed max-[640px]:z-20 max-[640px]:shadow-[12px_0_30px_#0003] min-[641px]:sticky ${collapsed ? "w-[76px] basis-[76px] max-[640px]:hidden" : "w-[250px] basis-[250px] max-[640px]:w-[210px]"} shrink-0`}
          aria-label="Main navigation"
        >
          <div
            className={`flex h-[74px] shrink-0 items-center gap-3 border-0 border-b border-solid border-[#e7e5ee] dark:border-[#27252e] ${collapsed ? "justify-center px-0" : "justify-between px-4"}`}
          >
            <Button
              className={`${collapsed ? "!hidden" : "!flex"} !cursor-pointer !items-center !gap-2 !whitespace-nowrap !border-0 !bg-transparent !p-0 !text-[#7564d8] focus-visible:!outline focus-visible:!outline-2 focus-visible:!outline-[#a89af7] dark:!text-[#beb7ff]`}
              onClick={() => navigate("/dashboard")}
              aria-label="AI solution dashboard"
            >
              <SendOutlined className="-rotate-12 text-[27px]" />
              <span className="text-[23px] font-bold tracking-[-0.6px] max-[640px]:text-lg">AI solution</span>
            </Button>
            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </IconButton>
          </div>
          <nav className="flex-1 overflow-y-auto px-3">
            {groups.map((group) => (
              <div
                className="border-0 border-b border-solid border-[#e7e5ee] pb-3 pt-2 dark:border-[#27252e]"
                key={group.label}
              >
                <div className={`mb-[5px] text-xs text-[#797586] dark:text-[#93909f] ${collapsed ? "hidden" : ""}`}>
                  {group.label}
                </div>
                {group.items
                  .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
                  .map((item) => {
                    const path = "path" in item ? item.path : undefined;
                    return (
                      <Button
                        key={item.label}
                        className={`!my-0.5 !flex !shadow-none !font-normal !h-[39px] !w-full !cursor-pointer !items-center !gap-3 !whitespace-nowrap !rounded-[5px] !border-0 !text-left disabled:!cursor-default focus-visible:!outline focus-visible:!outline-2 focus-visible:!outline-[#a89af7] [&_.anticon]:!text-[15px] ${collapsed ? "!justify-center !px-0" : "!justify-start !px-[11px]"} ${path === pathname ? "!bg-[#e5e0ff] !text-[#45319c] dark:!bg-[#c4bfff] dark:!text-[#161325]" : "!bg-transparent !text-[#252331] enabled:hover:!bg-[#f2effa] dark:!text-[#eeedf5] dark:enabled:hover:!bg-[#1b1923]"}`}
                        aria-current={path === pathname ? "page" : undefined}
                        disabled={!path}
                        title={path ? item.label : `${item.label} - Coming soon`}
                        onClick={() => path && navigate(path)}
                      >
                        {item.icon}
                        <span className={collapsed ? "hidden" : ""}>{item.label}</span>
                      </Button>
                    );
                  })}
              </div>
            ))}
          </nav>
          <div
            className={`${collapsed ? "hidden" : "flex"} items-center gap-2 px-[23px] py-5 text-xs text-[#797586] dark:text-[#93909f]`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#78bc8b]" />
            <span className="text-xs">AI workspace</span>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <HeaderCustom
            mode={mode}
            onToggleTheme={toggleTheme}
            query={query}
            onSearch={setQuery}
            onToggleSidebar={() => setCollapsed(!collapsed)}
          />
          <main className="box-border w-full min-w-0 max-w-none px-4 py-3 max-[640px]:px-4 max-[640px]:py-6">
            <div className="w-full min-w-0 max-w-none [&>*]:w-full [&>*]:min-w-0 [&>*]:max-w-none">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
}
