import { Form } from "antd";

interface Props {
  amount?: number;
}

const ServiceChargeDataShow: React.FC<Props> = ({ amount }) => {
  return (
    <Form.Item label={"Service charge"} required>
      {amount} BDT
    </Form.Item>
  );
};
export default ServiceChargeDataShow;
