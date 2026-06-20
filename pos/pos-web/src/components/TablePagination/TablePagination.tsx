import { Pagination, Row, Col } from "antd";

interface TablePaginationProps {
  meta: { page: number; pageSize: number; itemCount: number };
  label?: string;
  onChange: (page: number, pageSize: number) => void;
}

const TablePagination = ({ meta, label = "items", onChange }: TablePaginationProps) => {
  const start = meta.itemCount === 0 ? 0 : (meta.page - 1) * meta.pageSize + 1;
  const end = Math.min(meta.page * meta.pageSize, meta.itemCount);

  return (
    <Row justify="space-between" align="middle" style={{ marginTop: 16 }}>
      <Col>
        {meta.itemCount > 0
          ? `${start} - ${end} of ${meta.itemCount} ${label}`
          : `No ${label} found`}
      </Col>

      <Col>
        <Pagination
          size="small"
          current={meta.page}
          pageSize={meta.pageSize}
          total={meta.itemCount}
          showSizeChanger
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

export default TablePagination;
