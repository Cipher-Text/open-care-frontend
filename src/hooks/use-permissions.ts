"use client";

import { useCallback, useEffect, useState } from "react";
import { getUserSession } from "@/lib/auth-client";
import { getPermissionsFromToken, hasPermission } from "@/lib/permissions";

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<string[]>([]);
  // The token is read after mount, so until then "no permission" only means "not known yet"
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getUserSession()?.access_token;
    setPermissions(getPermissionsFromToken(token));
    setReady(true);
  }, []);

  const can = useCallback(
    (permission: string) => hasPermission(permission, permissions),
    [permissions]
  );

  return { permissions, hasPermission: can, ready };
};
