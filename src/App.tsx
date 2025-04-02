// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import AppHeader from "./components/AppHeader";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Hospitals from "./pages/Hospitals";
import Institutes from "./pages/Institutes";
import Profile from "./pages/Profile";
import "./App.css";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";

const { Content, Footer } = Layout;

const App: React.FC = () => {
	return (
		<Router>
			<Layout className="layout" style={{ minHeight: "100vh" }}>
				<AppHeader />
				<Content style={{ padding: "0 50px", marginTop: 64 }}>
					<div className="site-layout-content">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/doctors" element={<Doctors />} />
							<Route path="/hospitals" element={<Hospitals />} />
							<Route
								path="/institutes"
								element={
									<ErrorBoundary>
										<Institutes />
									</ErrorBoundary>
								}
							/>
							<Route path="/profile" element={<Profile />} />
						</Routes>
					</div>
				</Content>
				<Footer style={{ textAlign: "center" }}>
					Medical Information Portal ©{new Date().getFullYear()} Created with
					Ant Design
				</Footer>
			</Layout>
		</Router>
	);
};

export default App;
