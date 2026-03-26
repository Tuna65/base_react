import React, { useState, useMemo } from "react";
import {
  Table,
  Input,
  InputNumber,
  Button,
  Card,
  Space,
  Typography,
  Divider,
  message,
  Select,
  Popconfirm,
  Row,
  Col,
  Flex,
} from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { InventoryReceipt, ReceiptItem } from "@/types/inventoryReceipt";
import { ProductOption } from "@/types/product";
import { useTitle } from "@/hooks/useTitle";
import useGetProductOption from "@/hooks/modules/useGetProductOption";
import { ResPagination } from "@/models";
import { inventoryReceiptApi } from "@/apis/inventoryReceipt";
import useAsync from "@/apis/useApi";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const TaoDonNhapHang = () => {
  useTitle("Tạo Phiếu Nhập Hàng");
  const navigate = useNavigate();
  const { dataList } = useGetProductOption({});

  const [receipt, setReceipt] = useState<Partial<InventoryReceipt>>({
    receiptNumber: `PN-${Date.now()}`,
    importDate: new Date(),
    supplierName: "",
    shopId: 1,
  });

  const [items, setItems] = useState<Partial<ReceiptItem>[]>([]);

  const { execute, data } = useAsync<ResPagination<InventoryReceipt>>(inventoryReceiptApi.create, {
    onSucess: (_) => {
      navigate(-1);
    },
    onFailed: (_error) => {},
  });

  const totalCost = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.quantity || 0) * (item.importPrice || 0), 0);
  }, [items]);

  const handleAddProduct = (optionId: number) => {
    const option = dataList.find((opt) => opt.id === optionId);
    if (!option) return;

    const existingIndex = items.findIndex((item) => item.productOptionId === optionId);
    if (existingIndex > -1) {
      const newItems = [...items];
      newItems[existingIndex].quantity = (newItems[existingIndex].quantity || 0) + 1;
      setItems(newItems);
      return;
    }

    const newItem: Partial<ReceiptItem> = {
      productOptionId: option.id,
      productOption: option,
      quantity: 1,
      importPrice: option.costPrice || 0,
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (index: number, field: keyof ReceiptItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      return message.error("Vui lòng thêm ít nhất một sản phẩm!");
    }

    const payload = {
      ...receipt,
      totalCost,
      items: items.map(({ productOption, ...rest }) => rest),
    };

    console.log("Dữ liệu gửi lên server:", payload);
    execute(payload);
    message.success("Lưu phiếu nhập hàng thành công!");
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productOption",
      key: "name",
      render: (opt: ProductOption) => (
        <div>
          <Flex>
            <Text strong>{opt.product.name}</Text>
            <Text> @{opt.name}</Text>
          </Flex>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Tồn hiện tại: {opt.stock}
          </Text>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
      render: (val: number, record: any, index: number) => (
        <InputNumber
          min={1}
          value={val}
          style={{ width: "100%" }}
          onChange={(v) => handleUpdateItem(index, "quantity", v)}
        />
      ),
    },
    {
      title: "Giá nhập (đ)",
      dataIndex: "importPrice",
      key: "importPrice",
      width: 180,
      render: (val: number, record: any, index: number) => (
        <InputNumber
          min={0}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          style={{ width: "100%" }}
          value={val}
          onChange={(v) => handleUpdateItem(index, "importPrice", v)}
        />
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      width: 150,
      render: (_: any, record: Partial<ReceiptItem>) => (
        <Text strong>{((record.quantity || 0) * (record.importPrice || 0)).toLocaleString()} đ</Text>
      ),
    },
    {
      title: "",
      key: "action",
      width: 50,
      render: (_: any, __: any, index: number) => (
        <Popconfirm title="Xóa dòng này?" onConfirm={() => handleRemoveItem(index)}>
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ margin: "0 auto", padding: "0px" }}>
      <Row gutter={[12, 12]}>
        <Col span={16}>
          <Card>
            {/* Thông tin chung */}
            <Space vertical style={{ width: "100%" }} size="large">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <Text>Mã phiếu nhập</Text>
                  <Input
                    value={""}
                    disabled
                    onChange={(e) => setReceipt({ ...receipt, receiptNumber: e.target.value })}
                  />
                </div>
                <div>
                  <Text>Nhà cung cấp</Text>
                  <Input
                    placeholder="Tên nhà cung cấp"
                    onChange={(e) => setReceipt({ ...receipt, supplierName: e.target.value })}
                  />
                </div>
              </div>

              {/* Ô tìm kiếm sản phẩm */}
              <div style={{ background: "#f5f5f5", padding: "16px", borderRadius: "8px" }}>
                <Text strong>Thêm sản phẩm vào phiếu:</Text>
                <Select
                  showSearch
                  style={{ width: "100%", marginTop: 8 }}
                  placeholder="Gõ tên sản phẩm để tìm..."
                  optionFilterProp="children"
                  onChange={handleAddProduct}
                  value={null} // Reset sau khi chọn
                >
                  {dataList.map((opt) => (
                    <Select.Option key={opt.id} value={opt.id}>
                      <Flex>
                        <Flex vertical>
                          <Text>{opt.product.name}</Text>
                          <Text className="text-gray-400 text-xs">@({opt.name})</Text>
                        </Flex>
                        <Text className="ml-2"> - (Giá vốn: {opt.costPrice?.toLocaleString()}đ)</Text>
                      </Flex>
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {/* Bảng Items */}
              <Table
                dataSource={items}
                columns={columns}
                rowKey={(record, index) => index?.toString() || ""}
                pagination={false}
                locale={{ emptyText: "Chưa có sản phẩm nào được chọn" }}
              />

              {/* Tổng kết tiền */}
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <div className=" p-4 bg-white">
            <div style={{ textAlign: "right", padding: "16px" }}>
              <Flex vertical gap={12}>
                <Flex justify="space-between">
                  <Text style={{ fontSize: 16 }}>Tổng số mặt hàng:</Text>
                  <Text strong>{items.length}</Text>
                </Flex>
                <Flex justify="space-between" align="end">
                  <Text style={{ fontSize: 20 }}>Tổng cộng:</Text>
                  <Text strong>{totalCost.toLocaleString()} đ</Text>
                </Flex>
              </Flex>
            </div>
            <Button type="primary" size="large" icon={<SaveOutlined />} block onClick={handleSubmit}>
              Xác nhận nhập kho
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default React.memo(TaoDonNhapHang);
