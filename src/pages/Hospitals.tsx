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
import { District, Hospital, HospitalType, OrganizationType } from "../types";
import config from "../config";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

const Hospitals: React.FC = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [organizationTypes, setOrganizationTypes] = useState<
    OrganizationType[]
  >([]);
  const [hospitalTypes, setHospitalTypes] = useState<HospitalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: config.itemsPerPage || 5,
    total: 0,
  });

  // Filter states
  const [selectedDistrict, setSelectedDistrict] = useState<number | undefined>(
    undefined
  );
  const [selectedHospitalType, setSelectedHospitalType] = useState<
    string | undefined
  >(undefined);
  const [selectedOrgType, setSelectedOrgType] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    // Fetch all filter data
    const fetchFilterData = async () => {
      try {
        const [districtRes, orgTypeRes, hospitalTypeRes] = await Promise.all([
          apiClient.get<District[]>("/api/districts"),
          apiClient.get<OrganizationType[]>("/api/organization-types"),
          apiClient.get<HospitalType[]>("/api/hospital-types"),
        ]);

        setDistricts(districtRes.data);
        setOrganizationTypes(orgTypeRes.data);
        setHospitalTypes(hospitalTypeRes.data);
      } catch (error) {
        console.error("Failed to fetch filter data:", error);
      }
    };

    fetchFilterData();
  }, []);

  useEffect(() => {
    fetchHospitalList(1); // Reset to page 1 on filter change
  }, [selectedDistrict, selectedHospitalType, selectedOrgType]);

  const fetchHospitalList = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetchHospitals(
        page - 1, // Convert 1-based to 0-based for the API
        pagination.pageSize,
        selectedDistrict,
        selectedHospitalType,
        selectedOrgType
      );

      setHospitals(response.hospitals);
      setPagination({
        ...pagination,
        current: page, // Keep 1-based for the UI
        total: response.totalItems || 0,
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
      dataIndex: "organizationType",
      key: "organizationType",
      render: (text: string) => <Tag color={getOrgTypeColor(text)}>{text}</Tag>,
    },
    {
      title: "Hospital Type",
      dataIndex: "hospitalType",
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
      title: "Website",
      dataIndex: "url",
      key: "url",
      render: (url: string | null) =>
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

  // Render mobile card for each hospital
  const renderMobileCard = (hospital: Hospital) => (
    <Card key={hospital.id} style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontWeight: "bold", marginBottom: 8 }}>{hospital.name}</h3>
        <Space direction="vertical" size="small">
          <div>
            <Tag color={getOrgTypeColor(hospital.organizationType)}>
              {hospital.organizationType}
            </Tag>
            <Tag color={getHospitalTypeColor(hospital.hospitalType)}>
              {hospital.hospitalType}
            </Tag>
          </div>
          <div>
            <EnvironmentOutlined /> {hospital.district?.name}
          </div>
          {hospital.url ? (
            <a href={hospital.url} target="_blank" rel="noopener noreferrer">
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
              {hospitalTypes.map((type) => (
                <Option key={type.name} value={type.name}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by Organization Type"
              style={{ width: "100%" }}
              onChange={handleOrgTypeChange}
              allowClear
            >
              {organizationTypes.map((type) => (
                <Option key={type.name} value={type.name}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Row style={{ marginTop: 16 }}>
          <Col span={24}>
            <Button
              type="primary"
              onClick={() => fetchHospitalList(1)}
              loading={loading}
            >
              Apply Filters
            </Button>
          </Col>
        </Row>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Desktop view */}
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

          {/* Mobile view */}
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

          {/* CSS for responsive display */}
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
