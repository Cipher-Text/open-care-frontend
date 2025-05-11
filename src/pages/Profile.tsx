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
  Timeline,
  Tag,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  BankOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { fetchUserProfile } from "../services/api";
import { User } from "../types";
import { useAuth } from "../contexts/AuthContext";

const { Title } = Typography;
const { TabPane } = Tabs;

const Profile: React.FC = () => {
  useAuth();
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

  // Mock medical history data
  const medicalHistory = [
    {
      date: "2024-03-15",
      type: "Check-up",
      doctor: "Dr. John Smith",
      diagnosis: "Regular health check-up",
      prescription: "Vitamin D supplements",
    },
    {
      date: "2024-02-20",
      type: "Consultation",
      doctor: "Dr. Sarah Johnson",
      diagnosis: "Seasonal allergies",
      prescription: "Antihistamines",
    },
  ];

  // Mock upcoming appointments
  const upcomingAppointments = [
    {
      id: "1",
      date: "2024-04-10",
      time: "10:00 AM",
      doctor: "Dr. Michael Chang",
      specialization: "Cardiology",
      hospital: "Central Hospital",
    },
    {
      id: "2",
      date: "2024-04-15",
      time: "2:30 PM",
      doctor: "Dr. Emily Rodriguez",
      specialization: "Dermatology",
      hospital: "City Medical Center",
    },
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
          <TabPane
            tab={
              <span>
                <CalendarOutlined />
                Upcoming Appointments
              </span>
            }
            key="1"
          >
            <List
              itemLayout="horizontal"
              dataSource={upcomingAppointments}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link">Reschedule</Button>,
                    <Button type="link" danger>
                      Cancel
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={item.doctor}
                    description={
                      <>
                        <div>
                          <CalendarOutlined /> {item.date} at {item.time}
                        </div>
                        <div>
                          <BankOutlined /> {item.hospital}
                        </div>
                        <div>
                          <MedicineBoxOutlined /> {item.specialization}
                        </div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <FileTextOutlined />
                Medical History
              </span>
            }
            key="2"
          >
            <Timeline mode="left">
              {medicalHistory.map((record, index) => (
                <Timeline.Item key={index} label={record.date} color="blue">
                  <Card size="small" style={{ marginBottom: 16 }}>
                    <p>
                      <strong>Type:</strong> {record.type}
                    </p>
                    <p>
                      <strong>Doctor:</strong> {record.doctor}
                    </p>
                    <p>
                      <strong>Diagnosis:</strong> {record.diagnosis}
                    </p>
                    <p>
                      <strong>Prescription:</strong> {record.prescription}
                    </p>
                  </Card>
                </Timeline.Item>
              ))}
            </Timeline>
          </TabPane>

          <TabPane
            tab={
              <span>
                <HeartOutlined />
                Health Records
              </span>
            }
            key="3"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Card title="Vital Signs">
                  <Descriptions column={1}>
                    <Descriptions.Item label="Blood Pressure">
                      120/80 mmHg
                    </Descriptions.Item>
                    <Descriptions.Item label="Heart Rate">
                      72 bpm
                    </Descriptions.Item>
                    <Descriptions.Item label="Temperature">
                      98.6°F
                    </Descriptions.Item>
                    <Descriptions.Item label="Blood Group">
                      <Tag color="red">O+</Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card title="Allergies">
                  <List
                    size="small"
                    dataSource={["Pollen", "Penicillin"]}
                    renderItem={(item) => (
                      <List.Item>
                        <Tag color="orange">{item}</Tag>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Profile;
