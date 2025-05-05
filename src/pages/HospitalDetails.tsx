import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  List,
  Avatar,
  Space,
  Empty,
  Pagination,
  Tabs,
  message,
  Breadcrumb,
} from "antd";
import {
  EnvironmentOutlined,
  LinkOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { fetchHospitalById, fetchDoctorsByHospital } from "../services/api";
import { Hospital, Doctor } from "../types";
import config from "../config";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const HospitalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: config.itemsPerPage || 5,
    total: 0,
  });

  const hospitalId = parseInt(id || "0");

  useEffect(() => {
    const loadHospitalData = async () => {
      if (!hospitalId) {
        navigate("/hospitals");
        return;
      }

      try {
        setLoading(true);
        const hospitalData = await fetchHospitalById(hospitalId);
        setHospital(hospitalData);
      } catch (error) {
        console.error("Failed to fetch hospital details:", error);
        message.error("Failed to load hospital information");
      } finally {
        setLoading(false);
      }
    };

    loadHospitalData();
  }, [hospitalId, navigate]);

  useEffect(() => {
    if (hospitalId) {
      loadDoctors(1);
    }
  }, [hospitalId]);

  const loadDoctors = async (page: number) => {
    try {
      setDoctorsLoading(true);
      const data = await fetchDoctorsByHospital(
        hospitalId,
        page - 1, // API uses 0-based indexing
        pagination.pageSize
      );

      setDoctors(data.doctors);
      setPagination({
        ...pagination,
        current: page,
        total: data.totalItems,
      });
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      message.error("Failed to load doctors information");
    } finally {
      setDoctorsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    loadDoctors(page);
  };

  const getOrgTypeColor = (type: string) => {
    switch (type) {
      case "GOVERNMENT":
        return "blue";
      case "MILITARY":
        return "red";
      case "PRIVATE":
        return "green";
      default:
        return "default";
    }
  };

  const getHospitalTypeColor = (type: string) => {
    switch (type) {
      case "GENERAL":
        return "purple";
      case "CANCER":
        return "magenta";
      case "CHEST_DISEASE":
        return "gold";
      default:
        return "orange";
    }
  };

  if (loading) {
    return (
      <div
        className="loading-container"
        style={{ textAlign: "center", padding: "100px 0" }}
      >
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Loading hospital information...</p>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div
        className="not-found-container"
        style={{ textAlign: "center", padding: "100px 0" }}
      >
        <Empty description="Hospital not found" />
        <Button
          type="primary"
          style={{ marginTop: 16 }}
          onClick={() => navigate("/hospitals")}
        >
          Back to Hospitals
        </Button>
      </div>
    );
  }

  return (
    <div className="hospital-details-container">
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/hospitals">Hospitals</Breadcrumb.Item>
        <Breadcrumb.Item>{hospital.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Button
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/hospitals")}
      >
        Back to Hospitals
      </Button>

      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Title level={2}>{hospital.name}</Title>
            {hospital.bnName && <Text type="secondary">{hospital.bnName}</Text>}

            <Space style={{ marginTop: 16 }}>
              <Tag color={getOrgTypeColor(hospital.organizationType)}>
                {hospital.organizationType}
              </Tag>
              <Tag color={getHospitalTypeColor(hospital.hospitalType)}>
                {hospital.hospitalType}
              </Tag>
            </Space>
          </Col>

          <Col xs={24} md={8} style={{ textAlign: "right" }}>
            <Space direction="vertical">
              {hospital.url && (
                <Button
                  type="link"
                  href={hospital.url}
                  target="_blank"
                  icon={<LinkOutlined />}
                >
                  Visit Website
                </Button>
              )}
              {hospital.lat && hospital.lon && (
                <Button
                  type="primary"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${hospital.lat},${hospital.lon}`,
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
          <TabPane tab="Hospital Information" key="info">
            <Descriptions
              bordered
              column={{ xs: 1, sm: 2, md: 3 }}
              layout="vertical"
            >
              <Descriptions.Item label="Hospital Name">
                {hospital.name}
              </Descriptions.Item>
              <Descriptions.Item label="Number of Beds">
                {hospital.numberOfBed}
              </Descriptions.Item>
              <Descriptions.Item label="Organization Type">
                <Tag color={getOrgTypeColor(hospital.organizationType)}>
                  {hospital.organizationType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Hospital Type">
                <Tag color={getHospitalTypeColor(hospital.hospitalType)}>
                  {hospital.hospitalType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="District">
                <Space>
                  <EnvironmentOutlined />
                  {hospital.district.name}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Division">
                {hospital.district.division.name}
              </Descriptions.Item>
              {hospital.upazila && (
                <Descriptions.Item label="Upazila">
                  {hospital.upazila.name}
                </Descriptions.Item>
              )}
              {hospital.union && (
                <Descriptions.Item label="Union">
                  {hospital.union.name}
                </Descriptions.Item>
              )}
              {hospital.url && (
                <Descriptions.Item label="Website">
                  <a
                    href={hospital.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkOutlined /> {hospital.url}
                  </a>
                </Descriptions.Item>
              )}
              {hospital.lat && hospital.lon && (
                <Descriptions.Item label="GPS Coordinates">
                  Lat: {hospital.lat}, Lon: {hospital.lon}
                </Descriptions.Item>
              )}
            </Descriptions>
          </TabPane>

          <TabPane tab="Doctors" key="doctors">
            {doctorsLoading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Spin />
                <p>Loading doctors...</p>
              </div>
            ) : doctors.length > 0 ? (
              <>
                <List
                  itemLayout="vertical"
                  dataSource={doctors}
                  renderItem={(doctor) => (
                    <List.Item
                      key={doctor.id}
                      actions={[
                        doctor.phone && (
                          <Space>
                            <PhoneOutlined /> {doctor.phone}
                          </Space>
                        ),
                        doctor.email && (
                          <Space>
                            <MailOutlined /> {doctor.email}
                          </Space>
                        ),
                        <Space>
                          <UserOutlined /> Experience: {doctor.yearOfExperience}{" "}
                          years
                        </Space>,
                      ].filter(Boolean)}
                      extra={
                        <Button
                          type="primary"
                          onClick={() => navigate(`/api/doctors/${doctor.id}`)}
                        >
                          View Profile
                        </Button>
                      }
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={doctor.image || undefined}
                            size={64}
                            icon={!doctor.image && <UserOutlined />}
                          />
                        }
                        title={
                          <a
                            onClick={() =>
                              navigate(`/api/doctors/${doctor.id}`)
                            }
                          >
                            {doctor.name}
                          </a>
                        }
                        description={
                          <Space direction="vertical">
                            {doctor.bnName && <span>{doctor.bnName}</span>}
                            <span>BMDC No: {doctor.bmdcNo}</span>
                            <Tag
                              color={doctor.gender === "MALE" ? "blue" : "pink"}
                            >
                              {doctor.gender}
                            </Tag>
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
            ) : (
              <Empty
                description="No doctors found for this hospital"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default HospitalDetails;
