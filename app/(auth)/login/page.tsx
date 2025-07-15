"use client";

import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import type { Rule } from "antd/es/form";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../src/contexts/AuthContext";

const { Title, Text } = Typography;

interface LoginFormValues {
	email: string;
	password: string;
}

interface LoginError {
	message: string;
}

const VALIDATION_RULES: Record<string, Rule[]> = {
	email: [
		{ required: true, message: "Please input your email!" },
		{ type: "email" as const, message: "Please enter a valid email!" },
	],
	password: [{ required: true, message: "Please input your password!" }],
};

const styles = {
	container: {
		minHeight: "100vh",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
	},
	card: {
		width: "100%",
		maxWidth: 400,
		boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
		borderRadius: "12px",
	},
	header: {
		textAlign: "center" as const,
		marginBottom: 32,
	},
	title: {
		color: "#1890ff",
	},
	footer: {
		textAlign: "center" as const,
		marginTop: 24,
	},
	forgotPassword: {
		float: "right" as const,
	},
	submitButton: {
		width: "100%",
		height: 45,
		marginTop: 16,
	},
};

export default function LoginPage() {
	const router = useRouter();
	const { login } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<LoginError | null>(null);

	const onFinish = async (values: LoginFormValues) => {
		setLoading(true);
		setError(null);

		try {
			await login(values.email, values.password);
			message.success("Login successful!");
			router.push("/");
		} catch (err: Error | unknown) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Login failed. Please check your credentials.";
			setError({
				message: errorMessage,
			});
			message.error("Login failed. Please check your credentials.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={styles.container}>
			<Card style={styles.card}>
				<div style={styles.header}>
					<Title level={2} style={styles.title}>
						Welcome Back
					</Title>
					<Text type="secondary">Sign in to your account to continue</Text>
				</div>

				{error && (
					<div style={{ marginBottom: 16, color: "#ff4d4f" }}>
						{error.message}
					</div>
				)}

				<Form
					name="login"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					layout="vertical"
				>
					<Form.Item name="email" label="Email" rules={VALIDATION_RULES.email}>
						<Input
							prefix={<MailOutlined />}
							placeholder="Enter your email"
							size="large"
						/>
					</Form.Item>

					<Form.Item
						name="password"
						label={
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									width: "100%",
								}}
							>
								<span>Password</span>
								<Link href="/forgot-password" style={{ fontSize: 14 }}>
									Forgot password?
								</Link>
							</div>
						}
						rules={VALIDATION_RULES.password}
					>
						<Input.Password
							prefix={<LockOutlined />}
							placeholder="Enter your password"
							size="large"
						/>
					</Form.Item>

					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							style={styles.submitButton}
							loading={loading}
							size="large"
						>
							Sign In
						</Button>
					</Form.Item>
				</Form>

				<div style={styles.footer}>
					<Text type="secondary">
						Don't have an account? <Link href="/register">Sign up</Link>
					</Text>
				</div>
			</Card>
		</div>
	);
}
