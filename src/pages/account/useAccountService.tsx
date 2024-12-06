import { accountApi } from "@/apis/account";
import Status from "@/components/Status";
import Text from "@/components/Text";
import { STORAGE } from "@/configs/storage";
import { ResPagination, SuccessFunc } from "@/models";
import { IRole } from "@/models/role";
import { IUser } from "@/models/user";
import { cookieStorageUtil } from "@/service/storage";
import { authActions } from "@/store/modules/auth";
import { keyActions } from "@/store/modules/tanstackKey";
import { keySelector } from "@/store/modules/tanstackKey/selector";
import { IBaseLoading } from "@/types";
import { IQueryAccount } from "@/types/account";
import { baseLoading } from "@/utils";
import { PATHNAME } from "@/utils/Pathname";
import { func } from "@/utils/func";
import { EditOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, message } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useAccountService = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const key = useSelector(keySelector);

  const rulesForm = {
    name: [
      {
        required: true,
        message: t("Tên cửa hàng không được để trống"),
      },
    ],
    username: [
      {
        required: true,
        message: t("Tên đăng nhập không được để trống"),
      },
      {
        pattern: /^[a-z0-9.@]+$/,
        message: 'Tên đăng nhập chỉ viết thường, ký tự ". @" và số',
      },
    ],
    password: [
      {
        required: true,
        message: t("Mật khẩu không được để trống"),
      },
    ],
    email: [
      {
        required: true,
        message: t("Email không được để trống"),
      },
      {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Email không hợp lệ!",
      },
    ],
    alias: [
      {
        required: true,
        message: t("Địa chỉ truy cập không được để trống"),
      },
      {
        pattern: /^[a-z0-9.-]+$/,
        message: 'Alias chỉ được chứa chữ thường và ký tự ".", "-"',
      },
    ],
  };

  const columns = [
    {
      title: t("Fullname"),
      dataIndex: "name",
      key: "name",
      render: (name: any, user: IUser) => (
        <Flex
          align="center"
          gap={4}
          className="group cursor-pointer"
          onClick={() => navigate(PATHNAME.USER.DETAIL_ID(user.id ?? ""))}
        >
          <Avatar src={user.image ?? func.defaultAvatar(name)} />
          <Text type="BODY" className="group-hover:underline ">
            {name}
          </Text>
        </Flex>
      ),
    },
    {
      title: t("Số điện thoại"),
      dataIndex: "phone",
      align: "center",
      key: "phone",
      render: (phone: any) => <Text type="BODY">{phone ?? "---"}</Text>,
    },
    {
      title: t("Email"),
      dataIndex: "email",
      key: "email",
      render: (email: any) => <Text type="BODY">{email ?? "---"}</Text>,
    },
    {
      title: t("Vai trò"),
      dataIndex: "role",
      key: "role",
      render: (role: IRole, user: IUser) => (
        <Text type="BODY">{user.isOwner ? t("Chủ cửa hàng") : role?.name ?? "---"}</Text>
      ),
    },
    {
      title: t("Trạng thái"),
      dataIndex: "status",
      align: "center",
      key: "status",
      render: (status: any, user: IUser) => <Status type={status} />,
    },
    {
      title: t("Thao tác"),
      key: "action",
      dataIndex: "key",
      align: "center",
      render: (id: string, user: IUser) => (
        <div className="flex items-center justify-center">
          <Button type="text" icon={<EditOutlined />} onClick={() => navigate(PATHNAME.USER.EDIT_ID(user?.id))} />
        </div>
      ),
    },
  ];

  const [loading, setLoading] = useState<IBaseLoading>(baseLoading);

  const detailToken = async () => {
    try {
      const res = await accountApi.detailByToken();
      if (res) dispatch(authActions.setUser(res));
    } catch (error) {
      navigate(PATHNAME.AUTH.LOGIN);
      dispatch(authActions.clear());
      cookieStorageUtil.remove(STORAGE.NAAT_TOKEN_KEY);
      message.error("Token hết hạn hoặc không hợp lệ");
    }
  };

  const detailAccount = async (id: string, success: SuccessFunc<IUser>) => {
    setLoading((prev) => ({ ...prev, detail: true }));
    try {
      const res = await accountApi.detail(id);
      if (res) {
        success(res);
        dispatch(authActions.setUser(res));
      }
      setLoading((prev) => ({ ...prev, detail: false }));
    } catch (error) {
      setLoading((prev) => ({ ...prev, detail: false }));
      navigate(PATHNAME.AUTH.LOGIN);
      dispatch(authActions.clear());
      cookieStorageUtil.remove(STORAGE.NAAT_TOKEN_KEY);
      message.error("Token hết hạn hoặc không hợp lệ");
    }
  };

  const deleteAccount = async (id: string, success?: SuccessFunc<IUser>) => {
    setLoading((prev) => ({ ...prev, detail: true }));
    try {
      const res = await accountApi.delete(id);
      if (res) {
        success && success(res);
        dispatch(authActions.setUser(res));
        message.error("Xóa nhân viên thành công");
        dispatch(keyActions.changeKey({ ...key, account: `account_${func.renderCode()}` }));
      }
      setLoading((prev) => ({ ...prev, detail: false }));
    } catch (error) {
      setLoading((prev) => ({ ...prev, detail: false }));
    }
  };

  const findAccount = async (query: IQueryAccount, success: (data: ResPagination<IUser>) => void) => {
    try {
      setLoading((prev) => ({ ...prev, find: true }));
      const res = await accountApi.find(query);
      if (res) {
        success(res);
      }
      setLoading((prev) => ({ ...prev, find: false }));
    } catch (error) {
      setLoading((prev) => ({ ...prev, find: false }));
    }
  };
  return { deleteAccount, columns, rulesForm, loading, detailToken, findAccount, detailAccount };
};

export default useAccountService;
