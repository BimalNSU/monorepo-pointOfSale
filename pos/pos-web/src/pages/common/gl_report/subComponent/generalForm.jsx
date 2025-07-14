import { useEffect, useState } from "react";
import { Select, Form, Radio, Button, Space, Modal, DatePicker, Tag } from "antd";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const { Option } = Select;

const GeneralForm = ({ downloadPDF, downloadExcel, onSubmit, filters }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [exportType, setExportType] = useState("pdf");
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ dateRange: [filters.start, filters.end] });
  }, [filters]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setExportType("pdf");
  };

  const handleDownload = () => {
    if (exportType === "pdf") {
      downloadPDF && downloadPDF();
    } else if (exportType === "excel") {
      downloadExcel && downloadExcel();
    }
    setIsModalVisible(false);
  };

  const selectExportType = (value) => {
    setExportType(value);
  };
  const rangePresets = [
    { label: "Today", value: [dayjs().startOf("day"), dayjs().endOf("day")] },
    { label: "This Week", value: [dayjs().startOf("week"), dayjs().endOf("week")] },
    { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "This Month", value: [dayjs().startOf("month"), dayjs().endOf("month")] },
    {
      label: "Last Month",
      value: [
        dayjs().subtract(1, "month").startOf("month"),
        dayjs().subtract(1, "month").endOf("month"),
      ],
    },
    { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
    { label: "This Year", value: [dayjs().startOf("year"), dayjs().endOf("year")] },
    {
      label: "Last Year",
      value: [
        dayjs().subtract(1, "year").startOf("year"),
        dayjs().subtract(1, "year").endOf("year"),
      ],
    },
  ];
  const onChange = (date) => {
    if (date) {
      console.log("Date: ", date);
    } else {
      console.log("Clear");
    }
  };
  const handleFinish = (values) => {
    const { dateRange, ...rest } = values;
    onSubmit({ start: dateRange[0], end: dateRange[1], ...rest });
  };
  return (
    <div>
      <Form form={form} onFinish={handleFinish} layout="horizontal">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Form.Item
            name="dateRange"
            label="Date Range"
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: "Please input date" }]}
            initialValue={[dayjs().startOf("day"), dayjs().endOf("day")]}
          >
            <RangePicker presets={rangePresets} />
          </Form.Item>
          <Form.Item
            name="basisType"
            label="Accounting Basis"
            labelCol={{ span: 24 }}
            style={{ marginLeft: "10px" }}
          >
            <Select allowClear style={{ width: "100px" }}>
              <Option key="accrual" value={1}>
                {`Accrual`}
              </Option>
              <Option key="cash" value={2}>{`Cash`}</Option>
            </Select>
          </Form.Item>
          <Space size={8}>
            <Button onClick={showModal}>Export</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#71bd44", border: "none" }}
            >
              Run Report
            </Button>
          </Space>
        </div>
      </Form>
      <Modal
        title="Download Options"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="download" type="primary" onClick={handleDownload}>
            Download
          </Button>,
        ]}
      >
        <p>Select the format to download the file:</p>
        <Radio.Group onChange={(e) => selectExportType(e.target.value)} value={exportType}>
          <Radio value="pdf">Download PDF</Radio>
          <Radio value="excel">Download Excel</Radio>
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default GeneralForm;
