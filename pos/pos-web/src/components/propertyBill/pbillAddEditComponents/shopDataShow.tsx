import { Form } from "antd";
type Shop = {
  id: string;
  name: string;
  rent: number;
};
interface Props {
  data: Shop;
}
const ShopDataShow: React.FC<Props> = ({ data }) => {
  return (
    <Form.Item
      key={data.id}
      label={
        <>
          Rent (shop) - <b> {data.name} </b>
        </>
      }
      required
    >
      {data.rent} BDT
    </Form.Item>
  );
};
export default ShopDataShow;
