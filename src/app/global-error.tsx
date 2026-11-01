"use client";

/**
 * Last resort: shown when the root layout itself fails to render. It replaces the whole page, so it brings its own html
 * and body and uses no app styles or providers. It never shows the error text, only a reference for the support team.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<html lang="en">
			<body style={{ fontFamily: "system-ui, sans-serif", margin: 0, display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#f8fafc", color: "#0f172a" }}>
				<div role="alert" style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
					<h1 style={{ fontSize: 22, marginBottom: 8 }}>Something went wrong</h1>
					<p style={{ marginBottom: 16, color: "#475569" }}>The page could not be shown. Try again, or come back in a few minutes.</p>
					{error.digest && <p style={{ marginBottom: 16, fontSize: 12, color: "#64748b" }}>Reference: {error.digest}</p>}
					<button type="button" onClick={reset} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}>
						Try again
					</button>
				</div>
			</body>
		</html>
	);
}
