import { useState, useEffect } from "react";
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
import usePbillDropdownResidential from "@/api/usePBillDropDown/usePBillDropDownResidential";
import ResidentialPbill from "@/service/propertyBill/residentialPbill.service";
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

const ResidentialPbillAdd = ({ propertyId }) => {
  const firestore = useFirestore();
  const residentialPbillObj = new ResidentialPbill(firestore);
  const { userId: authUserId } = useCustomAuth();
  const {
    onMonthSelect,
    selectedMonth,
    data: dropdownData,
    selected,
    onSelect: onSelectDropDown,
    enableAutofillPbills,
  } = usePbillDropdownResidential(authUserId, propertyId);

  const [pbillForm] = Form.useForm();
  const [isSelected, setIsSelected] = useState(false);
  const [exFormData, setExFormData] = useState();

  useEffect(() => {
    //reset all states
    pbillForm.resetFields();
    setExFormData();
    setIsSelected(false);

    if (!selectedMonth) return;
    pbillForm.setFieldValue("month", selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    if (selected) {
      setIsSelected(true);
      const { tenantAgreement, units, parkings, selectedPBills } = selected.value;

      const { id, type, serviceCharge } = tenantAgreement || {};
      const nExFormData = {};
      nExFormData.tenantAgreement = tenantAgreement ? { id, type, serviceCharge } : undefined;
      const numOfUnits = units?.length;
      nExFormData.units = numOfUnits
        ? units.map((u) => {
            const { id, unitNo: name } = u;
            const rent = type === 1 || type === 2 ? tenantAgreement.unitRents[id] : 0;
            return {
              id,
              name,
              rent,
            };
          })
        : null;

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

      setExFormData(nExFormData); // it contains considerationAmount, agreemented units, parkings, serviceCharge,
    } else {
      setExFormData(undefined); // reset
    }
  }, [selected]);

  function disabledDate(current) {
    // can not select month after current month
    return current && current > moment().endOf("day");
  }
  const showConfirmBox = async (values) => {
    confirm({
      title: `Are you sure to add this property bills for ${selectedMonth?.format(DATE_MMM_YYYY)}?`,
      async onOk() {
        const userInputs = {
          bills: values.bills,
          month: moment(values.month.toDate()).format(DATE_MMM_YYYY),
          considerationAmount: values.considerationAmount,
        };
        const unitIds = selected.value.units?.map((u) => u.id) || [];
        const parkingIds = selected.value.parkings?.map((p) => p.id) || [];
        const agreement = selected.value.tenantAgreement || null;
        try {
          await residentialPbillObj.create(
            userInputs,
            propertyId,
            unitIds,
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
            // onChange={onChangeMonth}
            onChange={(date) => onMonthSelect(date)}
            picker="month"
            disabledDate={disabledDate}
            format={DATE_MMM_YYYY}
            disabled={false}
          />
        </Form.Item>
        <Form.Item label="Select" name={"selected"} required>
          <Select
            allowClear={false}
            placeholder="Select"
            onSelect={onSelectDropDown}
            value={selected?.label}
            disabled={false}
            showSearch
            // style={{ width: 400 }}
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
                    const aIsShop = a.label.includes("Unit");
                    const bIsShop = b.label.includes("Unit");

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
export default ResidentialPbillAdd;
