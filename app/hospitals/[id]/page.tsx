"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
	Typography,
	Card,
	Row,
	Col,
	Tag,
	Button,
	Spin,
	Descriptions,
	List,
	Avatar,
	Space,
	Empty,
	Pagination,
	Tabs,
	message,
	Breadcrumb,
	Table,
} from "antd";
import {
	EnvironmentOutlined,
	LinkOutlined,
	PhoneOutlined,
	MailOutlined,
	HomeOutlined,
	UserOutlined,
} from "@ant-design/icons";
import {
	fetchHospitalById,
	fetchDoctorsByHospital,
	fetchHospitalMedicalTests,
} from "../../../src/services/api";
import { Hospital, Doctor, HospitalMedicalTest } from "../../../src/types";
import config from "../../../src/config";

const { Title, Text } = Typography;

export default function HospitalDetailsPage({
	params,
}: {
	params: { id: string };
}) {
	const [hospital, setHospital] = useState<Hospital | null>(null);
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [medicalTests, setMedicalTests] = useState<HospitalMedicalTest[]>([]);
	const [loading, setLoading] = useState(true);
	const [doctorsLoading, setDoctorsLoading] = useState(true);
	const [testsLoading, setTestsLoading] = useState(true);
	const [doctorsPagination, setDoctorsPagination] = useState({
		current: 0,
		pageSize: config.itemsPerPage || 10,
		total: 0,
	});
	const [testsPagination, setTestsPagination] = useState({
		current: 0,
		pageSize: config.itemsPerPage || 10,
		total: 0,
	});
	const [activeTab, setActiveTab] = useState("info");

	useEffect(() => {
		const fetchHospitalData = async () => {
			if (!params.id) return;

			setLoading(true);
			try {
				const data = await fetchHospitalById(Number(params.id));
				setHospital(data);
			} catch (error) {
				console.error("Failed to fetch hospital details:", error);
				message.error("Failed to load hospital information");
			} finally {
				setLoading(false);
			}
		};

		fetchHospitalData();
	}, [params.id]);

	useEffect(() => {
		if (!params.id || activeTab !== "doctors") return;

		const fetchDoctorsData = async () => {
			setDoctorsLoading(true);
			try {
				const response = await fetchDoctorsByHospital(
					Number(params.id),
					doctorsPagination.current,
					doctorsPagination.pageSize
				);
				setDoctors(response.doctors || []);
				setDoctorsPagination({
					...doctorsPagination,
					total: response.totalItems,
				});
			} catch (error) {
				console.error("Failed to fetch doctors:", error);
			} finally {
				setDoctorsLoading(false);
			}
		};

		fetchDoctorsData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id, activeTab, doctorsPagination.current]);

	useEffect(() => {
		if (!params.id || activeTab !== "tests") return;

		const fetchTestsData = async () => {
			setTestsLoading(true);
			try {
				const response = await fetchHospitalMedicalTests(
					Number(params.id),
					testsPagination.current,
					testsPagination.pageSize
				);
				setMedicalTests(response.tests || []);
				setTestsPagination({
					...testsPagination,
					total: response.totalItems,
				});
			} catch (error) {
				console.error("Failed to fetch medical tests:", error);
			} finally {
				setTestsLoading(false);
			}
		};

		fetchTestsData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id, activeTab, testsPagination.current]);

	const handleDoctorPageChange = (page: number) => {
		setDoctorsPagination({
			...doctorsPagination,
			current: page - 1, // API uses 0-based indexing
		});
	};

	const handleTestsPageChange = (page: number) => {
		setTestsPagination({
			...testsPagination,
			current: page - 1, // API uses 0-based indexing
		});
	};

	const handleTabChange = (key: string) => {
		setActiveTab(key);
	};

	if (loading) {
		return (
			<div style={{ textAlign: "center", padding: "100px" }}>
				<Spin size="large" />
				<div style={{ marginTop: 16 }}>Loading hospital information...</div>
			</div>
		);
	}

	if (!hospital) {
		return (
			<div style={{ textAlign: "center", padding: "100px" }}>
				<Empty description="Hospital not found" />
				<Link href="/hospitals">
					<Button type="primary" style={{ marginTop: 16 }}>
						Back to Hospitals List
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="hospital-details-container" style={{ padding: "20px" }}>
			<Breadcrumb style={{ marginBottom: 16 }}>
				<Breadcrumb.Item>
					<Link href="/">
						<HomeOutlined /> Home
					</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>
					<Link href="/hospitals">Hospitals</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>{hospital.name}</Breadcrumb.Item>
			</Breadcrumb>

			<Row gutter={24}>
				<Col xs={24} lg={16}>
					<Card className="hospital-info-card">
						<Title level={2}>{hospital.name}</Title>
						{hospital.bnName && (
							<Title level={4} type="secondary">
								{hospital.bnName}
							</Title>
						)}

						<div style={{ marginBottom: 16 }}>
							{hospital.hospitalType && (
								<Tag color="blue" style={{ marginRight: 8 }}>
									{hospital.hospitalType.name}
								</Tag>
							)}
							{hospital.organizationType && (
								<Tag color="green">{hospital.organizationType.name}</Tag>
							)}
						</div>

						<Descriptions column={{ xs: 1, md: 2 }} bordered>
							{hospital.address && (
								<Descriptions.Item label="Address">
									<Space>
										<EnvironmentOutlined />
										<span>{hospital.address}</span>
									</Space>
								</Descriptions.Item>
							)}

							{hospital.district && (
								<Descriptions.Item label="Location">
									{hospital.district.name}
									{hospital.district.division &&
										`, ${hospital.district.division.name}`}
								</Descriptions.Item>
							)}

							{hospital.phone && (
								<Descriptions.Item label="Phone">
									<Space>
										<PhoneOutlined />
										<span>{hospital.phone}</span>
									</Space>
								</Descriptions.Item>
							)}

							{hospital.email && (
								<Descriptions.Item label="Email">
									<Space>
										<MailOutlined />
										<span>{hospital.email}</span>
									</Space>
								</Descriptions.Item>
							)}

							{hospital.numberOfBed > 0 && (
								<Descriptions.Item label="Number of Beds">
									{hospital.numberOfBed}
								</Descriptions.Item>
							)}

							{hospital.websiteUrl && (
								<Descriptions.Item label="Website">
									<Button
										type="link"
										href={hospital.websiteUrl}
										target="_blank"
										icon={<LinkOutlined />}
										style={{ padding: 0 }}
									>
										Visit Website
									</Button>
								</Descriptions.Item>
							)}
						</Descriptions>
					</Card>
				</Col>
				<Col xs={24} lg={8}>
					<Card>
						<img
							alt={hospital.name}
							src={
								hospital.imageUrl ||
								`https://via.placeholder.com/800x400?text=${encodeURIComponent(
									hospital.name
								)}`
							}
							style={{ width: "100%", borderRadius: 8 }}
						/>

						{hospital.lat && hospital.lon && (
							<div style={{ marginTop: 16 }}>
								<Title level={5}>Location</Title>
								<div
									style={{
										height: 200,
										background: "#f0f0f0",
										borderRadius: 8,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									{/* Implement map here if needed */}
									<Text type="secondary">Map View</Text>
								</div>
								<Text type="secondary">
									Lat: {hospital.lat}, Lon: {hospital.lon}
								</Text>
							</div>
						)}
					</Card>
				</Col>
			</Row>

			<Card style={{ marginTop: 24 }}>
				<Tabs activeKey={activeTab} onChange={handleTabChange}>
					<Tabs.TabPane tab="Information" key="info">
						<Row gutter={[16, 16]}>
							<Col span={24}>
								<Card title="About Hospital" bordered={false}>
									<p>
										{hospital.description ||
											"No detailed information available for this hospital at the moment."}
									</p>
								</Card>
							</Col>

							<Col span={24}>
								<Card title="Services" bordered={false}>
									{hospital.services && hospital.services.length > 0 ? (
										<List
											dataSource={hospital.services}
											renderItem={(service) => (
												<List.Item>
													<List.Item.Meta
														title={service.name}
														description={service.description}
													/>
												</List.Item>
											)}
										/>
									) : (
										<Empty description="No services information available" />
									)}
								</Card>
							</Col>

							<Col span={24}>
								<Card title="Facilities" bordered={false}>
									{hospital.facilities && hospital.facilities.length > 0 ? (
										<Row gutter={[16, 16]}>
											{hospital.facilities.map((facility, index) => (
												<Col xs={24} sm={12} md={8} key={index}>
													<Card size="small">
														<Card.Meta
															title={facility.name}
															description={facility.description}
														/>
													</Card>
												</Col>
											))}
										</Row>
									) : (
										<Empty description="No facilities information available" />
									)}
								</Card>
							</Col>
						</Row>
					</Tabs.TabPane>

					<Tabs.TabPane tab="Doctors" key="doctors">
						{doctorsLoading ? (
							<div style={{ textAlign: "center", padding: "50px" }}>
								<Spin />
								<div style={{ marginTop: 16 }}>Loading doctors...</div>
							</div>
						) : (
							<>
								{doctors.length > 0 ? (
									<>
										<List
											dataSource={doctors}
											renderItem={(doctor) => (
												<List.Item
													key={doctor.id}
													actions={[
														<Link
															href={`/doctors/${doctor.id}`}
															key="view-profile"
														>
															<Button type="primary">View Profile</Button>
														</Link>,
													]}
												>
													<List.Item.Meta
														avatar={
															<Avatar
																size={64}
																src={doctor.profile?.photo}
																icon={<UserOutlined />}
															/>
														}
														title={
															<Link href={`/doctors/${doctor.id}`}>
																{doctor.profile?.name}
															</Link>
														}
														description={
															<Space direction="vertical">
																<div>{doctor.specializations}</div>
																<div>{doctor.degrees}</div>
																<div>
																	Experience: {doctor.yearOfExperience} years
																</div>
															</Space>
														}
													/>
												</List.Item>
											)}
										/>
										<div
											style={{
												marginTop: 24,
												display: "flex",
												justifyContent: "center",
											}}
										>
											<Pagination
												current={doctorsPagination.current + 1}
												pageSize={doctorsPagination.pageSize}
												total={doctorsPagination.total}
												onChange={handleDoctorPageChange}
												showSizeChanger={false}
											/>
										</div>
									</>
								) : (
									<Empty description="No doctors found for this hospital" />
								)}
							</>
						)}
					</Tabs.TabPane>

					<Tabs.TabPane tab="Medical Tests" key="tests">
						{testsLoading ? (
							<div style={{ textAlign: "center", padding: "50px" }}>
								<Spin />
								<div style={{ marginTop: 16 }}>Loading medical tests...</div>
							</div>
						) : (
							<>
								{medicalTests.length > 0 ? (
									<>
										<Table
											dataSource={medicalTests}
											rowKey="id"
											pagination={false}
											columns={[
												{
													title: "Test Name",
													dataIndex: ["medicalTest", "name"],
													key: "name",
													sorter: (a, b) => {
														const nameA = a.medicalTest?.name || "";
														const nameB = b.medicalTest?.name || "";
														return nameA.localeCompare(nameB);
													},
												},
												{
													title: "Category",
													dataIndex: ["medicalTest", "category", "name"],
													key: "category",
												},
												{
													title: "Price (BDT)",
													dataIndex: "price",
													key: "price",
													sorter: (a, b) => (a.price || 0) - (b.price || 0),
												},
												{
													title: "Discount",
													key: "discount",
													render: (_, record) => (
														<>
															{record.discountPercent
																? `${record.discountPercent}%`
																: "N/A"}
														</>
													),
												},
												{
													title: "Final Price",
													key: "finalPrice",
													render: (_, record) => {
														if (!record.price) return "N/A";
														if (!record.discountPercent) return record.price;
														const discount =
															(record.price * record.discountPercent) / 100;
														return (record.price - discount).toFixed(2);
													},
												},
											]}
										/>
										<div
											style={{
												marginTop: 24,
												display: "flex",
												justifyContent: "center",
											}}
										>
											<Pagination
												current={testsPagination.current + 1}
												pageSize={testsPagination.pageSize}
												total={testsPagination.total}
												onChange={handleTestsPageChange}
												showSizeChanger={false}
											/>
										</div>
									</>
								) : (
									<Empty description="No medical tests information available" />
								)}
							</>
						)}
					</Tabs.TabPane>
				</Tabs>
			</Card>
		</div>
	);
}
