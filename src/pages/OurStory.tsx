import React, { useState } from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Timeline,
  Avatar,
  Space,
  Button,
  Tag,
  Statistic,
  Badge,
  List,
  Collapse,
} from "antd";
import {
  HeartOutlined,
  TrophyOutlined,
  RocketOutlined,
  EyeOutlined,
  BulbOutlined,
  GlobalOutlined,
  CodeOutlined,
  DatabaseOutlined,
  MobileOutlined,
  CloudOutlined,
  SecurityScanOutlined,
  CheckCircleOutlined,
  StarFilled,
  LinkedinOutlined,
  GithubOutlined,
  MailOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
  BankOutlined,
  ReadOutlined,
  TeamOutlined as TeamIcon,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

// Developer data
const developers = [
  {
    id: 1,
    name: "Imran Hossain",
    role: "Full Stack Developer",
    avatar: "https://via.placeholder.com/150x150?text=IH",
    bio: "Passionate developer with expertise in React, Node.js, and modern web technologies. Leading the development of Open Care platform.",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
    experience: "5+ years",
    education: "BSc in Computer Science",
    github: "https://github.com/imranhossain",
    linkedin: "https://linkedin.com/in/imranhossain",
    email: "imran@opencare.com",
    contributions: ["Frontend Architecture", "API Design", "Database Design"],
  },
  {
    id: 2,
    name: "Sarah Ahmed",
    role: "UI/UX Designer",
    avatar: "https://via.placeholder.com/150x150?text=SA",
    bio: "Creative designer focused on creating intuitive and accessible healthcare interfaces. Committed to improving user experience in medical applications.",
    skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
    experience: "4+ years",
    education: "BDes in Interaction Design",
    github: "https://github.com/sarahahmed",
    linkedin: "https://linkedin.com/in/sarahahmed",
    email: "sarah@opencare.com",
    contributions: ["UI Design", "User Experience", "Design System"],
  },
  {
    id: 3,
    name: "Mohammad Rahman",
    role: "Backend Developer",
    avatar: "https://via.placeholder.com/150x150?text=MR",
    bio: "Experienced backend developer specializing in scalable healthcare systems. Expert in API development and database optimization.",
    skills: ["Java", "Spring Boot", "MySQL", "Redis", "AWS"],
    experience: "6+ years",
    education: "MSc in Software Engineering",
    github: "https://github.com/mohammadrahman",
    linkedin: "https://linkedin.com/in/mohammadrahman",
    email: "mohammad@opencare.com",
    contributions: ["Backend API", "Database Design", "Security"],
  },
  {
    id: 4,
    name: "Fatima Khan",
    role: "DevOps Engineer",
    avatar: "https://via.placeholder.com/150x150?text=FK",
    bio: "DevOps specialist ensuring reliable deployment and monitoring of healthcare applications. Focused on security and compliance.",
    skills: ["Docker", "Kubernetes", "AWS", "Jenkins", "Prometheus"],
    experience: "4+ years",
    education: "BSc in Information Technology",
    github: "https://github.com/fatimakhan",
    linkedin: "https://linkedin.com/in/fatimakhan",
    email: "fatima@opencare.com",
    contributions: ["CI/CD Pipeline", "Infrastructure", "Monitoring"],
  },
];

// Project milestones
const milestones = [
  {
    year: "2024",
    title: "Project Launch",
    description: "Open Care platform officially launched with core features",
    icon: <RocketOutlined />,
    achievements: [
      "Initial platform development",
      "Doctor directory",
      "Hospital listings",
    ],
  },
  {
    year: "2023",
    title: "Development Phase",
    description: "Intensive development and testing phase",
    icon: <CodeOutlined />,
    achievements: [
      "Backend API development",
      "Frontend implementation",
      "Database design",
    ],
  },
  {
    year: "2022",
    title: "Planning & Research",
    description: "Comprehensive market research and planning",
    icon: <BulbOutlined />,
    achievements: [
      "Market analysis",
      "User research",
      "Technology stack selection",
    ],
  },
];

// Core values
const coreValues = [
  {
    title: "Patient-Centric",
    description: "Every feature is designed with patients' needs in mind",
    icon: <HeartOutlined />,
    color: "#ff4d4f",
  },
  {
    title: "Transparency",
    description: "Clear and honest information about healthcare providers",
    icon: <EyeOutlined />,
    color: "#1890ff",
  },
  {
    title: "Quality",
    description: "Maintaining high standards in healthcare information",
    icon: <TrophyOutlined />,
    color: "#faad14",
  },
  {
    title: "Innovation",
    description: "Continuously improving healthcare technology",
    icon: <BulbOutlined />,
    color: "#52c41a",
  },
];

// Technology stack
const techStack = {
  frontend: ["React", "TypeScript", "Ant Design", "Vite", "React Router"],
  backend: ["Node.js", "Express", "PostgreSQL", "Redis", "JWT"],
  devops: ["Docker", "AWS", "GitHub Actions", "Nginx", "PM2"],
  tools: ["Git", "VS Code", "Postman", "Figma", "Jira"],
};

const OurStory: React.FC = () => {
  const [, setActiveTab] = useState("mission");

  return (
    <div className="our-story-container" style={{ padding: "24px 0" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
          padding: "60px 20px",
          borderRadius: "20px",
          marginBottom: 48,
          textAlign: "center",
          color: "#fff",
        }}
      >
        <Title style={{ color: "#fff", fontSize: 48, marginBottom: 16 }}>
          Our Story
        </Title>
        <Paragraph
          style={{
            fontSize: 20,
            color: "#fff",
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          Building the future of healthcare access in Bangladesh through
          technology and innovation
        </Paragraph>
        <Space size={16} style={{ marginTop: 24 }}>
          <Button
            type="primary"
            size="large"
            style={{ background: "#fff", color: "#1890ff" }}
            onClick={() => setActiveTab("mission")}
          >
            Our Mission
          </Button>
          <Button
            type="default"
            size="large"
            style={{ borderColor: "#fff", color: "#fff" }}
            onClick={() => setActiveTab("team")}
          >
            Meet Our Team
          </Button>
        </Space>
      </div>

      {/* Mission & Vision Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
        <Col xs={24} lg={12}>
          <Card
            hoverable
            style={{ height: "100%", borderRadius: 12 }}
            title={
              <Space>
                <RocketOutlined style={{ color: "#1890ff" }} />
                <Title level={3} style={{ margin: 0 }}>
                  Our Mission
                </Title>
              </Space>
            }
          >
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              To democratize healthcare access in Bangladesh by providing a
              comprehensive, user-friendly platform that connects patients with
              qualified healthcare providers. We strive to bridge the gap
              between healthcare seekers and providers through innovative
              technology solutions.
            </Paragraph>
            <ul style={{ fontSize: 16, lineHeight: 1.8 }}>
              <li>Make healthcare information easily accessible to everyone</li>
              <li>Empower patients with informed decision-making tools</li>
              <li>Support healthcare providers with digital presence</li>
              <li>Improve healthcare outcomes through better connectivity</li>
            </ul>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            hoverable
            style={{ height: "100%", borderRadius: 12 }}
            title={
              <Space>
                <EyeOutlined style={{ color: "#722ed1" }} />
                <Title level={3} style={{ margin: 0 }}>
                  Our Vision
                </Title>
              </Space>
            }
          >
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              To become the leading healthcare information platform in
              Bangladesh, revolutionizing how people access and interact with
              healthcare services. We envision a future where quality healthcare
              is just a click away for every citizen.
            </Paragraph>
            <ul style={{ fontSize: 16, lineHeight: 1.8 }}>
              <li>Comprehensive healthcare ecosystem</li>
              <li>AI-powered health recommendations</li>
              <li>Telemedicine integration</li>
              <li>National healthcare data hub</li>
            </ul>
          </Card>
        </Col>
      </Row>

      {/* Core Values */}
      <div style={{ marginBottom: 48 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          Our Core Values
        </Title>
        <Row gutter={[16, 16]}>
          {coreValues.map((value, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card
                hoverable
                style={{
                  textAlign: "center",
                  borderRadius: 12,
                  height: "100%",
                }}
                bodyStyle={{ padding: 24 }}
              >
                <div
                  style={{ fontSize: 48, marginBottom: 16, color: value.color }}
                >
                  {value.icon}
                </div>
                <Title level={4} style={{ marginBottom: 8 }}>
                  {value.title}
                </Title>
                <Text type="secondary">{value.description}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Project Goals & Impact */}
      <div style={{ marginBottom: 48 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          Project Goals & Impact
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="Primary Goals" style={{ borderRadius: 12 }}>
              <List
                dataSource={[
                  "Create a comprehensive healthcare provider directory",
                  "Improve healthcare accessibility in rural areas",
                  "Reduce healthcare information asymmetry",
                  "Support digital transformation in healthcare",
                  "Enable data-driven healthcare decisions",
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      <Text>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Expected Impact" style={{ borderRadius: 12 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Healthcare Access"
                    value={85}
                    suffix="%"
                    prefix={<MedicineBoxOutlined />}
                  />
                  <Text type="secondary">Improvement in rural areas</Text>
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Time Saved"
                    value={60}
                    suffix="%"
                    prefix={<ClockCircleOutlined />}
                  />
                  <Text type="secondary">Reduction in search time</Text>
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Provider Reach"
                    value={5000}
                    prefix={<TeamIcon />}
                  />
                  <Text type="secondary">Healthcare providers</Text>
                </Col>
                <Col span={12}>
                  <Statistic
                    title="User Satisfaction"
                    value={92}
                    suffix="%"
                    prefix={<StarFilled />}
                  />
                  <Text type="secondary">Based on user feedback</Text>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Development Team */}
      <div style={{ marginBottom: 48 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          Meet Our Development Team
        </Title>
        <Row gutter={[24, 24]}>
          {developers.map((developer) => (
            <Col xs={24} sm={12} lg={6} key={developer.id}>
              <Card
                hoverable
                style={{ borderRadius: 12, height: "100%" }}
                cover={
                  <div style={{ padding: 24, textAlign: "center" }}>
                    <Badge.Ribbon text={developer.role} color="blue">
                      <Avatar
                        size={120}
                        src={developer.avatar}
                        style={{ border: "4px solid #f0f0f0" }}
                      />
                    </Badge.Ribbon>
                  </div>
                }
              >
                <div style={{ textAlign: "center" }}>
                  <Title level={4} style={{ marginBottom: 8 }}>
                    {developer.name}
                  </Title>
                  <Text
                    type="secondary"
                    style={{ display: "block", marginBottom: 12 }}
                  >
                    {developer.role}
                  </Text>
                  <Paragraph style={{ fontSize: 14, marginBottom: 16 }}>
                    {developer.bio}
                  </Paragraph>

                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Skills:</Text>
                    <div style={{ marginTop: 8 }}>
                      {developer.skills.map((skill, index) => (
                        <Tag
                          key={index}
                          color="blue"
                          style={{ marginBottom: 4 }}
                        >
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Experience:</Text> {developer.experience}
                    <br />
                    <Text strong>Education:</Text> {developer.education}
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Key Contributions:</Text>
                    <ul
                      style={{ textAlign: "left", fontSize: 12, marginTop: 4 }}
                    >
                      {developer.contributions.map((contribution, index) => (
                        <li key={index}>{contribution}</li>
                      ))}
                    </ul>
                  </div>

                  <Space size={8}>
                    <Button
                      type="text"
                      icon={<GithubOutlined />}
                      href={developer.github}
                      target="_blank"
                      size="small"
                    />
                    <Button
                      type="text"
                      icon={<LinkedinOutlined />}
                      href={developer.linkedin}
                      target="_blank"
                      size="small"
                    />
                    <Button
                      type="text"
                      icon={<MailOutlined />}
                      href={`mailto:${developer.email}`}
                      size="small"
                    />
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Project Timeline */}
      <div style={{ marginBottom: 48 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          Project Timeline
        </Title>
        <Timeline
          mode="alternate"
          items={milestones.map((milestone) => ({
            children: (
              <Card
                hoverable
                style={{ borderRadius: 12, maxWidth: 400 }}
                title={
                  <Space>
                    {milestone.icon}
                    <Text strong>{milestone.year}</Text>
                  </Space>
                }
              >
                <Title level={4} style={{ marginBottom: 8 }}>
                  {milestone.title}
                </Title>
                <Paragraph style={{ marginBottom: 16 }}>
                  {milestone.description}
                </Paragraph>
                <ul style={{ fontSize: 14 }}>
                  {milestone.achievements.map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              </Card>
            ),
          }))}
        />
      </div>

      {/* Technology Stack */}
      <div style={{ marginBottom: 48 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          Technology Stack
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={6}>
            <Card
              title={
                <Space>
                  <CodeOutlined style={{ color: "#1890ff" }} />
                  Frontend
                </Space>
              }
              style={{ borderRadius: 12 }}
            >
              <List
                size="small"
                dataSource={techStack.frontend}
                renderItem={(item) => (
                  <List.Item>
                    <Tag color="blue">{item}</Tag>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card
              title={
                <Space>
                  <DatabaseOutlined style={{ color: "#52c41a" }} />
                  Backend
                </Space>
              }
              style={{ borderRadius: 12 }}
            >
              <List
                size="small"
                dataSource={techStack.backend}
                renderItem={(item) => (
                  <List.Item>
                    <Tag color="green">{item}</Tag>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card
              title={
                <Space>
                  <CloudOutlined style={{ color: "#faad14" }} />
                  DevOps
                </Space>
              }
              style={{ borderRadius: 12 }}
            >
              <List
                size="small"
                dataSource={techStack.devops}
                renderItem={(item) => (
                  <List.Item>
                    <Tag color="orange">{item}</Tag>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card
              title={
                <Space>
                  <ExperimentOutlined style={{ color: "#722ed1" }} />
                  Tools
                </Space>
              }
              style={{ borderRadius: 12 }}
            >
              <List
                size="small"
                dataSource={techStack.tools}
                renderItem={(item) => (
                  <List.Item>
                    <Tag color="purple">{item}</Tag>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Key Features */}
      <div style={{ marginBottom: 48 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          Key Features & Capabilities
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              style={{ borderRadius: 12, textAlign: "center" }}
              bodyStyle={{ padding: 24 }}
            >
              <MedicineBoxOutlined
                style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }}
              />
              <Title level={4}>Doctor Directory</Title>
              <Text type="secondary">
                Comprehensive database of qualified healthcare professionals
                with detailed profiles
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              style={{ borderRadius: 12, textAlign: "center" }}
              bodyStyle={{ padding: 24 }}
            >
              <BankOutlined
                style={{ fontSize: 48, color: "#52c41a", marginBottom: 16 }}
              />
              <Title level={4}>Hospital Listings</Title>
              <Text type="secondary">
                Complete information about hospitals, clinics, and medical
                facilities
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              style={{ borderRadius: 12, textAlign: "center" }}
              bodyStyle={{ padding: 24 }}
            >
              <ReadOutlined
                style={{ fontSize: 48, color: "#faad14", marginBottom: 16 }}
              />
              <Title level={4}>Medical Education</Title>
              <Text type="secondary">
                Information about medical institutions and educational programs
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              style={{ borderRadius: 12, textAlign: "center" }}
              bodyStyle={{ padding: 24 }}
            >
              <SecurityScanOutlined
                style={{ fontSize: 48, color: "#722ed1", marginBottom: 16 }}
              />
              <Title level={4}>Secure Platform</Title>
              <Text type="secondary">
                HIPAA-compliant security measures to protect sensitive health
                information
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              style={{ borderRadius: 12, textAlign: "center" }}
              bodyStyle={{ padding: 24 }}
            >
              <MobileOutlined
                style={{ fontSize: 48, color: "#ff4d4f", marginBottom: 16 }}
              />
              <Title level={4}>Mobile Responsive</Title>
              <Text type="secondary">
                Optimized for all devices with seamless mobile experience
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              style={{ borderRadius: 12, textAlign: "center" }}
              bodyStyle={{ padding: 24 }}
            >
              <GlobalOutlined
                style={{ fontSize: 48, color: "#13c2c2", marginBottom: 16 }}
              />
              <Title level={4}>Multi-language</Title>
              <Text type="secondary">
                Support for Bengali and English languages for better
                accessibility
              </Text>
            </Card>
          </Col>
        </Row>
      </div>

      {/* FAQ Section */}
      <div style={{ marginBottom: 48 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          Frequently Asked Questions
        </Title>
        <Collapse
          ghost
          size="large"
          style={{ background: "#f5f5f5", borderRadius: 12, padding: 24 }}
        >
          <Panel header="What is Open Care?" key="1">
            <Paragraph>
              Open Care is a comprehensive healthcare information platform
              designed to connect patients with healthcare providers in
              Bangladesh. We provide detailed information about doctors,
              hospitals, and medical institutions to help users make informed
              healthcare decisions.
            </Paragraph>
          </Panel>
          <Panel
            header="How do you ensure the quality of healthcare providers?"
            key="2"
          >
            <Paragraph>
              We verify all healthcare providers through official medical board
              registrations and maintain strict quality standards. Our platform
              includes verification badges and detailed credential information
              for transparency.
            </Paragraph>
          </Panel>
          <Panel header="Is the platform free to use?" key="3">
            <Paragraph>
              Yes, Open Care is completely free for patients to use. We believe
              that access to healthcare information should be available to
              everyone without any cost barriers.
            </Paragraph>
          </Panel>
          <Panel
            header="How can healthcare providers join the platform?"
            key="4"
          >
            <Paragraph>
              Healthcare providers can register through our provider portal. We
              conduct verification processes to ensure all listed providers meet
              our quality standards and maintain valid medical licenses.
            </Paragraph>
          </Panel>
          <Panel
            header="What makes Open Care different from other platforms?"
            key="5"
          >
            <Paragraph>
              Open Care is specifically designed for the Bangladeshi healthcare
              market with local language support, comprehensive provider
              information, and a focus on accessibility for both urban and rural
              populations.
            </Paragraph>
          </Panel>
        </Collapse>
      </div>

      {/* Call to Action */}
      <div
        style={{
          background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
          padding: 48,
          borderRadius: 12,
          textAlign: "center",
          color: "#fff",
        }}
      >
        <Title level={2} style={{ color: "#fff", marginBottom: 16 }}>
          Join Us in Transforming Healthcare
        </Title>
        <Paragraph
          style={{
            fontSize: 18,
            color: "#fff",
            maxWidth: 800,
            margin: "0 auto 24px",
          }}
        >
          Whether you're a healthcare provider looking to reach more patients or
          a developer interested in contributing to our mission, we'd love to
          hear from you.
        </Paragraph>
        <Space size={16}>
          <Link to="/contact">
            <Button
              type="primary"
              size="large"
              style={{ background: "#fff", color: "#1890ff" }}
            >
              Get in Touch
            </Button>
          </Link>
          <Link to="/">
            <Button
              type="default"
              size="large"
              style={{ borderColor: "#fff", color: "#fff" }}
            >
              Explore Platform
            </Button>
          </Link>
        </Space>
      </div>
    </div>
  );
};

export default OurStory;
