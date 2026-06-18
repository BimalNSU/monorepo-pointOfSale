import { DeleteOutlined, ExportOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Col, Dropdown, Grid, Input, Row, Space } from "antd";
type TableFilterBarProps = {
  isAdmin: boolean;
  searchTerm?: string | null;
  selectedRow?: number;
  onSearch: (searchTerm?: string) => void;
  onDelete?: () => void;
  onExport?: () => void;
};

const CustomerToolbar = ({
  isAdmin = false,
  searchTerm,
  selectedRow = 0,
  onSearch,
  onDelete,
  onExport,
}: TableFilterBarProps) => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <Row gutter={[16, 10]} justify="space-between">
      <Col>
        <Input
          placeholder="Search by name, mobile or email"
          value={searchTerm || ""}
          // onChange={(e) => setSearch(e.target.value)}
          onChange={(e) => onSearch?.(e.target.value)}
          allowClear
        />
        {/* <Search
                    placeholder="Search customer"
                    defaultValue={search}
                    onSearch={(value) => updateParams({ page: 1, search: value })}
                    style={{ width: 250, marginBottom: 16 }}
                  /> */}
      </Col>
      <Col>
        {selectedRow > 0 &&
          (isMobile ? (
            <Dropdown
              menu={{
                items: [
                  ...(isAdmin
                    ? [
                        {
                          key: "delete",
                          label: "Delete Selected",
                          icon: <DeleteOutlined />,
                          danger: true,
                          onClick: onDelete,
                        },
                      ]
                    : []),
                  {
                    key: "export",
                    label: "Export Selected",
                    icon: <ExportOutlined />,
                    onClick: onExport,
                  },
                ],
              }}
            >
              <Button icon={<MoreOutlined />} />
            </Dropdown>
          ) : (
            <Space>
              {isAdmin && (
                <Button color="danger" variant="solid" icon={<DeleteOutlined />} onClick={onDelete}>
                  Delete ({selectedRow})
                </Button>
              )}
              <Button icon={<ExportOutlined />} onClick={onExport}>
                Export
              </Button>
            </Space>
          ))}
      </Col>
    </Row>
  );
};
export default CustomerToolbar;
