"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchCapabilities, type Capabilities } from "@/api/capabilities";
import { getSession } from "@/lib/session-client";

// One shared request per minute, so every component on a page uses the same answer
let cached: { at: number; promise: Promise<Capabilities> } | null = null;
const TTL_MS = 60_000;

function capabilities(): Promise<Capabilities> {
  if (!cached || Date.now() - cached.at > TTL_MS) {
    const promise = fetchCapabilities();
    cached = { at: Date.now(), promise };
    // A failed call is not kept, so the next component asks again
    promise.catch(() => {
      if (cached?.promise === promise) cached = null;
    });
  }
  return cached.promise;
}

/**
 * The signed-in person's permissions: the API's answer (read from Keycloak, so a role change applies without a
 * new login), or the permissions the server read from the sign-in cookie (`/api/session`) if the API cannot be reached.
 */
export const usePermissions = () => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  // The session is read after mount, so until then "no permission" only means "not known yet"
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    getSession().then((session) => {
      if (!active) return;
      if (!session.signedIn) {
        setReady(true);
        return;
      }
      setPermissions(session.permissions ?? []);
      // Ready once the API has answered (or failed, then the cookie's permissions stand), so a stale token
      // never flashes "no access" for a page the person was just given
      capabilities()
        .then((latest) => {
          if (!active) return;
          setPermissions(latest.permissions);
          setFeatures(latest.features ?? {});
        })
        .catch(() => {
          // Keep what the sign-in cookie said
        })
        .finally(() => {
          if (active) setReady(true);
        });
    });
    return () => {
      active = false;
    };
  }, []);

  const hasPermission = useCallback(
    (permission: string) => permissions.includes(permission),
    [permissions]
  );
  const hasFeature = useCallback((name: string) => features[name] === true, [features]);

  return { permissions, hasPermission, hasFeature, ready };
};
