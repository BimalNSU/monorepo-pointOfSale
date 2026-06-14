import { Button, Col, Form, Pagination, Row, Select, Table } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useCustomerFeedbacks } from "@/api/useCustomerFeedbacks";
import { feedbackColumns } from "./components/feedbackColumn";
import { FeedbackDrawer } from "./components/feedbackDrawerView";
import { FeedbackRow } from "./feedback.type";
import FeedbackSummaryBar from "./components/feedbackSummaryBar";
import CustomDateRangePicker from "./components/customDateRangePicker";
import dayjs from "dayjs";

const CustomerFeedbackList = () => {
  const navigate = useNavigate();
  const [searchForm] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRow | undefined>();

  const handleView = (feedback: FeedbackRow) => {
    setSelectedFeedback(feedback);
    setDrawerOpen(true);
  };

  const { status, data: feedbacks } = useCustomerFeedbacks();

  const paginatedFeedbacks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return feedbacks?.slice(start, start + pageSize);
  }, [feedbacks, currentPage, pageSize]);

  useEffect(() => {
    searchForm.setFieldsValue({
      startDate: startDate ? dayjs(startDate, "YYYY-MM-DD") : null,
      ...(startDate && endDate && { endDate: dayjs(endDate, "YYYY-MM-DD") }),
    });
  }, [startDate, endDate]);

  const updateParams = (queryFilters: any) => {
    const queryParams = new URLSearchParams(searchParams);

    // if (newParams.search !== undefined) {
    //   if (newParams.search === "") {
    //     params.delete("search"); // remove empty search
    //   } else {
    //     params.set("search", newParams.search);
    //   }
    // }
    queryFilters.startDate
      ? queryParams.set("startDate", queryFilters.startDate)
      : queryParams.delete("startDate");

    queryFilters.startDate || queryFilters.endDate
      ? queryParams.set("endDate", queryFilters.endDate)
      : queryParams.delete("endDate");

    queryFilters.searchTerm
      ? queryParams.set("q", queryFilters.searchTerm)
      : queryParams.delete("q");

    queryParams.set("page", queryFilters.page);
    queryParams.set("pageSize", queryFilters.pageSize);

    setSearchParams(queryParams);
  };
  const onFinish = (values: any) => {
    console.log(values);
    updateParams({
      page: currentPage,
      pageSize,
      startDate: values.startDate.format("YYYY-MM-DD"),
      endDate: values.endDate.format("YYYY-MM-DD"),
    });
  };
  return (
    <>
      <div style={{ margin: "8px 8px  8px 0" }}>
        <FeedbackSummaryBar data={feedbacks} />
      </div>
      <Form form={searchForm} onFinish={onFinish}>
        <Row gutter={[16, 8]}>
          <Col>
            <CustomDateRangePicker />
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
        columns={feedbackColumns(handleView)}
        dataSource={paginatedFeedbacks}
        pagination={false}
        rowKey="id"
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          margin: "8px 8px 0 8px",
        }}
      >
        {/* Page Size */}
        <Select
          size="middle"
          value={pageSize}
          onChange={(value) => updateParams({ page: 1, pageSize: value })}
          // style={{
          //   width: isMobile ? "45%" : 140,
          //   minWidth: 120,
          // }}
          options={[
            { value: 10, label: "10 / page" },
            { value: 20, label: "20 / page" },
            { value: 50, label: "50 / page" },
          ]}
        />
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={feedbacks?.length}
          onChange={(p) => updateParams({ page: p })}
          size="small"
          showSizeChanger={false}
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
