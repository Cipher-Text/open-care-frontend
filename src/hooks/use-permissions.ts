"use client";

import { useCallback, useMemo } from "react";
import { getUserSession } from "@/lib/auth-client";
import { getPermissionsFromToken, hasPermission } from "@/lib/permissions";

export const usePermissions = () => {
  const token = getUserSession()?.access_token;
  const permissions = useMemo(
    () => getPermissionsFromToken(token),
    [token]
  );

  const can = useCallback(
    (permission: string) => hasPermission(permission, permissions),
    [permissions]
  );

  return { permissions, hasPermission: can };
};
