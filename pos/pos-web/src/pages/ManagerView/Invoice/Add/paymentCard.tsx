import React, { useEffect, useMemo, useState } from "react";
import { Form, Button, Row, Col, Card, InputNumber, Select, Spin } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDespositAccounts } from "@/api/useDepositAccounts";
import { ChartOfAccountId, RESERVE_ACCOUNT_ID } from "@pos/shared-models";

type Payment = {
  accountId?: string;
  amount?: number;
};
type SelectedAccount = {
  id: ChartOfAccountId;
  name: string;
};

type PaymentCardProps = {
  form: any;
  formName: string; // Form.List name
  totalInvoiceAmount: number;
  invoiceItems?: any[];
  onReset: () => void;
};

const PaymentCard: React.FC<PaymentCardProps> = ({
  form,
  formName,
  totalInvoiceAmount,
  invoiceItems,
  onReset,
}) => {
  const [selectedAccounts, setSelectedAccounts] = useState<SelectedAccount[]>([]);
  const { status: accountStatus, data } = useDespositAccounts();

  useEffect(() => {
    if (invoiceItems?.length) {
      form.setFieldValue(formName, [{ accountId: RESERVE_ACCOUNT_ID.petty_cash }]);
    } else {
      form.resetFields([formName]);
    }
  }, [invoiceItems]);
  const selectableAccounts = useMemo(
    () => data?.filter((acc) => !selectedAccounts.find((sAcc) => sAcc.id === acc.id)) || [],
    [data, selectedAccounts],
  );
  useEffect(() => {
    if (!invoiceItems?.length && selectedAccounts.length) {
      setSelectedAccounts([]);
    }
  }, [invoiceItems]);
  const handleSelectAccount = () => {
    const payments = form.getFieldValue(formName) as Array<
      { accountId: ChartOfAccountId; amount?: number } | undefined
    >;
    const updatedSelectedAccounts =
      payments?.reduce((pre, curr) => {
        if (curr) {
          pre.push({
            id: curr.accountId,
            name: data?.find((acc) => acc.id === curr.accountId)?.name || "",
          });
        }
        return pre;
      }, new Array<SelectedAccount>()) || [];
    setSelectedAccounts(updatedSelectedAccounts);
  };
  const handleReset = () => {
    setSelectedAccounts([]);
    onReset();
  };
  return (
    <Card
      title="Payment"
      style={{ marginBottom: 16 }}
      styles={{
        header: { padding: "6px 12px", fontSize: 14 },
        body: { padding: "10px 12px" },
      }}
    >
      <Form.List name={formName}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => {
              const currentAccountId = form.getFieldValue([formName, name, "accountId"]);
              const currentAccount = data?.find((acc) => acc.id === currentAccountId) || null;
              const options = [
                ...(currentAccount
                  ? [{ value: currentAccount.id, label: currentAccount.name }]
                  : []),
                ...selectableAccounts
                  .filter((acc) => acc.id !== currentAccountId)
                  .map((acc) => ({
                    value: acc.id,
                    label: acc.name,
                  })),
              ];
              return (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    // flexWrap: "wrap", // allow wrapping on small screens
                    flexWrap: "nowrap", // prevents wrapping unless absolutely needed
                  }}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "accountId"]}
                    rules={[{ required: true, message: "Select account" }]}
                    style={{ flex: 1, minWidth: 160 }}
                  >
                    <Select
                      showSearch
                      placeholder="Select account"
                      options={options}
                      onChange={handleSelectAccount}
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "amount"]}
                    rules={[{ required: true, message: "Enter amount" }]}
                    style={{ width: 140 }}
                  >
                    <InputNumber placeholder="Amount" style={{ width: "100%" }} />
                  </Form.Item>

                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      onClick={() => {
                        const removeAccountId = form.getFieldValue([formName, name, "accountId"]);
                        setSelectedAccounts((prev) =>
                          prev.filter((prev) => prev.id !== removeAccountId),
                        );
                        remove(name);
                      }}
                      style={{ color: "red", fontSize: 18, marginBottom: "24px" }}
                    />
                  )}
                </div>
              );
            })}
            {accountStatus === "loading" ? (
              <Spin />
            ) : selectedAccounts.length !== data?.length ? (
              <Form.Item>
                <Button
                  disabled={!invoiceItems || !invoiceItems?.length}
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Payment
                </Button>
              </Form.Item>
            ) : null}
          </>
        )}
      </Form.List>

      <Row
        gutter={[16, 16]}
        justify="center"
        style={{
          marginTop: 24,
          padding: "0 16px",
          marginBottom: 8,
        }}
      >
        <Col>
          <Button
            type="default"
            htmlType="button"
            disabled={!invoiceItems || !invoiceItems?.length}
            style={{ minWidth: 80 }}
            onClick={handleReset}
          >
            Cancel
          </Button>
        </Col>
        <Col>
          <Form.Item
            noStyle
            //   dependencies={["payments", "specialDiscount"]}
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.payments !== currentValues.payments ||
              prevValues.specialDiscount !== currentValues.specialDiscount
            }
          >
            {({ getFieldValue }) => {
              const payments: Payment[] = getFieldValue(formName) || [];
              const specialDiscount = getFieldValue("specialDiscount");
              const totalPayment = payments.reduce((sum, p) => sum + (p?.amount || 0), 0);
              const invoiceTotal =
                invoiceItems?.reduce(
                  (pre, curr) => pre + curr.qty * curr.rate - (curr.discount || 0),
                  specialDiscount ? -specialDiscount : 0,
                ) || 0;
              const disallowPayment = !invoiceTotal || totalPayment !== invoiceTotal;
              return (
                <Button
                  type="primary"
                  htmlType="submit"
                  //   disabled={!invoiceItemsLength || invoiceItemsLength <= 0}
                  disabled={disallowPayment}
                  style={{ minWidth: 80 }}
                >
                  Save
                </Button>
              );
            }}
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default PaymentCard;
