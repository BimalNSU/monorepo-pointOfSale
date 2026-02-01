import { Row, Col, List, Input, Tag, Card, Select, Button, Modal, Divider } from "antd";
// import { useShopEmployees } from "../hooks/useShopEmployees";
import { SHOP_ROLES } from "../../../../constants/posRoles";
import { useUsers } from "@/api/useUsers";
import { USER_ROLE } from "@/constants/role";
import { useState } from "react";
import { useDebounce } from "react-use";
import ShopService from "@/service/shop.service";
import { useFirebaseAuth } from "@/utils/hooks/useFirebaseAuth";

const { Search } = Input;
const { Option } = Select;

const EmployeeAccessTab = ({ shopId }) => {
  const { getToken, session } = useFirebaseAuth();
  const shopService = new ShopService();
  //   const employees = useShopEmployees(shopId);
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
        setFiltered(employees);
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
    setShopRole(emp.shopRoles ? emp.shopRoles[shopId] : SHOP_ROLES.VALUES.N0_ACCESS);
  };

  const saveRole = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      shopRole === SHOP_ROLES.VALUES.N0_ACCESS
        ? await shopService.revokeShopAccess(shopId, selected.id, token, session.id)
        : await shopService.addShopAccess(shopId, selected.id, shopRole, token, session.id);
      setSaving(false);
      setSelected();
      setShopRole();
    } catch (err) {
      setSaving(false);
    }
  };

  return (
    <Row gutter={16}>
      {/* LEFT PANEL */}
      <Col span={8}>
        <Card title="Employees">
          <Search
            placeholder="Search employee"
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />

          <List
            loading={status === "loading"}
            style={{ marginTop: 12 }}
            dataSource={filtered}
            renderItem={(emp) => (
              <List.Item
                onClick={() => selectEmployee(emp)}
                style={{
                  cursor: "pointer",
                  background: selected?.id === emp.id ? "#f5f5f5" : undefined,
                }}
              >
                <List.Item.Meta
                  title={emp.fullName}
                  description={
                    <Tag
                      color={
                        SHOP_ROLES.KEYS[
                          (emp.shopRoles && emp.shopRoles[shopId]) || SHOP_ROLES.VALUES.N0_ACCESS
                        ].color
                      }
                    >
                      {
                        SHOP_ROLES.KEYS[
                          (emp.shopRoles && emp.shopRoles[shopId]) || SHOP_ROLES.VALUES.N0_ACCESS
                        ].text
                      }
                    </Tag>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>

      {/* RIGHT PANEL */}
      <Col span={16}>
        <Card title="Role Assignment">
          {!selected && (
            <div style={{ textAlign: "center", color: "#999" }}>
              Select an employee to manage access
            </div>
          )}

          {selected && (
            <>
              <h3>{selected.fullName}</h3>
              <p>{selected?.email}</p>

              <Divider />

              <label>Role</label>
              <Select value={shopRole} size="large" style={{ width: 300 }} onChange={setShopRole}>
                {Object.entries(SHOP_ROLES.KEYS).map(([id, { text }]) => (
                  <Option
                    key={Number(id)}
                    value={Number(id)}
                    // disabled={id === role}
                  >
                    {text}
                  </Option>
                ))}
              </Select>

              <Divider />

              {/* <h4>Permissions</h4>
              {ROLE_PERMISSIONS[role].map((p) => (
                <Tag key={p} color="green">
                  {p}
                </Tag>
              ))} */}

              <Divider />

              <Button
                type="primary"
                disabled={
                  selected.shopRoles
                    ? shopRole === selected.shopRoles[shopId]
                    : shopRole === SHOP_ROLES.VALUES.N0_ACCESS
                }
                loading={saving}
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
                            SHOP_ROLES.KEYS[
                              selected.shopRoles
                                ? selected.shopRoles[shopId]
                                : SHOP_ROLES.VALUES.N0_ACCESS
                            ].text
                          }{" "}
                          → {SHOP_ROLES.KEYS[shopRole].text}
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
