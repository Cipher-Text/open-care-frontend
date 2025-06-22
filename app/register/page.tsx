"use client";

import React from "react";
import {
	Form,
	Input,
	Button,
	Card,
	Typography,
	DatePicker,
	Select,
	message,
} from "antd";
import {
	UserOutlined,
	LockOutlined,
	MailOutlined,
	PhoneOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;
const { Option } = Select;

export default function RegisterPage() {
	const router = useRouter();
	const [form] = Form.useForm();

	interface RegisterFormValues {
		name: string;
		email: string;
		phone: string;
		dateOfBirth: Date;
		bloodGroup: string;
		password: string;
		confirmPassword: string;
	}

	const onFinish = async (values: RegisterFormValues) => {
		try {
			// Here you would typically make an API call to your backend
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			if (!response.ok) {
				throw new Error("Registration failed");
			}

			message.success("Registration successful! Please login.");
			router.push("/login");
		} catch {
			message.error("Registration failed. Please try again.");
		}
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
				padding: "20px",
			}}
		>
			<Card
				style={{
					width: "100%",
					maxWidth: 600,
					boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
					borderRadius: "12px",
				}}
			>
				<div style={{ textAlign: "center", marginBottom: 32 }}>
					<Title level={2} style={{ color: "#1890ff" }}>
						Create Account
					</Title>
					<Text type="secondary">Join our medical information portal</Text>
				</div>

				<Form
					form={form}
					name="register"
					onFinish={onFinish}
					layout="vertical"
					size="large"
				>
					<Form.Item
						name="name"
						rules={[{ required: true, message: "Please input your name!" }]}
					>
						<Input prefix={<UserOutlined />} placeholder="Full Name" />
					</Form.Item>

					<Form.Item
						name="email"
						rules={[
							{ required: true, message: "Please input your email!" },
							{ type: "email", message: "Please enter a valid email!" },
						]}
					>
						<Input prefix={<MailOutlined />} placeholder="Email" />
					</Form.Item>

					<Form.Item
						name="phone"
						rules={[
							{ required: true, message: "Please input your phone number!" },
						]}
					>
						<Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
					</Form.Item>

					<Form.Item
						name="dateOfBirth"
						rules={[
							{ required: true, message: "Please select your date of birth!" },
						]}
					>
						<DatePicker style={{ width: "100%" }} placeholder="Date of Birth" />
					</Form.Item>

					<Form.Item
						name="bloodGroup"
						rules={[
							{ required: true, message: "Please select your blood group!" },
						]}
					>
						<Select placeholder="Blood Group">
							<Option value="A+">A+</Option>
							<Option value="A-">A-</Option>
							<Option value="B+">B+</Option>
							<Option value="B-">B-</Option>
							<Option value="AB+">AB+</Option>
							<Option value="AB-">AB-</Option>
							<Option value="O+">O+</Option>
							<Option value="O-">O-</Option>
						</Select>
					</Form.Item>

					<Form.Item
						name="password"
						rules={[
							{ required: true, message: "Please input your password!" },
							{ min: 6, message: "Password must be at least 6 characters!" },
						]}
					>
						<Input.Password prefix={<LockOutlined />} placeholder="Password" />
					</Form.Item>

					<Form.Item
						name="confirmPassword"
						dependencies={["password"]}
						rules={[
							{ required: true, message: "Please confirm your password!" },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue("password") === value) {
										return Promise.resolve();
									}
									return Promise.reject(new Error("Passwords do not match!"));
								},
							}),
						]}
					>
						<Input.Password
							prefix={<LockOutlined />}
							placeholder="Confirm Password"
						/>
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" block>
							Register
						</Button>
					</Form.Item>

					<div style={{ textAlign: "center" }}>
						<Text type="secondary">Already have an account? </Text>
						<Link href="/login">Sign in</Link>
					</div>
				</Form>
			</Card>
		</div>
	);
}
