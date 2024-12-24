import React, { useState } from "react";
import { Button, Typography, Input, Form, InputNumber } from "antd";
import { MinusCircleOutlined, PlusSquareOutlined } from "@ant-design/icons";
import styles from "./Table.module.css";

const { Text } = Typography;

const PMSTable = ({ form }) => {
  const [total, setTotal] = useState("");

  const reCalTotalAmount = () => {
    const bills = form.getFieldValue("bills");
    const total = bills
      .filter((b) => b && b.amount && b.amount > 0)
      .map((b) => b.amount)
      .reduce((pre, cur) => {
        return pre + cur;
      }, 0);
    setTotal(total);
  };
  const handleInputChange = () => {
    reCalTotalAmount();
  };

  return (
    <table style={{ width: "100%", textAlign: "center" }}>
      <thead>
        <tr>
          <th className={styles.customTh}>Item Details</th>
          <th className={styles.customTh} style={{ borderLeft: "1px solid #f0f0f0" }}>
            Description
          </th>
          <th className={styles.customTh} style={{ borderLeft: "1px solid #f0f0f0" }}>
            Amount
          </th>
          <th className={styles.customTh} style={{ borderLeft: "1px solid #f0f0f0" }}>
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        <Form.List
          name="bills"
          initialValues={{ remember: true }}
          initialValue={[{ name: "", description: "", amount: "" }]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <tr key={key} className={styles.brBottom}>
                  <td
                    id="input"
                    className={styles.customtd}
                    style={{ borderLeft: "1px solid #F2F2F2" }}
                  >
                    <Form.Item
                      className={styles.hideTableHeader}
                      label={`Item Details`}
                      name={[name, "name"]}
                      rules={[
                        {
                          required: true,
                          message: "Please Input your Item details",
                        },
                      ]}
                    >
                      <Input placeholder="Item Details" className={styles.tableInput} />
                    </Form.Item>
                  </td>
                  <td
                    id="input"
                    className={styles.customtd}
                    style={{ borderLeft: "1px solid #F2F2F2" }}
                  >
                    <Form.Item
                      label={`Description`}
                      name={[name, "description"]}
                      className={styles.hideTableHeader}
                    >
                      <Input placeholder="Description" className={styles.tableInput} />
                    </Form.Item>
                  </td>
                  <td
                    id="input"
                    className={styles.customtd}
                    style={{ borderLeft: "1px solid #F2F2F2" }}
                  >
                    <Form.Item
                      label={`Amount`}
                      name={[name, "amount"]}
                      className={styles.hideTableHeader}
                      rules={[
                        {
                          required: true,
                          message: "Please Insert an Amount",
                        },
                      ]}
                    >
                      {/* <Input placeholder="Amount" onChange={handleInputChange} type="number" min={0} max={100} /> */}
                      <InputNumber
                        onChange={handleInputChange}
                        min={0}
                        placeholder="amount"
                        style={{
                          width: 300,
                        }}
                        className={styles.tableInput}
                      />
                    </Form.Item>
                  </td>
                  {fields.length > 1 ? (
                    <Button
                      className={styles.dangerButto}
                      onClick={() => {
                        remove(name);
                        reCalTotalAmount();
                      }}
                      danger
                      style={{ margin: "8px" }}
                    >
                      Delete
                    </Button>
                  ) : null}
                </tr>
              ))}
              <tr>
                <td className={styles.customtd}>
                  <Form.Item>
                    <Button
                      type="link"
                      onClick={() => add()}
                      icon={<PlusSquareOutlined />}
                      style={{ margin: "15px", color: "#1B1212", fontWeight: "bold" }}
                    >
                      Add More
                    </Button>
                  </Form.Item>
                </td>
                <td className={styles.customtd}></td>
                <td className={styles.customtd}>Total: {total}</td>
              </tr>
            </>
          )}
        </Form.List>
      </tbody>
    </table>
  );
};

export default PMSTable;
