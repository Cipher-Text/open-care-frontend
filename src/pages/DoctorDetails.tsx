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
} from "@ant-design/icons";
import { Doctor } from "../types";
import { fetchDoctorById } from "../services/api";

const { Title, Text } = Typography;

const DoctorDetails: React.FC = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

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
          <List.Item>
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
          <List.Item>
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
          <Card>
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
              <Title level={4}>
                <BookOutlined /> Educational Qualifications
              </Title>
            }
          >
            {renderDegrees()}
          </Card>

          <Card
            title={
              <Title level={4}>
                <MedicineBoxOutlined /> Work Experience
              </Title>
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
    </div>
  );
};

export default DoctorDetails;
