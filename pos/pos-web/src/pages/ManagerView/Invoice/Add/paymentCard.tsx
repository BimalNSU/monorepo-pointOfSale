import React, { useEffect, useMemo, useState } from "react";
import { Form, Button, Row, Col, Card, InputNumber, Select, Spin } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDespositAccounts } from "@/api/useDepositAccounts";
import { ChartOfAccountId, RESERVE_ACCOUNT_ID } from "@pos/shared-models";

type PaymentAccount = {
  id: ChartOfAccountId;
  name: string;
  amount?: number;
};

type PaymentCardProps = {
  form: any;
  formName: string; // Form.List name
  invoiceTotal: number;
  invoiceItems?: any[];
  onResetPayment: () => void;
};

const PaymentCard: React.FC<PaymentCardProps> = ({
  form,
  formName,
  invoiceTotal,
  invoiceItems,
  onResetPayment,
}) => {
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
  const { status: accountStatus, data } = useDespositAccounts();

  useEffect(() => {
    if (!invoiceItems?.length) {
      form.resetFields([formName]);
      if (paymentAccounts.length) {
        setPaymentAccounts([]);
      }
    }
    //add default payment method
    if (invoiceItems?.length && !paymentAccounts.length) {
      const defaultAccountId = RESERVE_ACCOUNT_ID.petty_cash;
      setPaymentAccounts([
        {
          id: defaultAccountId,
          name: data?.find((a) => a.id === defaultAccountId)?.name || "",
        },
      ]);
      form.setFieldValue(formName, [{ accountId: defaultAccountId }]);
    }
  }, [invoiceItems]);
  const selectableAccounts = useMemo(
    () => data?.filter((acc) => !paymentAccounts.find((sAcc) => sAcc.id === acc.id)) || [],
    [data, paymentAccounts],
  );
  const paymentTotal = useMemo(
    () => paymentAccounts.reduce((sum, acc) => sum + (acc.amount || 0), 0),
    [paymentAccounts],
  );

  const updatePaymentField = (
    value: string | number | null,
    field: "id" | "amount",
    key: ChartOfAccountId,
  ) => {
    setPaymentAccounts((prev) =>
      prev.map((p) => {
        if (key === p.id) {
          return {
            ...p,
            [field]: value,
            ...(field === "id" && {
              name: data?.find((acc) => acc.id === value)?.name || "",
            }),
          };
        } else {
          return p;
        }
      }),
    );
  };
  const removePaymentAccount = (accountId: ChartOfAccountId) => {
    setPaymentAccounts((prev) => prev.filter((p) => p.id !== accountId));
  };
  const resetPaymentForm = () => {
    setPaymentAccounts([]);
    onResetPayment();
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
                      onChange={(accountId) =>
                        updatePaymentField(accountId, "id", currentAccountId)
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "amount"]}
                    rules={[{ required: true, message: "Enter amount" }]}
                    style={{ width: 140 }}
                  >
                    <InputNumber
                      onChange={(amount) =>
                        updatePaymentField(amount as any, "amount", currentAccountId)
                      }
                      placeholder="Amount"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      onClick={() => {
                        removePaymentAccount(currentAccountId);
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
            ) : paymentAccounts.length !== data?.length ? (
              <Form.Item>
                <Button
                  disabled={!invoiceItems || !invoiceItems?.length}
                  type="dashed"
                  onClick={() => {
                    add({ accountId: selectableAccounts[0].id });
                    const updatedAccounts = paymentAccounts.map((acc) => ({ ...acc })); //deep copy
                    updatedAccounts.push({
                      id: selectableAccounts[0].id,
                      name: selectableAccounts[0].name,
                    });
                    setPaymentAccounts(updatedAccounts);
                  }}
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
            onClick={resetPaymentForm}
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
            <Button
              type="primary"
              htmlType="submit"
              //   disabled={!invoiceItemsLength || invoiceItemsLength <= 0}
              disabled={!invoiceTotal || paymentTotal !== invoiceTotal}
              style={{ minWidth: 80 }}
            >
              Save
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default PaymentCard;
