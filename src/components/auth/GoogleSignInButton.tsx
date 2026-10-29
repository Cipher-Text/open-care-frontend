import { Button } from "@/components/ui/button";

/** A plain link, not next/link: it starts a redirect handled by a route, which must not be prefetched. */
export function GoogleSignInButton({ label = "Continue with Google" }: { label?: string }) {
	return (
		<Button asChild variant="outline" className="h-11 w-full">
			{/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a route handler that redirects to Google, not a page */}
			<a href="/auth/google">
				<svg viewBox="0 0 48 48" className="mr-2 size-5" aria-hidden="true">
					<path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
					<path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
					<path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
					<path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
				</svg>
				{label}
			</a>
		</Button>
	);
}

/** "or" between the password form and the Google button. */
export function OrDivider() {
	return (
		<div className="relative my-1" role="separator">
			<div className="absolute inset-0 flex items-center">
				<span className="w-full border-t border-border" />
			</div>
			<div className="relative flex justify-center text-xs uppercase">
				<span className="bg-card px-2 text-muted-foreground">or</span>
			</div>
		</div>
	);
}
