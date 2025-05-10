import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  Select,
  Space,
  Spin,
  Card,
  Row,
  Col,
  Tag,
  Button,
  Pagination,
} from "antd";
import {
  EnvironmentOutlined,
  LinkOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { apiClient, fetchHospitals } from "../services/api";
import { District, Hospital } from "../types";
import config from "../config";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

const Hospitals: React.FC = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: config.itemsPerPage || 10,
    total: 0,
  });

  // Filter states
  const [selectedDistrict, setSelectedDistrict] = useState<
    number | undefined
  >();
  const [selectedHospitalType, setSelectedHospitalType] = useState<
    string | undefined
  >();
  const [selectedOrgType, setSelectedOrgType] = useState<string | undefined>();

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const districtRes = await apiClient.get<District[]>("/api/districts");
        setDistricts(districtRes.data);
      } catch (error) {
        console.error("Failed to fetch districts:", error);
      }
    };

    fetchFilterData();
  }, []);

  useEffect(() => {
    fetchHospitalList(1);
  }, [selectedDistrict, selectedHospitalType, selectedOrgType]);

  const fetchHospitalList = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetchHospitals(
        page - 1,
        pagination.pageSize,
        selectedDistrict,
        selectedHospitalType,
        selectedOrgType
      );

      setHospitals(response.hospitals);
      setPagination({
        ...pagination,
        current: page,
        total: response.totalItems,
      });
    } catch (error) {
      console.error("Failed to fetch hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination: {
    current: number;
    pageSize: number;
    total: number;
  }) => {
    setPagination(newPagination);
    fetchHospitalList(newPagination.current);
  };

  const handleDistrictChange = (value: number | undefined) => {
    setSelectedDistrict(value);
  };

  const handleHospitalTypeChange = (value: string | undefined) => {
    setSelectedHospitalType(value);
  };

  const handleOrgTypeChange = (value: string | undefined) => {
    setSelectedOrgType(value);
  };

  const navigateToDetails = (hospitalId: number) => {
    navigate(`/hospitals/${hospitalId}`);
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
      case "Specialized":
        return "magenta";
      default:
        return "orange";
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span style={{ fontWeight: "bold" }}>{text}</span>
      ),
    },
    {
      title: "Organization Type",
      dataIndex: ["organizationType", "name"],
      key: "organizationType",
      render: (text: string) => <Tag color={getOrgTypeColor(text)}>{text}</Tag>,
    },
    {
      title: "Hospital Type",
      dataIndex: ["hospitalType", "englishName"],
      key: "hospitalType",
      render: (text: string) => (
        <Tag color={getHospitalTypeColor(text)}>{text}</Tag>
      ),
    },
    {
      title: "District",
      dataIndex: ["district", "name"],
      key: "district",
      render: (text: string) => (
        <Space>
          <EnvironmentOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Beds",
      dataIndex: "numberOfBed",
      key: "beds",
      render: (number: number) => number.toLocaleString(),
    },
    {
      title: "Website",
      dataIndex: "websiteUrl",
      key: "website",
      render: (url: string) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            <LinkOutlined /> Visit
          </a>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Hospital) => (
        <Space size="small">
          {record.lat && record.lon ? (
            <Button
              type="default"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps?q=${record.lat},${record.lon}`,
                  "_blank"
                )
              }
            >
              View Map
            </Button>
          ) : null}
          <Button
            type="primary"
            onClick={() => navigateToDetails(record.id)}
            icon={<InfoCircleOutlined />}
          >
            Details
          </Button>
        </Space>
      ),
    },
  ];

  const renderMobileCard = (hospital: Hospital) => (
    <Card key={hospital.id} style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontWeight: "bold", marginBottom: 8 }}>{hospital.name}</h3>
        <Space direction="vertical" size="small">
          <div>
            <Tag color={getOrgTypeColor(hospital.organizationType.name)}>
              {hospital.organizationType.name}
            </Tag>
            <Tag
              color={getHospitalTypeColor(hospital.hospitalType.englishName)}
            >
              {hospital.hospitalType.englishName}
            </Tag>
          </div>
          <div>
            {hospital.district ? (
              <>
                <EnvironmentOutlined /> {hospital.district.name}
              </>
            ) : (
              "District not available"
            )}
          </div>
          <div>Beds: {hospital.numberOfBed.toLocaleString()}</div>
          {hospital.websiteUrl ? (
            <a
              href={hospital.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkOutlined /> Visit Website
            </a>
          ) : (
            <div>Website: N/A</div>
          )}
          <Space>
            {hospital.lat && hospital.lon ? (
              <Button
                type="default"
                size="small"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${hospital.lat},${hospital.lon}`,
                    "_blank"
                  )
                }
              >
                View on Map
              </Button>
            ) : null}
            <Button
              type="primary"
              size="small"
              onClick={() => navigateToDetails(hospital.id)}
              icon={<InfoCircleOutlined />}
            >
              Details
            </Button>
          </Space>
        </Space>
      </div>
    </Card>
  );

  return (
    <div className="hospitals-container">
      <Title level={2}>Hospitals</Title>

      <div className="filter-container" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by District"
              style={{ width: "100%" }}
              onChange={handleDistrictChange}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {districts.map((district) => (
                <Option key={district.id} value={district.id}>
                  {district.name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by Hospital Type"
              style={{ width: "100%" }}
              onChange={handleHospitalTypeChange}
              allowClear
            >
              <Option value="College">College</Option>
              <Option value="Specialized">Specialized</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by Organization Type"
              style={{ width: "100%" }}
              onChange={handleOrgTypeChange}
              allowClear
            >
              <Option value="Government">Government</Option>
              <Option value="Military">Military</Option>
              <Option value="Private">Private</Option>
            </Select>
          </Col>
        </Row>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="desktop-view" style={{ display: "block" }}>
            <Table
              columns={columns}
              dataSource={hospitals}
              rowKey="id"
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: false,
              }}
              onChange={handleTableChange}
            />
          </div>

          <div className="mobile-view" style={{ display: "none" }}>
            {hospitals.map(renderMobileCard)}
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={(page) => fetchHospitalList(page)}
              />
            </div>
          </div>

          <style>{`
            @media (max-width: 768px) {
              .desktop-view {
                display: none !important;
              }
              .mobile-view {
                display: block !important;
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default Hospitals;
