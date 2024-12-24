import { Row } from "antd";
import { version } from "../../package.json";

export const AppVersion = () => {
  return <Row justify="end"> v{version}</Row>;
};
