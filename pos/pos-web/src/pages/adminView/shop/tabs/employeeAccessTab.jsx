import { Row, Col, List, Input, Tag, Card, Select, Button, Modal, Divider } from "antd";
import { useUsers } from "@/api/useUsers";
import { SHOP_ROLE, USER_ROLE } from "@pos/shared-models";
import { useState } from "react";
import { useDebounce } from "react-use";
import ShopService from "@/service/shop.service";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";

const { Search } = Input;
const { Option } = Select;

const EmployeeAccessTab = ({ shopId }) => {
  const { getToken, session } = useFirebaseAuth();
  const shopService = new ShopService();
  const { status, data: employees } = useUsers({
    isDeleted: false,
    role: USER_ROLE.VALUES.Employee,
  });

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [shopRole, setShopRole] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filtered, setFiltered] = useState([]);

  useDebounce(
    () => {
      if (!search) {
        setFiltered(employees || []);
      } else {
        setFiltered(
          employees?.filter((e) => e.fullName.toLowerCase().includes(search.toLowerCase())) || [],
        );
      }
    },
    300,
    [employees, search],
  );

  const selectEmployee = (emp) => {
    setSelected(emp);
    setShopRole(emp.shopRoles?.[shopId] ?? SHOP_ROLE.VALUES.N0_ACCESS);
  };

  const saveRole = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      shopRole === SHOP_ROLE.VALUES.N0_ACCESS
        ? await shopService.revokeShopAccess(shopId, selected.id, token, session.id)
        : await shopService.addShopAccess(shopId, selected.id, shopRole, token, session.id);
      setSelected(null);
      setShopRole(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Row gutter={[16, 16]}>
      {/* LEFT PANEL */}
      <Col xs={24} md={10}>
        <Card title="Employees">
          <Search
            placeholder="Search employee"
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            size="large"
          />

          <List
            loading={status === "loading"}
            style={{ marginTop: 12 }}
            dataSource={filtered}
            renderItem={(emp) => {
              const role = emp.shopRoles?.[shopId] ?? SHOP_ROLE.VALUES.N0_ACCESS;
              return (
                <List.Item
                  onClick={() => selectEmployee(emp)}
                  style={{
                    cursor: "pointer",
                    padding: "12px 8px",
                    borderRadius: 6,
                    background: selected?.id === emp.id ? "#f5f5f5" : undefined,
                  }}
                >
                  <List.Item.Meta
                    title={emp.fullName}
                    description={
                      <Tag color={SHOP_ROLE.KEYS[role].color}>{SHOP_ROLE.KEYS[role].text}</Tag>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </Card>
      </Col>

      {/* RIGHT PANEL */}
      <Col xs={24} md={14}>
        <Card title="Role Assignment">
          {!selected && (
            <div style={{ textAlign: "center", color: "#999" }}>
              Select an employee to manage access
            </div>
          )}

          {selected && (
            <>
              <h3 style={{ marginBottom: 0 }}>{selected.fullName}</h3>
              <p style={{ color: "#666" }}>{selected.email}</p>

              <Divider />

              <label style={{ fontWeight: 500 }}>Role</label>
              <Select
                value={shopRole}
                size="large"
                style={{ width: "100%", maxWidth: 400 }}
                onChange={setShopRole}
              >
                {Object.entries(SHOP_ROLE.KEYS).map(([id, { text }]) => (
                  <Option key={id} value={Number(id)}>
                    {text}
                  </Option>
                ))}
              </Select>

              <Divider />

              <Button
                type="primary"
                block
                loading={saving}
                disabled={
                  selected.shopRoles?.[shopId]
                    ? shopRole === selected.shopRoles[shopId]
                    : shopRole === SHOP_ROLE.VALUES.N0_ACCESS
                }
                onClick={() =>
                  Modal.confirm({
                    title: "Confirm role change",
                    content: (
                      <>
                        <p>
                          <b>{selected.fullName}</b>
                        </p>
                        <p>
                          {
                            SHOP_ROLE.KEYS[
                              selected.shopRoles?.[shopId] ?? SHOP_ROLE.VALUES.N0_ACCESS
                            ].text
                          }
                          {" → "}
                          {SHOP_ROLE.KEYS[shopRole].text}
                        </p>
                      </>
                    ),
                    onOk: saveRole,
                  })
                }
              >
                Save Changes
              </Button>
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default EmployeeAccessTab;
