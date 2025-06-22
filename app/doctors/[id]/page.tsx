"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
	Typography,
	Spin,
	Card,
	Avatar,
	Row,
	Col,
	Tag,
	Divider,
	Button,
	List,
	Empty,
	Breadcrumb,
	Modal,
	Form,
	Input,
	Select,
	DatePicker,
	message,
	Popconfirm,
} from "antd";
import {
	UserOutlined,
	BookOutlined,
	MedicineBoxOutlined,
	HomeOutlined,
	EnvironmentOutlined,
	PhoneOutlined,
	MailOutlined,
	IdcardOutlined,
	EditOutlined,
	PlusOutlined,
	DeleteOutlined,
} from "@ant-design/icons";
import { Doctor, DoctorWorkplace, DoctorDegree } from "../../../src/types";
import { fetchDoctorById } from "../../../src/services/api";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Mock function to get user roles - replace with your actual auth logic
const getUserRoles = (): string[] => {
	// This should come from your auth context/token
	const token = localStorage.getItem("token"); // or however you store the token
	if (!token) return [];

	// In a real app, you would decode the token and get user roles
	// For now we just return a mock role for demonstration
	return ["user"]; // You might have "admin", "doctor", etc.
};

export default function DoctorDetailsPage({
	params,
}: {
	params: { id: string };
}) {
	const [doctor, setDoctor] = useState<Doctor | null>(null);
	const [loading, setLoading] = useState(true);
	const [editMode, setEditMode] = useState<string | null>(null); // null, "basic", "workplace", "degree"
	const [form] = Form.useForm();
	// Define interfaces that match the actual type structure coming from the API
	interface Workplace {
		id: number;
		hospital?: { id: number; name: string } | null;
		designation: React.ReactNode;
		department: React.ReactNode;
		startDate: string;
		endDate?: string | null;
	}

	interface Degree {
		id: number;
		degree?: { id: number; name: string; abbreviation: string };
		institute: React.ReactNode;
		year: React.ReactNode;
	}

	// Type for items that can be edited
	type EditableItem = Workplace | Degree | DoctorWorkplace | DoctorDegree;

	const [selectedWorkplace, setSelectedWorkplace] = useState<Workplace | null>(
		null
	);
	const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);

	const userRoles = getUserRoles();
	const canEdit = userRoles.includes("admin") || userRoles.includes("doctor");

	useEffect(() => {
		const loadDoctor = async () => {
			setLoading(true);
			try {
				const data = await fetchDoctorById(Number(params.id));
				setDoctor(data);
			} catch (error) {
				console.error("Failed to fetch doctor details:", error);
			} finally {
				setLoading(false);
			}
		};

		if (params.id) {
			loadDoctor();
		}
	}, [params.id]);

	// Handle edit form submission
	const handleSubmit = async () => {
		if (editMode === "basic") {
			// Handle basic information update
			message.success("Doctor information updated successfully!");
		} else if (editMode === "workplace") {
			// Handle workplace update/add
			message.success(
				selectedWorkplace
					? "Workplace updated successfully!"
					: "Workplace added successfully!"
			);
		} else if (editMode === "degree") {
			// Handle degree update/add
			message.success(
				selectedDegree
					? "Degree updated successfully!"
					: "Degree added successfully!"
			);
		}

		setEditMode(null);
		// Refetch doctor data
	};

	const handleEdit = (type: string, item?: EditableItem) => {
		setEditMode(type);

		if (type === "basic" && doctor) {
			form.setFieldsValue({
				name: doctor.profile?.name,
				bnName: doctor.profile?.bnName,
				gender: doctor.profile?.gender,
				email: doctor.profile?.email,
				phone: doctor.profile?.phone,
				address: doctor.profile?.address,
				bmdcNo: doctor.bmdcNo,
				specializations: doctor.specializations,
				description: doctor.description,
			});
		} else if (type === "workplace" && item) {
			const workplaceItem = item as Workplace;
			setSelectedWorkplace(workplaceItem);
			form.setFieldsValue({
				hospital: workplaceItem.hospital?.id,
				designation: workplaceItem.designation,
				department: workplaceItem.department,
				startDate: dayjs(workplaceItem.startDate),
				endDate: workplaceItem.endDate ? dayjs(workplaceItem.endDate) : null,
				isCurrentlyWorking: !workplaceItem.endDate,
			});
		} else if (type === "degree" && item) {
			const degreeItem = item as Degree;
			setSelectedDegree(degreeItem);
			form.setFieldsValue({
				degree: degreeItem.degree?.id,
				institute: degreeItem.institute,
				year: degreeItem.year,
			});
		} else {
			// Reset form when adding new
			form.resetFields();
			setSelectedWorkplace(null);
			setSelectedDegree(null);
		}
	};

	const handleCancel = () => {
		setEditMode(null);
		form.resetFields();
	};

	const handleDelete = (type: string, id: number) => {
		console.log(`Deleting ${type} with id: ${id}`);
		if (type === "workplace") {
			// Handle delete workplace
			message.success("Workplace deleted successfully!");
		} else if (type === "degree") {
			// Handle delete degree
			message.success("Degree deleted successfully!");
		}
		// TODO: Implement actual API call to delete data
	};

	if (loading) {
		return (
			<div style={{ textAlign: "center", padding: "100px" }}>
				<Spin size="large" />
				<div style={{ marginTop: 16 }}>Loading doctor information...</div>
			</div>
		);
	}

	if (!doctor) {
		return (
			<div style={{ textAlign: "center", padding: "100px" }}>
				<Empty description="Doctor not found" />
				<Link href="/doctors">
					<Button type="primary" style={{ marginTop: 16 }}>
						Back to Doctors List
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="doctor-details-container" style={{ padding: "20px" }}>
			<Breadcrumb style={{ marginBottom: 16 }}>
				<Breadcrumb.Item>
					<Link href="/">
						<HomeOutlined /> Home
					</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>
					<Link href="/doctors">Doctors</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>{doctor.profile?.name}</Breadcrumb.Item>
			</Breadcrumb>

			<Card className="doctor-profile-card" style={{ marginBottom: 24 }}>
				<Row gutter={24}>
					<Col xs={24} sm={8} md={6}>
						<div style={{ textAlign: "center" }}>
							<Avatar
								size={200}
								icon={<UserOutlined />}
								src={doctor.profile?.photo}
							/>
							{canEdit && (
								<div style={{ marginTop: 16 }}>
									<Button
										type="primary"
										icon={<EditOutlined />}
										onClick={() => handleEdit("basic")}
									>
										Edit Information
									</Button>
								</div>
							)}
						</div>
					</Col>
					<Col xs={24} sm={16} md={18}>
						<Title level={2}>{doctor.profile?.name}</Title>
						{doctor.profile?.bnName && (
							<Title level={4} type="secondary">
								{doctor.profile.bnName}
							</Title>
						)}
						<div>
							{doctor.specializations &&
								doctor.specializations.split(",").map((spec, index) => (
									<Tag color="blue" key={index}>
										{spec.trim()}
									</Tag>
								))}
						</div>

						<Divider />

						<Row gutter={[16, 16]}>
							<Col span={24} md={12}>
								<List>
									<List.Item>
										<IdcardOutlined style={{ marginRight: 8 }} />
										<Text strong>BMDC No:</Text> {doctor.bmdcNo}
									</List.Item>
									<List.Item>
										<MedicineBoxOutlined style={{ marginRight: 8 }} />
										<Text strong>Experience:</Text> {doctor.yearOfExperience}{" "}
										years
									</List.Item>
									{doctor.profile?.gender && (
										<List.Item>
											<UserOutlined style={{ marginRight: 8 }} />
											<Text strong>Gender:</Text> {doctor.profile.gender}
										</List.Item>
									)}
								</List>
							</Col>
							<Col span={24} md={12}>
								<List>
									{doctor.profile?.email && (
										<List.Item>
											<MailOutlined style={{ marginRight: 8 }} />
											<Text strong>Email:</Text> {doctor.profile.email}
										</List.Item>
									)}
									{doctor.profile?.phone && (
										<List.Item>
											<PhoneOutlined style={{ marginRight: 8 }} />
											<Text strong>Phone:</Text> {doctor.profile.phone}
										</List.Item>
									)}
									{doctor.profile?.address && (
										<List.Item>
											<EnvironmentOutlined style={{ marginRight: 8 }} />
											<Text strong>Address:</Text> {doctor.profile.address}
										</List.Item>
									)}
								</List>
							</Col>
						</Row>

						{doctor.description && (
							<div style={{ marginTop: 16 }}>
								<Title level={5}>About</Title>
								<p>{doctor.description}</p>
							</div>
						)}
					</Col>
				</Row>
			</Card>

			<Card
				title={
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<span>
							<MedicineBoxOutlined /> Workplaces
						</span>
						{canEdit && (
							<Button
								type="primary"
								size="small"
								icon={<PlusOutlined />}
								onClick={() => handleEdit("workplace")}
							>
								Add Workplace
							</Button>
						)}
					</div>
				}
				style={{ marginBottom: 24 }}
			>
				{doctor.doctorWorkplaces && doctor.doctorWorkplaces.length > 0 ? (
					<List
						dataSource={doctor.doctorWorkplaces}
						renderItem={(workplace) => (
							<List.Item
								actions={
									canEdit
										? [
												<Button
													key="edit"
													icon={<EditOutlined />}
													onClick={() => handleEdit("workplace", workplace)}
												/>,
												<Popconfirm
													key="delete"
													title="Are you sure to delete this workplace?"
													onConfirm={() =>
														handleDelete("workplace", workplace.id)
													}
													okText="Yes"
													cancelText="No"
												>
													<Button danger icon={<DeleteOutlined />} />
												</Popconfirm>,
										  ]
										: []
								}
							>
								<List.Item.Meta
									title={
										<span>
											<strong>{workplace.designation}</strong> at{" "}
											<Link href={`/hospitals/${workplace.hospital?.id}`}>
												{workplace.hospital?.name}
											</Link>
										</span>
									}
									description={
										<div>
											<div>Department: {workplace.department}</div>
											<div>
												Duration:{" "}
												{workplace.startDate
													? new Date(workplace.startDate).toLocaleDateString()
													: "N/A"}{" "}
												{workplace.endDate
													? `to ${new Date(
															workplace.endDate
													  ).toLocaleDateString()}`
													: "to Present"}
											</div>
										</div>
									}
								/>
							</List.Item>
						)}
					/>
				) : (
					<Empty description="No workplace information available" />
				)}
			</Card>

			<Card
				title={
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<span>
							<BookOutlined /> Education & Degrees
						</span>
						{canEdit && (
							<Button
								type="primary"
								size="small"
								icon={<PlusOutlined />}
								onClick={() => handleEdit("degree")}
							>
								Add Degree
							</Button>
						)}
					</div>
				}
			>
				{doctor.doctorDegrees && doctor.doctorDegrees.length > 0 ? (
					<List
						dataSource={doctor.doctorDegrees}
						renderItem={(degree) => (
							<List.Item
								actions={
									canEdit
										? [
												<Button
													key="edit"
													icon={<EditOutlined />}
													onClick={() => handleEdit("degree", degree)}
												/>,
												<Popconfirm
													key="delete"
													title="Are you sure to delete this degree?"
													onConfirm={() => handleDelete("degree", degree.id)}
													okText="Yes"
													cancelText="No"
												>
													<Button danger icon={<DeleteOutlined />} />
												</Popconfirm>,
										  ]
										: []
								}
							>
								<List.Item.Meta
									title={
										<span>
											<strong>
												{degree.degree?.name} ({degree.degree?.abbreviation})
											</strong>
										</span>
									}
									description={
										<div>
											<div>Institute: {degree.institute}</div>
											<div>Year: {degree.year}</div>
										</div>
									}
								/>
							</List.Item>
						)}
					/>
				) : (
					<Empty description="No degree information available" />
				)}
			</Card>

			{/* Edit Basic Information Modal */}
			<Modal
				title="Edit Basic Information"
				open={editMode === "basic"}
				onCancel={handleCancel}
				footer={[
					<Button key="cancel" onClick={handleCancel}>
						Cancel
					</Button>,
					<Button key="submit" type="primary" onClick={() => form.submit()}>
						Save
					</Button>,
				]}
				width={800}
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSubmit}
					initialValues={{
						name: doctor.profile?.name,
						bnName: doctor.profile?.bnName,
						gender: doctor.profile?.gender,
						email: doctor.profile?.email,
						phone: doctor.profile?.phone,
						address: doctor.profile?.address,
						bmdcNo: doctor.bmdcNo,
						specializations: doctor.specializations,
						description: doctor.description,
					}}
				>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="name"
								label="Name"
								rules={[{ required: true, message: "Name is required" }]}
							>
								<Input placeholder="Doctor's name" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="bnName" label="Name (Bengali)">
								<Input placeholder="Doctor's name in Bengali" />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="gender" label="Gender">
								<Select placeholder="Select gender">
									<Option value="Male">Male</Option>
									<Option value="Female">Female</Option>
									<Option value="Other">Other</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="bmdcNo"
								label="BMDC Registration Number"
								rules={[{ required: true, message: "BMDC number is required" }]}
							>
								<Input placeholder="BMDC registration number" />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="email" label="Email">
								<Input placeholder="Email address" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="phone" label="Phone">
								<Input placeholder="Phone number" />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item name="address" label="Address">
						<Input placeholder="Address" />
					</Form.Item>

					<Form.Item name="specializations" label="Specializations">
						<Input placeholder="Specializations (comma separated)" />
					</Form.Item>

					<Form.Item name="description" label="About">
						<TextArea rows={4} placeholder="Brief description" />
					</Form.Item>
				</Form>
			</Modal>

			{/* Edit/Add Workplace Modal */}
			<Modal
				title={selectedWorkplace ? "Edit Workplace" : "Add New Workplace"}
				open={editMode === "workplace"}
				onCancel={handleCancel}
				footer={[
					<Button key="cancel" onClick={handleCancel}>
						Cancel
					</Button>,
					<Button key="submit" type="primary" onClick={() => form.submit()}>
						Save
					</Button>,
				]}
			>
				<Form form={form} layout="vertical" onFinish={handleSubmit}>
					<Form.Item
						name="hospital"
						label="Hospital"
						rules={[{ required: true, message: "Hospital is required" }]}
					>
						<Select placeholder="Select hospital">
							{/* This would be populated from API */}
							<Option value={1}>City General Hospital</Option>
							<Option value={2}>Riverside Medical Center</Option>
						</Select>
					</Form.Item>

					<Form.Item
						name="designation"
						label="Designation"
						rules={[{ required: true, message: "Designation is required" }]}
					>
						<Input placeholder="E.g. Consultant, Specialist" />
					</Form.Item>

					<Form.Item name="department" label="Department">
						<Input placeholder="E.g. Cardiology, Neurology" />
					</Form.Item>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="startDate"
								label="Start Date"
								rules={[{ required: true, message: "Start date is required" }]}
							>
								<DatePicker style={{ width: "100%" }} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="isCurrentlyWorking" valuePropName="checked">
								<div style={{ marginTop: 30 }}>
									<Select
										defaultValue={false}
										onChange={(value) => {
											if (value) {
												form.setFieldValue("endDate", null);
											}
										}}
									>
										<Option value={true}>Currently Working Here</Option>
										<Option value={false}>Worked In The Past</Option>
									</Select>
								</div>
							</Form.Item>
						</Col>
					</Row>

					<Form.Item
						name="endDate"
						label="End Date"
						dependencies={["isCurrentlyWorking"]}
						rules={[
							({ getFieldValue }) => ({
								required: !getFieldValue("isCurrentlyWorking"),
								message: "End date is required if not currently working",
							}),
						]}
					>
						<DatePicker style={{ width: "100%" }} />
					</Form.Item>
				</Form>
			</Modal>

			{/* Edit/Add Degree Modal */}
			<Modal
				title={selectedDegree ? "Edit Degree" : "Add New Degree"}
				open={editMode === "degree"}
				onCancel={handleCancel}
				footer={[
					<Button key="cancel" onClick={handleCancel}>
						Cancel
					</Button>,
					<Button key="submit" type="primary" onClick={() => form.submit()}>
						Save
					</Button>,
				]}
			>
				<Form form={form} layout="vertical" onFinish={handleSubmit}>
					<Form.Item
						name="degree"
						label="Degree"
						rules={[{ required: true, message: "Degree is required" }]}
					>
						<Select placeholder="Select degree">
							{/* This would be populated from API */}
							<Option value={1}>
								MBBS - Bachelor of Medicine, Bachelor of Surgery
							</Option>
							<Option value={2}>MD - Doctor of Medicine</Option>
							<Option value={3}>
								FCPS - Fellow of College of Physicians and Surgeons
							</Option>
						</Select>
					</Form.Item>

					<Form.Item
						name="institute"
						label="Institute"
						rules={[{ required: true, message: "Institute is required" }]}
					>
						<Input placeholder="Name of the medical school or university" />
					</Form.Item>

					<Form.Item
						name="year"
						label="Passing Year"
						rules={[{ required: true, message: "Passing year is required" }]}
					>
						<Input placeholder="Year of graduation" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
