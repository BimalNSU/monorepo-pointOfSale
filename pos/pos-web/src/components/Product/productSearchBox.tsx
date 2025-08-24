import { useProducts } from "@/api/useProducts";
import { Product, ProductId, WithId } from "@pos/shared-models";
import { AutoComplete, Spin } from "antd";
import React, { useState } from "react";
type TypeProduct = Omit<WithId<Product>, "createdAt"> & { createdAt: string };
type Props = {
  onSelectMatchedItem: (data?: TypeProduct) => void;
};

const ProductSearchBox: React.FC<Props> = ({ onSelectMatchedItem }) => {
  const [searchItem, setSearchItem] = useState<ProductId>();
  const [matchedItems, setMatchedItems] = useState<Array<TypeProduct> | undefined>();
  const { status, data: products } = useProducts();

  const handleSearchItem = (text: string) => {
    if (text) {
      const pattern = new RegExp(`(${text})`, "i");
      const nMatchedProducts = products.filter((p) => pattern.test(p.id) || pattern.test(p.name));
      setMatchedItems(nMatchedProducts);
    } else {
      setMatchedItems(undefined);
    }
  };

  const onSelectItem = (itemId: ProductId) => {
    if (!matchedItems?.length) return;
    const selectedItem = matchedItems.find((p) => p.id === itemId);

    //reset search item & it's result
    setSearchItem(undefined);
    setMatchedItems(undefined);

    if (onSelectMatchedItem) {
      onSelectMatchedItem(selectedItem);
    }
  };
  const handleOnPressEnter = (value?: ProductId) => {
    if (value && matchedItems?.length) {
      const autoSelectedItem =
        matchedItems.length === 1 ? matchedItems[0] : matchedItems.find((mp) => mp.id === value);
      if (autoSelectedItem) {
        onSelectItem(autoSelectedItem.id);
      }
    }
  };
  if (status === "loading") {
    return <Spin />;
  }
  return (
    <AutoComplete
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleOnPressEnter(searchItem);
        }
      }}
      value={searchItem}
      onChange={(value) => setSearchItem(value)}
      options={matchedItems?.map((p) => ({ label: p.name, value: p.id })) || []}
      style={{ width: "auto", minWidth: 200, maxWidth: "100%" }}
      popupMatchSelectWidth={false}
      onSelect={onSelectItem}
      onSearch={handleSearchItem}
      placeholder="Start typing Item Name or scan Barcode.."
    />
  );
};
export default ProductSearchBox;
