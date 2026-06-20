import { Button, Card, Col, Modal, notification, Row } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import CustomerService from "@/service/customer.service";
import { useFirestore } from "reactfire";
import { useMemo, useState } from "react";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { USER_ROLE } from "@pos/shared-models";
import styles from "../../../posButton.module.css";
import customAntdStyles from "../../../customAntd.module.css";
import CustomerToolbar from "./components/CustomerToolbar";
import TablePagination from "@/components/TablePagination/TablePagination";
import CustomerTable from "./components/CustomerTable";
import { PlusOutlined } from "@ant-design/icons";
import { useCustomersPaginated } from "../hooks/useCustomersPaginated";
import CustomerSelectionDrawer from "./components/CustomerSelectionDrawer";
const { confirm } = Modal;
const DEFAULT_PAGE_SIZE = 10;

const CustomerList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("limit") || DEFAULT_PAGE_SIZE);
  const searchTerm = searchParams.get("q");
  const {
    status,
    data: customers,
    itemCount,
  } = useCustomersPaginated({ page, pageSize, searchTerm });

  const { userId: authUserId, session } = useFirebaseAuth();
  const db = useFirestore();
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const customerService = useMemo(() => new CustomerService(db), [db]);

  const selectedRowKeys = useMemo(() => selectedCustomers.map((r) => r.id), [selectedCustomers]);

  const handleSoftDeleteCustomer = async (record) => {
    confirm({
      title: `Are you sure you want to delete this customer?`,
      async onOk() {
        try {
          await customerService.softDelete(record.id, authUserId);
        } catch (err) {
          notification.error({ title: "Delete failed" });
        }
      },
    });
  };

  const handleBulkDelete = () => {
    confirm({
      title: `Delete ${selectedRowKeys.length} customers?`,
      async onOk() {
        try {
          await customerService.softDeletes(selectedRowKeys, authUserId);
          notification.success({ title: "Selected customers deleted successfully", duration: 2 });
          setSelectedCustomers([]);
          setDrawerOpen(false);
        } catch (err) {
          notification.error({ title: "Fail to delete", duration: 2 });
        }
      },
    });
  };

  const handleBulkExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["ID", "Name", "Mobile", "Email"],
        ...selectedCustomers.map((c) => [c.id, c.firstName, c.mobile, c.email ?? ""]),
      ]
        .map((e) => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
  };

  const updateParams = (newParams) => {
    const params = new URLSearchParams(searchParams);

    newParams.searchTerm ? params.set("q", newParams.searchTerm) : params.delete("q");
    newParams.page ? params.set("page", newParams.page) : params.delete("page");
    newParams.pageSize ? params.set("limit", newParams.pageSize) : params.delete("limit");

    setSearchParams(params);
  };

  const handleChangePagination = (page, pageSize) => {
    updateParams({
      page,
      pageSize,
      searchTerm,
    });
  };
  const handleSelectRow = (_, nSelectedCustomers) => {
    setSelectedCustomers(nSelectedCustomers);
  };
  const handleAllSelectedRowsClear = () => {
    setSelectedCustomers([]);
    setDrawerOpen(false);
  };
  const handleRemoveSelectedCustomers = (removeCustomerId) => {
    setSelectedCustomers((prev) => prev.filter((u) => u.id !== removeCustomerId));
  };
  return (
    <Card
      title={
        <Row justify="space-between">
          <Col style={{ fontSize: "16px" }}>Customer List</Col>
          <Col>
            <Link to="/customers/add">
              <Button className={styles.posBtn} icon={<PlusOutlined />}>
                Add Customer
              </Button>
            </Link>
          </Col>
        </Row>
      }
      variant="borderless"
      className={customAntdStyles.mobileCardBody}
    >
      {/* <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          margin: "3px 8px 0 0",
        }}
      >
        <Pagination
          current={page}
          pageSize={pageSize}
          total={itemCount}
          onChange={(p) => updateParams({ page: p, pageSize, searchTerm })}
          size="small"
          showSizeChanger={false}
        />
      </div> */}
      <CustomerToolbar
        isAdmin={session?.role === USER_ROLE.VALUES.Admin}
        searchTerm={searchTerm}
        selectedNumbers={selectedRowKeys.length}
        onSearch={(value) =>
          updateParams({ page: 1, pageSize: DEFAULT_PAGE_SIZE, searchTerm: value })
        }
        onSelectPreview={(value) => setDrawerOpen(value)}
      />

      <CustomerTable
        isAdmin={session?.role === USER_ROLE.VALUES.Admin}
        data={customers}
        status={status}
        searchTerm={searchTerm}
        selectedRowKeys={selectedRowKeys}
        onSelectionChange={handleSelectRow}
        onDelete={handleSoftDeleteCustomer}
      />

      <TablePagination
        meta={{ page, pageSize, itemCount }}
        label="customers"
        onChange={handleChangePagination}
      />

      <CustomerSelectionDrawer
        open={drawerOpen}
        customers={selectedCustomers}
        onClose={() => setDrawerOpen(false)}
        onRemove={handleRemoveSelectedCustomers}
        onClearAll={handleAllSelectedRowsClear}
        onExport={handleBulkExport}
        onDelete={handleBulkDelete}
      />
    </Card>
  );
};
export default CustomerList;
