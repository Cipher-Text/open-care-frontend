"use client";

import { useCallback, useEffect, useState } from "react";
import { getUserSession } from "@/lib/auth-client";
import { permissionsFromToken } from "@/lib/token-permissions";

/** The signed-in person's permissions, read from their access token. */
export const usePermissions = () => {
  const [permissions, setPermissions] = useState<string[]>([]);
  // The token is read after mount, so until then "no permission" only means "not known yet"
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getUserSession()?.access_token;
    setPermissions([...permissionsFromToken(token)]);
    setReady(true);
  }, []);

  const hasPermission = useCallback(
    (permission: string) => permissions.includes(permission),
    [permissions]
  );

  return { permissions, hasPermission, ready };
};
