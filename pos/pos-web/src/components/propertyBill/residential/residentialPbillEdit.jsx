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
import dayjs from "dayjs";
import { useCustomAuth } from "@/utils/hooks/customAuth";
import PropertyBillAddEdit from "../PropertyBillAddEdit";
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

const ResidentialPbillEdit = ({ data, onReset }) => {
  const { userId: authUserId } = useCustomAuth();
  const firestore = useFirestore();
  const residentialPbillObj = new ResidentialPbill(firestore);
  const [pbillForm] = Form.useForm();
  const [formData, setFormData] = useState();
  const [selectedValue, setSelectedValue] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [selectedPBills, setSelectedPBills] = useState();
  const [exFormData, setExFormData] = useState();

  const visibleModal = data ? true : false;
  const handleCancel = () => {
    onReset();
  };

  function disabledDate(current) {
    // can not select month after current month
    return current && current > dayjs().endOf("day");
  }
  useEffect(() => {
    if (data) {
      const pData = processDataForEdit(data);
      const { month, selected, ...rest } = pData;
      setSelectedValue(selected);
      pbillForm.setFieldValue("month", month);
      setFormData({ ...rest });
    }
  }, [data]);

  const processDataForEdit = (data) => {
    const { agreementId, units, parkings, month, agreementType, serviceCharge, ...tempData } = data;
    const nExFormData = { units, parkings };
    if (agreementId) {
      nExFormData.tenantAgreement = { id: agreementId, type: agreementType, serviceCharge };
    }
    if (units.length) {
      setSelectedPBills(units[0].selectedPBills);
    }
    setExFormData(nExFormData);
    setIsSelected(true);

    const labelUnits = units.length ? `Unit: ${units.map((unit) => unit.name).toString()}` : "";
    const labelParkings =
      agreementId && parkings?.length ? `Parkings: ${parkings.map((p) => p.name).join(",")}` : "";
    const finalLabel = `${labelUnits}${
      !agreementId
        ? " (Owner)"
        : `${
            agreementType === 1
              ? ` ${labelParkings}`
              : agreementType === 2
              ? ""
              : agreementType === 3
              ? labelParkings
              : ""
          } (Tenant)`
    }`;
    tempData.selected = finalLabel;
    tempData.month = dayjs(month, DATE_MMM_YYYY);
    return tempData;
  };
  const showConfirmBox = async (values) => {
    confirm({
      title: `Are you sure to edit this property bills for ${values.month.format(DATE_MMM_YYYY)}?`,
      async onOk() {
        try {
          await residentialPbillObj.update(
            data.id,
            { bills: values.bills, considerationAmount: values.considerationAmount },
            authUserId,
          );
          success("Successfully edited the property Bills");
          pbillForm.resetFields();
          setFormData(null);
          onReset();
        } catch (err) {
          error(err);
        }
      },
    });
  };
  const onFinishEdit = (values) => {
    showConfirmBox(values);
  };

  return (
    <Modal
      // title="Edit Property bills"
      zIndex={1000}
      centered
      open={visibleModal}
      onCancel={handleCancel}
      width={1000}
      footer={null}
    >
      <PropertyBillAddEdit
        form={pbillForm}
        onFinish={onFinishEdit}
        formData={formData}
        exFormData={exFormData}
        isSelected={isSelected}
        selectedPBills={selectedPBills}
      >
        <Form.Item
          name="month"
          label="Month"
          rules={[{ required: true, message: "Please input the month" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            // onChange={(date) => onMonthSelect(date)}
            picker="month"
            // disabledDate={disabledDate}
            format={DATE_MMM_YYYY}
            disabled={true}
          />
        </Form.Item>
        <Form.Item
          label="Select"
          // name={"selected"} required
        >
          <Select placeholder="Select" value={selectedValue} disabled={true}></Select>
        </Form.Item>
      </PropertyBillAddEdit>
    </Modal>
  );
};
export default ResidentialPbillEdit;
