import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import type { Rule } from "antd/es/form";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
  password: [
    { required: true, message: "Please input your password!" },
  ],
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
  },
} as const;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form] = Form.useForm<LoginFormValues>();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      await login(values.email, values.password);
      message.success("Login successful!");
      navigate("/profile");
    } catch (error) {
      const loginError = error as LoginError;
      message.error(loginError.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormItems = () => (
    <>
      <Form.Item
        name="email"
        rules={VALIDATION_RULES.email}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={VALIDATION_RULES.password}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          block 
          loading={isLoading}
        >
          Sign In
        </Button>
      </Form.Item>
    </>
  );

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.header}>
          <Title level={2} style={styles.title}>
            Welcome Back
          </Title>
          <Text type="secondary">
            Sign in to access your medical information
          </Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          {renderFormItems()}

          <div style={styles.footer}>
            <Text type="secondary">Don't have an account? </Text>
            <Link to="/register">Register now</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
