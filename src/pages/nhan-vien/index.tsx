import { staffApi } from "@/apis/staff";
import useAsync from "@/apis/useApi";
import ContainerTablePage from "@/components/ContainerTablePage";
import Text from "@/components/Text";
import { EStatus } from "@/enum/EStatus";
import { useBoolean } from "@/hooks/useBoolean";
import { useSearchQuery } from "@/hooks/useQuery";
import { useTitle } from "@/hooks/useTitle";
import { ResPagination } from "@/models";
import { Staff } from "@/types/staff";
import { defaultResPage } from "@/utils";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ModalCreate from "./components/ModalCreate";
import ModalEdit from "./components/ModalEdit";

const Users = () => {
  const { t } = useTranslation();
  useTitle(t("Quản lý nhân viên"));
  const { params } = useSearchQuery();
  const [open, { on, off }] = useBoolean();
  const [staff, setStaff] = useState<Staff>();

  const { execute, loading, data } = useAsync<ResPagination<Staff>>(staffApi.query, {
    onSucess: (_) => {},
    onFailed: (_error) => {},
  });

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string, record: Staff) => (
        <div className="flex items-center gap-1">
          <div className="font-semibold">{text ?? "---"}</div>
          <div className="text-xs text-gray-400">@{record.username}</div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      key: "status",
      render: (status: string) => (
        <Tag color={status === EStatus.ACTIVE ? "green" : "red"}>{status?.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Ngày upload",
      dataIndex: "createdAt",
      align: "center",
      width: "20%",
      render: (value: unknown) => {
        if (!value) return "-";
        const date = new Date(value as string);
        date.setHours(date.getHours() + 0);

        return (
          <Text>
            {date.toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </Text>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 150,
      render: (_: any, record: Staff) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => setStaff(record)}>
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => {}}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    params.page && execute(params);
  }, [params]);

  return (
    <div className="">
      <ContainerTablePage
        data={data || (defaultResPage as any)}
        column={columns as any}
        loading={loading}
        actionCreate={on}
      />
      <ModalCreate
        onCancel={off}
        onSuccess={() => {
          execute(params);
        }}
        open={open}
      />
      <ModalEdit
        onCancel={() => setStaff(undefined)}
        onSuccess={() => {
          execute(params);
        }}
        open={!!staff}
        initValue={staff}
      />
    </div>
  );
};

export default React.memo(Users);
