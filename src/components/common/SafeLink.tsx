import type { AnchorHTMLAttributes } from "react";
import { safeUrl } from "@/lib/safe-url";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href?: string | null };

/** An external link (opens in a new tab) built from backend data. If the address is not a safe http(s)/mailto/tel one, only the text is shown. */
export function SafeLink({ href, children, className, ...rest }: Props) {
	const safe = safeUrl(href);
	if (!safe) return <span className={className}>{children}</span>;
	return (
		<a href={safe} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
			{children}
		</a>
	);
}
