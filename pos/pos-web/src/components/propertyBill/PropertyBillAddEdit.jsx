import { useState, useEffect, Children } from "react";
import {
  Button,
  Input,
  Radio,
  Space,
  InputNumber,
  Checkbox,
  Select,
  Modal,
  Form,
  DatePicker,
  Row,
  Typography,
  Col,
} from "antd";
import { success, error } from "@/utils/Utils/Utils";
import FormItemTypeWithInput from "./pbillAddEditComponents/FormItemTypeWithInput";
import ParkingDataShow from "./pbillAddEditComponents/ParkingDataShow";
import ServiceChargeDataShow from "./pbillAddEditComponents/ServiceChargeDataShow";
import UnitDataShow from "./pbillAddEditComponents/UnitDataShow";
import ShopDataShow from "./pbillAddEditComponents/shopDataShow";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;
const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const getPbillsFormConfig = (bills, selectedPBills, lastMonthInputPbills) => {
  if (bills) {
    const nBills = { ...bills };
    const oldBillIds = Object.keys(bills);
    const nRestBills = selectedPBills?.filter((b) => !oldBillIds.includes(b.id)) || [];
    nRestBills.forEach((b) => {
      const amount = (lastMonthInputPbills || {})[b.id]?.amount || 0;
      nBills[b.id] = {
        name: b.name,
        amount,
        type: "post-paid",
      };
    });
    return nBills;
  } else {
    // process for new pbill UI
    const nConfig = selectedPBills.reduce((pre, bill) => {
      const amount = (lastMonthInputPbills || {})[bill.id]?.amount || 0;
      return {
        ...pre,
        [bill.id]: {
          name: bill.name,
          amount,
          type: "post-paid",
        },
      };
    }, {});
    return nConfig;
  }
};
const PropertyBillAddEdit = ({
  children,
  form,
  onFinish,
  formData, //default null if add pbill
  exFormData,
  isSelected,
  selectedPBills,
  lastMonthInputPbills,
  enableAutofillPbills,
}) => {
  const [config, setConfig] = useState({});
  const onFillPbills = (enableAutofill) => {
    if ((!formData && !selectedPBills) || exFormData?.tenantAgreement?.type === 3) {
      setConfig({});
    } else {
      const nConfig = getPbillsFormConfig(
        formData?.bills,
        selectedPBills,
        enableAutofill ? lastMonthInputPbills : null,
      );
      setConfig({ ...nConfig });
      form.setFieldsValue({ bills: nConfig });
    }
  };
  useEffect(() => {
    onFillPbills(enableAutofillPbills);
  }, [exFormData, selectedPBills]);

  useEffect(() => {
    if (formData) {
      const { selectedConfig, considerationAmount, ...rest } = formData;
      form.setFieldValue("considerationAmount", considerationAmount);
      // form.setFieldsValue({ ...rest });
    }
  }, [formData]);

  const handleFinsish = (values) => {
    onFinish(values);
  };
  return (
    <div>
      <Row justify={"space-between"} gutter={16}>
        {/* <Button onClick={() => console.log("selectedPBills", selectedPBills)}>selectedPBills</Button> */}
        <Col>
          <Title level={5} style={{ marginBottom: "30px" }}>
            {formData ? "Edit" : ""} Property Bills
          </Title>
        </Col>
        <Col>
          {/* {!exFormData || exFormData.units?.length ? ( */}
          <Button block>
            <Link
              to={{ pathname: `/propertyBills/config` }}
              style={{
                // color: record.isRegistrationCompleted
                //   ? record.isUserActive
                //     ? "black"
                //     : "pink"
                //   : "red",
                color: "black",
                textDecoration: "none",
              }}
            >
              Configuration
            </Link>
          </Button>
          {/* ) : null} */}
        </Col>
      </Row>
      <div className="border p-4 rounded">
        <Form
          {...formLayout}
          form={form}
          name="register"
          onFinish={handleFinsish}
          // initialValues={{ ...formDataForEdit }}
          // layout="vertical"
          labelWrap
          scrollToFirstError
          labelAlign="left"
        >
          {children}
          {/* {exFormData?.units?.length ? ( */}
          {exFormData?.tenantAgreement?.type === 1 || exFormData?.tenantAgreement?.type === 2 ? (
            <>
              <UnitDataShow
                // unitData={selected.value.units[0]} tenantAgreement={tenantAgreement}
                data={{
                  id: exFormData.units[0].id,
                  name: exFormData.units[0].name,
                  rent: exFormData.units[0].rent,
                }}
              />
              {!(exFormData.tenantAgreement.serviceCharge == null) ? (
                <ServiceChargeDataShow amount={exFormData.tenantAgreement.serviceCharge} />
              ) : null}
            </>
          ) : null}
          {exFormData?.tenantAgreement?.type === 4 || exFormData?.tenantAgreement?.type === 5 ? (
            <>
              <ShopDataShow
                data={{
                  id: exFormData.shops[0].id,
                  name: exFormData.shops[0].name,
                  rent: exFormData.shops[0].rent,
                }}
              />
              {!(exFormData.tenantAgreement.serviceCharge == null) ? (
                <ServiceChargeDataShow amount={exFormData.tenantAgreement.serviceCharge} />
              ) : null}
            </>
          ) : null}
          {/* {exFormData?.parkings?.length  */}
          {exFormData?.tenantAgreement?.type === 1 || exFormData?.tenantAgreement?.type === 3 ? (
            <ParkingDataShow data={exFormData.parkings} />
          ) : null}
          {Object.entries(config).map((item) => (
            <FormItemTypeWithInput
              key={item[0]}
              form={form}
              label={item[1].name}
              typeName={["bills", item[0], "type"]}
              typeValue={item[1].type || null}
              // inputName={["customBills", bill.id, bill.amount]}
              inputName={["bills", item[0], "amount"]}
              inputLabel={["bills", item[0], "name"]}
              billName={item[1].name}
            />
          ))}
          {exFormData?.tenantAgreement && exFormData.tenantAgreement.type !== 3 ? (
            <Form.Item name="considerationAmount" label="Consideration Amount" initialValue={null}>
              <InputNumber
                placeholder="Consideration Amount"
                style={{ width: "100%" }}
                min={0}
                // precision="number"
              />
            </Form.Item>
          ) : null}

          {/* </Row> */}
          <Row align="center" gutter={[10, 1]}>
            {/* {config.length || tenantAgreement?.type === 3 || editData?.agreementType === 3 ? ( */}
            {/* {!requiredConfig || (requiredConfig && config.length) ? ( */}
            <Col>
              <Button
                // disabled={selected || editData ? false : true}
                // disabled={!others}
                disabled={!isSelected}
                type="primary"
                htmlType="submit"
                style={{ paddingRight: "20" }}
              >
                Save
              </Button>
            </Col>
            <Col>
              <Button
                htmlType="button"
                disabled={!isSelected || enableAutofillPbills}
                onClick={() => onFillPbills(true)}
              >
                {`Fill ${enableAutofillPbills ? "(Auto)" : ""}`}
              </Button>
            </Col>

            {/* {!exFormData?.units ||
            !exFormData.units.length ||
            (exFormData.units.length && config.length) ? (
              <Button
                // disabled={selected || editData ? false : true}
                // disabled={!others}
                disabled={!isSelected}
                type="primary"
                htmlType="submit"
                style={{ paddingRight: "20" }}
              >
                Save
              </Button>
            ) : (
              <Title level={5}>Please add bills from the configurations</Title>
            )} */}
          </Row>
        </Form>
      </div>
      <br />
    </div>
  );
};
export default PropertyBillAddEdit;
