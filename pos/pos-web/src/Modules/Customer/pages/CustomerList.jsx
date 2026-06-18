import { Button, Card, Col, Modal, notification, Row } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import CustomerService from "@/service/customer.service";
import { useFirestore } from "reactfire";
import { useEffect, useMemo, useState } from "react";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";
import { useDebounce } from "react-use";
import { USER_ROLE } from "@pos/shared-models";
import dayjs from "dayjs";
import styles from "../../../posButton.module.css";
import customAntdStyles from "../../../customAntd.module.css";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
import CustomerToolbar from "./components/CustomerToolbar";
import TablePagination from "@/components/TablePagination/TablePagination";
import CustomerTable from "./components/CustomerTable";
import { useCustomers } from "../hooks/useCustomers";
import { PlusOutlined } from "@ant-design/icons";

const { confirm } = Modal;
const DEFAULT_PAGE_SIZE = 10;

const CustomerList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("limit") || DEFAULT_PAGE_SIZE);
  const searchTerm = searchParams.get("q");
  const { status, data } = useCustomers({ isDeleted: false });

  const { userId: authUserId, session } = useFirebaseAuth();
  const db = useFirestore();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const customerService = useMemo(() => new CustomerService(db), [db]);
  useDebounce(
    () => {
      if (!data?.length) {
        setFilteredCustomers([]);
        return;
      }
      const lowerSearch = searchTerm?.toLowerCase();
      const result = [];
      for (const c of data) {
        if (
          !lowerSearch ||
          (lowerSearch &&
            (c.id.includes(lowerSearch) ||
              c.firstName.toLowerCase().includes(lowerSearch) ||
              c.mobile.includes(lowerSearch) ||
              c.email?.toLowerCase().includes(lowerSearch)))
        ) {
          const { createdAt, ...rest } = c;
          result.push({ ...rest, createdAt: dayjs(createdAt).format(DATE_TIME_FORMAT), key: c.id });
        }
      }
      setFilteredCustomers(result);
    },
    500,
    [data, searchTerm],
  );
  useEffect(() => {
    setSelectedRowKeys([]);
  }, [filteredCustomers]);
  const paginatedCustomers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, page, pageSize]);

  const handleRemoveCustomer = async (record) => {
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
  const handleRestoreCustomer = async (record) => {
    confirm({
      title: `Are you sure, want to restore this customer?`,
      async onOk() {
        try {
          await customerService.restore(record.id, authUserId);
        } catch (err) {
          notification.error({ title: "Restore failed" });
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
          setSelectedRowKeys([]);
        } catch (err) {
          notification.error({ title: "Fail to delete", duration: 2 });
        }
      },
    });
  };

  const handleBulkExport = () => {
    const selectedCustomers = filteredCustomers.filter((c) => selectedRowKeys.includes(c.id));

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
          total={filteredCustomers.length}
          onChange={(p) => updateParams({ page: p, pageSize, searchTerm })}
          size="small"
          showSizeChanger={false}
        />
      </div> */}
      <CustomerToolbar
        isAdmin={session?.role === USER_ROLE.VALUES.Admin}
        searchTerm={searchTerm}
        selectedRow={selectedRowKeys.length}
        onSearch={(value) =>
          updateParams({ page: 1, pageSize: DEFAULT_PAGE_SIZE, searchTerm: value })
        }
        onDelete={handleBulkDelete}
        onExport={handleBulkExport}
      />
      <CustomerTable
        isAdmin={session?.role === USER_ROLE.VALUES.Admin}
        data={paginatedCustomers}
        status={status}
        searchTerm={searchTerm}
        selectedRowKeys={selectedRowKeys}
        onSelectionChange={setSelectedRowKeys}
        onDelete={handleRemoveCustomer}
        onRestore={handleRestoreCustomer}
      />

      <TablePagination
        meta={{ page, pageSize, itemCount: filteredCustomers.length }}
        label="customers"
        onChange={handleChangePagination}
      />
    </Card>
  );
};
export default CustomerList;
