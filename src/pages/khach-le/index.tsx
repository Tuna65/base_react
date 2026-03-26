import { customerApi } from "@/apis/customer";
import useAsync from "@/apis/useApi";
import ContainerTablePage from "@/components/ContainerTablePage";
import Text from "@/components/Text";
import { useBoolean } from "@/hooks/useBoolean";
import { useSearchQuery } from "@/hooks/useQuery";
import { useTitle } from "@/hooks/useTitle";
import { ResPagination } from "@/models";
import { Customer } from "@/types/customer";
import { defaultResPage } from "@/utils";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import ModalCreate from "./ModalCreate";
import ModalEdit from "./ModalEdit";

const KhachLe = () => {
  useTitle("Khách lẻ");
  const { params } = useSearchQuery();
  const [open, { on, off }] = useBoolean();
  const [selected, setSelected] = useState<Customer | undefined>();

  const { execute, loading, data } = useAsync<ResPagination<Customer>>(customerApi.query, {
    onSucess: () => {},
    onFailed: () => {},
  });

  const { execute: executeDelete } = useAsync<any>(customerApi.delete, {
    onSucess: () => {
      message.success("Xóa khách lẻ thành công!");
      execute(params);
    },
    onFailed: () => {},
  });

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <div className="font-semibold">{text ?? "---"}</div>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (text: string) => text ?? "---",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      align: "center",
      width: "20%",
      render: (value: unknown) => {
        if (!value) return "-";
        const date = new Date(value as string);
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
      width: 160,
      render: (_: any, record: Customer) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => setSelected(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            description="Bạn chắc chắn muốn xóa khách lẻ này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => executeDelete(record.id!)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    params.page && execute(params);
  }, [params]);

  return (
    <div>
      <ContainerTablePage
        data={data || (defaultResPage as any)}
        column={columns as any}
        loading={loading}
        actionCreate={on}
      />

      <ModalCreate
        open={open}
        onCancel={off}
        onSuccess={() => execute(params)}
      />

      <ModalEdit
        customer={selected}
        onCancel={() => setSelected(undefined)}
        onSuccess={() => {
          setSelected(undefined);
          execute(params);
        }}
      />
    </div>
  );
};

export default React.memo(KhachLe);
