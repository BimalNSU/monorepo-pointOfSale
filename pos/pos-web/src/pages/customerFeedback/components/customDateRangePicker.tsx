import { DATE_FORMAT } from "@/constants/dateFormat";
import { DatePicker, Form, Space } from "antd";
import { Dayjs } from "dayjs";
import { useState } from "react";

interface DateRangeValue {
  startDate?: Dayjs;
  endDate?: Dayjs;
}

interface CustomDateRangePickerProps {
  value?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
}

const CustomDateRangePicker = ({ value, onChange }: CustomDateRangePickerProps) => {
  const [startDate, setStartDate] = useState<Dayjs | undefined>(value?.startDate);
  const [endDate, setEndDate] = useState<Dayjs | undefined>(value?.endDate);

  const handleStartChange = (date: Dayjs | null) => {
    const newStartDate = date ?? undefined;

    // Clear end date if it becomes invalid
    const newEndDate =
      endDate && newStartDate && !endDate.isAfter(newStartDate, "day") ? undefined : endDate;

    setStartDate(newStartDate);
    setEndDate(newEndDate);

    onChange?.({
      startDate: newStartDate,
      endDate: newEndDate,
    });
  };

  const handleEndChange = (date: Dayjs | null) => {
    const newEndDate = date ?? undefined;

    setEndDate(newEndDate);

    onChange?.({
      startDate,
      endDate: newEndDate,
    });
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

      <Form.Item name="endDate" style={{ marginBottom: 8 }}>
        <DatePicker
          format={DATE_FORMAT}
          placeholder="End Date"
          value={endDate}
          disabled={!startDate}
          onChange={handleEndChange}
          disabledDate={(current) => !!startDate && !current.isAfter(startDate, "day")}
        />
      </Form.Item>
    </Space>
  );
};
export default CustomDateRangePicker;
