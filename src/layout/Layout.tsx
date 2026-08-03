import { sidebarSelector } from "@/store/modules/sidebar/selector";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout as AntLayout, Flex, Menu } from "antd";
import { useTranslation } from "react-i18next";
import HeaderCustom from "./Header";
import Text from "@/components/Text";
import { navItem } from "@/utils/useGlobalService";
const { Header, Sider, Content } = AntLayout;

const Layout = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const openSidebar = useSelector(sidebarSelector);

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const activeKey = React.useMemo(() => {
    return [`/${pathname.split("/")[1]}`];
  }, [pathname]);

  useEffect(() => {
    setOpenKeys([pathname]);
  }, []);

  return (
    <div>
      <AntLayout style={{ height: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={openSidebar} theme="light" className="h-screen overflow-hidden">
          <Flex
            className="h-[64px] px-2 border-0 border-b border-solid border-black border-opacity-10"
            justify="center"
            align="center"
          >
            <Text type="TITLE3" className="text-primary font-bold text-xl tracking-wider">
              {"TEST"}
            </Text>
          </Flex>
          <Menu
            mode="inline"
            selectedKeys={activeKey}
            openKeys={openKeys}
            style={{ height: "100%" }}
            items={navItem(t)}
            className=""
            onClick={(i) => navigate(i.key)}
            onOpenChange={(o) => setOpenKeys(o)}
            theme="light"
          />
        </Sider>
        <AntLayout style={{ overflow: "hidden" }}>
          <Header style={{ padding: 0, background: "#fff", boxShadow: "0 2px 8px #f0f1f2", flexShrink: 0, height: 64 }}>
            <HeaderCustom />
          </Header>
          <Content
            style={{
              padding: 16,
              overflowY: "auto",
            }}
          >
            <Outlet />
          </Content>
        </AntLayout>
      </AntLayout>
    </div>
  );
};

export default Layout;
