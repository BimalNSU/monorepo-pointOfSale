import { useShop } from "@/api/useShop";

const DisplayShop = ({ shopId }) => {
  const { status, data } = useShop(shopId);
  if (status === "loading") {
    return <p>Loading ... </p>;
  }
  return <span>{data.name}</span>;
};

export default DisplayShop;
