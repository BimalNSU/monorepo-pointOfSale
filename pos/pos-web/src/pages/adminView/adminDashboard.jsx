import { Card, Col, Row, Statistic, List, Avatar, Select, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isBetween from "dayjs/plugin/isBetween";
import CustomerMeasurementChart from "./customerMeasurementChart";
import { useCustomers } from "@/api/useCustomers";
import Loading from "@/components/loading";
import ResponsiveDateFilter from "./responsiveDateFilter";

dayjs.extend(isoWeek);
dayjs.extend(isBetween);
const AdminDashboard = () => {
  const { status, data } = useCustomers({ isDeleted: false });

  const [dateFilter, setDateFilter] = useState("today");
  const [customRange, setCustomRange] = useState([null, null]);

  // 🔥 Filtered Customers By Date
  const filteredCustomers = useMemo(() => {
    if (!data?.length) return [];

    if (dateFilter === "today") return data;

    const now = dayjs();

    return data.filter((customer) => {
      const created = dayjs(customer.createdAt);

      switch (dateFilter) {
        case "this_week":
          return created.isBetween(now.startOf("isoWeek"), now.endOf("isoWeek"), null, "[]");

        case "last_week":
          const lastWeekStart = now.subtract(1, "week").startOf("isoWeek");
          const lastWeekEnd = now.subtract(1, "week").endOf("isoWeek");

          return created.isBetween(lastWeekStart, lastWeekEnd, null, "[]");

        case "this_month":
          return created.month() === now.month() && created.year() === now.year();

        case "last_6_months":
          return created.isAfter(now.subtract(6, "month"));

        case "this_year":
          return created.year() === now.year();

        case "custom":
          if (!customRange?.[0] || !customRange?.[1]) return true;

          return created.isBetween(
            customRange[0].startOf("day"),
            customRange[1].endOf("day"),
            null,
            "[]",
          );

        default:
          return true;
      }
    });
  }, [data, dateFilter, customRange]);

  const stats = useMemo(() => {
    if (!filteredCustomers?.length) return { total: 0, byUser: [] };

    const grouped = {};

    filteredCustomers.forEach((customer) => {
      const user = customer.addedBy;
      grouped[user] = (grouped[user] || 0) + 1;
    });

    return {
      total: filteredCustomers.length,
      byUser: Object.entries(grouped).map(([userId, count]) => ({
        userId,
        count,
      })),
    };
  }, [filteredCustomers]);

  if (status === "loading") return <Loading />;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card
          title="Customer Statistics"
          extra={
            <Space>
              <Select
                value={dateFilter}
                onChange={setDateFilter}
                style={{ width: 180 }}
                options={[
                  { value: "today", label: "Today" },
                  { value: "this_week", label: "This Week" },
                  { value: "last_week", label: "Last Week" },
                  { value: "this_month", label: "This Month" },
                  { value: "last_6_months", label: "Last 6 Months" },
                  { value: "custom", label: "Custom" },
                ]}
              />

              {dateFilter === "custom" && (
                <ResponsiveDateFilter customRange={customRange} setCustomRange={setCustomRange} />
              )}
            </Space>
          }
        >
          <Statistic title="Total Customers" value={stats.total} style={{ marginBottom: 24 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {stats.byUser.map((item) => (
              <div
                key={item.userId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "4px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <UserOutlined style={{ fontSize: 20, color: "#1890ff" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>User: {item.userId}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{item.count} customers</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <CustomerMeasurementChart customers={filteredCustomers} />
      </Col>
    </Row>
  );
};

export default AdminDashboard;
