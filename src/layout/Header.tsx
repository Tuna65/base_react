import { STORAGE } from "@/configs/storage";
import { cookieStorageUtil, sessionStorageUtil } from "@/service/storage";
import { authActions } from "@/store/modules/auth";
import { userSelector } from "@/store/modules/auth/selector";
import { PATHNAME } from "@/utils/Pathname";
import {
  BellOutlined,
  FolderOpenOutlined,
  LoginOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Avatar, Tooltip } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HeaderCustom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const account = useSelector(userSelector);
  const displayName = account?.fullName || account?.username || "Admin User";

  const handleLogout = () => {
    cookieStorageUtil.remove(STORAGE.TOKEN_KEY);
    cookieStorageUtil.remove(STORAGE.REFRESH_TOKEN_KEY);
    sessionStorageUtil.remove(STORAGE.USER_KEY);
    dispatch(authActions.clear());
    navigate(PATHNAME.AUTH.LOGIN);
  };

  return (
    <header className="flex h-[62px] shrink-0 items-center justify-between border-0 border-b border-solid border-[#e5eaf1] bg-white px-6">
      <div className="flex min-w-0 items-center gap-4">
        <button className="flex h-[48px] w-[322px] items-center gap-3 rounded-xl border border-solid border-[#e5eaf1] bg-white px-3 text-left shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ddebfa] text-[#5075aa]">
            <FolderOpenOutlined />
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block text-[10px] font-semibold uppercase tracking-wide text-[#59708f]">Workspace</span>
            <span className="block truncate text-[13px] font-semibold text-[#081d3d]">Workspace_16/07/2026</span>
          </span>
          <UpOutlined className="rotate-180 text-[10px] text-[#7b8aa0]" />
        </button>

        <span className="h-6 w-px bg-[#e5eaf1]" />
        <nav className="flex items-center gap-3 text-[13px]">
          <span className="font-medium text-[#506480]">TestFlow</span>
          <span className="text-[#9ba7b8]">›</span>
          <span className="font-semibold text-[#091d3d]">Dashboard</span>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Tooltip title="Notifications">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#53647d] hover:bg-[#f4f7fb]">
            <BellOutlined />
          </button>
        </Tooltip>
        <div className="flex items-center gap-2 text-left">
          <Avatar size={36} className="!bg-[#5579ad] !text-xs !font-semibold">AU</Avatar>
          <span className="hidden leading-tight xl:block">
            <span className="block text-[13px] font-semibold text-[#081d3d]">{displayName}</span>
            <span className="block text-[11px] text-[#61738f]">Admin</span>
          </span>
        </div>
        <Tooltip title="Sign out">
          <button
            onClick={handleLogout}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#53647d] hover:bg-[#f4f7fb]"
          >
            <LoginOutlined className="origin-center scale-[0.75]" />
          </button>
        </Tooltip>
      </div>
    </header>
  );
};

export default React.memo(HeaderCustom);
