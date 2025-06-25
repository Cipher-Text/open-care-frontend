import AppHeader from "./components/AppHeader";
import { Providers } from "./components/Providers";
import "antd/dist/reset.css"; // Import Ant Design styles
import "../src/index.css"; // Import global CSS
import "../src/App.css"; // Import application-specific styles
import { Layout } from "antd";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Open care",
	description: "Find the best hospitals, doctors, and healthcare institutions",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<Layout>
						<AppHeader />
						<Layout
							className="container"
							style={{
								marginTop: "5rem", // Adjust for fixed header height
							}}
						>
							<div id="root">{children}</div>
						</Layout>
					</Layout>
				</Providers>
			</body>
		</html>
	);
}
