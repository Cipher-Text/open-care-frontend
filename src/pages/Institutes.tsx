// src/pages/Institutes.tsx
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
  Statistic,
} from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { fetchInstitutes } from "../services/api";
import { Institute } from "../types";
import config from "../config";

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const Institutes: React.FC = () => {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: config.itemsPerPage,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [course, setCourse] = useState<string | undefined>(undefined);

  const fetchData = async (page = 1, query = "", course = "") => {
    setLoading(true);
    try {
      // In a real app, you would pass query and course as parameters
      const response = await fetchInstitutes(page);
      setInstitutes(response.data);
      setPagination({
        ...pagination,
        current: page,
        total: response.total,
      });
    } catch (error) {
      console.error("Failed to fetch institutes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchData(pagination.current, searchQuery, course);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    fetchData(1, value, course);
  };

  const handleCourseChange = (value: string) => {
    setCourse(value);
    fetchData(1, searchQuery, value);
  };

  const columns = [
    {
      title: "Institute",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Institute) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: "bold" }}>{text}</span>
          <span style={{ fontSize: "12px", color: "#888" }}>
            Est. {record.established}
          </span>
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
      title: "Courses",
      dataIndex: "courses",
      key: "courses",
      render: (courses: string[]) => (
        <Space wrap>
          {courses.map((course) => (
            <Tag key={course} color="purple">
              {course}
            </Tag>
          ))}
        </Space>
      ),
    },
  ];

  // For mobile view
  const renderMobileCard = (institute: Institute) => (
    <Card key={institute.id} style={{ marginBottom: 16 }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <img
          src={institute.image}
          alt={institute.name}
          style={{
            width: "100%",
            maxHeight: 200,
            objectFit: "cover",
            borderRadius: "4px",
          }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <Title level={4}>{institute.name}</Title>
        <Paragraph style={{ color: "#888" }}>
          <ClockCircleOutlined /> Established {institute.established}
        </Paragraph>
      </div>
      <Paragraph>
        <EnvironmentOutlined /> {institute.address}
      </Paragraph>
      <Paragraph>
        <PhoneOutlined /> {institute.contact}
      </Paragraph>
      <div>
        <div style={{ marginBottom: 8 }}>Available Courses:</div>
        <Space wrap>
          {institute.courses.map((course) => (
            <Tag key={course} color="purple">
              {course}
            </Tag>
          ))}
        </Space>
      </div>
    </Card>
  );

  return (
    <div className="institutes-container">
      <Title level={2}>Medical Institutes</Title>

      <div className="filter-container" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="Search institutes"
              onSearch={handleSearch}
              style={{ width: "100%" }}
              enterButton
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Filter by course"
              style={{ width: "100%" }}
              onChange={handleCourseChange}
              allowClear
            >
              <Option value="MBBS">MBBS</Option>
              <Option value="MD">MD</Option>
              <Option value="Pharmacy">Pharmacy</Option>
              <Option value="Nursing">Nursing</Option>
              <Option value="Dentistry">Dentistry</Option>
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
              dataSource={institutes}
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
            {institutes.map(renderMobileCard)}
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

export default Institutes;
