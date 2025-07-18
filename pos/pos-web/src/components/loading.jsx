import { Spin } from "antd";

const Loading = () => {
  return (
    <div style={{ position: "relative", minHeight: 200, padding: 20, border: "1px solid #ddd" }}>
      <Spin />
    </div>
  );
};
export default Loading;
