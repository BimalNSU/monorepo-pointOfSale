import { DATE_FORMAT } from "@/constants/dateFormat";
import { Table } from "antd";
import { useMemo } from "react";
import dayjs from "dayjs";

const AnnouncementTable = ({ announcements }) => {
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
  ];

  const tableData = useMemo(
    () =>
      announcements?.map((item) => {
        return {
          key: item.id,
          date: item.publishedAt ? dayjs(item.publishedAt).format(DATE_FORMAT) : "N/A",
          description: item.description,
        };
      }) || [][announcements],
  );

  return (
    <>
      <Table columns={columns} dataSource={tableData} />
    </>
  );
};

export default AnnouncementTable;
