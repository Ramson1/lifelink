export const ADMIN_ROLES = [
  "super_admin",
  "chairman",
  "director_humanitarian",
  "director_business_operations",
  "director_trade_investments",
  "director_it_digital_assets",
  "director_finance_procurement",
  "director_admin_cooperative",
  "manager_mlm_affiliate",
  "corporate_manager_spokesperson",
  "manager_agriinvestment_foodbank",
  "hod_accounts_audit",
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  chairman: "Chairman, Board of Trustees / Director General",
  director_humanitarian: "Director of Humanitarian & Grassroot Projects",
  director_business_operations: "Director of Business Operations",
  director_trade_investments: "Director of Trade and Investments",
  director_it_digital_assets:
    "Director of Information Technology & Digital Assets",
  director_finance_procurement: "Director of Finance & Procurement",
  director_admin_cooperative:
    "Director of Administration & Cooperative Department",
  manager_mlm_affiliate:
    "Manager, Multi-Level Marketing & Affiliate Marketing",
  corporate_manager_spokesperson:
    "Corporate Manager and Official Spokesperson",
  manager_agriinvestment_foodbank:
    "Manager, Agriinvestment & Foodbank Projects",
  hod_accounts_audit: "Head of Department, Accounts and Audit",
};

export function isValidRole(role: string): role is AdminRole {
  return (ADMIN_ROLES as readonly string[]).includes(role);
}

/** Roles that have full CRUD / backup access in the admin dashboard. */
export const CRUD_ROLES = new Set<string>([
  "super_admin",
  "chairman",
  "director_it_digital_assets",
]);

/**
 * Server-side counterpart to the client `useAdminPermissions` gate.
 * Super admins always pass; otherwise the role must be in CRUD_ROLES.
 */
export function canCrudRole(session: {
  role: string;
  is_super_admin: boolean;
}): boolean {
  return session.is_super_admin || CRUD_ROLES.has(session.role);
}
