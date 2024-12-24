import { Col, Form, FormInstance, Input, InputNumber, Radio, Row } from "antd";
import { NamePath } from "antd/lib/form/interface";
import { useEffect, useState } from "react";
import type { RadioChangeEvent } from "antd";

interface Props {
  form: FormInstance;
  label: string;
  typeName: NamePath;
  inputName: NamePath;
  inputLabel: NamePath;
  billName: string;
  typeValue: string;
}

const FormItemTypeWithInput: React.FC<Props> = ({
  form,
  label,
  typeName,
  inputName,
  inputLabel,
  billName,
  typeValue,
}) => {
  const [type, setType] = useState<string>("post-paid");
  useEffect(() => {
    if (typeValue) {
      setType(typeValue);
    }
  }, [typeValue]);

  const handleChange = (e: RadioChangeEvent) => {
    const { value } = e.target;
    const initialAmount = value === "pre-paid" ? 0 : null;
    form.setFieldValue(inputName, initialAmount);
    setType(value);
  };
  return (
    <Form.Item
      label={label}
      // required
    >
      <Row style={{ width: "100%" }}>
        <Col>
          <Form.Item
            name={typeName}
            rules={[{ required: true, message: "Please input type!" }]}
            initialValue={"post-paid"}
          >
            <Radio.Group
              onChange={handleChange}
              //  value={type}
            >
              <Radio value="pre-paid"> Prepaid </Radio>
              <Radio value="post-paid"> Postpaid </Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Form.Item hidden={true} name={inputLabel} initialValue={billName}>
          <Input
            // required
            style={{ width: "100%" }}
            min={0}
          />
        </Form.Item>
        <Col>
          <Form.Item
            // initialValue={0}
            hidden={type === "post-paid" ? false : true}
            name={inputName}
            rules={[{ required: true, message: "Please input your amount!" }]}
          >
            <InputNumber
              // required
              style={{ width: "100%" }}
              min={0}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form.Item>
  );
};
export default FormItemTypeWithInput;
