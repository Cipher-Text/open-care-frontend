// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Avatar,
  Descriptions,
  Button,
  Spin,
  Tabs,
  List,
  message,
  Space,
  Form,
  Row,
  Col,
  Input,
  Empty,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { fetchUserProfile } from "../services/api";
import { User } from "../types";

const { Title } = Typography;
const { TabPane } = Tabs;

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUser(data);
        setEditedUser(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        message.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Discard changes
      setEditedUser(user);
      form.resetFields();
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    // Here you would typically send the updated profile to your API
    // For now, we'll just update the local state
    setUser(editedUser);
    setIsEditing(false);
    message.success("Profile updated successfully");
  };

  const handleInputChange = (field: keyof User, value: string) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [field]: value,
      });
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  // Mock data for favorite items
  const favoriteDoctors = [
    { id: "1", name: "Dr. John Smith", specialization: "Cardiology" },
    { id: "2", name: "Dr. Sarah Johnson", specialization: "Neurology" },
  ];

  const favoriteHospitals = [
    { id: "1", name: "Central Hospital", address: "123 Main St" },
    { id: "2", name: "City Medical Center", address: "456 Park Ave" },
  ];

  return (
    <div className="profile-container">
      <Title level={2}>My Profile</Title>

      <Card
        style={{ marginBottom: 24 }}
        extra={
          isEditing ? (
            <Space>
              <Button
                icon={<SaveOutlined />}
                type="primary"
                onClick={handleSaveProfile}
              >
                Save
              </Button>
              <Button icon={<CloseOutlined />} onClick={handleEditToggle}>
                Cancel
              </Button>
            </Space>
          ) : (
            <Button icon={<EditOutlined />} onClick={handleEditToggle}>
              Edit Profile
            </Button>
          )
        }
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Avatar
            size={100}
            src={user?.image}
            icon={<UserOutlined />}
            style={{ marginBottom: 16 }}
          />
          <Title level={3}>{user?.name}</Title>
          <Typography.Text type="secondary">{user?.role}</Typography.Text>
        </div>

        {isEditing ? (
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Name">
                  <Input
                    value={editedUser?.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    prefix={<UserOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Email">
                  <Input
                    value={editedUser?.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    prefix={<MailOutlined />}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Role">
                  <Input
                    value={editedUser?.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ) : (
          <Descriptions bordered column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Name">{user?.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
            <Descriptions.Item label="Role">{user?.role}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Favorite Doctors" key="1">
            <List
              itemLayout="horizontal"
              dataSource={favoriteDoctors}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={item.name}
                    description={item.specialization}
                  />
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="Favorite Hospitals" key="2">
            <List
              itemLayout="horizontal"
              dataSource={favoriteHospitals}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<BankOutlined />} />}
                    title={item.name}
                    description={item.address}
                  />
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="Appointments" key="3">
            <Empty description="No appointments found" />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Profile;
