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
} from "antd";
import {
  EnvironmentOutlined,
  LinkOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { apiClient } from "../services/api";
import { Hospital, Institution } from "../types";

const { Title, Text } = Typography;

const InstituteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [institute, setInstitute] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);

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
      </Card>
    </div>
  );
};

export default InstituteDetail;
