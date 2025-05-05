import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Typography,
  Spin,
  Card,
  Avatar,
  Row,
  Col,
  Descriptions,
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
} from "@ant-design/icons";
import { Doctor } from "../types";
import axios from "axios";
import config from "../config";

const { Title, Text } = Typography;

const DoctorDetails: React.FC = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${config.apiUrl}/api/doctors/${id}`);
        setDoctor(response.data);
      } catch (error) {
        console.error("Failed to fetch doctor details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctorDetails();
    }
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
        itemLayout="horizontal"
        dataSource={doctor.doctorDegrees}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={`${item.degree.abbreviation} - ${item.degree.name}`}
              description={
                <div>
                  <p>
                    <strong>Institution:</strong>{" "}
                    {item.institution?.name || "N/A"}
                  </p>
                  {item.startDateTime && item.endDateTime && (
                    <p>
                      <strong>Period:</strong>{" "}
                      {new Date(item.startDateTime).getFullYear()} -{" "}
                      {new Date(item.endDateTime).getFullYear()}
                    </p>
                  )}
                  {item.degree.degreeType && (
                    <p>
                      <strong>Type:</strong> {item.degree.degreeType}
                    </p>
                  )}
                </div>
              }
            />
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
        itemLayout="horizontal"
        dataSource={doctor.doctorWorkplaces}
        renderItem={(workplace) => (
          <List.Item>
            <List.Item.Meta
              title={
                <span>
                  {workplace.hospital?.name ||
                    workplace.institution?.name ||
                    "Unknown"}
                </span>
              }
              description={
                <div>
                  <p>
                    <strong>Position:</strong>{" "}
                    {workplace.doctorPosition ||
                      workplace.teacherPosition ||
                      "N/A"}
                  </p>
                  {workplace.medicalSpeciality && (
                    <p>
                      <strong>Speciality:</strong>{" "}
                      {workplace.medicalSpeciality.name}
                    </p>
                  )}
                  {workplace.startDate && (
                    <p>
                      <strong>Since:</strong>{" "}
                      {new Date(workplace.startDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              }
            />
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

      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8} md={6} style={{ textAlign: "center" }}>
            <Avatar
              src={doctor.profile.photo || undefined}
              icon={<UserOutlined />}
              size={200}
              style={{ marginBottom: 16 }}
            />
            <Title level={3}>{doctor.profile.name}</Title>
            <Tag
              color={doctor.profile.gender === "MALE" ? "blue" : "pink"}
              style={{ marginBottom: 8 }}
            >
              {doctor.profile.gender}
            </Tag>
            <Text style={{ display: "block", marginBottom: 8 }}>
              BMDC No: {doctor.bmdcNo || "N/A"}
            </Text>
            {doctor.yearOfExperience && (
              <Text style={{ display: "block", marginBottom: 8 }}>
                Experience: {doctor.yearOfExperience} years
              </Text>
            )}
          </Col>

          <Col xs={24} sm={16} md={18}>
            <Descriptions
              title="Personal Information"
              bordered
              layout="vertical"
            >
              <Descriptions.Item label="Full Name" span={3}>
                {doctor.profile.name}
              </Descriptions.Item>
              {doctor.profile.bnName && (
                <Descriptions.Item label="Name (Bangla)" span={3}>
                  {doctor.profile.bnName}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Gender" span={1}>
                {doctor.profile.gender}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>
                {doctor.profile.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Phone" span={3}>
                {doctor.profile.phone || "N/A"}
              </Descriptions.Item>
              {doctor.profile.address && (
                <Descriptions.Item label="Address" span={3}>
                  {doctor.profile.address}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider orientation="left">
              <BookOutlined /> Educational Qualifications
            </Divider>
            {renderDegrees()}

            <Divider orientation="left">
              <MedicineBoxOutlined /> Workplaces
            </Divider>
            {renderWorkplaces()}

            {doctor.description && (
              <>
                <Divider orientation="left">About</Divider>
                <Text>{doctor.description}</Text>
              </>
            )}
          </Col>
        </Row>
      </Card>

      <div style={{ textAlign: "center", margin: "24px 0" }}>
        <Button type="primary">
          <Link to="/doctors">Back to Doctors</Link>
        </Button>
      </div>
    </div>
  );
};

export default DoctorDetails;
