import React, { useEffect, useMemo } from "react";
import { Form, Button, Row, Col, Card, InputNumber, Select, Spin } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDepositAccounts } from "@/api/useDepositAccounts";
import { ChartOfAccountId, RESERVE_ACCOUNT_ID } from "@pos/shared-models";

type PaymentAccount = {
  accountId: ChartOfAccountId;
  amount?: number;
};

type PaymentCardProps = {
  form: any;
  formName: string; // Form.List name
  invoiceTotal: number;
  hasInvoiceItems?: boolean;
  onPaymentReset: () => void;
  initialPaymentAccounts?: { accountId: ChartOfAccountId; name: string; amount: number }[];
};

const PaymentCard: React.FC<PaymentCardProps> = ({
  form,
  formName,
  invoiceTotal,
  hasInvoiceItems,
  onPaymentReset,
  initialPaymentAccounts,
}) => {
  const { status: accountStatus, data } = useDepositAccounts();
  const paymentAccounts = Form.useWatch<Array<PaymentAccount> | undefined>([formName], form);

  useEffect(() => {
    // only run for new invoice (add mode)
    if (initialPaymentAccounts?.length) return; // edit mode: skip

    //reset payments
    if (!invoiceTotal) {
      form.resetFields([formName]);
      return;
    }

    //Initialize default payment method when invoice changes
    if (!paymentAccounts?.length) {
      const defaultAccountId = RESERVE_ACCOUNT_ID.petty_cash;
      form.setFieldValue(formName, [{ accountId: defaultAccountId, amount: invoiceTotal }]);
      return;
    }

    // Update first payment amount when invoiceTotal changes
    const formPayments = form.getFieldValue(formName);
    formPayments[0].amount = invoiceTotal;
    form.setFieldValue(formName, formPayments);
  }, [invoiceTotal]);

  const selectableAccounts = useMemo(() => {
    if (!paymentAccounts?.length) {
      return [];
    }
    return data?.filter((acc) => !paymentAccounts.find((sAcc) => sAcc.accountId === acc.id)) || [];
  }, [data, paymentAccounts]);

  const paymentTotal = useMemo(
    () => paymentAccounts?.reduce((sum, acc) => sum + (acc.amount || 0), 0) || 0,
    [paymentAccounts],
  );

  const removePaymentAccount = (accountId: ChartOfAccountId) => {
    const requireAutofill = Boolean(
      paymentAccounts?.find((acc) => acc.accountId === accountId)?.amount,
    );
    if (requireAutofill) {
      const formPayments = form.getFieldValue(formName) as Array<{
        accountId: ChartOfAccountId;
        amount?: number;
      }>;
      formPayments[0].amount = invoiceTotal;
      form.setFieldValue(formName, formPayments);
    }
  };
  const resetPaymentForm = () => {
    onPaymentReset();
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
            {fields.map(({ key, name, ...fieldProps }) => {
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
                    {...fieldProps}
                    name={[name, "accountId"]}
                    rules={[{ required: true, message: "Select account" }]}
                    style={{ flex: 1, minWidth: 160 }}
                  >
                    <Select showSearch placeholder="Select account" options={options} />
                  </Form.Item>

                  <Form.Item
                    {...fieldProps}
                    name={[name, "amount"]}
                    rules={[{ required: true, message: "Enter amount" }]}
                    style={{ width: 140 }}
                  >
                    <InputNumber placeholder="Amount" style={{ width: "100%" }} />
                  </Form.Item>

                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      onClick={() => {
                        remove(name);
                        removePaymentAccount(currentAccountId);
                      }}
                      style={{ color: "red", fontSize: 18, marginBottom: "24px" }}
                    />
                  )}
                </div>
              );
            })}
            {accountStatus === "loading" ? (
              <Row justify="center">
                <Spin />
              </Row>
            ) : paymentAccounts?.length !== data?.length ? (
              <Form.Item>
                <Button
                  disabled={!hasInvoiceItems}
                  type="dashed"
                  onClick={() => add({ accountId: selectableAccounts[0].id })}
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
            disabled={!hasInvoiceItems}
            style={{ minWidth: 80 }}
            onClick={resetPaymentForm}
          >
            Cancel
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!invoiceTotal || paymentTotal !== invoiceTotal}
            style={{ minWidth: 80 }}
          >
            Save
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default PaymentCard;
