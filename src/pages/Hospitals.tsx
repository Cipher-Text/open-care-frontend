// src/pages/Hospitals.tsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  Input,
  Select,
  Space,
  Spin,
  Card,
  Row,
  Col,
  Tag,
  Button,
} from "antd";
import { EnvironmentOutlined, LinkOutlined } from "@ant-design/icons";
import { apiClient, fetchHospitals } from "../services/api";
import {
  District,
  Hospital,
  HospitalResponse,
  HospitalType,
  OrganizationType,
} from "../types";
import config from "../config";

const { Title } = Typography;
const { Option } = Select;

const Hospitals: React.FC = () => {
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
          apiClient.get<District[]>("/districts"),
          apiClient.get<OrganizationType[]>("/organization-types"),
          apiClient.get<HospitalType[]>("/hospital-types"),
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

  const fetchHospitalList = async (page = pagination.current) => {
    setLoading(true);
    try {
      const response = await fetchHospitals(
        page - 1, // API expects 0-based index
        pagination.pageSize,
        selectedDistrict,
        selectedHospitalType,
        selectedOrgType
      );

      setHospitals(response.hospitals);
      setPagination((prev) => ({
        ...prev,
        current: page, // Ensure current page is updated
        total: response.totalElements || 0,
      }));
    } catch (error) {
      console.error("Failed to fetch hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination: any) => {
    fetchHospitalList(newPagination.current);
  };

  const handleDistrictChange = (value: number | undefined) => {
    setSelectedDistrict(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleHospitalTypeChange = (value: string | undefined) => {
    setSelectedHospitalType(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleOrgTypeChange = (value: string | undefined) => {
    setSelectedOrgType(value);
    setPagination({ ...pagination, current: 1 });
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
      render: (text: string) => (
        <Tag
          color={
            text === "GOVERNMENT"
              ? "blue"
              : text === "MILITARY"
              ? "red"
              : "green"
          }
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Hospital Type",
      dataIndex: "hospitalType",
      key: "hospitalType",
      render: (text: string) => (
        <Tag
          color={
            text === "GENERAL"
              ? "purple"
              : text === "CANCER"
              ? "magenta"
              : "orange"
          }
        >
          {text}
        </Tag>
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
      title: "Location",
      dataIndex: "lat",
      key: "location",
      render: (_: any, record: Hospital) =>
        record.lat && record.lon ? (
          <Button
            type="primary"
            onClick={() =>
              window.open(
                `https://www.google.com/maps?q=${record.lat},${record.lon}`,
                "_blank"
              )
            }
          >
            View Map
          </Button>
        ) : (
          "N/A"
        ),
    },
  ];

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
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Hospitals;
