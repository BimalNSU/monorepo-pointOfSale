import { Form } from "antd";
type Parking = {
  id: string;
  name: string;
  rent: number;
};
interface Props {
  data: Parking[];
}
const ParkingDataShow: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.map((parking: Parking) => {
        return (
          <Form.Item
            key={parking.id}
            label={
              <>
                Parking Charge - <b> {parking.name} </b>
              </>
            }
            required
          >
            {parking.rent} BDT
          </Form.Item>
        );
      })}
    </>
  );
};
export default ParkingDataShow;
