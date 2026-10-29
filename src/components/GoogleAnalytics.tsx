"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const MEASUREMENT_ID = "G-WJDPRXW0CM";

/** Signed-in and sign-in pages: their URLs say who looks at health data, so analytics never runs there. */
const PRIVATE_PREFIXES = ["/admin", "/account", "/login", "/signup", "/logout", "/auth"];

const isPrivatePath = (pathname: string) =>
  PRIVATE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const disabled = isPrivatePath(pathname);

  // The app navigates without reloading, so a tag loaded on a public page would keep reporting after the visitor
  // moves into /account. Google's documented switch stops it for as long as it is set.
  useEffect(() => {
    (window as unknown as Record<string, boolean>)[`ga-disable-${MEASUREMENT_ID}`] = disabled;
  }, [disabled]);

  if (disabled) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${MEASUREMENT_ID}', {
              allow_google_signals: false,
              allow_ad_personalization_signals: false
            });
          `,
        }}
      />
    </>
  );
}
