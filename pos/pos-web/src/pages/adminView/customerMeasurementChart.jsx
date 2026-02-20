import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import { Grid, Select, Space } from "antd";
const { useBreakpoint } = Grid;

const CustomerMeasurementChart = ({ customers }) => {
  const screens = useBreakpoint(); // xs, sm, md, lg, xl, xxl

  // Set chart height based on screen size
  const chartHeight = screens.xs ? 350 : screens.sm ? 400 : 450;

  const [clothType, setClothType] = useState("pant");
  const [measurement, setMeasurement] = useState("waist");

  const measurementOptions = useMemo(() => {
    switch (clothType) {
      case "pant":
        return ["waist", "side_length", "front_rise", "thigh", "leg_opening"];
      case "shirt":
      case "polo_shirt":
        return ["chest", "long"];
      default:
        return [];
    }
  }, [clothType]);

  // Group data
  const chartData = useMemo(() => {
    if (!customers?.length || !measurement) return [];

    const grouped = {};

    customers.forEach((customer) => {
      const cloth = customer.cloths.find((c) => c.type === clothType);
      if (!cloth) return;

      const value = cloth.info[measurement];
      if (value === undefined || value === null) return;

      grouped[value] = (grouped[value] || 0) + 1;
    });

    return Object.keys(grouped)
      .map((key) => ({
        measurement: String(key),
        count: grouped[key],
      }))
      .sort((a, b) => Number(a.measurement) - Number(b.measurement));
  }, [customers, clothType, measurement]);

  return (
    <div style={{ width: "100%" }}>
      {/* Cloth Type & Measurement Select */}
      <Space wrap style={{ marginBottom: 20 }}>
        <Select
          value={clothType}
          onChange={(val) => {
            setClothType(val);
            const defaultMeasurement =
              val === "pant" ? "waist" : val === "shirt" || val === "polo_shirt" ? "chest" : "";
            setMeasurement(defaultMeasurement);
          }}
          style={{ width: 160 }}
          options={[
            { value: "pant", label: "Pant" },
            { value: "shirt", label: "Shirt" },
            { value: "polo_shirt", label: "Polo Shirt" },
          ]}
        />

        <Select
          value={measurement}
          onChange={setMeasurement}
          style={{ minWidth: 120, maxWidth: "100%" }}
          options={measurementOptions.map((option) => ({
            value: option,
            label: option.replace("_", " ").toUpperCase(),
          }))}
        />
      </Space>

      {/* Chart */}
      <div style={{ width: "100%", height: chartHeight }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="measurement"
              type="category"
              angle={screens.xs ? -35 : 0} // Rotate on mobile
              textAnchor={screens.xs ? "end" : "middle"}
              interval={0}
            >
              <Label
                value={measurement.replace("_", " ").toUpperCase()}
                position="bottom"
                offset={20} // reduce offset
              />
            </XAxis>

            <YAxis allowDecimals={false}>
              <Label value="Number of Customers" angle={-90} position="insideLeft" />
            </YAxis>

            <Tooltip />
            <Bar dataKey="count" fill="#4a90e2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerMeasurementChart;
