import { BellOutlined, SearchOutlined, SunOutlined, MoonOutlined, LogoutOutlined, MenuOutlined, RightOutlined } from "@/components/Icons";
import { Avatar, Dropdown, Switch, Tooltip } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { clearAuth } from "@/apis/gateway-http";
import { authActions } from "@/store/modules/auth";
import { userSelector } from "@/store/modules/auth/selector";
import { Button, IconButton, Input } from "@/components";
import type { ThemeMode } from "./Layout";

type Props = { mode: ThemeMode; onToggleTheme: () => void; query: string; onSearch: (value: string) => void; onToggleSidebar: () => void };

export default function HeaderCustom({ mode, onToggleTheme, query, onSearch, onToggleSidebar }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const account = useSelector(userSelector);
  const displayName = account?.displayName || account?.fullName || account?.username || "Account";
  const initials = displayName.split(/[\s_]+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  const logout = () => {
    clearAuth();
    dispatch(authActions.clear());
    navigate("/login", { replace: true });
  };
  return <header className="flex h-[74px] items-center justify-between gap-5 border-0 border-b border-solid border-[#e7e5ee] bg-white px-7 dark:border-[#27252e] dark:bg-[#0f0e14] max-[1100px]:px-5 max-[640px]:gap-2 max-[640px]:px-3">
    <IconButton className="min-[641px]:!hidden" onClick={onToggleSidebar} aria-label="Toggle navigation"><MenuOutlined /></IconButton>
    <nav className="flex items-center gap-[15px] whitespace-nowrap text-[#797586] dark:text-[#93909f] max-[1100px]:gap-2 max-[640px]:hidden [&_.anticon]:text-[10px]" aria-label="Breadcrumb"><Button className="!h-auto !shadow-none !cursor-pointer !border-0 !bg-transparent !p-0 !text-inherit focus-visible:!outline focus-visible:!outline-2 focus-visible:!outline-[#a89af7]" onClick={() => navigate("/dashboard")}>Home</Button><RightOutlined /><span>{pathname === "/llm" ? "LLM" : pathname === "/ocr" ? "OCR" : pathname === "/users" ? "User" : pathname === "/branches" ? "Branches" : pathname === "/roles" ? "Roles & Permissions" : pathname === "/documents" ? "Documents" : "Dashboard"}</span><RightOutlined /><strong className="font-medium text-[#252331] dark:text-[#eeedf5]">{pathname === "/llm" ? "Management" : pathname === "/ocr" ? "Settings" : pathname === "/branches" || pathname === "/users" || pathname === "/roles" || pathname === "/documents" ? "Management" : "Overview"}</strong></nav>
    <div className="flex items-center gap-3 max-[640px]:gap-2">
      <label className="flex h-9 w-60 items-center gap-2 rounded-[9px] border border-solid border-[#e7e5ee] px-2.5 text-[#797586] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#a89af7] dark:border-[#27252e] dark:text-[#93909f] max-[1100px]:w-[180px] max-[900px]:hidden"><SearchOutlined /><Input variant="borderless" className="!min-w-0 !w-full !p-0 !text-sm !border-0 !bg-transparent !text-[#252331] !outline-none placeholder:!text-[#797586] dark:!text-[#eeedf5] dark:placeholder:!text-[#93909f]" aria-label="Search navigation" placeholder="Search here" value={query} onChange={event => onSearch(event.target.value)} /><kbd className="text-[11px] opacity-50">/</kbd></label>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-xs max-[640px]:hidden">{mode === "dark" ? "Dark" : "Light"}</span>
        <Tooltip title={mode === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
          <Switch checked={mode === "dark"} onChange={onToggleTheme} checkedChildren={<MoonOutlined />} unCheckedChildren={<SunOutlined />} aria-label="Dark theme" />
        </Tooltip>
      </div>
      <Dropdown trigger={["click"]} menu={{ items: [{ key: "empty", label: "No new notifications", disabled: true }] }}><IconButton aria-label="Notifications"><BellOutlined /></IconButton></Dropdown>
      <Dropdown trigger={["click"]} menu={{ items: [{ key: "logout", label: "Sign out", icon: <LogoutOutlined />, onClick: logout }] }}>
        <Button className="!flex !h-auto !shadow-none !cursor-pointer !items-center !gap-2 !border-0 !bg-transparent !p-0 !text-left !text-[#252331] focus-visible:!outline focus-visible:!outline-2 focus-visible:!outline-[#a89af7] dark:!text-[#eeedf5]" aria-label="Account menu"><Avatar src={account?.avatarUrl || undefined} size={34} className="!bg-[#c4bfff] !font-semibold !text-[#252036]">{initials}</Avatar><span className="max-[900px]:hidden"><strong className="block text-[13px] font-semibold">{displayName}</strong><small className="mt-0.5 block text-[11px] text-[#797586] dark:text-[#93909f]">{account?.username === "super_admin" || account?.roles?.includes("super_admin") ? "Super Admin" : account?.roles?.includes("admin") ? "Admin" : "Member"}</small></span></Button>
      </Dropdown>
    </div>
  </header>;
}
