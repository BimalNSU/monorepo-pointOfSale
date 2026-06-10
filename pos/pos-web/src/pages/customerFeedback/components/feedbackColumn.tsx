import { CustomerFeedback, WithId } from "@pos/shared-models";
import {
  Avatar,
  Button,
  Col,
  Descriptions,
  Divider,
  Rate,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { FeedbackRow } from "../feedback.type";
import { StarOutlined, UserOutlined } from "@ant-design/icons";
const { Text } = Typography;

export const feedbackColumns = (
  onView: (feedback: FeedbackRow) => void,
): ColumnsType<FeedbackRow> => [
  {
    dataIndex: "mobileIndex",
    key: "mobileIndex",
    render: (_, record) => (
      <>
        <Row justify="space-between" align="top">
          <Col>
            <Space>
              <Avatar
                icon={<StarOutlined />}
                style={{
                  backgroundColor: "#faad14",
                }}
              />
              <div>
                <div style={{ fontWeight: 500 }}>{record.customerName}</div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  #{record.id} · {record.createdAt}
                </div>
              </div>
            </Space>
          </Col>
        </Row>
        <div style={{ marginTop: 10 }} onClick={(e) => e.stopPropagation()}>
          <Text strong style={{ marginRight: "3px" }}>
            Mobile:
          </Text>
          <a href={`tel:${record.mobile}`} style={{ color: "#1677ff" }}>
            {record.mobile}
          </a>
        </div>

        <Divider orientation="horizontal">Ratings</Divider>

        <Space orientation="vertical" size={12} style={{ width: "100%" }}>
          <div>
            🛍️ Collection: <Rate disabled value={record.collection} />
          </div>
          <div>
            💰 Value for Money: <Rate disabled value={record.valueForMoney} />
          </div>
          <div>
            😊 Staff Service: <Rate disabled value={record.staffService} />
          </div>
          <div>
            🏪 Store Ambience: <Rate disabled value={record.storeAmbience} />
          </div>
        </Space>
      </>
    ),
    responsive: ["xs"],
  },
  {
    title: "Customer",
    dataIndex: "customerName",
    width: 180,
    responsive: ["md", "lg", "xl", "xxl"],
  },
  {
    title: "Mobile",
    dataIndex: "mobile",
    width: 140,
    responsive: ["md", "lg", "xl", "xxl"],
  },
  {
    title: "Collection",
    dataIndex: "collection",
    width: 120,
    render: (value: number) => <Rate disabled value={value} />,
    responsive: ["md", "lg", "xl", "xxl"],
  },
  {
    title: "Value",
    dataIndex: "valueForMoney",
    width: 120,
    render: (value: number) => <Rate disabled value={value} />,
    responsive: ["md", "lg", "xl", "xxl"],
  },
  {
    title: "Staff",
    dataIndex: "staffService",
    width: 120,
    render: (value: number) => <Rate disabled value={value} />,
    responsive: ["md", "lg", "xl", "xxl"],
  },
  {
    title: "Ambience",
    dataIndex: "storeAmbience",
    width: 120,
    render: (value: number) => <Rate disabled value={value} />,
    responsive: ["md", "lg", "xl", "xxl"],
  },
  {
    title: "Avg Rating",
    width: 120,
    render: (_, record) => {
      const avg =
        (record.collection + record.valueForMoney + record.staffService + record.storeAmbience) / 4;

      let color = "red";

      if (avg >= 4.5) color = "green";
      else if (avg >= 3.5) color = "gold";

      return <Tag color={color}>{avg.toFixed(1)}</Tag>;
    },
    responsive: ["md", "lg", "xl", "xxl"],
  },
  {
    title: "Submitted",
    dataIndex: "createdAt",
    width: 140,
    render: (value: string) => dayjs(value).format("DD MMM YYYY"),
    responsive: ["md", "lg", "xl", "xxl"],
  },
  {
    title: "Actions",
    width: 100,
    fixed: "right",
    render: (_, record) => (
      <Space>
        <Button type="link" onClick={() => onView(record)}>
          View
        </Button>
      </Space>
    ),
    responsive: ["md", "lg", "xl", "xxl"],
  },
];
