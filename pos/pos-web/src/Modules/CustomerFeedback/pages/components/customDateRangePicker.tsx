import { DATE_FORMAT } from "@/constants/dateFormat";
import { DatePicker, Form, Space } from "antd";
import { Dayjs } from "dayjs";

const CustomDateRangePicker = () => {
  const form = Form.useFormInstance();
  const startDate = Form.useWatch("startDate", form);

  const handleStartChange = (newStartDate: Dayjs | null) => {
    const endDate = form.getFieldValue("endDate");
    if (!newStartDate || (startDate && endDate && endDate.isSameOrBefore(startDate, "day"))) {
      form.setFieldValue("endDate", undefined);
    }
  };

  return (
    <Space wrap>
      <Form.Item name="startDate" style={{ marginBottom: 8 }}>
        <DatePicker
          format={DATE_FORMAT}
          placeholder="Start Date"
          value={startDate}
          onChange={handleStartChange}
        />
      </Form.Item>

      <Form.Item
        name="endDate"
        style={{ marginBottom: 8 }}
        dependencies={["startDate"]}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              const startDate = getFieldValue("startDate");
              if (!startDate || value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Please select an end date."));
            },
          }),
        ]}
      >
        <DatePicker
          format={DATE_FORMAT}
          placeholder="End Date"
          disabled={!startDate}
          disabledDate={(current) => !!startDate && !current.isAfter(startDate, "day")}
        />
      </Form.Item>
    </Space>
  );
};
export default CustomDateRangePicker;
