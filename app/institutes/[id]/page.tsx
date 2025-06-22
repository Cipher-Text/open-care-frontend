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
	Empty,
	Breadcrumb,
	Space,
	message,
	Tabs,
	List,
	Avatar,
	Pagination,
} from "antd";
import {
	EnvironmentOutlined,
	LinkOutlined,
	HomeOutlined,
	UserOutlined,
} from "@ant-design/icons";
import {
	fetchInstituteById,
	fetchDoctorsByInstitute,
} from "../../../src/services/api";
import { Institution, Doctor } from "../../../src/types";
import { useParams } from "next/navigation";

const { Title, Text } = Typography;

export default function InstituteDetailsPage() {
	const params = useParams<{ id: string }>();

	const [institute, setInstitute] = useState<Institution | null>(null);
	const [loading, setLoading] = useState(true);
	const [teachers, setTeachers] = useState<Doctor[]>([]);
	const [graduates, setGraduates] = useState<Doctor[]>([]);
	const [teachersLoading, setTeachersLoading] = useState(true);
	const [graduatesLoading, setGraduatesLoading] = useState(true);
	const [teachersPagination, setTeachersPagination] = useState({
		current: 0, // API uses 0-based indexing
		pageSize: 5,
		total: 0,
	});
	const [graduatesPagination, setGraduatesPagination] = useState({
		current: 0, // API uses 0-based indexing
		pageSize: 5,
		total: 0,
	});
	const [activeTab, setActiveTab] = useState("info");

	useEffect(() => {
		const fetchInstituteData = async () => {
			if (!params.id) return;

			setLoading(true);
			try {
				const data = await fetchInstituteById(Number(params.id));
				setInstitute(data);
			} catch (error) {
				console.error("Failed to fetch institute details:", error);
				message.error("Failed to load institute information");
			} finally {
				setLoading(false);
			}
		};

		fetchInstituteData();
	}, [params.id]);

	useEffect(() => {
		if (!params.id || activeTab !== "teachers") return;

		const fetchTeachersData = async () => {
			setTeachersLoading(true);
			try {
				const response = await fetchDoctorsByInstitute(
					Number(params.id),
					teachersPagination.current,
					teachersPagination.pageSize,
					true
				);
				setTeachers(response.doctors || []);
				setTeachersPagination({
					...teachersPagination,
					total: response.totalItems,
				});
			} catch (error) {
				console.error("Failed to fetch teachers:", error);
			} finally {
				setTeachersLoading(false);
			}
		};

		fetchTeachersData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id, activeTab, teachersPagination.current]);

	useEffect(() => {
		if (!params.id || activeTab !== "graduates") return;

		const fetchGraduatesData = async () => {
			setGraduatesLoading(true);
			try {
				const response = await fetchDoctorsByInstitute(
					Number(params.id),
					graduatesPagination.current,
					graduatesPagination.pageSize,
					false
				);
				setGraduates(response.doctors || []);
				setGraduatesPagination({
					...graduatesPagination,
					total: response.totalItems,
				});
			} catch (error) {
				console.error("Failed to fetch graduates:", error);
			} finally {
				setGraduatesLoading(false);
			}
		};

		fetchGraduatesData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id, activeTab, graduatesPagination.current]);

	const handleTeacherPageChange = (page: number) => {
		setTeachersPagination({
			...teachersPagination,
			current: page - 1, // API uses 0-based indexing
		});
	};

	const handleGraduatesPageChange = (page: number) => {
		setGraduatesPagination({
			...graduatesPagination,
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
				<div style={{ marginTop: 16 }}>Loading institute information...</div>
			</div>
		);
	}

	if (!institute) {
		return (
			<div style={{ textAlign: "center", padding: "100px" }}>
				<Empty description="Institute not found" />
				<Link href="/institutes">
					<Button type="primary" style={{ marginTop: 16 }}>
						Back to Institutes List
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="institute-details-container" style={{ padding: "20px" }}>
			<Breadcrumb style={{ marginBottom: 16 }}>
				<Breadcrumb.Item>
					<Link href="/">
						<HomeOutlined /> Home
					</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>
					<Link href="/institutes">Institutes</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>{institute.name}</Breadcrumb.Item>
			</Breadcrumb>

			<Row gutter={24}>
				<Col xs={24} lg={16}>
					<Card className="institute-info-card">
						<Title level={2}>{institute.name}</Title>
						{institute.bnName && (
							<Title level={4} type="secondary">
								{institute.bnName}
							</Title>
						)}

						<div style={{ marginBottom: 16 }}>
							{institute.hospitalType && (
								<Tag color="blue" style={{ marginRight: 8 }}>
									{institute.hospitalType.name}
								</Tag>
							)}
							{institute.organizationType && (
								<Tag color="green">{institute.organizationType.name}</Tag>
							)}
						</div>

						<Descriptions column={{ xs: 1, md: 2 }} bordered>
							{institute.district && (
								<Descriptions.Item label="Location">
									<Space>
										<EnvironmentOutlined />
										<span>
											{institute.district.name}
											{institute.district.division &&
												`, ${institute.district.division.name}`}
										</span>
									</Space>
								</Descriptions.Item>
							)}

							{institute.establishedYear && (
								<Descriptions.Item label="Established">
									{institute.establishedYear}
								</Descriptions.Item>
							)}

							{institute.enroll && (
								<Descriptions.Item label="Enrollment">
									{institute.enroll}
								</Descriptions.Item>
							)}

							{institute.numberOfBed > 0 && (
								<Descriptions.Item label="Number of Beds">
									{institute.numberOfBed}
								</Descriptions.Item>
							)}

							{institute.websiteUrl && (
								<Descriptions.Item label="Website">
									<Button
										type="link"
										href={institute.websiteUrl}
										target="_blank"
										icon={<LinkOutlined />}
										style={{ padding: 0 }}
									>
										Visit Website
									</Button>
								</Descriptions.Item>
							)}

							{institute.acronym && (
								<Descriptions.Item label="Acronym">
									{institute.acronym}
								</Descriptions.Item>
							)}
						</Descriptions>
					</Card>
				</Col>
				<Col xs={24} lg={8}>
					<Card>
						<img
							alt={institute.name}
							src={
								institute.imageUrl ||
								`https://via.placeholder.com/800x400?text=${encodeURIComponent(
									institute.name
								)}`
							}
							style={{ width: "100%", borderRadius: 8 }}
						/>

						{institute.lat && institute.lon && (
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
									Lat: {institute.lat}, Lon: {institute.lon}
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
								<Card title="About Institute" bordered={false}>
									<p>
										{institute.description ||
											"No detailed information available for this institute at the moment."}
									</p>
								</Card>
							</Col>
						</Row>
					</Tabs.TabPane>

					<Tabs.TabPane tab="Faculty" key="teachers">
						{teachersLoading ? (
							<div style={{ textAlign: "center", padding: "50px" }}>
								<Spin />
								<div style={{ marginTop: 16 }}>Loading faculty...</div>
							</div>
						) : (
							<>
								{teachers.length > 0 ? (
									<>
										<List
											dataSource={teachers}
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
												current={teachersPagination.current + 1}
												pageSize={teachersPagination.pageSize}
												total={teachersPagination.total}
												onChange={handleTeacherPageChange}
												showSizeChanger={false}
											/>
										</div>
									</>
								) : (
									<Empty description="No faculty found for this institute" />
								)}
							</>
						)}
					</Tabs.TabPane>

					<Tabs.TabPane tab="Alumni" key="graduates">
						{graduatesLoading ? (
							<div style={{ textAlign: "center", padding: "50px" }}>
								<Spin />
								<div style={{ marginTop: 16 }}>Loading alumni...</div>
							</div>
						) : (
							<>
								{graduates.length > 0 ? (
									<>
										<List
											dataSource={graduates}
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
												current={graduatesPagination.current + 1}
												pageSize={graduatesPagination.pageSize}
												total={graduatesPagination.total}
												onChange={handleGraduatesPageChange}
												showSizeChanger={false}
											/>
										</div>
									</>
								) : (
									<Empty description="No alumni found for this institute" />
								)}
							</>
						)}
					</Tabs.TabPane>
				</Tabs>
			</Card>
		</div>
	);
}
