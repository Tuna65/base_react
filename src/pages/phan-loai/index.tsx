import { categoryApi } from "@/apis/category";
import useAsync from "@/apis/useApi";
import ContainerTablePage from "@/components/ContainerTablePage";
import { useBoolean } from "@/hooks/useBoolean";
import { useSearchQuery } from "@/hooks/useQuery";
import { useTitle } from "@/hooks/useTitle";
import { ResPagination } from "@/models";
import { Category } from "@/models/category";
import { defaultResPage } from "@/utils";
import { DeleteOutlined, EditOutlined, LinkOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Space, TableProps, Tag, Tooltip, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ThemMoiPhanLoai from "./ThemMoiPhanLoai";
import ChinhSuaPhanLoai from "./ChinhSuaPhanLoai";
const { Text } = Typography;
type Props = {};

const PhanLoai = ({}: Props) => {
  const { t } = useTranslation();
  useTitle(t("Quản lý sản phẩm"));

  const { params } = useSearchQuery();
  const [open, { on, off }] = useBoolean();
  const [category, setCategory] = useState<Partial<Category>>();

  const { execute, loading, data } = useAsync<ResPagination<Category>>(categoryApi.query, {
    onSucess: (_) => {},
    onFailed: (_error) => {},
  });

  const { execute: deleted } = useAsync<Category>(categoryApi.delete, {
    onSucess: (_) => {
      message.success("Xóa danh mục mới thành công!");
      execute(params);
    },
    onFailed: (_error) => {},
  });

  const columns: TableProps<Category>["columns"] = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      width: "25%",
      render: (text: string, record: Category) => (
        <Space vertical size={0}>
          <Text strong className="text-blue-600">
            {text}
          </Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            <LinkOutlined /> {record.slug}
          </Text>
        </Space>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true, // Tự động rút gọn nếu quá dài
      render: (text: string) => (
        <Tooltip title={text}>
          <Text type="secondary">{text || "---"}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Số sản phẩm",
      key: "product_count",
      align: "center",
      width: "15%",
      render: (_, record: Category) => (
        <Tag color="cyan" icon={<ShoppingOutlined />}>
          {record.products?.length || 0} Sản phẩm
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 120,
      render: (status: string) => {
        const color = status === "ACTIVE" ? "green" : "volcano";
        return (
          <Tag color={color} className="rounded-full px-3">
            {status?.toUpperCase() || "ACTIVE"}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      width: 150,
      render: (value: string) => (
        <Text style={{ fontSize: "13px" }}>{value ? new Date(value).toLocaleDateString("vi-VN") : "---"}</Text>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: "15%",
      render: (_: any, record: Category) => (
        <Space>
          <Button type="text" icon={<EditOutlined className="text-blue-500" />} onClick={() => setCategory(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa danh mục này?"
            description="Tất cả sản phẩm thuộc danh mục này sẽ bị mất liên kết."
            onConfirm={() => deleted(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
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
      <div>
        <ContainerTablePage
          data={data || (defaultResPage as any)}
          column={columns as any}
          loading={loading}
          actionCreate={on}
        />
      </div>

      <ThemMoiPhanLoai onCancel={off} onSuccess={() => execute(params)} open={open} />
      <ChinhSuaPhanLoai
        initValue={category}
        onCancel={() => setCategory(undefined)}
        onSuccess={() => execute(params)}
        open={!!category}
      />
    </div>
  );
};

export default React.memo(PhanLoai);
