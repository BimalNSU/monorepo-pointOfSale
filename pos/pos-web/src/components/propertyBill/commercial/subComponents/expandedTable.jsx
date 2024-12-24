import { BILL_TYPE } from "@/constants/billsType";
import { Table } from "antd";
import { useMemo } from "react";

const columns = [
  {
    title: "Item Name",
    dataIndex: "name",
    key: "name",
    render: (text, record) => {
      return text;
    },
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
];
const ExpandedTable = ({ record }) => {
  const tableData = useMemo(() => {
    if (!record) return [];
    const {
      bills,
      shops,
      parkings,
      considerationAmount,
      agreementId,
      agreementType,
      serviceCharge,
    } = record;

    const shopsData =
      shops && agreementId
        ? shops.map((item) => ({ name: item.name, type: "Shop", amount: item.rent }))
        : [];
    const parkingsData =
      parkings && agreementId
        ? parkings.map((item) => ({ name: item.name, type: "Parking", amount: item.rent }))
        : [];
    // consideration , service charge
    const otherData = [];
    if (!(considerationAmount === null) && (agreementType === 4 || agreementType === 5)) {
      otherData.push({ name: "Consideration Amount", type: "N/A", amount: considerationAmount });
    }
    if (!(serviceCharge == null) && (agreementType === 1 || agreementType === 2)) {
      otherData.push({ name: "Service Charge", type: "N/A", amount: serviceCharge });
    }

    //render bills
    const billsArr = Object.entries(bills || {}).map((bill) => {
      // const id = bill[0];
      return {
        name: bill[1].name,
        type: BILL_TYPE[bill[1].type].text,
        amount: bill[1].amount,
      };
    });
    const data = [...shopsData, ...parkingsData, ...otherData, ...billsArr];
    return data.map((item, i) => ({ ...item, key: i }));
  }, [record]);

  return <Table columns={columns} dataSource={tableData} pagination={false} />;
};
export default ExpandedTable;
