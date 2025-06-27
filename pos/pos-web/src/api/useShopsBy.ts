import { FetchStatus, Shop as ShopModel, ShopId } from "@pos/shared-models";
import { useFirestore } from "reactfire";
import { useEffect, useState } from "react";
import { Shop } from "@/db-collections/shop.collection";

export const useShopsBy = (ids: ShopId[]) => {
  const db = useFirestore();
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [shops, setShops] = useState<ShopModel[] | null>();
  const shopObj = new Shop(db);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        setStatus("loading");
        const nShops = ids.length ? await shopObj.getListByIds(ids) : [];
        if (!abortController.signal.aborted) {
          setShops(nShops);
          setStatus("success");
        }
      } catch (e) {
        if (!abortController.signal.aborted) {
          setStatus("error");
          console.error("Failed to fetch shops:", e);
        }
      }
    };
    fetchData();
    return () => {
      abortController.abort();
    };
  }, [ids]);

  return { status, data: shops };
};
