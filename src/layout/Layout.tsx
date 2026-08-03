import HeaderCustom from "./Header";
import { navItem } from "@/utils/useGlobalService";
import { sidebarSelector } from "@/store/modules/sidebar/selector";
import { Layout as AntLayout, Menu } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const { Sider, Content } = AntLayout;

const TestFlowMark = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path
      d="M5 28L13 21L19 25L29 9"
      stroke="url(#test-flow-logo)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="test-flow-logo" x1="5" y1="28" x2="29" y2="9" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4F46E5" />
        <stop offset="1" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
  </svg>
);

const Layout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const collapsed = useSelector(sidebarSelector);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const selectedKeys = useMemo(() => [`/${pathname.split("/")[1]}`], [pathname]);

  useEffect(() => {
    setOpenKeys([pathname]);
  }, [pathname]);

  return (
    <AntLayout className="h-screen overflow-hidden bg-white">
      <Sider
        width={220}
        collapsedWidth={68}
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        className="app-sidebar !border-r !border-solid !border-[#e5eaf1] !bg-white"
      >
        <div className="flex h-[62px] items-center gap-2 border-0 border-b border-solid border-[#e5eaf1] px-5">
          <TestFlowMark />
          {!collapsed && <span className="text-base font-bold text-[#071b3b]">TestFlow</span>}
        </div>

        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          items={navItem()}
          onClick={({ key }) => {
            if (key === "/jira" || key === "/knowledge" || key === "/requirements") navigate(key);
          }}
          onOpenChange={setOpenKeys}
          className="!mt-2 !border-none !bg-transparent px-3 [&_.ant-menu-item]:!my-1 [&_.ant-menu-item]:!h-10 [&_.ant-menu-item]:!leading-10 [&_.ant-menu-item]:!rounded-xl [&_.ant-menu-item]:!px-3 [&_.ant-menu-item]:!text-[14px] [&_.ant-menu-item]:!font-semibold [&_.ant-menu-item]:!text-[#425779] [&_.ant-menu-item-icon]:!text-[#62718a] [&_.ant-menu-title-content]:!text-[14px] [&_.ant-menu-title-content]:!font-semibold [&_.ant-menu-title-content_*]:!text-[14px] [&_.ant-menu-title-content_*]:!font-semibold [&_.ant-menu-title-content_.anticon]:!text-[6px]"
        />
      </Sider>

      <AntLayout className="min-w-0 !bg-white">
        <HeaderCustom />
        <Content className="overflow-y-auto bg-[#fbfcfe] p-6">
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
