"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
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
	Alert,
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
import Link from "next/link";
import { Developer } from "../../src/types";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

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

export default function OurStoryPage() {
	const [, setActiveTab] = useState("mission");
	const [developers, setDevelopers] = useState<Developer[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// List of repositories to fetch contributors from
		const repositories = [
			"Cipher-Text/open-care-frontend",
			// "Cipher-Text/open-care-backend",
			"Cipher-Text/opencare",
		];
		const fetchContributors = async () => {
			try {
				setLoading(true);

				// Map of all contributors to combine contributions across repos
				const contributorsMap = new Map<string, Developer>();

				// Role mapping based on repository or can be hardcoded if needed
				const roleMap: Record<string, string> = {};

				// Default role if not in mapping
				const defaultRole = "Contributor";

				// Fetch contributors from each repository
				for (const repo of repositories) {
					const response = await axios.get(
						`https://api.github.com/repos/${repo}/contributors`
					);

					// Process each contributor
					for (const contributor of response.data) {
						// Skip bots or automated accounts
						if (contributor.type === "Bot") continue;

						// If contributor already exists in map, add contributions
						if (contributorsMap.has(contributor.login)) {
							const dev = contributorsMap.get(contributor.login)!;
							dev.contributions += contributor.contributions;
							contributorsMap.set(contributor.login, dev);
						} else {
							// Fetch detailed user info
							const userDetails = await axios.get(
								`https://api.github.com/users/${contributor.login}`
							);

							contributorsMap.set(contributor.login, {
								id: contributor.id,
								login: contributor.login,
								name: userDetails.data.name || contributor.login,
								role: roleMap[contributor.login] || defaultRole,
								avatar: contributor.avatar_url,
								bio: userDetails.data.bio || "Project contributor",
								contributions: contributor.contributions,
								githubUrl: contributor.html_url,
								email: userDetails.data.email,
								linkedin: userDetails.data.blog, // Often LinkedIn URL is in the blog field
								location: userDetails.data.location,
							});
						}
					}
				}

				// Convert map to array and sort by contributions
				const developersList = Array.from(contributorsMap.values()).sort(
					(a, b) => b.contributions - a.contributions
				);

				setDevelopers(developersList);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching contributors:", err);
				setError("Failed to load contributors. Please try again later.");
				setLoading(false);
			}
		};

		fetchContributors();
	}, []);

	const renderDevelopersSection = () => {
		if (loading) {
			return (
				<div style={{ textAlign: "center", padding: "40px 0" }}>
					<div className="ant-spin ant-spin-lg ant-spin-spinning">
						<span className="ant-spin-dot">
							<i className="ant-spin-dot-item"></i>
							<i className="ant-spin-dot-item"></i>
							<i className="ant-spin-dot-item"></i>
							<i className="ant-spin-dot-item"></i>
						</span>
					</div>
					<p style={{ marginTop: 16 }}>Loading contributors...</p>
				</div>
			);
		}

		if (error) {
			return (
				<div style={{ textAlign: "center", padding: "40px 0" }}>
					<Alert message="Error" description={error} type="error" showIcon />
				</div>
			);
		}

		return (
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

								{developer.location && (
									<div style={{ marginBottom: 16 }}>
										<Text strong>Location:</Text> {developer.location}
									</div>
								)}

								<div style={{ marginBottom: 16 }}>
									<Text strong>Contributions:</Text> {developer.contributions}
								</div>

								<Space size={8}>
									<Button
										type="text"
										icon={<GithubOutlined />}
										href={developer.githubUrl}
										target="_blank"
										size="small"
									/>
									{developer.email && (
										<Button
											type="text"
											icon={<MailOutlined />}
											href={`mailto:${developer.email}`}
											size="small"
										/>
									)}
									{developer.linkedin && (
										<Button
											type="text"
											icon={<LinkedinOutlined />}
											href={developer.linkedin}
											target="_blank"
											size="small"
										/>
									)}
								</Space>
							</div>
						</Card>
					</Col>
				))}
			</Row>
		);
	};

	return (
		<div className="our-story-container" style={{ padding: "24px" }}>
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
				{renderDevelopersSection()}
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
					<Link href="/contact">
						<Button
							type="primary"
							size="large"
							style={{ background: "#fff", color: "#1890ff" }}
						>
							Get in Touch
						</Button>
					</Link>
					<Link href="/">
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
}
