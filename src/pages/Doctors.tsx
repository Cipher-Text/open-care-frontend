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
import { SearchOutlined } from "@ant-design/icons";
import { fetchDoctors } from "../services/api";
import config from "../config";
import { DoctorResponse, Doctor } from "../types";

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

  const fetchData = async (page = 1, query = "") => {
    setLoading(true);
    try {
      // In a real app, you would pass query as parameter
      const response = await fetchDoctors(page);
      // Update to match your API response structure
      setDoctors(response.doctors);
      setPagination({
        ...pagination,
        current: page,
        total: response.totalItems,
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
    fetchData(pagination.current, searchQuery);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    fetchData(1, value);
  };

  // Updated columns to match your requirements
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Doctor) => (
        <Space>
          <Avatar
            src={record.image || "https://via.placeholder.com/48"}
            size={48}
          />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (text: string) => {
        const color = text === "MALE" ? "blue" : "pink";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "BMDC No",
      dataIndex: "bmdcNo",
      key: "bmdcNo",
      render: (text: string) => text || "Not Available",
    },
    {
      title: "Years of Experience",
      dataIndex: "yearOfExperience",
      key: "yearOfExperience",
      render: (years: number) => `${years} years`,
    },
  ];

  // Updated for mobile view
  const renderMobileCard = (doctor: Doctor) => (
    <Card key={doctor.id} style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <Avatar
          src={doctor.image || "https://via.placeholder.com/64"}
          size={64}
        />
        <div style={{ marginLeft: 16 }}>
          <h3>{doctor.name}</h3>
          <Tag color={doctor.gender === "MALE" ? "blue" : "pink"}>
            {doctor.gender}
          </Tag>
        </div>
      </div>
      <div>
        <p>
          <strong>BMDC No:</strong> {doctor.bmdcNo || "Not Available"}
        </p>
        <p>
          <strong>Experience:</strong> {doctor.yearOfExperience} years
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
