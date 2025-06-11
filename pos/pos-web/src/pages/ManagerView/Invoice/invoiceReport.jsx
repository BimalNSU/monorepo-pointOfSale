import { useInvoicesWithFilters } from "@/api/useInvoicesWithfilters";
import InvoiceListContainer from "@/components/Invoice/invoiceListContainer";
import { convertToBD } from "@/constants/currency";
import { DATE_FORMAT, QUERY_DATE_FORMAT } from "@/constants/dateFormat";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Form, Row, Table, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const { RangePicker } = DatePicker;
const { Text } = Typography;

const InvoiceReport = () => {
  const navigate = useNavigate();
  const [searchForm] = Form.useForm();
  //   const initalDateRange = { fromDate: dayjs().startOf("day"), toDate: dayjs().endOf("day") };
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fromDateStr = queryParams.get("fromDate");
  const toDateStr = queryParams.get("toDate");

  const filters = useMemo(() => {
    const fromDate = fromDateStr
      ? dayjs(fromDateStr, QUERY_DATE_FORMAT).startOf("day")
      : dayjs().startOf("day");
    const toDate = toDateStr
      ? dayjs(toDateStr, QUERY_DATE_FORMAT).endOf("day")
      : dayjs().endOf("day");
    return { fromDate, toDate };
  }, [fromDateStr, toDateStr]);

  const { status, data } = useInvoicesWithFilters(filters);

  useEffect(() => {
    searchForm.setFieldsValue({ dateRange: [filters.fromDate, filters.toDate] });
  }, [filters]);

  const updateUrlParams = (queryFilters) => {
    const queryParams = new URLSearchParams(location.search);

    // if (queryFilters.searchTerm) {
    //   queryParams.set("q", queryFilters.searchTerm);
    // } else {
    //   queryParams.delete("q");
    // }
    // if (queryFilters.status?.length) {
    //   queryParams.set("status", queryFilters.status.join(","));
    // } else {
    //   queryParams.delete("status");
    // }

    if (queryFilters.fromDate) {
      queryParams.set("fromDate", queryFilters.fromDate.format(QUERY_DATE_FORMAT));
    } else {
      queryParams.delete("fromDate");
    }

    if (queryFilters.toDate) {
      queryParams.set("toDate", queryFilters.toDate.format(QUERY_DATE_FORMAT));
    } else {
      queryParams.delete("toDate");
    }
    navigate(
      {
        pathname: window.location.pathname, // Keeps the current path
        search: queryParams.toString(), // Set the updated query params
      },
      { replace: true },
    ); // This replaces the current entry in the history stack
  };
  const onFinish = (values) => {
    const [fromDate, toDate] = values.dateRange || [];
    console.log(values);
    updateUrlParams({
      //   page: 1, //default
      //   pageSize: 10, //default
      //   status: values.status,
      //   searchTerm: values.searchTerm,
      fromDate,
      toDate,
    });
  };

  const rangePresets = [
    { label: "Today", value: [dayjs().startOf("day"), dayjs().endOf("day")] },
    {
      label: "Yesterday",
      value: [dayjs().add(-1, "d").startOf("day"), dayjs().add(-1, "d").endOf("day")],
    },
    {
      label: "Last 7 Days",
      value: [dayjs().add(-7, "d"), dayjs()],
    },
    {
      label: "Last 14 Days",
      value: [dayjs().add(-14, "d"), dayjs()],
    },
    {
      label: "Last 30 Days",
      value: [dayjs().add(-30, "d"), dayjs()],
    },
    {
      label: "Last 90 Days",
      value: [dayjs().add(-90, "d"), dayjs()],
    },
  ];

  return (
    <Card
      title="Invoice Report"
      bordered={false}
      style={{
        margin: "10px",
      }}
    >
      <Row gutter={[16, 1]} justify="space-between">
        <Col>
          <Form form={searchForm} onFinish={onFinish}>
            <Row gutter={[16, 1]}>
              <Col>
                <Form.Item name="dateRange">
                  <RangePicker format={DATE_FORMAT} presets={rangePresets} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button htmlType="submit" icon={<SearchOutlined />} iconPosition="end">
                    Search
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col>
          <Text strong>
            Total: {convertToBD(data?.reduce((pre, curr) => pre + curr.totalAmount, 0))}
          </Text>
        </Col>
      </Row>
      <InvoiceListContainer status={status} data={data} />
    </Card>
  );
};
export default InvoiceReport;
