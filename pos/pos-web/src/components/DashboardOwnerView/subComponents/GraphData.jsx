import { useMemo } from "react";
import { Column } from "@ant-design/plots";
import moment from "moment";

const months = [
  {
    label: "January",
    value: 1,
  },
  {
    label: "February",
    value: 2,
  },
  {
    label: "March",
    value: 3,
  },
  {
    label: "April",
    value: 4,
  },
  {
    label: "May",
    value: 5,
  },
  {
    label: "June",
    value: 6,
  },
  {
    label: "July",
    value: 7,
  },
  {
    label: "August",
    value: 8,
  },
  {
    label: "September",
    value: 9,
  },
  {
    label: "October",
    value: 10,
  },
  {
    label: "November",
    value: 11,
  },
  {
    label: "December",
    value: 12,
  },
];

const GraphData = ({ invoices }) => {
  const graphAmount = useMemo(() => {
    if (!invoices) {
      return [];
    }

    const arr = [];

    months.forEach((m) => {
      const unpaidInvoicesForMonth = invoices.filter((invoice) => {
        const issuedAtMoment = moment(invoice.createdAt);
        const monthInNumber = issuedAtMoment.month() + 1;
        return m.value === monthInNumber && invoice.paymentStatus === "unpaid";
      });
      const sumForUnpaid = unpaidInvoicesForMonth.reduce(
        (pre, cur) => pre + cur.invoiceTotalAmount,
        0,
      );

      const paidInvoicesForMonth = invoices.filter((invoice) => {
        const issuedAtMoment = moment(invoice.createdAt);
        const monthInNumber = issuedAtMoment.month() + 1;
        return m.value === monthInNumber && invoice.paymentStatus === "paid";
      });
      const sumForPaid = paidInvoicesForMonth.reduce((pre, cur) => pre + cur.invoiceTotalAmount, 0);

      arr.push(
        {
          name: "Total Receivable",
          month: m.label,
          value: sumForUnpaid,
        },
        {
          name: "Total Collection",
          month: m.label,
          value: sumForPaid,
        },
      );
    });

    return arr;
  }, [invoices]);

  const config = {
    data: graphAmount,
    isGroup: true,
    xField: "month",
    yField: "value",
    seriesField: "name",
    color: ["#1ca9e6", "#8BCD50"],
    dodgePadding: 1,
    intervalPadding: 20,
    label: {
      // 可手动配置 label 数据标签位置
      position: "middle",

      // 可配置附加的布局方法
      layout: [
        // 柱形图数据标签位置自动调整
        {
          type: "interval-adjust-position",
        }, // 数据标签防遮挡
        {
          type: "adjust-color",
        },
      ],
    },
  };

  return <Column {...config} />;
};

export default GraphData;
