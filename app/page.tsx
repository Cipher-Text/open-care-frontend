"use client";

import React, { useState, useEffect } from "react";
import "@ant-design/v5-patch-for-react-19";
// Next.js imports
import Link from "next/link";
import {
	Row,
	Col,
	Card,
	Typography,
	Input,
	Button,
	Tag,
	Space,
	Spin,
	Avatar,
	Badge,
	Carousel,
} from "antd";
import {
	SearchOutlined,
	MedicineBoxOutlined,
	BankOutlined,
	ReadOutlined,
	TeamOutlined,
	RightOutlined,
	EnvironmentOutlined,
	ClockCircleOutlined,
	StarFilled,
	CalendarOutlined,
	GlobalOutlined,
} from "@ant-design/icons";
import CountUp from "react-countup";
import type { FeaturedData, BlogPost } from "../src/types";

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;
const { Search } = Input;

// Mock data
const staticFeaturedData: FeaturedData = {
	doctors: [
		{
			id: 1,
			bmdcNo: "A-12345",
			yearOfExperience: 15,
			startDate: "2008-06-01",
			degrees: "MD, FCPS",
			specializations: "Cardiology",
			description: "Experienced cardiologist specializing in heart conditions",
			isActive: true,
			isDeleted: false,
			profile: {
				id: 1,
				name: "Dr. John Smith",
				bnName: "ডা. জন স্মিথ",
				gender: "Male",
				dateOfBirth: "1975-03-15",
				address: "123 Medical Plaza, Cityville",
				phone: "+1234567890",
				email: "dr.smith@example.com",
				photo: "https://via.placeholder.com/300x200?text=Dr.+John+Smith",
				username: "drjsmith",
				userType: "DOCTOR",
				keycloakUserId: "uid123",
				district: null,
				upazila: null,
				union: null,
			},
			doctorDegrees: null,
			doctorWorkplaces: null,
		},
		{
			id: 2,
			bmdcNo: "B-23456",
			yearOfExperience: 12,
			startDate: "2011-09-01",
			degrees: "MD, FCPS",
			specializations: "Pediatrics",
			description: "Caring pediatrician with focus on child development",
			isActive: true,
			isDeleted: false,
			profile: {
				id: 2,
				name: "Dr. Sarah Johnson",
				bnName: "ডা. সারা জনসন",
				gender: "Female",
				dateOfBirth: "1982-07-22",
				address: "456 Healthcare Ave, Riverside",
				phone: "+1987654321",
				email: "dr.johnson@example.com",
				photo: "https://via.placeholder.com/300x200?text=Dr.+Sarah+Johnson",
				username: "drsjohnson",
				userType: "DOCTOR",
				keycloakUserId: "uid456",
				district: null,
				upazila: null,
				union: null,
			},
			doctorDegrees: null,
			doctorWorkplaces: null,
		},
		{
			id: 3,
			bmdcNo: "C-34567",
			yearOfExperience: 20,
			startDate: "2003-05-15",
			degrees: "MD, DM, FACC",
			specializations: "Neurology",
			description: "Specialist in neurological disorders and stroke management",
			isActive: true,
			isDeleted: false,
			profile: {
				id: 3,
				name: "Dr. Michael Chang",
				bnName: "ডা. মাইকেল চ্যাং",
				gender: "Male",
				dateOfBirth: "1970-11-08",
				address: "789 Medical Center Rd, Townsville",
				phone: "+1567891234",
				email: "dr.chang@example.com",
				photo: "https://via.placeholder.com/300x200?text=Dr.+Michael+Chang",
				username: "drmchang",
				userType: "DOCTOR",
				keycloakUserId: "uid789",
				district: null,
				upazila: null,
				union: null,
			},
			doctorDegrees: null,
			doctorWorkplaces: null,
		},
		{
			id: 4,
			bmdcNo: "D-45678",
			yearOfExperience: 8,
			startDate: "2015-03-10",
			degrees: "MD, FAAD",
			specializations: "Dermatology",
			description: "Specializing in skin conditions and cosmetic dermatology",
			isActive: true,
			isDeleted: false,
			profile: {
				id: 4,
				name: "Dr. Emily Rodriguez",
				bnName: "ডা. এমিলি রদ্রিগেজ",
				gender: "Female",
				dateOfBirth: "1988-09-25",
				address: "321 Skin Health Blvd, Meadowville",
				phone: "+1321654987",
				email: "dr.rodriguez@example.com",
				photo: "https://via.placeholder.com/300x200?text=Dr.+Emily+Rodriguez",
				username: "drerodriguez",
				userType: "DOCTOR",
				keycloakUserId: "uid321",
				district: null,
				upazila: null,
				union: null,
			},
			doctorDegrees: null,
			doctorWorkplaces: null,
		},
	],
	hospitals: [
		{
			id: 1,
			name: "City General Hospital",
			bnName: "সিটি জেনারেল হাসপাতাল",
			numberOfBed: 500,
			imageUrl:
				"https://via.placeholder.com/300x200?text=City+General+Hospital",
			address: "123 Main St, Cityville",
			district: null,
			upazila: null,
			union: null,
			hospitalType: {
				name: "Multi-Specialty",
				bnName: "মাল্টি-স্পেশালিটি",
				banglaName: "",
				englishName: "",
			},
			organizationType: {
				name: "Public",
				bnName: "পাবলিক",
				description: "",
				banglaName: "",
			},
			lat: null,
			lon: null,
			websiteUrl: "",
			email: "info@citygeneralhospital.com",
			phone: "+1-123-456-7890",
		},
		{
			id: 2,
			name: "Riverside Medical Center",
			bnName: "রিভারসাইড মেডিকেল সেন্টার",
			numberOfBed: 350,
			imageUrl:
				"https://via.placeholder.com/300x200?text=Riverside+Medical+Center",
			address: "456 River Rd, Riverside",
			district: null,
			upazila: null,
			union: null,
			hospitalType: {
				name: "Cardiac Care",
				bnName: "হার্ট কেয়ার",
				banglaName: "",
				englishName: "",
			},
			organizationType: {
				name: "Private",
				bnName: "প্রাইভেট",
				description: "",
				banglaName: "",
			},
			lat: null,
			lon: null,
			websiteUrl: "",
			email: "contact@riversidemedical.com",
			phone: "+1-234-567-8901",
		},
		{
			id: 3,
			name: "Sunshine Children's Hospital",
			bnName: "সানশাইন চিলড্রেন হাসপাতাল",
			numberOfBed: 250,
			imageUrl:
				"https://via.placeholder.com/300x200?text=Sunshine+Children's+Hospital",
			address: "789 Sun Ave, Sunnydale",
			district: null,
			upazila: null,
			union: null,
			hospitalType: {
				name: "Pediatric",
				bnName: "শিশু রোগ",
				banglaName: "",
				englishName: "",
			},
			organizationType: {
				name: "Non-profit",
				bnName: "নন-প্রফিট",
				description: "",
				banglaName: "",
			},
			lat: null,
			lon: null,
			websiteUrl: "",
			email: "info@sunshinechildrens.org",
			phone: "+1-345-678-9012",
		},
	],
	institutions: [
		{
			id: 1,
			acronym: "NMC",
			establishedYear: "1965",
			enroll: 500,
			name: "National Medical College",
			bnName: "ন্যাশনাল মেডিকেল কলেজ",
			numberOfBed: 350,
			district: {
				id: 1,
				division: {
					id: 1,
					name: "Dhaka",
					bnName: "ঢাকা",
					url: null,
				},
				name: "Dhaka",
				bnName: "ঢাকা",
				lat: "23.7104",
				lon: "90.4074",
				url: "dhaka",
			},
			upazila: null,
			union: null,
			hospitalType: {
				name: "Teaching Hospital",
				bnName: "শিক্ষণ হাসপাতাল",
				banglaName: "শিক্ষণ হাসপাতাল",
				englishName: "Teaching Hospital",
			},
			organizationType: {
				name: "Public",
				bnName: "পাবলিক",
				description: "Government funded institution",
				banglaName: "পাবলিক",
			},
			lat: "23.7225",
			lon: "90.4078",
			websiteUrl: "https://nmc.edu.bd",
		},
		{
			id: 2,
			acronym: "RIM",
			establishedYear: "1978",
			enroll: 450,
			name: "Riverside Institute of Medicine",
			bnName: "রিভারসাইড ইনস্টিটিউট অফ মেডিসিন",
			numberOfBed: 275,
			district: {
				id: 2,
				division: {
					id: 2,
					name: "Chittagong",
					bnName: "চট্টগ্রাম",
					url: null,
				},
				name: "Chittagong",
				bnName: "চট্টগ্রাম",
				lat: "22.3569",
				lon: "91.7832",
				url: "chittagong",
			},
			upazila: null,
			union: null,
			hospitalType: {
				name: "Medical College",
				bnName: "মেডিকেল কলেজ",
				banglaName: "মেডিকেল কলেজ",
				englishName: "Medical College",
			},
			organizationType: {
				name: "Private",
				bnName: "প্রাইভেট",
				description: "Privately funded institution",
				banglaName: "প্রাইভেট",
			},
			lat: "22.3593",
			lon: "91.8318",
			websiteUrl: "https://rim.edu.bd",
		},
		{
			id: 3,
			acronym: "SIHS",
			establishedYear: "1995",
			enroll: 325,
			name: "Sylhet Institute of Health Sciences",
			bnName: "সিলেট ইনস্টিটিউট অফ হেলথ সায়েন্সেস",
			numberOfBed: 200,
			district: {
				id: 3,
				division: {
					id: 3,
					name: "Sylhet",
					bnName: "সিলেট",
					url: null,
				},
				name: "Sylhet",
				bnName: "সিলেট",
				lat: "24.8949",
				lon: "91.8687",
				url: "sylhet",
			},
			upazila: null,
			union: null,
			hospitalType: {
				name: "Medical University",
				bnName: "মেডিকেল বিশ্ববিদ্যালয়",
				banglaName: "মেডিকেল বিশ্ববিদ্যালয়",
				englishName: "Medical University",
			},
			organizationType: {
				name: "Public",
				bnName: "পাবলিক",
				description: "Government funded institution",
				banglaName: "পাবলিক",
			},
			lat: "24.9042",
			lon: "91.8644",
			websiteUrl: "https://sihs.edu.bd",
		},
	],
	stats: {
		totalDoctors: 5367,
		totalHospitals: 432,
		totalInstitutions: 128,
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

export default function Page() {
	const [featuredData, setFeaturedData] = useState<FeaturedData | null>(null);
	const [, setBlogPosts] = useState<BlogPost[]>([]); // Changed to avoid unused variable
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
								<Link href="/doctors">
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
								<Link href="/hospitals">
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
											end={featuredData.stats.totalInstitutions}
											separator=","
											duration={2.5}
										/>
									</Title>
									<Text style={{ color: "#fff", fontSize: 16 }}>
										Medical institutions
									</Text>
								</div>
								<Link href="/institutions">
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
								<Col xs={12} sm={8} md={6} lg={4} key={index}>
									<Link href={`/doctors?specialty=${specialty.name}`}>
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
							<Col xs={24} sm={12} md={10} lg={8} key={doctor.id}>
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
													alt={doctor.profile.name}
													src={
														doctor.profile.photo ||
														"https://via.placeholder.com/300x200"
													}
													style={{
														width: "100%",
														height: "100%",
														objectFit: "cover",
													}}
												/>
											</div>
										}
										actions={[
											<Link href={`/doctors/${doctor.id}`} key="view">
												View Profile
											</Link>,
											<Button type="text" key="book">
												Book Appointment
											</Button>,
										]}
									>
										<Meta
											avatar={
												<Avatar
													src={
														doctor.profile.photo ||
														"https://via.placeholder.com/64"
													}
													size="large"
												/>
											}
											title={doctor.profile.name}
											description={
												<Space direction="vertical" size={0}>
													<Text type="secondary">{doctor.specializations}</Text>
													<Space>
														<StarFilled style={{ color: "#faad14" }} />
														<Text>4.8</Text>
														<Text type="secondary">(124 reviews)</Text>
													</Space>
													<Text>
														<ClockCircleOutlined /> {doctor.yearOfExperience}{" "}
														years experience
													</Text>
												</Space>
											}
										/>
									</Card>
								</Badge.Ribbon>
							</Col>
						))}
					</Row>

					{/* Hospitals Section */}
					<Title level={2} style={{ marginBottom: 24 }}>
						Top Hospitals
					</Title>
					<Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
						{featuredData.hospitals.map((hospital) => (
							<Col xs={24} sm={12} md={8} key={hospital.id}>
								<Card
									hoverable
									className="hospital-card"
									cover={
										<div
											style={{
												height: 200,
												overflow: "hidden",
												position: "relative",
											}}
										>
											<img
												alt={hospital.name}
												src={
													hospital.imageUrl ||
													`https://via.placeholder.com/300x200?text=${encodeURIComponent(
														hospital.name
													)}`
												}
												style={{
													width: "100%",
													height: "100%",
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
									<div style={{ minHeight: "180px" }}>
										<Meta
											title={
												<div>
													{hospital.bnName && (
														<Text
															type="secondary"
															style={{ display: "block", fontSize: 14 }}
														>
															{hospital.bnName}
														</Text>
													)}
												</div>
											}
											description={
												<Space
													direction="vertical"
													size={2}
													style={{ width: "100%", marginTop: 8 }}
												>
													{hospital.hospitalType && (
														<Tag color="blue">{hospital.hospitalType.name}</Tag>
													)}

													{hospital.organizationType && (
														<Tag color="green">
															{hospital.organizationType.name}
														</Tag>
													)}

													{hospital.address && (
														<div>
															<EnvironmentOutlined style={{ marginRight: 4 }} />
															<Text type="secondary">{hospital.address}</Text>
														</div>
													)}

													{hospital.numberOfBed > 0 && (
														<div>
															<MedicineBoxOutlined style={{ marginRight: 4 }} />
															<Text type="secondary">
																{hospital.numberOfBed} beds
															</Text>
														</div>
													)}

													{hospital.district && (
														<div>
															<EnvironmentOutlined style={{ marginRight: 4 }} />
															<Text type="secondary">
																{hospital.district.name}
															</Text>
														</div>
													)}
												</Space>
											}
										/>

										<div
											style={{
												marginTop: 16,
												display: "flex",
												justifyContent: "space-between",
											}}
										>
											<Link href={`/hospitals/${hospital.id}`}>
												<Button
													type="primary"
													size="small"
													icon={<RightOutlined />}
												>
													Details
												</Button>
											</Link>

											{hospital.websiteUrl && (
												<Button
													type="link"
													size="small"
													icon={<GlobalOutlined />}
													href={hospital.websiteUrl}
													target="_blank"
												>
													Website
												</Button>
											)}
										</div>
									</div>
								</Card>
							</Col>
						))}
						<Col xs={24} style={{ textAlign: "center", marginTop: 16 }}>
							<Link href="/hospitals">
								<Button
									type="primary"
									size="large"
									icon={<MedicineBoxOutlined />}
								>
									Explore All Hospitals
								</Button>
							</Link>
						</Col>
					</Row>

					{/* Medical Institutions Section */}
					<Title level={2} style={{ marginBottom: 24 }}>
						Top Medical Institutions
					</Title>
					<Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
						{featuredData.institutions.map((institution) => (
							<Col xs={24} sm={12} md={8} key={institution.id}>
								<Card
									hoverable
									className="institution-card"
									cover={
										<div
											style={{
												height: 200,
												overflow: "hidden",
												position: "relative",
											}}
										>
											<img
												alt={institution.name}
												src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(
													institution.acronym || institution.name
												)}`}
												style={{
													width: "100%",
													height: "100%",
													objectFit: "cover",
												}}
											/>
											{institution.acronym && (
												<div
													style={{
														position: "absolute",
														top: 12,
														right: 12,
														background: "#1890ff",
														color: "white",
														padding: "3px 8px",
														borderRadius: "4px",
														fontWeight: "bold",
													}}
												>
													{institution.acronym}
												</div>
											)}
										</div>
									}
								>
									<div style={{ minHeight: "180px" }}>
										<Meta
											title={
												<div>
													<Text strong style={{ fontSize: 16 }}>
														{institution.name}
													</Text>
													{institution.bnName && (
														<Text
															type="secondary"
															style={{ display: "block", fontSize: 14 }}
														>
															{institution.bnName}
														</Text>
													)}
												</div>
											}
											description={
												<Space
													direction="vertical"
													size={2}
													style={{ width: "100%", marginTop: 8 }}
												>
													{institution.hospitalType && (
														<Tag color="blue">
															{institution.hospitalType.name}
														</Tag>
													)}

													{institution.district && (
														<div>
															<EnvironmentOutlined style={{ marginRight: 4 }} />
															<Text type="secondary">
																{institution.district.name}
															</Text>
														</div>
													)}

													{institution.establishedYear && (
														<div>
															<CalendarOutlined style={{ marginRight: 4 }} />
															<Text type="secondary">
																Est. {institution.establishedYear}
															</Text>
														</div>
													)}

													{institution.numberOfBed > 0 && (
														<div>
															<MedicineBoxOutlined style={{ marginRight: 4 }} />
															<Text type="secondary">
																{institution.numberOfBed} beds
															</Text>
														</div>
													)}

													{institution.enroll && (
														<div>
															<TeamOutlined style={{ marginRight: 4 }} />
															<Text type="secondary">
																{institution.enroll} students/year
															</Text>
														</div>
													)}
												</Space>
											}
										/>

										<div
											style={{
												marginTop: 16,
												display: "flex",
												justifyContent: "space-between",
											}}
										>
											<Link href={`/institutions/${institution.id}`}>
												<Button
													type="primary"
													size="small"
													icon={<RightOutlined />}
												>
													Details
												</Button>
											</Link>

											{institution.websiteUrl && (
												<Button
													type="link"
													size="small"
													icon={<GlobalOutlined />}
													href={institution.websiteUrl}
													target="_blank"
												>
													Website
												</Button>
											)}
										</div>
									</div>
								</Card>
							</Col>
						))}
						<Col xs={24} style={{ textAlign: "center", marginTop: 16 }}>
							<Link href="/institutions">
								<Button type="primary" size="large" icon={<ReadOutlined />}>
									Explore All Medical Institutions
								</Button>
							</Link>
						</Col>
					</Row>

					{/* Blog Section */}
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
												<Meta
													title={`Medical Article Title ${item}`}
													description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
												/>
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
												<Meta
													title={`Medical Article Title ${item}`}
													description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
												/>
											</Card>
										</Col>
									))}
								</Row>
							</div>
						</Carousel>
						<div style={{ textAlign: "center", marginTop: 24 }}>
							<Link href="/blog">
								<Button type="primary" icon={<ReadOutlined />}>
									View All Articles
								</Button>
							</Link>
						</div>
					</div>

					{/* Testimonials Section */}
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
												description="The platform made finding a specialist incredibly easy. Booked an appointment with a cardiologist within minutes."
											/>
										</Card>
									</Col>
									<Col xs={24} md={8}>
										<Card bordered={false}>
											<Meta
												avatar={<Avatar size={64} src="/images/user2.jpg" />}
												title="Michael Brown"
												description="I was able to compare different hospitals and their facilities before choosing one for my surgery. Great resource!"
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
												description="The detailed profiles of doctors helped me find the right pediatrician for my children. Very helpful service!"
											/>
										</Card>
									</Col>
									<Col xs={24} md={8}>
										<Card bordered={false}>
											<Meta
												avatar={<Avatar size={64} src="/images/user4.jpg" />}
												title="Robert Wilson"
												description="As someone new to the city, this platform was invaluable in helping me find quality healthcare providers nearby."
											/>
										</Card>
									</Col>
								</Row>
							</div>
						</Carousel>
					</div>

					{/* Health Tips Section */}
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

					{/* Call to Action Section */}
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

					{/* App Download Section */}
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

					{/* Footer Subscription Section */}
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
						<div style={{ marginTop: 24 }}>
							<Text type="secondary">
								Learn more about our mission and team:{" "}
							</Text>
							<Link href="/our-story">
								<Button type="link" style={{ paddingLeft: 8 }}>
									Our Story
								</Button>
							</Link>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
