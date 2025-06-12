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
  Select,
  DatePicker,
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
  IdcardOutlined,
  PhoneOutlined,
  HomeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { fetchUserProfile } from "../services/api";
import { User } from "../types";
import { useAuth } from "../contexts/AuthContext";
import moment from "moment";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

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

  const handleInputChange = (field: keyof User, value: any) => {
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
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={2}>My Profile</Title>
        {!isEditing ? (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEditToggle}
          >
            Edit Profile
          </Button>
        ) : (
          <Space>
            <Button
              icon={<SaveOutlined />}
              type="primary"
              onClick={handleSaveProfile}
            >
              Save Changes
            </Button>
            <Button icon={<CloseOutlined />} onClick={handleEditToggle}>
              Cancel
            </Button>
          </Space>
        )}
      </div>

      <Card
        bordered={false}
        className="profile-card"
        style={{ marginBottom: 24, boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}
      >
        <Row gutter={[24, 24]}>
          {/* Left column - Profile picture */}
          <Col xs={24} md={8}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                size={180}
                src={user?.photo}
                icon={<UserOutlined />}
                style={{
                  marginBottom: 16,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#1890ff",
                }}
              />
              <Title level={3} style={{ margin: "16px 0 4px 0" }}>
                {user?.name}
              </Title>
              <Tag color="blue" style={{ marginBottom: 8 }}>
                {user?.userType}
              </Tag>
              <Text type="secondary">
                {user?.district?.name}, {user?.district?.division?.name}
              </Text>
            </div>
          </Col>

          {/* Right column - User information */}
          <Col xs={24} md={16}>
            <div style={{ height: "100%" }}>
              <Title level={4} style={{ marginBottom: 24 }}>
                Personal Information
              </Title>

              {isEditing ? (
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={editedUser || {}}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Full Name"
                        name="name"
                        rules={[
                          { required: true, message: "Please enter your name" },
                        ]}
                      >
                        <Input
                          value={editedUser?.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          prefix={<UserOutlined />}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your email",
                          },
                          {
                            type: "email",
                            message: "Please enter a valid email",
                          },
                        ]}
                      >
                        <Input
                          value={editedUser?.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          prefix={<MailOutlined />}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Gender" name="gender">
                        <Select
                          value={editedUser?.gender}
                          onChange={(value) =>
                            handleInputChange("gender", value)
                          }
                        >
                          <Option value="MALE">Male</Option>
                          <Option value="FEMALE">Female</Option>
                          <Option value="OTHER">Other</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Date of Birth" name="dateOfBirth">
                        <DatePicker
                          style={{ width: "100%" }}
                          value={
                            editedUser?.dateOfBirth
                              ? moment(editedUser.dateOfBirth)
                              : null
                          }
                          onChange={(date) =>
                            handleInputChange(
                              "dateOfBirth",
                              date?.format("YYYY-MM-DD")
                            )
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Phone Number" name="phone">
                        <Input
                          value={editedUser?.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          prefix={<PhoneOutlined />}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Blood Group" name="bloodGroup">
                        <Select
                          value={editedUser?.bloodGroup}
                          onChange={(value) =>
                            handleInputChange("bloodGroup", value)
                          }
                        >
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
                    </Col>
                  </Row>

                  <Form.Item label="Address" name="address">
                    <Input.TextArea
                      value={editedUser?.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      rows={2}
                    />
                  </Form.Item>
                </Form>
              ) : (
                <div className="user-info">
                  <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12}>
                      <div className="info-item">
                        <UserOutlined className="info-icon" />
                        <div>
                          <Text type="secondary">Full Name</Text>
                          <div>
                            <Text strong>{user?.name || "Not provided"}</Text>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col xs={24} sm={12}>
                      <div className="info-item">
                        <MailOutlined className="info-icon" />
                        <div>
                          <Text type="secondary">Email</Text>
                          <div>
                            <Text strong>{user?.email || "Not provided"}</Text>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col xs={24} sm={12}>
                      <div className="info-item">
                        <IdcardOutlined className="info-icon" />
                        <div>
                          <Text type="secondary">Gender</Text>
                          <div>
                            <Text strong>
                              {user?.gender
                                ? user.gender.charAt(0) +
                                  user.gender.slice(1).toLowerCase()
                                : "Not provided"}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col xs={24} sm={12}>
                      <div className="info-item">
                        <CalendarOutlined className="info-icon" />
                        <div>
                          <Text type="secondary">Date of Birth</Text>
                          <div>
                            <Text strong>
                              {user?.dateOfBirth
                                ? moment(user.dateOfBirth).format(
                                    "MMMM D, YYYY"
                                  )
                                : "Not provided"}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col xs={24} sm={12}>
                      <div className="info-item">
                        <PhoneOutlined className="info-icon" />
                        <div>
                          <Text type="secondary">Phone</Text>
                          <div>
                            <Text strong>{user?.phone || "Not provided"}</Text>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col xs={24} sm={12}>
                      <div className="info-item">
                        <HeartOutlined className="info-icon" />
                        <div>
                          <Text type="secondary">Blood Group</Text>
                          <div>
                            {user?.bloodGroup ? (
                              <Tag color="red">{user.bloodGroup}</Tag>
                            ) : (
                              <Text strong>Not provided</Text>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>

                    {user?.district && (
                      <Col xs={24}>
                        <div className="info-item">
                          <EnvironmentOutlined className="info-icon" />
                          <div>
                            <Text type="secondary">Location</Text>
                            <div>
                              <Text strong>
                                {[
                                  user.district.name,
                                  user.district.division?.name,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </Text>
                            </div>
                          </div>
                        </div>
                      </Col>
                    )}

                    {user?.address && (
                      <Col xs={24}>
                        <div className="info-item">
                          <HomeOutlined className="info-icon" />
                          <div>
                            <Text type="secondary">Address</Text>
                            <div>
                              <Text strong>{user.address}</Text>
                            </div>
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      <Card
        bordered={false}
        style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}
      >
        <Tabs defaultActiveKey="1" type="card">
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
                          <CalendarOutlined style={{ marginRight: 8 }} />
                          {item.date} at {item.time}
                        </div>
                        <div>
                          <BankOutlined style={{ marginRight: 8 }} />
                          {item.hospital}
                        </div>
                        <div>
                          <MedicineBoxOutlined style={{ marginRight: 8 }} />
                          {item.specialization}
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
                <Card title="Vital Signs" bordered={false}>
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
                      <Tag color="red">
                        {user?.bloodGroup || "Not provided"}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card title="Allergies" bordered={false}>
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

      {/* Add CSS for better styling */}
      <style jsx>{`
        .profile-card {
          overflow: hidden;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .info-icon {
          font-size: 16px;
          color: #1890ff;
          margin-right: 12px;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};

export default Profile;
