import { useState, useEffect, useMemo } from "react";
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
import { useFirestore } from "reactfire";
import { success, error } from "@/utils/Utils/Utils";
import moment from "moment";
import { useCustomAuth } from "@/utils/hooks/customAuth";
import PropertyBillAddEdit from "@/components/propertyBill/PropertyBillAddEdit";
import usePbillDropdownCommercial from "@/api/usePBillDropDown/usePBillDropDownCommercial";
import CommercialPbill from "@/service/propertyBill/commercialPbill.service";
import { DATE_MMM_YYYY } from "@/constants/dateFormat";

const { Title } = Typography;
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

const CommercialPbillAdd = ({ propertyId }) => {
  const { userId: authUserId } = useCustomAuth();
  const firestore = useFirestore();
  const commercialPbillObj = new CommercialPbill(firestore);
  const {
    onMonthSelect,
    selectedMonth,
    data: dropdownData,
    selected,
    onSelect: onSelectDropDown,
    enableAutofillPbills,
  } = usePbillDropdownCommercial(authUserId, propertyId);

  const [pbillForm] = Form.useForm();

  const [isSelected, setIsSelected] = useState(false);
  // const [requiredConfig, setRquiredConfig] = useState(false);
  const [exFormData, setExFormData] = useState();

  useEffect(() => {
    //reset all states
    pbillForm.resetFields();
    setExFormData();
    setIsSelected(false);
    // setRquiredConfig(false);

    if (!selectedMonth) return;
    pbillForm.setFieldValue("month", selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    if (selected) {
      setIsSelected(true);
      const { tenantAgreement, shops, parkings } = selected.value;
      // const nPbillAgreementType = tenantAgreement?.type || null;

      const { id, type, serviceCharge } = tenantAgreement || {};
      const nExFormData = {};
      nExFormData.tenantAgreement = tenantAgreement ? { id, type, serviceCharge } : undefined;
      const numOfShops = shops?.length;
      nExFormData.shops = numOfShops
        ? shops.map((u) => {
            const { id, no: name } = u;
            const rent = type === 4 || type === 5 ? tenantAgreement.shopRents[id] : 0;
            return {
              id,
              name,
              rent,
            };
          })
        : null;

      // nExFormData.serviceCharge = serviceCharge;
      nExFormData.tenantAgreement = tenantAgreement
        ? { ...nExFormData.tenantAgreement, serviceCharge }
        : undefined;

      const numOfParkings = parkings?.length;
      nExFormData.parkings = numOfParkings
        ? parkings.map((p) => {
            const { id, no: name } = p;
            const rent = tenantAgreement.parkingRents[id];
            return {
              id,
              name,
              rent,
            };
          })
        : null;

      setExFormData(nExFormData); // it contains considerationAmount, agreemented shops, parkings, serviceCharge,
    } else {
      setExFormData(undefined); // reset
    }
  }, [selected]);

  function disabledDate(current) {
    return current && current > moment().endOf("day");
  }
  const showConfirmBox = async (values) => {
    confirm({
      title: `Are you sure to add this property bills for ${selectedMonth?.format(DATE_MMM_YYYY)}?`,
      async onOk() {
        try {
          const userInputs = {
            bills: values.bills,
            month: moment(values.month.toDate()).format(DATE_MMM_YYYY),
            considerationAmount: values.considerationAmount,
          };
          const shopIds = selected.value.shops?.map((s) => s.id) || [];
          const parkingIds = selected.value.parkings?.map((p) => p.id) || [];
          const agreement = selected.value.tenantAgreement || null;
          await commercialPbillObj.create(
            userInputs,
            propertyId,
            shopIds,
            parkingIds,
            agreement,
            authUserId,
          );
          success("Successfully added the property bills");
          pbillForm.resetFields();
          pbillForm.setFieldValue("month", selectedMonth);
        } catch (err) {
          error("Error");
        }
      },
    });
  };
  const onFinishAdd = (values) => {
    showConfirmBox(values);
  };

  return (
    <div>
      <PropertyBillAddEdit
        form={pbillForm}
        onFinish={onFinishAdd}
        isSelected={isSelected}
        exFormData={exFormData}
        selectedPBills={selected?.value?.selectedPBills}
        lastMonthInputPbills={selected?.value?.lastMonthInputPbills}
        enableAutofillPbills={enableAutofillPbills}
      >
        <Form.Item
          name="month"
          label="Month"
          rules={[{ required: true, message: "Please input the month" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            onChange={(date) => onMonthSelect(date)}
            picker="month"
            disabledDate={disabledDate}
            format={DATE_MMM_YYYY}
            disabled={false}
          />
        </Form.Item>
        <Form.Item label="Select" required>
          <Select
            placeholder="Select"
            onSelect={onSelectDropDown}
            value={selected?.label}
            disabled={false}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => {
              const filteredInput = input.replace(/[(\\)]/, "");
              const pattern = new RegExp(`(${filteredInput})`, "gi"); // Removed "^" as this is to match beginning of a line or string.
              const dataInOptionTag = option.children;
              return pattern.test(dataInOptionTag);
            }}
          >
            {dropdownData?.length
              ? dropdownData
                  .sort((a, b) => {
                    const aIsShop = a.label.includes("Shop");
                    const bIsShop = b.label.includes("Shop");

                    if (aIsShop && !bIsShop) {
                      return -1;
                    } else if (!aIsShop && bIsShop) {
                      return 1;
                    }

                    return a.label.localeCompare(b.label);
                  })
                  .map((item, index) => (
                    <Option key={index} value={item.label}>
                      {item.label}
                    </Option>
                  ))
              : null}
          </Select>
        </Form.Item>
      </PropertyBillAddEdit>
      <br />
    </div>
  );
};
export default CommercialPbillAdd;
