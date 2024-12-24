import { Form } from "antd";
type Unit = {
  id: string;
  name: string;
  rent: number;
};
interface Props {
  data: Unit;
}
const UnitDataShow: React.FC<Props> = ({ data }) => {
  return (
    <Form.Item
      key={data.id}
      label={
        <>
          Rent (unit) - <b> {data.name} </b>
        </>
      }
      required
    >
      {data.rent} BDT
    </Form.Item>
  );
};
export default UnitDataShow;
