import { Button, Col, Form, InputNumber, Row, Space, Tooltip, Typography } from "antd";
import { useState } from "react";
const { Text } = Typography;

const InvoiceTotalDiscount = ({
  setTotalDiscount,
  totalDiscount,
  onPromptYes,
  isRequiredTooltip,
}) => {
  const [showPrompt, setShowPrompt] = useState();

  const handlePromptYesBtn = () => {
    setShowPrompt(false); //close prompt window
    onPromptYes();
  };
  const promptComponent = (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Text>Direct changes make reset individuals' discount fields. Will procced?</Text>
      </Col>
      <Col span={24}>
        <Space direction="horizontal">
          <Button onClick={() => handlePromptYesBtn()}>Yes</Button>
          <Button onClick={() => setShowPrompt(false)}>No</Button>
        </Space>
      </Col>
    </Row>
  );
  const handlePromptVisibility = () => {
    if (!isRequiredTooltip) {
      setShowPrompt(true);
    }
  };
  return (
    <div>
      <span>Total Discount: </span>
      <Tooltip
        // overlayStyle={{ maxWidth: "100%" }}
        title={promptComponent}
        open={showPrompt}
        color="white"
        trigger="click"
        placement="right"
        // autoAdjustOverflow={true}
      >
        <InputNumber
          controls={false}
          disabled={showPrompt}
          value={totalDiscount}
          // keyboard={true}
          // decimalSeparator={","}
          onChange={(value) => setTotalDiscount(value)}
          onClick={handlePromptVisibility}
          min={0}
        />
      </Tooltip>
    </div>
  );
};
export default InvoiceTotalDiscount;
