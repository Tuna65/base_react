import Text from "@/components/Text";
import { Flex, Image, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import logo from "@/assets/images/naat_logo.jpg";
import { sidebarSelector } from "@/store/modules/sidebar/selector";
import { func } from "@/utils/func";
import useGlobalService from "@/utils/useGlobalService";
import { useSelector } from "react-redux";

const Layout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const openSidebar = useSelector(sidebarSelector);
  const { navItem } = useGlobalService();

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const activeKey = React.useMemo(() => {
    return [`/${pathname.split("/")[1]}`];
  }, [pathname]);

  useEffect(() => {
    setOpenKeys([pathname]);
  }, []);

  return (
    <div>
      <Flex>
        <div className="w-auto  border-0 border-r border-solid border-black border-opacity-10">
          <Flex
            className="h-[78px] border-0 border-b border-solid border-black border-opacity-10"
            justify="center"
            align="center"
          >
            {!openSidebar ? (
              <Flex className="">
                <Image className="rounded-lg" width={120} height={50} src={logo} />
                {/* <img src={logo} alt="" className="h-full" /> */}
              </Flex>
            ) : (
              <Text type="TITLE1" className="text-primary">
                {"NAAT"}
              </Text>
            )}
          </Flex>

          <div className="p-4">
            <Menu
              mode="inline"
              selectedKeys={activeKey}
              openKeys={openKeys}
              style={{ height: "100%" }}
              items={navItem}
              className=""
              onClick={(i) => navigate(i.key)}
              onOpenChange={(o) => setOpenKeys(o)}
              inlineCollapsed={openSidebar}
            />
          </div>
        </div>
        <div className="flex-1 h-[100vh] overflow-hidden">
          <div className="shadow-bottom relative z-10">
            <Header />
          </div>

          <div className="bg-[#fafafa] h-[calc(100vh-88px)] p-6 overflow-y-auto ">
            <Outlet />
          </div>
        </div>
      </Flex>
    </div>
  );
};

export default Layout;
