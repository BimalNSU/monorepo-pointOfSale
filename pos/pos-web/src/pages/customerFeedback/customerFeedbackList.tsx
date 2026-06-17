import { Button, Col, Form, Input, Pagination, Row, Select, Table } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCustomerFeedbacks } from "@/api/useCustomerFeedbacks";
import { feedbackColumns } from "./components/feedbackColumn";
import { FeedbackDrawer } from "./components/feedbackDrawerView";
import { FeedbackRow } from "./feedback.type";
import FeedbackSummaryBar from "./components/feedbackSummaryBar";
import CustomDateRangePicker from "./components/customDateRangePicker";
import dayjs from "dayjs";
import { useDebounce } from "react-use";
import { DATE_TIME_FORMAT } from "@/constants/dateFormat";
import * as validator from "../../utils/Validation/Validation";

const CustomerFeedbackList = () => {
  const navigate = useNavigate();
  const [searchForm] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const startDateStr = searchParams.get("startDate");
  const startDate = startDateStr ? dayjs(startDateStr, "YYYY-MM-DD") : null;
  const endDateStr = searchParams.get("endDate");
  const endDate = startDateStr && endDateStr ? dayjs(endDateStr, "YYYY-MM-DD") : null;
  const searchTerm = searchParams.get("q");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRow | undefined>();
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<FeedbackRow[]>();

  const handleView = (feedback: FeedbackRow) => {
    setSelectedFeedback(feedback);
    setDrawerOpen(true);
  };

  const { status, data: feedbacks } = useCustomerFeedbacks();

  useEffect(() => {
    searchForm.setFieldsValue({
      startDate,
      endDate,
      searchTerm,
    });
  }, [startDateStr, endDateStr, searchTerm]);
  useDebounce(
    () => {
      if (!feedbacks?.length) {
        setFilteredFeedbacks([]);
        return;
      }
      const lowerSearch = searchTerm?.toLowerCase();
      const result = [];
      for (const f of feedbacks) {
        const createdAtDayjs = dayjs(f.createdAt as Date);
        const matchesDate =
          (!startDateStr || !createdAtDayjs.isBefore(startDate, "day")) &&
          (!endDateStr || !createdAtDayjs.isAfter(endDate, "day"));

        if (
          matchesDate &&
          (!lowerSearch ||
            f.customerName.toLowerCase().includes(lowerSearch) ||
            f.mobile.includes(lowerSearch))
        ) {
          const { createdAt, ...rest } = f;
          result.push({
            ...rest,
            createdAt: dayjs(createdAt as Date).format(DATE_TIME_FORMAT),
            key: f.id,
          });
        }
      }
      setFilteredFeedbacks(result);
    },
    500,
    [feedbacks, startDate, endDate, searchTerm],
  );
  const paginatedFeedbacks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFeedbacks?.slice(start, start + pageSize) || [];
  }, [filteredFeedbacks, currentPage, pageSize]);

  const highlightText = useCallback(
    (text: string) => {
      if (!searchTerm || !text) return text;

      const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
      return String(text)
        .split(regex)
        .map((part, index) =>
          regex.test(part) ? (
            <span
              key={index}
              style={{
                backgroundColor: "#ffc069",
                padding: "0 2px",
                borderRadius: 2,
              }}
            >
              {part}
            </span>
          ) : (
            part
          ),
        );
    },
    [searchTerm],
  );
  const updateParams = (queryFilters: any) => {
    const queryParams = new URLSearchParams(searchParams);

    queryFilters.startDate
      ? queryParams.set("startDate", queryFilters.startDate)
      : queryParams.delete("startDate");

    queryFilters.startDate && queryFilters.endDate
      ? queryParams.set("endDate", queryFilters.endDate)
      : queryParams.delete("endDate");

    queryFilters.searchTerm
      ? queryParams.set("q", queryFilters.searchTerm)
      : queryParams.delete("q");

    queryFilters.page ? queryParams.set("page", queryFilters.page) : queryParams.delete("page");

    queryFilters.pageSize
      ? queryParams.set("pageSize", queryFilters.pageSize)
      : queryParams.delete("pageSize");

    setSearchParams(queryParams);
  };
  const onFinish = (values: any) => {
    updateParams({
      page: currentPage,
      pageSize,
      searchTerm: values.searchTerm,
      startDate: values.startDate?.format("YYYY-MM-DD"),
      endDate: values.endDate?.format("YYYY-MM-DD"),
    });
  };
  const handlePagination = (page: number, pageSize: number) => {
    updateParams({
      page,
      pageSize,
      searchTerm,
      startDate: startDateStr,
      endDate: endDateStr,
    });
  };
  return (
    <>
      <div style={{ margin: "8px 8px  8px 0" }}>
        <FeedbackSummaryBar data={filteredFeedbacks} />
      </div>
      <Form form={searchForm} onFinish={onFinish}>
        <Row gutter={[16, 8]}>
          <Col>
            <CustomDateRangePicker />
          </Col>
          <Col>
            <Form.Item
              name="searchTerm"
              rules={[{ whitespace: true, message: validator.BLANK_SPACE_MESSAGE }]}
            >
              <Input placeholder="Search by name, mobile" allowClear />
            </Form.Item>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit" block>
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      <Table
        size="small"
        loading={status === "loading"}
        columns={feedbackColumns(handleView, highlightText)}
        dataSource={paginatedFeedbacks}
        pagination={false}
        rowKey="id"
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          margin: "8px 8px 0 8px",
        }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredFeedbacks?.length}
          onChange={handlePagination}
          size="small"
          showSizeChanger
          // simple={isMobile}
          // style={{
          //   width: isMobile ? "50%" : "auto",
          //   textAlign: isMobile ? "right" : "right",
          // }}
        />
      </div>
      <FeedbackDrawer
        open={drawerOpen}
        feedback={selectedFeedback}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedFeedback(undefined);
        }}
      />
    </>
  );
};
export default CustomerFeedbackList;
