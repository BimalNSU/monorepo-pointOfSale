import { Button, Col, Input, Row } from "antd";
type TableFilterBarProps = {
  searchTerm?: string | null;
  selectedNumbers?: number;
  onSelectPreview?: (showDrawer: boolean) => void;
  onSearch: (searchTerm?: string) => void;
};

const CustomerToolbar = ({
  searchTerm,
  selectedNumbers = 0,
  onSelectPreview,
  onSearch,
}: TableFilterBarProps) => {
  // const { useBreakpoint } = Grid;
  // const screens = useBreakpoint();
  // const isMobile = !screens.md;

  return (
    <Row gutter={[16, 10]} justify="space-between" style={{ margin: "5px" }}>
      <Col>
        <Input
          placeholder="Search by name, mobile or email"
          value={searchTerm || ""}
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
        {selectedNumbers > 0 && onSelectPreview && (
          <Button color="volcano" variant="filled" onClick={() => onSelectPreview(true)}>
            Selected ({selectedNumbers})
          </Button>
        )}
      </Col>
      {/* <Col>
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
      </Col> */}
    </Row>
  );
};
export default CustomerToolbar;
