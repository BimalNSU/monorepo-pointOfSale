import { useBkashTransactions } from "@/api/useBkashTransactions";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Select, Space, Table, Typography } from "antd";
import { useState } from "react";
const { Text } = Typography;

const BkashTransactions = () => {
  const [pageSize, setPageSize] = useState(10);
  const {
    status,
    data,
    metaData,
    hasPreviousePage,
    hasNextPage,
    handleNextPage,
    handlePreviousPage,
  } = useBkashTransactions();

  const columns = [
    {
      dataIndex: "mobileIndex",
      key: "mobileIndex",
      render: (_, record) => (
        <>
          <Row gutter={[16, 1]} justify="space-between">
            <Col span={24}>
              <Text strong>{`# `}</Text>
              <Text>{record.id}</Text>
            </Col>
            <Col span={24}>
              <Text strong>Date:</Text> {record.createdAt}
            </Col>
            <Col span={12}>
              <Text strong>Mobile:</Text> {record.customerMobile}
            </Col>
            <Col span={12}>
              <Text strong>Amount:</Text> {convertToBD(record.amount)}
            </Col>
          </Row>
          <Row gutter={[16, 1]} justify="space-between">
            <Col span={12}>
              <Text strong>status:</Text>
              {record.status}
            </Col>
            <Col span={12}>
              <Text strong>Ref#:</Text> {convertToBD(record.reference ?? "N/A")}
            </Col>
          </Row>
        </>
      ),
      responsive: ["xs"],
    },
    {
      title: "#",
      dataIndex: "id",
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Mobile",
      dataIndex: "customerMobile",
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Amount",
      dataIndex: "amount",
      align: "right",
      render: (text) => convertToBD(text),
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Ref#",
      dataIndex: "reference",
      align: "center",
      render: (text) => text ?? "N/A",
      responsive: ["md", "lg", "xl", "xxl"],
    },
  ];
  return (
    <Card title="Bkash Transactions" bordered={false} size="small">
      <Row justify="end" gutter={[16, 1]}>
        <Col>
          <Text>
            {metaData.pageSize * (metaData.pageNo - 1) + 1}-{metaData.pageSize * metaData.pageNo}
          </Text>
        </Col>
        <Col>
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
        </Col>
      </Row>
      <Table
        size="small"
        loading={status === "loading"}
        columns={columns}
        dataSource={data}
        // rowSelection={{
        //   type: "checkbox",
        //   ...rowSelection,
        // }}
        pagination={false}
        // onChange={onChange}
      />
    </Card>
  );
};
export default BkashTransactions;
