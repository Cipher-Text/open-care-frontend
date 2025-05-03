import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  Input,
  Space,
  Spin,
  Avatar,
  Tag,
  Card,
  Row,
  Col,
  TablePaginationConfig,
} from "antd";
import { fetchDoctors } from "../services/api";
import config from "../config";
import { Doctor, Profile } from "../types";

const { Title } = Typography;
const { Search } = Input;

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
      const response = await fetchDoctors(page, query);
      setDoctors(response.data);
      setPagination({
        current: page,
        pageSize: config.itemsPerPage,
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

  const handleTableChange = (pagination: TablePaginationConfig) => {
    fetchData(pagination.current, searchQuery);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    fetchData(1, value);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "profile",
      key: "name",
      render: (profile: Profile) => (
        <Space>
          <Avatar
            src={profile.photo || "https://via.placeholder.com/48"}
            size={48}
          />
          <span>{profile.name}</span>
        </Space>
      ),
    },
    {
      title: "Gender",
      dataIndex: "profile",
      key: "gender",
      render: (profile: Profile) => {
        const color = profile.gender === "MALE" ? "blue" : "pink";
        return <Tag color={color}>{profile.gender}</Tag>;
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

  const renderMobileCard = (doctor: Doctor) => (
    <Card key={doctor.id} style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <Avatar
          src={doctor.profile.photo || "https://via.placeholder.com/64"}
          size={64}
        />
        <div style={{ marginLeft: 16 }}>
          <h3>{doctor.profile.name}</h3>
          <Tag color={doctor.profile.gender === "MALE" ? "blue" : "pink"}>
            {doctor.profile.gender}
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

          <div className="mobile-view">{doctors.map(renderMobileCard)}</div>
        </>
      )}
    </div>
  );
};

export default Doctors;
