export const AGREEMENT_STATUS = {
  pending: { status: "pending", text: "Pending", color: "processing" },
  ownerAccepted: { status: "ownerAccepted", text: "Owner Accepted", color: "success" },
  ownerRejected: { status: "ownerRejected", text: "Owner Rejected", color: "red" },
  tenantAccepted: { status: "tenantAccepted", text: "Tenant Accepted", color: "success" },
  tenantRejected: { status: "tenantRejected", text: "Tenant Rejected", color: "red" },
  active: { status: "active", text: "Active", color: "success" },
  cancelled: { status: "cancelled", text: "Cancelled", color: "red" },
  expired: { status: "expired", text: "Expired", color: "ash" },
  revoked: { status: "revoked", text: "Revoked", color: "red" },
};
