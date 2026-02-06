import { Button, Card, Modal, Space, Table, Typography } from "antd";
import { useProducts } from "@/api/useProducts";
import { USER_ROLE } from "@/constants/role";
import { Link } from "react-router-dom";
import { DeleteOutlined, PrinterOutlined } from "@ant-design/icons";
import { convertToBD } from "@/constants/currency";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import ProductService from "@/service/product.service";
import { useFirestore } from "reactfire";
import { useMemo, useState } from "react";
import PrintBarcodeLabel from "@/components/barcodeLabel/printBarcodeLabel";
const { Text } = Typography;
const { confirm } = Modal;

const Products = () => {
  const { userId, session } = useFirebaseAuth();
  const db = useFirestore();
  const productService = new ProductService(db);
  const [selectedProduct, setSelectedProduct] = useState();
  const { status, data } = useProducts();

  const products = useMemo(() => data?.map((p) => ({ ...p, key: p.id })) ?? [], [data]);

  const handleDeleteProduct = (e, record) => {
    e.preventDefault();
    confirm({
      title: `Are you sure to delete the product?`,
      async onOk() {
        await productService.delete(record.id, userId);
      },
    });
  };
  const openLabelModal = (selectedProduct) => {
    setSelectedProduct(selectedProduct);
  };
  const renderValueCell = (text, record) => (
    <Link
      to={{ pathname: `/products/${record.id}` }}
      style={{
        color: "black",
        textDecoration: "none",
      }}
    >
      {record.isDeleted ? <Text type="danger">{text}</Text> : text}
    </Link>
  );
  const columns = [
    {
      dataIndex: "mobileIndex",
      key: "mobileIndex",
      render: (text, record) => (
        <div>
          <Link
            to={{ pathname: `/products/${record.id}` }}
            style={{
              color: "black",
              textDecoration: "none",
            }}
          >
            <Text strong>No#:</Text> {record.id}
            <br />
            <Text strong>Date:</Text> {record.createdAt}
            <br />
            <Text strong>Name:</Text> {record.name}
            <br />
            <Text strong>Description:</Text> {record.description ?? "N/A"}
            <br />
            <Text strong>Qty:</Text> {record.qty}
            <br />
            <Text strong>Purchase Rate:</Text>{" "}
            {record.purchaseRate ? convertToBD(record.purchaseRate) : record.purchaseRate}
            <br />
            <Text strong>Sales Rate:</Text> {convertToBD(record.salesRate)}
          </Link>
          {USER_ROLE.VALUES.Admin === session.role && (
            <div>
              <Text strong>Action:</Text>{" "}
              <span>
                <DeleteOutlined
                  onClick={(e) => {
                    handleDeleteProduct(e, record);
                  }}
                />
              </span>
            </div>
          )}
        </div>
      ),
      responsive: ["xs"],
    },
    {
      title: "#",
      dataIndex: "id",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Name",
      dataIndex: "name",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text, record) => renderValueCell(text ?? "N/A", record),
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Qty",
      dataIndex: "qty",
      render: renderValueCell,
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Purchase Rate",
      dataIndex: "purchaseRate",
      align: "right",
      render: (text, record) => (text ? renderValueCell(convertToBD(text), record) : text),
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Sales Rate",
      dataIndex: "salesRate",
      align: "right",
      render: (text, record) => {
        const amountBDT = convertToBD(text);
        return renderValueCell(amountBDT, record);
      },
      responsive: ["md", "lg", "xl", "xxl"],
    },
  ];
  if (session.role === USER_ROLE.VALUES.Admin) {
    columns.push({
      title: "Action",
      align: "center",
      render: (_, record) => (
        <Space size={10}>
          <Button size="small" icon={<PrinterOutlined />} onClick={() => openLabelModal(record)} />
          <span>
            <DeleteOutlined
              onClick={(e) => {
                handleDeleteProduct(e, record);
              }}
            />
          </span>
        </Space>
      ),
      responsive: ["md", "lg", "xl", "xxl"],
    });
  }
  return (
    <Card
      title="Product List"
      bordered={false}
      style={{
        // width: 300,
        margin: "10px",
      }}
    >
      <Table
        size="small"
        loading={status === "loading"}
        columns={columns}
        dataSource={products}
        // rowSelection={{
        //   type: "checkbox",
        //   ...rowSelection,
        // }}
        // onChange={onChange}
      />
      <PrintBarcodeLabel product={selectedProduct} reset={() => setSelectedProduct(null)} />
    </Card>
  );
};
export default Products;
