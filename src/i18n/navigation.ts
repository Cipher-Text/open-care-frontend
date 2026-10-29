import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/** Locale-aware Link, usePathname and so on, for links between public pages. Links to /login, /signup, /account and /admin use next/link. */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
