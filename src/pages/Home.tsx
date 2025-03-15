import React, { useEffect, useState } from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Carousel,
  Spin,
  Button,
  Input,
  Tag,
  Avatar,
  Space,
  Badge,
} from "antd";
import {
  MedicineBoxOutlined,
  BankOutlined,
  ReadOutlined,
  SearchOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  StarFilled,
  RightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BlogPost, FeaturedData } from "../types";
import CountUp from "react-countup"; // You'll need to install this package

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;
const { Search } = Input;

// Mock data
const staticFeaturedData: FeaturedData = {
  doctors: [
    {
      id: 1,
      name: "Dr. John Smith",
      specialization: "Cardiology",
      experience: 15,
      image: "https://via.placeholder.com/300x200?text=Dr.+John+Smith",
      rating: 4.9,
      reviewCount: 156,
      education: "",
      contact: "",
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      specialization: "Pediatrics",
      experience: 12,
      image: "https://via.placeholder.com/300x200?text=Dr.+Sarah+Johnson",
      rating: 4.8,
      reviewCount: 132,
      education: "",
      contact: "",
    },
    {
      id: 3,
      name: "Dr. Michael Chang",
      specialization: "Neurology",
      experience: 20,
      image: "https://via.placeholder.com/300x200?text=Dr.+Michael+Chang",
      rating: 4.7,
      reviewCount: 94,
      education: "",
      contact: "",
    },
    {
      id: 4,
      name: "Dr. Emily Rodriguez",
      specialization: "Dermatology",
      experience: 8,
      image: "https://via.placeholder.com/300x200?text=Dr.+Emily+Rodriguez",
      rating: 4.6,
      reviewCount: 87,
      education: "",
      contact: "",
    },
  ],
  hospitals: [
    {
      id: 1,
      name: "City General Hospital",
      address: "123 Main St, Cityville",
      image: "https://via.placeholder.com/300x200?text=City+General+Hospital",
      type: "Multi-Specialty",
      beds: 500,
      contact: "",
      specialties: [],
      rating: 0,
      doctors: [],
    },
    {
      id: 2,
      name: "Riverside Medical Center",
      address: "456 River Rd, Riverside",
      image:
        "https://via.placeholder.com/300x200?text=Riverside+Medical+Center",
      type: "Cardiac Care",
      beds: 350,
      contact: "",
      specialties: [],
      rating: 0,
      doctors: [],
    },
    {
      id: 3,
      name: "Sunshine Children's Hospital",
      address: "789 Sun Ave, Sunnydale",
      image:
        "https://via.placeholder.com/300x200?text=Sunshine+Children's+Hospital",
      type: "Pediatric",
      beds: 250,
      contact: "",
      specialties: [],
      rating: 0,
      doctors: [],
    },
  ],
  institutes: [
    {
      id: 1,
      name: "National Medical College",
      location: "Cityville",
      image:
        "https://via.placeholder.com/300x200?text=National+Medical+College",
      address: "",
      contact: "",
      courses: [],
      established: 0,
    },
    {
      id: 2,
      name: "Riverside Institute of Medicine",
      location: "Riverside",
      image: "https://via.placeholder.com/300x200?text=Riverside+Institute",
      address: "",
      contact: "",
      courses: [],
      established: 0,
    },
  ],
  stats: {
    totalDoctors: 5367,
    totalHospitals: 432,
    totalInstitutes: 128,
    totalPatientsCared: 250000,
  },
};

const staticBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Understanding Hypertension: Causes and Treatment",
    image: "https://via.placeholder.com/300x200?text=Hypertension+Article",
    category: "Health Tips",
    description:
      "Learn about the causes, symptoms, and treatment options for high blood pressure.",
  },
  {
    id: 2,
    title: "Vaccination Schedule for Children",
    image: "https://via.placeholder.com/300x200?text=Vaccination+Article",
    category: "Pediatrics",
    description:
      "A complete guide to essential vaccines for children from birth to 12 years.",
  },
  {
    id: 3,
    title: "Stress Management Techniques",
    image: "https://via.placeholder.com/300x200?text=Stress+Management",
    category: "Mental Health",
    description:
      "Effective strategies to manage stress and improve your mental wellbeing.",
  },
  {
    id: 4,
    title: "New Cancer Treatment Breakthrough",
    image: "https://via.placeholder.com/300x200?text=Cancer+Research",
    category: "Medical News",
    description:
      "Researchers discover a promising new approach to treating advanced cancer.",
  },
  {
    id: 5,
    title: "Diabetes Prevention: Diet and Exercise",
    image: "https://via.placeholder.com/300x200?text=Diabetes+Prevention",
    category: "Nutrition",
    description:
      "How proper diet and regular exercise can help prevent type 2 diabetes.",
  },
  {
    id: 6,
    title: "COVID-19: Latest Updates and Guidelines",
    image: "https://via.placeholder.com/300x200?text=COVID+Updates",
    category: "Public Health",
    description:
      "Stay informed with the most recent information about COVID-19 prevention and treatment.",
  },
];

// Define common specialties for quick navigation
const popularSpecialties = [
  { name: "Cardiology", icon: "❤️" },
  { name: "Pediatrics", icon: "👶" },
  { name: "Orthopedics", icon: "🦴" },
  { name: "Dermatology", icon: "🧴" },
  { name: "Neurology", icon: "🧠" },
  { name: "Gynecology", icon: "👩" },
  { name: "Ophthalmology", icon: "👁️" },
  { name: "Dentistry", icon: "🦷" },
];

const Home: React.FC = () => {
  const [featuredData, setFeaturedData] = useState<FeaturedData | null>(null);
  const [, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setFeaturedData(staticFeaturedData);
        setBlogPosts(staticBlogPosts);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        <Spin size="large" />
        <Paragraph style={{ marginTop: 16 }}>
          Loading medical resources...
        </Paragraph>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section with Search */}
      <div
        className="hero-section"
        style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
          borderRadius: "0 0 20px 20px",
          marginBottom: 48,
          color: "#fff",
        }}
      >
        <Title style={{ color: "#fff", fontSize: 36 }}>
          Your Health, Our Priority
        </Title>
        <Paragraph
          style={{
            fontSize: 18,
            color: "#fff",
            maxWidth: 800,
            margin: "0 auto 32px",
          }}
        >
          Find the best doctors, hospitals, and medical institutions in your
          area
        </Paragraph>

        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Search
            placeholder="Search for doctors, hospitals, or medical conditions..."
            enterButton={
              <Button type="primary" icon={<SearchOutlined />}>
                Search
              </Button>
            }
            size="large"
            onSearch={(value) => console.log(value)}
            style={{ width: "100%" }}
          />

          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <Text style={{ color: "#fff", marginRight: 8 }}>Popular:</Text>
            <Tag color="blue">Cardiologists</Tag>
            <Tag color="blue">Family Doctors</Tag>
            <Tag color="blue">Pediatricians</Tag>
            <Tag color="blue">Top Hospitals</Tag>
          </div>
        </div>
      </div>

      {featuredData && (
        <>
          {/* Enhanced Statistics Section */}
          <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
            <Col xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                className="stat-card"
                style={{
                  height: 160,
                  background: "linear-gradient(to right, #36DBFF, #0085FF)",
                  color: "#fff",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <MedicineBoxOutlined
                    style={{ fontSize: 36, marginBottom: 8 }}
                  />
                  <Title level={2} style={{ color: "#fff", margin: 0 }}>
                    <CountUp
                      end={featuredData.stats.totalDoctors}
                      separator=","
                      duration={2.5}
                    />
                  </Title>
                  <Text style={{ color: "#fff", fontSize: 16 }}>
                    Qualified Doctors
                  </Text>
                </div>
                <Link to="/doctors">
                  <Button
                    type="link"
                    style={{
                      color: "#fff",
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                    }}
                  >
                    View All <RightOutlined />
                  </Button>
                </Link>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                style={{
                  height: 160,
                  background: "linear-gradient(to right, #FFD580, #FF8C00)",
                  color: "#fff",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <BankOutlined style={{ fontSize: 36, marginBottom: 8 }} />
                  <Title level={2} style={{ color: "#fff", margin: 0 }}>
                    <CountUp
                      end={featuredData.stats.totalHospitals}
                      separator=","
                      duration={2.5}
                    />
                  </Title>
                  <Text style={{ color: "#fff", fontSize: 16 }}>
                    Leading Hospitals
                  </Text>
                </div>
                <Link to="/hospitals">
                  <Button
                    type="link"
                    style={{
                      color: "#fff",
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                    }}
                  >
                    View All <RightOutlined />
                  </Button>
                </Link>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                style={{
                  height: 160,
                  background: "linear-gradient(to right, #C5A3FF, #7B2CBF)",
                  color: "#fff",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <ReadOutlined style={{ fontSize: 36, marginBottom: 8 }} />
                  <Title level={2} style={{ color: "#fff", margin: 0 }}>
                    <CountUp
                      end={featuredData.stats.totalInstitutes}
                      separator=","
                      duration={2.5}
                    />
                  </Title>
                  <Text style={{ color: "#fff", fontSize: 16 }}>
                    Medical Institutes
                  </Text>
                </div>
                <Link to="/institutes">
                  <Button
                    type="link"
                    style={{
                      color: "#fff",
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                    }}
                  >
                    View All <RightOutlined />
                  </Button>
                </Link>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                style={{
                  height: 160,
                  background: "linear-gradient(to right, #90EE90, #2E8B57)",
                  color: "#fff",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <TeamOutlined style={{ fontSize: 36, marginBottom: 8 }} />
                  <Title level={2} style={{ color: "#fff", margin: 0 }}>
                    <CountUp
                      end={featuredData.stats.totalPatientsCared || 50000}
                      separator=","
                      duration={2.5}
                    />
                  </Title>
                  <Text style={{ color: "#fff", fontSize: 16 }}>
                    Patients Served
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Quick Navigation - Medical Specialties */}
          <div style={{ marginBottom: 48 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Find Doctors By Specialty
            </Title>
            <Row gutter={[16, 16]}>
              {popularSpecialties.map((specialty, index) => (
                <Col xs={12} sm={8} md={6} lg={3} key={index}>
                  <Link to={`/doctors?specialty=${specialty.name}`}>
                    <Card
                      hoverable
                      style={{ textAlign: "center", borderRadius: 12 }}
                      bodyStyle={{ padding: 16 }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>
                        {specialty.icon}
                      </div>
                      <Text strong>{specialty.name}</Text>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </div>

          {/* Featured Doctors Section - Enhanced */}
          <Title level={2} style={{ marginBottom: 24 }}>
            Top-Rated Doctors
          </Title>
          <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
            {featuredData.doctors.map((doctor) => (
              <Col xs={24} sm={12} md={8} lg={6} key={doctor.id}>
                <Badge.Ribbon text="Top Rated" color="gold">
                  <Card
                    hoverable
                    className="doctor-card"
                    cover={
                      <div
                        style={{
                          position: "relative",
                          height: 200,
                          overflow: "hidden",
                        }}
                      >
                        <img
                          alt={doctor.name}
                          src={doctor.image}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    }
                    actions={[
                      <Link to={`/doctors/${doctor.id}`}>View Profile</Link>,
                      <Button type="text">Book Appointment</Button>,
                    ]}
                  >
                    <Meta
                      avatar={<Avatar src={doctor.image} size="large" />}
                      title={doctor.name}
                      description={
                        <Space direction="vertical" size={0}>
                          <Text type="secondary">{doctor.specialization}</Text>
                          <Space>
                            <StarFilled style={{ color: "#faad14" }} />
                            <Text>{doctor.rating || "4.8"}</Text>
                            <Text type="secondary">
                              ({doctor.reviewCount || "124"} reviews)
                            </Text>
                          </Space>
                          <Text>
                            <ClockCircleOutlined /> {doctor.experience} years
                            experience
                          </Text>
                        </Space>
                      }
                    />
                  </Card>
                </Badge.Ribbon>
              </Col>
            ))}
            <Col xs={24} style={{ textAlign: "center", marginTop: 16 }}>
              <Link to="/doctors">
                <Button type="primary" size="large" icon={<PlusOutlined />}>
                  See All Doctors
                </Button>
              </Link>
            </Col>
          </Row>

          {/* Top Hospitals - Enhanced */}
          <Title level={2} style={{ marginBottom: 24 }}>
            Leading Medical Facilities
          </Title>
          <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
            {featuredData.hospitals.map((hospital) => (
              <Col xs={24} sm={12} md={8} key={hospital.id}>
                <Card
                  hoverable
                  className="hospital-card"
                  cover={
                    <div style={{ position: "relative" }}>
                      <img
                        alt={hospital.name}
                        src={hospital.image}
                        style={{
                          height: 200,
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: "30px 12px 12px",
                          background:
                            "linear-gradient(transparent, rgba(0,0,0,0.7))",
                          color: "#fff",
                        }}
                      >
                        <Text strong style={{ color: "#fff", fontSize: 16 }}>
                          {hospital.name}
                        </Text>
                      </div>
                    </div>
                  }
                >
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">{hospital.address}</Text>
                    <Space style={{ marginTop: 8 }}>
                      <Tag color="blue">
                        {hospital.type || "Multi-Specialty"}
                      </Tag>
                      <Tag color="green">{hospital.beds || "200+"} Beds</Tag>
                    </Space>
                    <div style={{ marginTop: 12 }}>
                      <Link to={`/hospitals/${hospital.id}`}>
                        <Button type="primary" size="small">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
            <Col xs={24} style={{ textAlign: "center", marginTop: 16 }}>
              <Link to="/hospitals">
                <Button type="primary" size="large" icon={<PlusOutlined />}>
                  See All Hospitals
                </Button>
              </Link>
            </Col>
          </Row>

          {/* Blog Section - New */}
          <div style={{ marginBottom: 48 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Latest Medical Articles
            </Title>
            <Carousel
              autoplay
              dots={{ className: "custom-carousel-dots" }}
              autoplaySpeed={5000}
            >
              <div>
                <Row gutter={[16, 16]}>
                  {[1, 2, 3].map((item) => (
                    <Col xs={24} md={8} key={item}>
                      <Card
                        hoverable
                        cover={
                          <img
                            alt={`Medical Article ${item}`}
                            src={`/images/blog-${item}.jpg`}
                            style={{ height: 200, objectFit: "cover" }}
                          />
                        }
                      >
                        <Tag color="blue" style={{ marginBottom: 8 }}>
                          Health Tips
                        </Tag>
                        <Meta
                          title={`Medical Article Title ${item}`}
                          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        />
                        <div style={{ marginTop: 12 }}>
                          <Link to={`/blog/article-${item}`}>
                            <Button type="link" style={{ paddingLeft: 0 }}>
                              Read More
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
              <div>
                <Row gutter={[16, 16]}>
                  {[4, 5, 6].map((item) => (
                    <Col xs={24} md={8} key={item}>
                      <Card
                        hoverable
                        cover={
                          <img
                            alt={`Medical Article ${item}`}
                            src={`/images/blog-${item}.jpg`}
                            style={{ height: 200, objectFit: "cover" }}
                          />
                        }
                      >
                        <Tag color="green" style={{ marginBottom: 8 }}>
                          Medical News
                        </Tag>
                        <Meta
                          title={`Medical Article Title ${item}`}
                          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        />
                        <div style={{ marginTop: 12 }}>
                          <Link to={`/blog/article-${item}`}>
                            <Button type="link" style={{ paddingLeft: 0 }}>
                              Read More
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Carousel>
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Link to="/blog">
                <Button type="primary" icon={<ReadOutlined />}>
                  View All Articles
                </Button>
              </Link>
            </div>
          </div>

          {/* Testimonials Section - New */}
          <div
            style={{
              marginBottom: 48,
              background: "#f5f5f5",
              padding: 24,
              borderRadius: 12,
            }}
          >
            <Title level={2} style={{ marginBottom: 24, textAlign: "center" }}>
              What Our Users Say
            </Title>
            <Carousel
              autoplay
              autoplaySpeed={6000}
              dots={{ className: "custom-carousel-dots" }}
            >
              <div>
                <Row gutter={24} justify="center">
                  <Col xs={24} md={8}>
                    <Card bordered={false}>
                      <Meta
                        avatar={<Avatar size={64} src="/images/user1.jpg" />}
                        title="Sarah Johnson"
                        description={
                          <>
                            <div style={{ marginBottom: 8 }}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarFilled
                                  key={star}
                                  style={{ color: "#faad14", marginRight: 4 }}
                                />
                              ))}
                            </div>
                            <Paragraph>
                              "This portal made it so easy to find a specialist
                              for my condition. I was able to read reviews,
                              check credentials, and book an appointment all in
                              one place!"
                            </Paragraph>
                          </>
                        }
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card bordered={false}>
                      <Meta
                        avatar={<Avatar size={64} src="/images/user2.jpg" />}
                        title="Michael Brown"
                        description={
                          <>
                            <div style={{ marginBottom: 8 }}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarFilled
                                  key={star}
                                  style={{ color: "#faad14", marginRight: 4 }}
                                />
                              ))}
                            </div>
                            <Paragraph>
                              "Finding the right hospital for my procedure was
                              stressful until I found this website. The detailed
                              information and user reviews helped me make an
                              informed decision."
                            </Paragraph>
                          </>
                        }
                      />
                    </Card>
                  </Col>
                </Row>
              </div>
              <div>
                <Row gutter={24} justify="center">
                  <Col xs={24} md={8}>
                    <Card bordered={false}>
                      <Meta
                        avatar={<Avatar size={64} src="/images/user3.jpg" />}
                        title="Emily Davis"
                        description={
                          <>
                            <div style={{ marginBottom: 8 }}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarFilled
                                  key={star}
                                  style={{ color: "#faad14", marginRight: 4 }}
                                />
                              ))}
                            </div>
                            <Paragraph>
                              "The blog articles are informative and
                              well-written. I've learned so much about managing
                              my health conditions through this portal."
                            </Paragraph>
                          </>
                        }
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card bordered={false}>
                      <Meta
                        avatar={<Avatar size={64} src="/images/user4.jpg" />}
                        title="Robert Wilson"
                        description={
                          <>
                            <div style={{ marginBottom: 8 }}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarFilled
                                  key={star}
                                  style={{ color: "#faad14", marginRight: 4 }}
                                />
                              ))}
                            </div>
                            <Paragraph>
                              "I was able to compare different hospitals and
                              their specialties before making my decision. This
                              portal saved me so much time and stress."
                            </Paragraph>
                          </>
                        }
                      />
                    </Card>
                  </Col>
                </Row>
              </div>
            </Carousel>
          </div>

          {/* Health Tips Section - New */}
          <div style={{ marginBottom: 48 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Health Tips & Resources
            </Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12} lg={8}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt="Prevention"
                      src="/images/prevention.jpg"
                      style={{ height: 200, objectFit: "cover" }}
                    />
                  }
                >
                  <Meta
                    title="Preventive Health Measures"
                    description="Learn about key preventive health measures everyone should know about."
                  />
                  <Button type="link" style={{ paddingLeft: 0, marginTop: 12 }}>
                    Read More
                  </Button>
                </Card>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt="Insurance"
                      src="/images/insurance.jpg"
                      style={{ height: 200, objectFit: "cover" }}
                    />
                  }
                >
                  <Meta
                    title="Medical Insurance Guide"
                    description="Understanding your medical insurance options and coverage."
                  />
                  <Button type="link" style={{ paddingLeft: 0, marginTop: 12 }}>
                    Read More
                  </Button>
                </Card>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt="Diet"
                      src="/images/diet.jpg"
                      style={{ height: 200, objectFit: "cover" }}
                    />
                  }
                >
                  <Meta
                    title="Nutrition & Diet"
                    description="Healthy eating habits and nutrition advice from medical professionals."
                  />
                  <Button type="link" style={{ paddingLeft: 0, marginTop: 12 }}>
                    Read More
                  </Button>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Call to Action Section - New */}
          <div
            style={{
              marginBottom: 48,
              background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
              padding: 48,
              borderRadius: 12,
              textAlign: "center",
              color: "#fff",
            }}
          >
            <Title level={2} style={{ color: "#fff", marginBottom: 16 }}>
              Need Immediate Medical Assistance?
            </Title>
            <Paragraph
              style={{
                fontSize: 18,
                color: "#fff",
                maxWidth: 800,
                margin: "0 auto 24px",
              }}
            >
              Don't wait for an appointment. Connect with a doctor online now or
              find emergency care near you.
            </Paragraph>
            <Space size={16}>
              <Button
                type="primary"
                size="large"
                style={{ background: "#fff", color: "#1890ff" }}
              >
                Talk to a Doctor Now
              </Button>
              <Button
                type="default"
                size="large"
                style={{ borderColor: "#fff", color: "#fff" }}
              >
                Find Emergency Care
              </Button>
            </Space>
          </div>

          {/* App Download Section - New */}
          <div style={{ marginBottom: 48 }}>
            <Row gutter={24} align="middle">
              <Col xs={24} md={12}>
                <img
                  src="/images/app-mockup.png"
                  alt="Mobile App"
                  style={{
                    width: "100%",
                    maxWidth: 400,
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </Col>
              <Col xs={24} md={12}>
                <Title level={2}>Download Our Mobile App</Title>
                <Paragraph style={{ fontSize: 16 }}>
                  Get the same great features on the go! Our mobile app makes it
                  easy to:
                </Paragraph>
                <ul style={{ fontSize: 16, marginBottom: 24 }}>
                  <li>Find doctors and book appointments</li>
                  <li>Access your medical records</li>
                  <li>Get medication reminders</li>
                  <li>Consult with doctors via video chat</li>
                  <li>Find nearby pharmacies and hospitals</li>
                </ul>
                <Space size={16}>
                  <Button
                    type="primary"
                    size="large"
                    icon={
                      <img
                        src="/images/apple-icon.png"
                        width={20}
                        style={{ marginRight: 8 }}
                      />
                    }
                  >
                    App Store
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    icon={
                      <img
                        src="/images/google-play-icon.png"
                        width={20}
                        style={{ marginRight: 8 }}
                      />
                    }
                  >
                    Google Play
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>

          {/* Footer Subscription Section - New */}
          <div
            style={{
              marginBottom: 48,
              background: "#f5f5f5",
              padding: 24,
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <Title level={3}>Stay Updated with Medical News</Title>
            <Paragraph style={{ maxWidth: 600, margin: "0 auto 24px" }}>
              Subscribe to our newsletter to receive the latest medical news,
              health tips, and exclusive offers.
            </Paragraph>
            <Row justify="center">
              <Col xs={24} md={16} lg={12}>
                <Input.Group compact>
                  <Input
                    style={{ width: "calc(100% - 100px)" }}
                    placeholder="Enter your email"
                    size="large"
                  />
                  <Button type="primary" size="large" style={{ width: 100 }}>
                    Subscribe
                  </Button>
                </Input.Group>
              </Col>
            </Row>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
