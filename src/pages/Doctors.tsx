// src/pages/Doctors.tsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  Input,
  Select,
  Space,
  Spin,
  Avatar,
  Tag,
  Card,
  Row,
  Col,
} from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { fetchDoctors } from "../services/api";
import { Doctor } from "../types";
import config from "../config";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: config.itemsPerPage,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState<string | undefined>(
    undefined
  );

  const fetchData = async (page = 1, query = "", specialization = "") => {
    setLoading(true);
    try {
      // In a real app, you would pass query and specialization as parameters
      const response = await fetchDoctors(page);
      setDoctors(response.data);
      setPagination({
        ...pagination,
        current: page,
        total: response.total,
      });
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchData(pagination.current, searchQuery, specialization);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    fetchData(1, value, specialization);
  };

  const handleSpecializationChange = (value: string) => {
    setSpecialization(value);
    fetchData(1, searchQuery, value);
  };

  const columns = [
    {
      title: "Doctor",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Doctor) => (
        <Space>
          <Avatar src={record.image} size={48} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      key: "specialization",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      render: (years: number) => `${years} years`,
    },
    {
      title: "Education",
      dataIndex: "education",
      key: "education",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
    },
  ];

  // For mobile view
  const renderMobileCard = (doctor: Doctor) => (
    <Card key={doctor.id} style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <Avatar src={doctor.image} size={64} />
        <div style={{ marginLeft: 16 }}>
          <h3>{doctor.name}</h3>
          <Tag color="blue">{doctor.specialization}</Tag>
        </div>
      </div>
      <div>
        <p>
          <strong>Experience:</strong> {doctor.experience} years
        </p>
        <p>
          <strong>Education:</strong> {doctor.education}
        </p>
        <p>
          <strong>Contact:</strong> {doctor.contact}
        </p>
      </div>
    </Card>
  );

  return (
    <div className="doctors-container">
      <Title level={2}>Doctors</Title>

      <div className="filter-container" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="Search doctors"
              onSearch={handleSearch}
              style={{ width: "100%" }}
              enterButton
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Filter by specialization"
              style={{ width: "100%" }}
              onChange={handleSpecializationChange}
              allowClear
            >
              <Option value="Cardiology">Cardiology</Option>
              <Option value="Neurology">Neurology</Option>
              <Option value="Orthopedics">Orthopedics</Option>
              <Option value="Pediatrics">Pediatrics</Option>
              <Option value="Dermatology">Dermatology</Option>
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
              dataSource={doctors}
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
            {doctors.map(renderMobileCard)}
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

export default Doctors;
