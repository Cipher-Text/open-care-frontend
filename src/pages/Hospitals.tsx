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
  Rate,
  Tag,
} from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { fetchHospitals } from "../services/api";
import { Hospital } from "../types";
import config from "../config";

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const Hospitals: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: config.itemsPerPage,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState<string | undefined>(undefined);

  const fetchData = async (page = 1, query = "", specialty = "") => {
    setLoading(true);
    try {
      // In a real app, you would pass query and specialty as parameters
      const response = await fetchHospitals(page);
      setHospitals(response.data);
      setPagination({
        ...pagination,
        current: page,
        total: response.total,
      });
    } catch (error) {
      console.error("Failed to fetch hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchData(pagination.current, searchQuery, specialty);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    fetchData(1, value, specialty);
  };

  const handleSpecialtyChange = (value: string) => {
    setSpecialty(value);
    fetchData(1, searchQuery, value);
  };

  const columns = [
    {
      title: "Hospital",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Hospital) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: "bold" }}>{text}</span>
          <Rate
            disabled
            defaultValue={record.rating}
            style={{ fontSize: "14px" }}
          />
        </Space>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text: string) => (
        <Space>
          <EnvironmentOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      render: (text: string) => (
        <Space>
          <PhoneOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Specialties",
      dataIndex: "specialties",
      key: "specialties",
      render: (specialties: string[]) => (
        <Space wrap>
          {specialties.map((specialty) => (
            <Tag key={specialty} color="green">
              {specialty}
            </Tag>
          ))}
        </Space>
      ),
    },
  ];

  // For mobile view
  const renderMobileCard = (hospital: Hospital) => (
    <Card key={hospital.id} style={{ marginBottom: 16 }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <img
          src={hospital.image}
          alt={hospital.name}
          style={{
            width: "100%",
            maxHeight: 200,
            objectFit: "cover",
            borderRadius: "4px",
          }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <Title level={4}>{hospital.name}</Title>
        <Rate
          disabled
          defaultValue={hospital.rating}
          style={{ fontSize: "14px" }}
        />
      </div>
      <Paragraph>
        <EnvironmentOutlined /> {hospital.address}
      </Paragraph>
      <Paragraph>
        <PhoneOutlined /> {hospital.contact}
      </Paragraph>
      <div>
        <Space wrap>
          {hospital.specialties.map((specialty) => (
            <Tag key={specialty} color="green">
              {specialty}
            </Tag>
          ))}
        </Space>
      </div>
    </Card>
  );

  return (
    <div className="hospitals-container">
      <Title level={2}>Hospitals</Title>

      <div className="filter-container" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="Search hospitals"
              onSearch={handleSearch}
              style={{ width: "100%" }}
              enterButton
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Filter by specialty"
              style={{ width: "100%" }}
              onChange={handleSpecialtyChange}
              allowClear
            >
              <Option value="Cardiology">Cardiology</Option>
              <Option value="Neurology">Neurology</Option>
              <Option value="Orthopedics">Orthopedics</Option>
              <Option value="Pediatrics">Pediatrics</Option>
              <Option value="Oncology">Oncology</Option>
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
          {/* Desktop view */}
          <div className="desktop-view">
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
          <div className="mobile-view">
            {hospitals.map(renderMobileCard)}
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <Table
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: false,
                }}
                onChange={handleTableChange}
                showHeader={false}
                dataSource={[]}
                columns={[]}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Hospitals;
