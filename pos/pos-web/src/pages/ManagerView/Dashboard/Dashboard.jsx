import CommercialDashboardManager from "@/components/Dashboard/CommercialDashboardManager";
import ResidentialDashboardManager from "@/components/Dashboard/ResidentialDashboardManager";
import { useCustomProperty } from "@/utils/hooks/customProperty";

const Dashboard = () => {
  const { type, propertyId, tenantIds } = useCustomProperty();

  return (
    <div>
      {type === "residential" ? (
        <ResidentialDashboardManager propertyId={propertyId} tenantIds={tenantIds} />
      ) : (
        <CommercialDashboardManager propertyId={propertyId} tenantIds={tenantIds} />
      )}
    </div>
  );
};
export default Dashboard;
