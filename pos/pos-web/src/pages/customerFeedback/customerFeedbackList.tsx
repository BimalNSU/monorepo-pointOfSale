import { Button, Select, Space, Table } from "antd";
import { useSearchParams } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useCustomerFeedbacksPaginated } from "@/api/useCustomerFeedbacksPaginated";
import { feedbackColumns } from "./components/feedbackColumn";
import { FeedbackDrawer } from "./components/feedbackDrawerView";
import { FeedbackRow } from "./feedback.type";

const CustomerFeedbackList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageSize, setPageSize] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRow | undefined>();

  const handleView = (feedback: FeedbackRow) => {
    setSelectedFeedback(feedback);
    setDrawerOpen(true);
  };

  const {
    status,
    data: feedbacks,
    metaData,
    hasPreviousePage,
    hasNextPage,
    handleNextPage,
    handlePreviousPage,
  } = useCustomerFeedbacksPaginated(pageSize);

  const updateParams = (newParams: any) => {
    const params = new URLSearchParams(searchParams);

    if (newParams.page !== undefined) {
      params.set("page", String(newParams.page));
    }
    if (newParams.limit !== undefined) {
      params.set("limit", String(newParams.limit));
    }
    if (newParams.search !== undefined) {
      if (newParams.search === "") {
        params.delete("search"); // remove empty search
      } else {
        params.set("search", newParams.search);
      }
    }
    setSearchParams(params);
  };
  return (
    <>
      <div
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
        <Space orientation="horizontal">
          <Button
            icon={<LeftOutlined />}
            size="small"
            disabled={!hasPreviousePage}
            onClick={handlePreviousPage}
            type="text"
          />
          <Button
            icon={<RightOutlined />}
            size="small"
            disabled={!hasNextPage}
            onClick={handleNextPage}
            type="text"
          />
        </Space>
        <Select
          value={pageSize}
          onChange={(value) => setPageSize(value)}
          options={[10, 20, 30, 50].map((item) => ({ value: item, label: item }))}
        />
      </div>
      <Table
        // title={() => (
        //   <Row gutter={[16, 10]} justify="space-between">
        //     <Col>
        //       <Input
        //         placeholder="Search by name, mobile or email"
        //         value={search}
        //         // onChange={(e) => setSearch(e.target.value)}
        //         onChange={(e) => updateParams({ page: 1, search: e.target.value })}
        //         allowClear
        //       />
        //       {/* <Search
        //         placeholder="Search customer"
        //         defaultValue={search}
        //         onSearch={(value) => updateParams({ page: 1, search: value })}
        //         style={{ width: 250, marginBottom: 16 }}
        //       /> */}
        //     </Col>
        //   </Row>
        // )}
        size="small"
        loading={status === "loading"}
        columns={feedbackColumns(handleView)}
        dataSource={feedbacks}
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
          onChange={(value) => setPageSize(value)}
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
        <FeedbackDrawer
          open={drawerOpen}
          feedback={selectedFeedback}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedFeedback(undefined);
          }}
        />
      </div>
    </>
  );
};
export default CustomerFeedbackList;
