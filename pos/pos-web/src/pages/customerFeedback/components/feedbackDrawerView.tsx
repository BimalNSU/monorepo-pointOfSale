import { Drawer, Descriptions, Rate, Typography } from "antd";
import { FeedbackRow } from "../feedback.type";

const { Paragraph } = Typography;

interface Props {
  open: boolean;
  feedback?: FeedbackRow;
  onClose: () => void;
}

export function FeedbackDrawer({ open, feedback, onClose }: Props) {
  if (!feedback) return null;

  return (
    <Drawer title="Customer Feedback" width={700} open={open} onClose={onClose}>
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Customer">{feedback.customerName}</Descriptions.Item>

        <Descriptions.Item label="Mobile">{feedback.mobile}</Descriptions.Item>

        <Descriptions.Item label="Collection">
          <Rate disabled value={feedback.collection} />
        </Descriptions.Item>

        <Descriptions.Item label="Value for Money">
          <Rate disabled value={feedback.valueForMoney} />
        </Descriptions.Item>

        <Descriptions.Item label="Staff Service">
          <Rate disabled value={feedback.staffService} />
        </Descriptions.Item>

        <Descriptions.Item label="Store Ambience">
          <Rate disabled value={feedback.storeAmbience} />
        </Descriptions.Item>

        <Descriptions.Item label="Why visit again?">
          <Paragraph>{feedback.revisitReason}</Paragraph>
        </Descriptions.Item>

        <Descriptions.Item label="Improvement Suggestion">
          <Paragraph>{feedback.improvement || "-"}</Paragraph>
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
}
