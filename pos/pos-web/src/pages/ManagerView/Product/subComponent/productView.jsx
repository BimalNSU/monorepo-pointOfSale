import { convertToBD } from "@/constants/currency";
import { Descriptions } from "antd";

const ProductView = ({ product }) => {
  const items = [
    { key: "1", label: "Product ID", children: product.id },
    { key: "2", label: "Product Name", children: product.name },
    { key: "3", label: "Description", children: product.description ?? "N/A", span: 2 },
    {
      key: "4",
      label: "Cost Price",
      children: product.purchaseRate ? convertToBD(product.purchaseRate) : product.purchaseRate,
    },
    { key: "5", label: "Selling Price", children: convertToBD(product.salesRate) },
    { key: "6", label: "Stock Quantity", children: product.qty },
    { key: "7", label: "Unit of Measure", children: product.unit ?? "N/A" },
    { key: "8", label: "Main Category", children: product.category ?? "N/A" },
    { key: "9", label: "Brand", children: product.brand ?? "N/A" },
    { key: "10", label: "SKU Code", children: product.sku ?? "N/A" },
    { key: "11", label: "Barcode", children: product.barcode ?? "N/A" },
    { key: "12", label: "Status", children: product.status ?? "N/A" },
  ];
  return (
    <Descriptions
      column={2}
      // title={`User Info`}
      size="small"
      // extra={
      //   <Button onClick={onEdit} type="text">
      //     <EditOutlined />
      //   </Button>
      // }
      items={items}
    />
  );
};
export default ProductView;
