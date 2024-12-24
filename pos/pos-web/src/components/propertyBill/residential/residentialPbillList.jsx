import { usePBillsResidential } from "@/api/usePBillsResidential";
import { useCustomAuth } from "@/utils/hooks/customAuth";
import { error } from "@/utils/Utils/Utils";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Col, Dropdown, Input, Menu, Modal, Row, Space, Spin, Table } from "antd";
import { useMemo, useState } from "react";
import { useFirestore } from "reactfire";
import ExpandedTable from "./subComponents/expandedTable";
import { useDebounce } from "react-use";
import ResidentialPbillEdit from "./residentialPbillEdit";
import ResidentialPbill from "@/service/propertyBill/residentialPbill.service";
const { confirm } = Modal;

const arrSum = (arr) => {
  return (
    arr?.reduce((pre, cur) => {
      return pre + cur?.rent || 0;
    }, 0) || 0
  );
};
const actionOptions = [
  {
    label: "Edit",
    key: "1",
    icon: <EditOutlined />,
  },
  {
    label: "Delete",
    key: "2",
    icon: <DeleteOutlined />,
  },
];

const ResidentialPBillList = ({ propertyId }) => {
  const { userId: authUserId } = useCustomAuth();
  const firestore = useFirestore();
  const residentialPbillObj = new ResidentialPbill(firestore);
  const [tableData, setTableData] = useState([]);
  const [editData, setEditData] = useState();

  const handleRemovePbill = async (pbillId) => {
    confirm({
      title: "Do you want to remove these items?",
      icon: <ExclamationCircleFilled />,
      // content: 'When clicked the OK button, this dialog will be closed after 1 second',
      async onOk() {
        try {
          await residentialPbillObj.remove(pbillId, authUserId);
        } catch {
          error("oops errors!");
          return;
        }
      },
      // onCancel() {},
    });
  };

  const columns = [
    {
      title: "Property Bill Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Unit & Parkings",
      dataIndex: "unitsParkings",
      key: "unitsParkings",
      // render: (text) => <span>{text ? text : "N/A"}</span>,
    },
    Table.EXPAND_COLUMN,
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      key: "action",
      title: "Action",
      dataIndex: "action",
      width: 90,
      fixed: "right",
      render: (text, record) => (
        <>
          <Dropdown
            key={record.key}
            menu={{
              items: actionOptions,
              onClick: async ({ key, keyPath, domEvent }) => {
                if (key.includes("1")) {
                  if (record.canMutate === "can") {
                    // edit
                    setEditData({ ...record });
                  } else {
                    error(record.canMutate);
                    setEditData(null);
                  }
                } else {
                  // delete
                  if (record.canMutate === "can") {
                    await handleRemovePbill(record.id);
                  } else {
                    error(record.canMutate);
                  }
                }
              },
            }}
          >
            <Button>
              <Space>
                Action
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </>
      ),
    },
  ];
  const { status, data: pBillList } = usePBillsResidential(authUserId, propertyId);

  const [searchInput, setSearchInput] = useState("");

  const onChangeSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  const processPBillList = useMemo(
    () =>
      pBillList?.map((item, key) => {
        const {
          bills,
          units,
          parkings,
          considerationAmount,
          agreementId,
          agreementType,
          serviceCharge,
        } = item;
        // unit and parking name together
        const numOfUnits = units?.length;
        const numOfParkings = parkings?.length;
        const unitNames = numOfUnits ? `Units: ${units.map((item) => item.name).join(", ")}` : "";
        const parkingNames = numOfParkings
          ? `Parkings: ${parkings.map((item) => item.name).join(", ")}`
          : "";
        const unitsParkings = `${unitNames}${
          numOfUnits && numOfParkings ? ", " : ""
        }${parkingNames} ${agreementId ? "(Tenant)" : "(Owner)"}`;
        // total bills
        const unitRent = arrSum(units);
        const parkingRent = arrSum(parkings);

        const totalBillAmount = Object.entries(bills || {}).reduce(
          (pre, curr) => pre + curr[1].amount,
          0,
        );
        const totalAmount =
          unitRent +
          parkingRent +
          totalBillAmount -
          (considerationAmount || 0) +
          (serviceCharge ? serviceCharge : 0);
        return { ...item, unitsParkings, key, totalAmount };
      }) || [],
    [pBillList],
  );

  useDebounce(
    () => {
      const pattern = new RegExp(`(${searchInput || ""})`, "i");
      const nTableData = !searchInput
        ? processPBillList
        : processPBillList
            .filter((item) => {
              return (
                pattern.test(item.month) ||
                pattern.test(item.unitsParkings) ||
                pattern.test(item.id)
              );
            })
            .map((item) => item);
      setTableData(nTableData);
    },
    300,
    [processPBillList, searchInput],
  );

  const handleResetEditView = () => {
    setEditData(null);
  };
  if (status === "loading") {
    return (
      <div className={`spin`}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={`border p-3 rounded`}>
      <Row justify="space-between">
        <Col>
          <Row gutter={[10, 1]}>
            <Col>
              <Input
                width={100}
                className="header-search"
                placeholder="Type here..."
                prefix={<SearchOutlined />}
                onChange={onChangeSearchInput}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <br />
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: (record) => {
            return <ExpandedTable record={record} />;
          },
        }}
        dataSource={tableData}
      />
      <ResidentialPbillEdit data={editData} onReset={handleResetEditView} />
    </div>
  );
};
export default ResidentialPBillList;
