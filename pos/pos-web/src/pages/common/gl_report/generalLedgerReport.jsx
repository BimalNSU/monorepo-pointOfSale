import { useGLReport } from "@/api/useGLReport";
import { NatureType } from "@pos/shared-models";
import { Button, Card, Spin } from "antd";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { convertToBD } from "@/constants/currency";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GeneralForm from "./subComponent/generalForm";
import { QUERY_DATE_FORMAT } from "@/constants/dateFormat";

const GLReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const startDateStr = queryParams.get("start");
  const endDateStr = queryParams.get("end");
  const filters = useMemo(() => {
    const start = startDateStr
      ? dayjs(startDateStr, QUERY_DATE_FORMAT).startOf("day")
      : dayjs().startOf("day");
    const end = endDateStr
      ? dayjs(endDateStr, QUERY_DATE_FORMAT).endOf("day")
      : dayjs().endOf("day");
    return { start, end };
  }, [startDateStr, endDateStr]);
  const { status, data } = useGLReport(filters);

  const [expandedIds, setExpandedIds] = useState([]);
  const toggleRow = (id) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const updateUrlParams = (queryFilters) => {
    const queryParams = new URLSearchParams(location.search);
    // if (queryFilters.searchTerm) {
    //   queryParams.set("q", queryFilters.searchTerm);
    // } else {
    //   queryParams.delete("q");
    // }
    // if (queryFilters.status?.length) {
    //   queryParams.set("status", queryFilters.status.join(","));
    // } else {
    //   queryParams.delete("status");
    // }

    if (queryFilters.start) {
      queryParams.set("start", queryFilters.start.format(QUERY_DATE_FORMAT));
    } else {
      queryParams.delete("start");
    }

    if (queryFilters.end) {
      queryParams.set("end", queryFilters.end.format(QUERY_DATE_FORMAT));
    } else {
      queryParams.delete("end");
    }
    navigate(
      {
        pathname: window.location.pathname, // Keeps the current path
        search: queryParams.toString(), // Set the updated query params
      },
      { replace: true },
    ); // This replaces the current entry in the history stack
  };

  // if (status === "loading") {
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         height: "100vh", // full viewport height
  //       }}
  //     >
  //       <Spin />
  //     </div>
  //   );
  // }
  return (
    <Card
      title="GL Report"
      bordered={false}
      styles={{
        // width: 300,
        // margin: "10px",
        body: {
          paddingTop: 0,
          paddingBottom: 16,
        },
      }}
    >
      <GeneralForm onSubmit={updateUrlParams} filters={filters} />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ ...th, width: "10%" }}>Date</th>
            <th style={th}>Type</th>
            <th style={th}>Transaction#</th>
            <th style={th}>Reference#</th>
            <th style={th}>Remarks</th>
            <th style={th}>Debit</th>
            <th style={th}>Credit</th>
            <th style={th}>Balance</th>
            <th style={{ ...th, width: "5%" }}></th>
          </tr>
        </thead>
        <tbody>
          {status === "loading" || !data?.length ? (
            <tr>
              <td colSpan={9} style={{ textAlign: "center", padding: "40px 0", height: "120px" }}>
                {status === "loading" ? <Spin /> : "No data"}
              </td>
            </tr>
          ) : (
            data.map((account) => (
              <React.Fragment key={account.id}>
                {/* Main account summary row */}
                <tr style={tr}>
                  <td colSpan={3} style={td}>
                    {account.name}
                  </td>
                  <td colSpan={2} style={td}>
                    {"Opening Balance"}
                  </td>
                  <td style={td}>
                    {account.normalBalance === NatureType.debit &&
                      convertToBD(account.balance.opening ?? 0)}
                  </td>
                  <td style={td}>
                    {account.normalBalance === NatureType.credit &&
                      convertToBD(account.balance.opening ?? 0)}
                  </td>
                  <td style={td}>{/* Empty cell */}</td>
                  <td style={td}>
                    <Button onClick={() => toggleRow(account.id)} type="text">
                      {expandedIds.includes(account.id) ? <DownOutlined /> : <RightOutlined />}
                    </Button>
                  </td>
                </tr>
                {/* Transactions - directly as sibling rows */}
                {expandedIds.includes(account.id) &&
                  account.transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      style={{ backgroundColor: "#fafafa", transition: "all 0.3s ease" }}
                    >
                      <td style={td}>{tx.createdAt}</td>
                      <td style={td}>{tx.type}</td>
                      <td style={td}>
                        <Link to={tx.sourceVoucher.id}></Link>
                      </td>
                      <td style={td}>{tx.referenceNo || ""}</td>
                      <td style={td}>{tx.remark || ""}</td>
                      <td style={td}>{tx.nature === NatureType.debit ? tx.amount : ""}</td>
                      <td style={td}>{tx.nature === NatureType.credit ? tx.amount : ""}</td>
                      <td style={td}>{convertToBD(tx.balance)}</td>
                      <td style={td}></td>
                    </tr>
                  ))}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
};

const th = {
  padding: "10px",
  border: "1px solid #ccc",
  textAlign: "left",
};

const td = {
  padding: "10px",
  borderTop: "1px solid #ccc", // keep horizontal border (optional)
  borderBottom: "1px solid #ccc",
  borderLeft: "none", // remove vertical borders
  borderRight: "none",
};

const tr = {
  borderBottom: "1px solid #ccc",
};
export default GLReport;
