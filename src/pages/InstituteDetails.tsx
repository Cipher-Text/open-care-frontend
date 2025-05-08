import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Typography,
  Card,
  Row,
  Col,
  Tag,
  Button,
  Spin,
  Descriptions,
  Divider,
  Empty,
  Breadcrumb,
  Space,
  message,
  Tabs,
  List,
  Avatar,
  Pagination,
} from "antd";
import {
  EnvironmentOutlined,
  LinkOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { apiClient } from "../services/api";
import { Hospital, Institution, Doctor, DoctorResponse } from "../types";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const InstituteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [institute, setInstitute] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<Doctor[]>([]);
  const [graduates, setGraduates] = useState<Doctor[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [graduatesLoading, setGraduatesLoading] = useState(true);
  const [teachersPagination, setTeachersPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [graduatesPagination, setGraduatesPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const instituteId = parseInt(id || "0");

  useEffect(() => {
    const fetchInstituteData = async () => {
      if (!instituteId) {
        navigate("/institutes");
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.get<Hospital>(
          `/api/institutions/${instituteId}`
        );
        setInstitute(response.data);
      } catch (error) {
        console.error("Failed to fetch institute details:", error);
        message.error("Failed to load institute information");
      } finally {
        setLoading(false);
      }
    };

    fetchInstituteData();
  }, [instituteId, navigate]);

  useEffect(() => {
    if (instituteId) {
      loadTeachers(1);
      loadGraduates(1);
    }
  }, [instituteId]);

  const loadTeachers = async (page: number) => {
    try {
      setTeachersLoading(true);
      const response = await apiClient.get<DoctorResponse>(
        `/api/doctors?isCurrentWorkplace=true&workInstitutionId=${instituteId}&page=${
          page - 1
        }&size=${teachersPagination.pageSize}`
      );

      setTeachers(response.data.doctors);
      setTeachersPagination({
        ...teachersPagination,
        current: page,
        total: response.data.totalItems,
      });
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      message.error("Failed to load teachers information");
    } finally {
      setTeachersLoading(false);
    }
  };

  const loadGraduates = async (page: number) => {
    try {
      setGraduatesLoading(true);
      const response = await apiClient.get<DoctorResponse>(
        `/api/doctors?studyInstitutionId=${instituteId}&page=${page - 1}&size=${
          graduatesPagination.pageSize
        }`
      );

      setGraduates(response.data.doctors);
      setGraduatesPagination({
        ...graduatesPagination,
        current: page,
        total: response.data.totalItems,
      });
    } catch (error) {
      console.error("Failed to fetch graduates:", error);
      message.error("Failed to load graduates information");
    } finally {
      setGraduatesLoading(false);
    }
  };

  const handleTeachersPageChange = (page: number) => {
    loadTeachers(page);
  };

  const handleGraduatesPageChange = (page: number) => {
    loadGraduates(page);
  };

  const getOrgTypeColor = (type: string) => {
    switch (type) {
      case "Government":
        return "blue";
      case "Military":
        return "red";
      case "Private":
        return "green";
      default:
        return "default";
    }
  };

  const getHospitalTypeColor = (type: string) => {
    switch (type) {
      case "College":
        return "purple";
      case "General":
        return "magenta";
      case "Specialized":
        return "orange";
      default:
        return "default";
    }
  };

  // Render doctor list for both teachers and graduates
  const renderDoctorList = (
    doctors: Doctor[],
    loading: boolean,
    pagination: any,
    handlePageChange: (page: number) => void
  ) => {
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin />
          <p>Loading doctors...</p>
        </div>
      );
    }

    if (doctors.length === 0) {
      return (
        <Empty
          description="No doctors found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <>
        <List
          itemLayout="vertical"
          dataSource={doctors}
          renderItem={(doctor) => (
            <List.Item
              key={doctor.id}
              actions={[
                doctor.profile && doctor.profile.phone && (
                  <Space key="phone">
                    <PhoneOutlined /> {doctor.profile.phone}
                  </Space>
                ),
                doctor.profile && doctor.profile.email && (
                  <Space key="email">
                    <MailOutlined /> {doctor.profile.email}
                  </Space>
                ),
                doctor.yearOfExperience && (
                  <Space key="experience">
                    <UserOutlined /> Experience: {doctor.yearOfExperience} years
                  </Space>
                ),
              ].filter(Boolean)}
              extra={
                <Button
                  type="primary"
                  onClick={() => navigate(`/doctors/${doctor.id}`)}
                >
                  View Profile
                </Button>
              }
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={doctor.profile?.photo || undefined}
                    size={64}
                    icon={!doctor.profile?.photo && <UserOutlined />}
                  />
                }
                title={
                  <Link to={`/doctors/${doctor.id}`}>
                    {doctor.profile?.name}
                  </Link>
                }
                description={
                  <Space direction="vertical">
                    {doctor.profile?.bnName && (
                      <span>{doctor.profile.bnName}</span>
                    )}
                    <span>BMDC No: {doctor.bmdcNo}</span>
                    {doctor.profile?.gender && (
                      <Tag
                        color={
                          doctor.profile.gender === "MALE" ? "blue" : "pink"
                        }
                      >
                        {doctor.profile.gender}
                      </Tag>
                    )}
                  </Space>
                }
              />
              {doctor.description && <p>{doctor.description}</p>}
            </List.Item>
          )}
        />
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <div
        className="loading-container"
        style={{ textAlign: "center", padding: "100px 0" }}
      >
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Loading institute information...</p>
      </div>
    );
  }

  if (!institute) {
    return (
      <div
        className="not-found-container"
        style={{ textAlign: "center", padding: "100px 0" }}
      >
        <Empty description="Institute not found" />
        <Button
          type="primary"
          style={{ marginTop: 16 }}
          onClick={() => navigate("/institutes")}
        >
          Back to Institutes
        </Button>
      </div>
    );
  }

  // Get organization type and hospital type safely
  const organizationTypeName = institute.organizationType?.name || "Unknown";
  const hospitalTypeName = institute.hospitalType?.englishName || "Unknown";

  const breadcrumbItems = [
    {
      title: (
        <Link to="/">
          <HomeOutlined />
        </Link>
      ),
    },
    {
      title: <Link to="/institutes">Institutes</Link>,
    },
    {
      title: institute.name,
    },
  ];

  return (
    <div className="institute-details-container">
      <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 16 }} />

      <Button
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/institutes")}
      >
        Back to Institutes
      </Button>

      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Title level={2}>{institute.name}</Title>
            {institute.bnName && (
              <Text type="secondary">{institute.bnName}</Text>
            )}

            <Space style={{ marginTop: 16 }}>
              <Tag color={getOrgTypeColor(organizationTypeName)}>
                {organizationTypeName}
              </Tag>
              <Tag color={getHospitalTypeColor(hospitalTypeName)}>
                {hospitalTypeName}
              </Tag>
            </Space>
          </Col>

          <Col xs={24} md={8} style={{ textAlign: "right" }}>
            <Space direction="vertical">
              {institute.websiteUrl && (
                <Button
                  type="link"
                  href={institute.websiteUrl}
                  target="_blank"
                  icon={<LinkOutlined />}
                >
                  Visit Website
                </Button>
              )}
              {institute.lat && institute.lon && (
                <Button
                  type="primary"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${institute.lat},${institute.lon}`,
                      "_blank"
                    )
                  }
                  icon={<EnvironmentOutlined />}
                >
                  View on Map
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        <Divider />

        <Tabs defaultActiveKey="info">
          <TabPane tab="Institute Information" key="info">
            <Descriptions
              bordered
              column={{ xs: 1, sm: 2, md: 3 }}
              layout="vertical"
            >
              <Descriptions.Item label="Institute Name">
                {institute.name}
              </Descriptions.Item>
              {institute.acronym && (
                <Descriptions.Item label="Acronym">
                  {institute.acronym}
                </Descriptions.Item>
              )}
              {institute.establishedYear && (
                <Descriptions.Item label="Established Year">
                  {institute.establishedYear}
                </Descriptions.Item>
              )}
              {institute.enroll !== undefined && (
                <Descriptions.Item label="Enrollment Capacity">
                  {institute.enroll}
                </Descriptions.Item>
              )}
              {institute.numberOfBed !== undefined && (
                <Descriptions.Item label="Number of Beds">
                  {institute.numberOfBed}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Organization Type">
                <Tag color={getOrgTypeColor(organizationTypeName)}>
                  {organizationTypeName}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Institute Type">
                <Tag color={getHospitalTypeColor(hospitalTypeName)}>
                  {hospitalTypeName}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="District">
                <Space>
                  <EnvironmentOutlined />
                  {institute.district.name}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Division">
                {institute.district.division.name}
              </Descriptions.Item>
              {institute.websiteUrl && (
                <Descriptions.Item label="Website">
                  <a
                    href={institute.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkOutlined /> {institute.websiteUrl}
                  </a>
                </Descriptions.Item>
              )}
              {institute.lat && institute.lon && (
                <Descriptions.Item label="GPS Coordinates">
                  Lat: {institute.lat}, Lon: {institute.lon}
                </Descriptions.Item>
              )}
            </Descriptions>
          </TabPane>

          <TabPane tab="Teachers" key="teachers">
            {renderDoctorList(
              teachers,
              teachersLoading,
              teachersPagination,
              handleTeachersPageChange
            )}
          </TabPane>

          <TabPane tab="Graduates" key="graduates">
            {renderDoctorList(
              graduates,
              graduatesLoading,
              graduatesPagination,
              handleGraduatesPageChange
            )}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default InstituteDetail;
