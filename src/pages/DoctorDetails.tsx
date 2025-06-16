import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Typography,
  Spin,
  Card,
  Avatar,
  Row,
  Col,
  Tag,
  Divider,
  Button,
  List,
  Empty,
  Breadcrumb,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Popconfirm,
} from "antd";
import {
  UserOutlined,
  BookOutlined,
  MedicineBoxOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Doctor } from "../types";
import { fetchDoctorById } from "../services/api";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Mock function to get user roles - replace with your actual auth logic
const getUserRoles = (): string[] => {
  // This should come from your auth context/token
  const token = localStorage.getItem("token"); // or however you store the token
  if (!token) return [];

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.realm_access?.roles || [];
  } catch {
    return [];
  }
};

const DoctorDetails: React.FC = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles] = useState<string[]>(getUserRoles());

  // Modal states
  const [personalInfoModalVisible, setPersonalInfoModalVisible] =
    useState(false);
  const [degreeModalVisible, setDegreeModalVisible] = useState(false);
  const [workplaceModalVisible, setWorkplaceModalVisible] = useState(false);
  const [editingDegree, setEditingDegree] = useState<any>(null);
  const [editingWorkplace, setEditingWorkplace] = useState<any>(null);

  // Forms
  const [personalInfoForm] = Form.useForm();
  const [degreeForm] = Form.useForm();
  const [workplaceForm] = Form.useForm();

  const canUpdateDoctor = userRoles.includes("update-doctor");

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await fetchDoctorById(id);
          setDoctor(data);
        }
      } catch (error) {
        console.error("Failed to fetch doctor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [id]);

  // Personal Info Modal handlers
  const handleEditPersonalInfo = () => {
    if (doctor) {
      personalInfoForm.setFieldsValue({
        name: doctor.profile.name,
        bnName: doctor.profile.bnName,
        phone: doctor.profile.phone,
        email: doctor.profile.email,
        address: doctor.profile.address,
        gender: doctor.profile.gender,
        bmdcNo: doctor.bmdcNo,
        yearOfExperience: doctor.yearOfExperience,
        description: doctor.description,
      });
      setPersonalInfoModalVisible(true);
    }
  };

  const handlePersonalInfoSubmit = async (values: any) => {
    try {
      // API call to update personal info
      console.log("Updating personal info:", values);
      message.success("Personal information updated successfully");
      setPersonalInfoModalVisible(false);
      // Refresh doctor data
    } catch (error) {
      message.error("Failed to update personal information");
    }
  };

  // Degree Modal handlers
  const handleAddDegree = () => {
    setEditingDegree(null);
    degreeForm.resetFields();
    setDegreeModalVisible(true);
  };

  const handleEditDegree = (degree: any) => {
    setEditingDegree(degree);
    degreeForm.setFieldsValue({
      degreeId: degree.degree.id,
      institutionId: degree.institution?.id,
      medicalSpecialityId: degree.medicalSpeciality?.id,
      startDateTime: degree.startDateTime ? dayjs(degree.startDateTime) : null,
      endDateTime: degree.endDateTime ? dayjs(degree.endDateTime) : null,
    });
    setDegreeModalVisible(true);
  };

  const handleDegreeSubmit = async (values: any) => {
    try {
      const formattedValues = {
        ...values,
        startDateTime: values.startDateTime?.toISOString(),
        endDateTime: values.endDateTime?.toISOString(),
      };

      if (editingDegree) {
        console.log("Updating degree:", formattedValues);
        message.success("Degree updated successfully");
      } else {
        console.log("Adding degree:", formattedValues);
        message.success("Degree added successfully");
      }

      setDegreeModalVisible(false);
      // Refresh doctor data
    } catch (error) {
      message.error("Failed to save degree information");
    }
  };

  const handleDeleteDegree = async (degreeId: number) => {
    try {
      console.log("Deleting degree:", degreeId);
      message.success("Degree deleted successfully");
      // Refresh doctor data
    } catch (error) {
      message.error("Failed to delete degree");
    }
  };

  // Workplace Modal handlers
  const handleAddWorkplace = () => {
    setEditingWorkplace(null);
    workplaceForm.resetFields();
    setWorkplaceModalVisible(true);
  };

  const handleEditWorkplace = (workplace: any) => {
    setEditingWorkplace(workplace);
    workplaceForm.setFieldsValue({
      hospitalId: workplace.hospital?.id,
      institutionId: workplace.institution?.id,
      doctorPosition: workplace.doctorPosition,
      teacherPosition: workplace.teacherPosition,
      medicalSpecialityId: workplace.medicalSpeciality?.id,
      startDate: workplace.startDate ? dayjs(workplace.startDate) : null,
    });
    setWorkplaceModalVisible(true);
  };

  const handleWorkplaceSubmit = async (values: any) => {
    try {
      const formattedValues = {
        ...values,
        startDate: values.startDate?.toISOString(),
      };

      if (editingWorkplace) {
        console.log("Updating workplace:", formattedValues);
        message.success("Workplace updated successfully");
      } else {
        console.log("Adding workplace:", formattedValues);
        message.success("Workplace added successfully");
      }

      setWorkplaceModalVisible(false);
      // Refresh doctor data
    } catch (error) {
      message.error("Failed to save workplace information");
    }
  };

  const handleDeleteWorkplace = async (workplaceId: number) => {
    try {
      console.log("Deleting workplace:", workplaceId);
      message.success("Workplace deleted successfully");
      // Refresh doctor data
    } catch (error) {
      message.error("Failed to delete workplace");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Empty description="Doctor not found" />
        <Button type="primary" style={{ marginTop: 16 }}>
          <Link to="/doctors">Back to Doctors</Link>
        </Button>
      </div>
    );
  }

  const renderDegrees = () => {
    if (!doctor.doctorDegrees || doctor.doctorDegrees.length === 0) {
      return <Empty description="No degree information available" />;
    }

    return (
      <List
        itemLayout="vertical"
        dataSource={doctor.doctorDegrees}
        renderItem={(item) => (
          <List.Item
            actions={
              canUpdateDoctor
                ? [
                    <Button
                      key="edit"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEditDegree(item)}
                    >
                      Edit
                    </Button>,
                    <Popconfirm
                      key="delete"
                      title="Are you sure you want to delete this degree?"
                      onConfirm={() => handleDeleteDegree(item.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="text" danger icon={<DeleteOutlined />}>
                        Delete
                      </Button>
                    </Popconfirm>,
                  ]
                : []
            }
          >
            <Card size="small" style={{ width: "100%" }}>
              <Title level={5}>
                {item.degree.abbreviation} - {item.degree.name}
              </Title>
              {item.medicalSpeciality && (
                <Text type="secondary" style={{ display: "block" }}>
                  Speciality: {item.medicalSpeciality.name}
                </Text>
              )}
              {item.institution && (
                <Text style={{ display: "block" }}>
                  <strong>Institution:</strong> {item.institution.name}
                </Text>
              )}
              {item.startDateTime && item.endDateTime && (
                <Text style={{ display: "block" }}>
                  <strong>Period:</strong>{" "}
                  {new Date(item.startDateTime).getFullYear()} -{" "}
                  {new Date(item.endDateTime).getFullYear()}
                </Text>
              )}
              <Text type="secondary" style={{ display: "block" }}>
                Type: {item.degree.degreeType}
              </Text>
            </Card>
          </List.Item>
        )}
      />
    );
  };

  const renderWorkplaces = () => {
    if (!doctor.doctorWorkplaces || doctor.doctorWorkplaces.length === 0) {
      return <Empty description="No workplace information available" />;
    }

    return (
      <List
        itemLayout="vertical"
        dataSource={doctor.doctorWorkplaces}
        renderItem={(workplace) => (
          <List.Item
            actions={
              canUpdateDoctor
                ? [
                    <Button
                      key="edit"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEditWorkplace(workplace)}
                    >
                      Edit
                    </Button>,
                    <Popconfirm
                      key="delete"
                      title="Are you sure you want to delete this workplace?"
                      onConfirm={() => handleDeleteWorkplace(workplace.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="text" danger icon={<DeleteOutlined />}>
                        Delete
                      </Button>
                    </Popconfirm>,
                  ]
                : []
            }
          >
            <Card size="small" style={{ width: "100%" }}>
              <Title level={5}>
                {workplace.hospital?.name ||
                  workplace.institution?.name ||
                  "Unknown"}
              </Title>
              {workplace.doctorPosition && (
                <Text strong style={{ display: "block" }}>
                  Position: {workplace.doctorPosition}
                </Text>
              )}
              {workplace.teacherPosition && (
                <Text strong style={{ display: "block" }}>
                  Academic Position: {workplace.teacherPosition}
                </Text>
              )}
              {workplace.medicalSpeciality && (
                <Text style={{ display: "block" }}>
                  Speciality: {workplace.medicalSpeciality.name}
                </Text>
              )}
              {workplace.startDate && (
                <Text type="secondary" style={{ display: "block" }}>
                  Since: {new Date(workplace.startDate).toLocaleDateString()}
                </Text>
              )}
              {workplace.hospital?.district && (
                <Text type="secondary" style={{ display: "block" }}>
                  <EnvironmentOutlined /> {workplace.hospital.district.name}
                </Text>
              )}
            </Card>
          </List.Item>
        )}
      />
    );
  };

  return (
    <div className="doctor-details-container">
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined /> Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/doctors">Doctors</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{doctor.profile.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[24, 24]}>
        {/* Left Column - Doctor Profile */}
        <Col xs={24} md={10} lg={8}>
          <Card
            title={
              canUpdateDoctor && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Personal Information</span>
                  <Button
                    type="primary"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={handleEditPersonalInfo}
                  >
                    Edit
                  </Button>
                </div>
              )
            }
          >
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <Avatar
                src={doctor.profile.photo || undefined}
                icon={<UserOutlined />}
                size={150}
                style={{ marginBottom: 16 }}
              />
              <Title level={3}>{doctor.profile.name}</Title>
              {doctor.profile.bnName &&
                doctor.profile.bnName !== doctor.profile.name && (
                  <Title level={5} type="secondary">
                    {doctor.profile.bnName}
                  </Title>
                )}
              <Tag color="blue">{doctor.profile.gender}</Tag>
            </div>

            <Divider />

            {/* Professional Information Section */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <IdcardOutlined style={{ fontSize: 20, marginRight: 10 }} />
                <Title level={5} style={{ margin: 0 }}>
                  BMDC Registration: {doctor.bmdcNo || "N/A"}
                </Title>
              </div>

              {doctor.yearOfExperience && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <MedicineBoxOutlined
                    style={{ fontSize: 20, marginRight: 10 }}
                  />
                  <div>
                    <Text strong>Experience</Text>
                    <div>
                      <Tag
                        color="green"
                        style={{ fontSize: 14, padding: "4px 8px" }}
                      >
                        {doctor.yearOfExperience} years
                      </Tag>
                    </div>
                  </div>
                </div>
              )}

              {doctor.degrees && (
                <div style={{ display: "flex", marginBottom: 16 }}>
                  <BookOutlined
                    style={{ fontSize: 20, marginRight: 10, marginTop: 4 }}
                  />
                  <div>
                    <Text strong style={{ display: "block", marginBottom: 8 }}>
                      Degrees
                    </Text>
                    <div>
                      {doctor.degrees.split(", ").map((degree, index) => (
                        <Tag
                          key={index}
                          color="blue"
                          style={{
                            margin: "0 4px 8px 0",
                            fontSize: 14,
                            padding: "4px 8px",
                            borderRadius: "16px",
                          }}
                        >
                          {degree}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {doctor.specializations && (
                <div style={{ display: "flex", marginBottom: 16 }}>
                  <MedicineBoxOutlined
                    style={{ fontSize: 20, marginRight: 10, marginTop: 4 }}
                  />
                  <div>
                    <Text strong style={{ display: "block", marginBottom: 8 }}>
                      Specializations
                    </Text>
                    <div>
                      {doctor.specializations
                        .split(", ")
                        .map((specialization, index) => (
                          <Tag
                            key={index}
                            color="purple"
                            style={{
                              margin: "0 4px 8px 0",
                              fontSize: 14,
                              padding: "4px 8px",
                              borderRadius: "16px",
                            }}
                          >
                            {specialization}
                          </Tag>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Divider />

            {/* Contact Information Section */}
            <div style={{ marginBottom: 20 }}>
              <Title level={5} style={{ marginBottom: 16 }}>
                Contact Information
              </Title>

              <List itemLayout="horizontal" size="small">
                {doctor.profile.phone && (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<PhoneOutlined />}
                      title="Phone"
                      description={doctor.profile.phone}
                    />
                  </List.Item>
                )}

                {doctor.profile.email && (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<MailOutlined />}
                      title="Email"
                      description={doctor.profile.email}
                    />
                  </List.Item>
                )}

                {doctor.profile.address && (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<EnvironmentOutlined />}
                      title="Address"
                      description={doctor.profile.address}
                    />
                  </List.Item>
                )}
              </List>
            </div>

            {doctor.description && (
              <>
                <Divider />
                <div>
                  <Title level={5}>About</Title>
                  <Text>{doctor.description}</Text>
                </div>
              </>
            )}
          </Card>
        </Col>

        {/* Right Column - Degrees and Workplaces */}
        <Col xs={24} md={14} lg={16}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  <BookOutlined /> Educational Qualifications
                </Title>
                {canUpdateDoctor && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddDegree}
                  >
                    Add Degree
                  </Button>
                )}
              </div>
            }
          >
            {renderDegrees()}
          </Card>

          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  <MedicineBoxOutlined /> Work Experience
                </Title>
                {canUpdateDoctor && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddWorkplace}
                  >
                    Add Workplace
                  </Button>
                )}
              </div>
            }
            style={{ marginTop: 24 }}
          >
            {renderWorkplaces()}
          </Card>
        </Col>
      </Row>

      <div style={{ textAlign: "center", margin: "24px 0" }}>
        <Button type="primary">
          <Link to="/doctors">Back to Doctors</Link>
        </Button>
      </div>

      {/* Personal Info Modal */}
      <Modal
        title="Edit Personal Information"
        open={personalInfoModalVisible}
        onCancel={() => setPersonalInfoModalVisible(false)}
        onOk={() => personalInfoForm.submit()}
        width={600}
      >
        <Form
          form={personalInfoForm}
          layout="vertical"
          onFinish={handlePersonalInfoSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input name!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Bengali Name" name="bnName">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Phone" name="phone">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Gender" name="gender">
                <Select>
                  <Option value="MALE">Male</Option>
                  <Option value="FEMALE">Female</Option>
                  <Option value="OTHER">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="BMDC Registration" name="bmdcNo">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Years of Experience" name="yearOfExperience">
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Address" name="address">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Degree Modal */}
      <Modal
        title={editingDegree ? "Edit Degree" : "Add Degree"}
        open={degreeModalVisible}
        onCancel={() => setDegreeModalVisible(false)}
        onOk={() => degreeForm.submit()}
        width={600}
      >
        <Form form={degreeForm} layout="vertical" onFinish={handleDegreeSubmit}>
          <Form.Item
            label="Degree"
            name="degreeId"
            rules={[{ required: true, message: "Please select a degree!" }]}
          >
            <Select placeholder="Select degree">
              {/* You'll need to populate this with actual degree options */}
              <Option value="1">MBBS</Option>
              <Option value="2">MD</Option>
              <Option value="3">MS</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Institution" name="institutionId">
            <Select placeholder="Select institution">
              {/* You'll need to populate this with actual institution options */}
              <Option value="1">Dhaka Medical College</Option>
              <Option value="2">Chittagong Medical College</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Medical Speciality" name="medicalSpecialityId">
            <Select placeholder="Select speciality">
              {/* You'll need to populate this with actual speciality options */}
              <Option value="1">Cardiology</Option>
              <Option value="2">Neurology</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Start Date" name="startDateTime">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="End Date" name="endDateTime">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Workplace Modal */}
      <Modal
        title={editingWorkplace ? "Edit Workplace" : "Add Workplace"}
        open={workplaceModalVisible}
        onCancel={() => setWorkplaceModalVisible(false)}
        onOk={() => workplaceForm.submit()}
        width={600}
      >
        <Form
          form={workplaceForm}
          layout="vertical"
          onFinish={handleWorkplaceSubmit}
        >
          <Form.Item label="Hospital" name="hospitalId">
            <Select placeholder="Select hospital">
              {/* You'll need to populate this with actual hospital options */}
              <Option value="1">Dhaka Medical College Hospital</Option>
              <Option value="2">Chittagong Medical College Hospital</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Institution" name="institutionId">
            <Select placeholder="Select institution">
              {/* You'll need to populate this with actual institution options */}
              <Option value="1">Dhaka Medical College</Option>
              <Option value="2">Chittagong Medical College</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Doctor Position" name="doctorPosition">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Academic Position" name="teacherPosition">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Medical Speciality" name="medicalSpecialityId">
            <Select placeholder="Select speciality">
              {/* You'll need to populate this with actual speciality options */}
              <Option value="1">Cardiology</Option>
              <Option value="2">Neurology</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Start Date" name="startDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorDetails;
