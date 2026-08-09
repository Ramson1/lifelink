"use client";

import { useEffect, useState } from "react";

/** Roles that have full CRUD access in the admin dashboard. */
const CRUD_ROLES = new Set([
  "super_admin",
  "chairman",
  "director_it_digital_assets",
]);

interface AdminSession {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_super_admin: boolean;
}

interface PermissionsState {
  /** True once the session has been fetched (even if no admin). */
  loaded: boolean;
  session: AdminSession | null;
  /** Whether the current admin has full CRUD permissions. */
  canCrud: boolean;
}

export function useAdminPermissions() {
  const [state, setState] = useState<PermissionsState>({
    loaded: false,
    session: null,
    canCrud: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/auth/me");
        if (!res.ok) {
          setState({ loaded: true, session: null, canCrud: false });
          return;
        }
        const json = await res.json();
        const admin: AdminSession = json.admin;
        const canCrud =
          admin.is_super_admin || CRUD_ROLES.has(admin.role);
        setState({ loaded: true, session: admin, canCrud });
      } catch {
        setState({ loaded: true, session: null, canCrud: false });
      }
    })();
  }, []);

  return state;
}
