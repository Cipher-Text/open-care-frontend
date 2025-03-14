// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  Carousel,
  Spin,
  Button,
} from "antd";
import {
  UserOutlined,
  MedicineBoxOutlined,
  BankOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { fetchFeaturedData } from "../services/api";
import { Doctor, Hospital, Institute } from "../types";

const { Title, Paragraph } = Typography;
const { Meta } = Card;

interface FeaturedData {
  doctors: Doctor[];
  hospitals: Hospital[];
  institutes: Institute[];
  stats: {
    totalDoctors: number;
    totalHospitals: number;
    totalInstitutes: number;
  };
}

const Home: React.FC = () => {
  const [featuredData, setFeaturedData] = useState<FeaturedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedData = async () => {
      try {
        const data = await fetchFeaturedData();
        setFeaturedData(data);
      } catch (error) {
        console.error("Failed to load featured data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="home-container">
      <div
        className="hero-section"
        style={{ textAlign: "center", marginBottom: 48 }}
      >
        <Title>Welcome to Medical Information Portal</Title>
        <Paragraph style={{ fontSize: 18 }}>
          Your comprehensive resource for doctors, hospitals, and medical
          institutions
        </Paragraph>
      </div>

      {featuredData && (
        <>
          <Row gutter={16} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Doctors"
                  value={featuredData.stats.totalDoctors}
                  prefix={<MedicineBoxOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
                <Button type="link" style={{ padding: 0, marginTop: 8 }}>
                  <Link to="/doctors">View All Doctors</Link>
                </Button>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Hospitals"
                  value={featuredData.stats.totalHospitals}
                  prefix={<BankOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
                <Button type="link" style={{ padding: 0, marginTop: 8 }}>
                  <Link to="/hospitals">View All Hospitals</Link>
                </Button>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Medical Institutes"
                  value={featuredData.stats.totalInstitutes}
                  prefix={<ReadOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
                <Button type="link" style={{ padding: 0, marginTop: 8 }}>
                  <Link to="/institutes">View All Institutes</Link>
                </Button>
              </Card>
            </Col>
          </Row>

          <Title level={2} style={{ marginBottom: 24 }}>
            Featured Doctors
          </Title>
          <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
            {featuredData.doctors.map((doctor) => (
              <Col xs={24} sm={12} md={8} key={doctor.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={doctor.name}
                      src={doctor.image}
                      style={{ height: 200, objectFit: "cover" }}
                    />
                  }
                >
                  <Meta
                    title={doctor.name}
                    description={`${doctor.specialization} • ${doctor.experience} years experience`}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <Title level={2} style={{ marginBottom: 24 }}>
            Top Hospitals
          </Title>
          <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
            {featuredData.hospitals.map((hospital) => (
              <Col xs={24} sm={12} md={8} key={hospital.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={hospital.name}
                      src={hospital.image}
                      style={{ height: 200, objectFit: "cover" }}
                    />
                  }
                >
                  <Meta title={hospital.name} description={hospital.address} />
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

export default Home;
