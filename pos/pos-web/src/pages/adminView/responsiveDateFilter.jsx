import { DatePicker, Grid, Space } from "antd";

const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

const ResponsiveDateFilter = ({ customRange, setCustomRange }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  if (!isMobile) {
    return (
      <RangePicker
        style={{ width: 260 }}
        value={customRange}
        onChange={(dates) => setCustomRange(dates || [])}
      />
    );
  }

  return (
    <>
      <DatePicker
        value={customRange[0]}
        onChange={(date) => setCustomRange((prev) => [date ?? null, prev[1]])}
      />

      <DatePicker
        value={customRange[1]}
        onChange={(date) => setCustomRange((prev) => [prev[0], date ?? null])}
        disabledDate={(current) => customRange?.[0] && current.isBefore(customRange[0], "day")}
      />
    </>
  );
};

export default ResponsiveDateFilter;
