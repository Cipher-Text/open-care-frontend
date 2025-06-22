"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	Typography,
	Input,
	Select,
	Spin,
	Avatar,
	Card,
	Row,
	Col,
	Form,
	Button,
	Table,
} from "antd";
import { FilterOutlined, ClearOutlined, EyeOutlined } from "@ant-design/icons";
import {
	fetchDoctors,
	fetchHospitals,
	fetchDegrees,
	fetchMedicalSpecialities,
} from "../../src/services/api";
import config from "../../src/config";
import { Doctor } from "../../src/types";

const { Title } = Typography;
const { Option } = Select;

export default function DoctorsPage() {
	const router = useRouter();
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [loading, setLoading] = useState(true);
	const [hospitals, setHospitals] = useState<{ id: number; name: string }[]>(
		[]
	);
	const [degrees, setDegrees] = useState<
		{ id: number; name: string; abbreviation: string }[]
	>([]);
	const [specialities, setSpecialities] = useState<
		{ id: number; name: string }[]
	>([]);
	const [loadingFilters, setLoadingFilters] = useState(true);
	const [pagination, setPagination] = useState({
		current: 0, // API uses 0-based indexing
		pageSize: config.itemsPerPage,
		total: 0,
	});

	const [form] = Form.useForm();
	const [filters, setFilters] = useState({
		name: "",
		bmdcNo: "",
		hospitalId: undefined,
		degreeId: undefined,
		specialityId: undefined,
	});

	// Fetch filter options
	useEffect(() => {
		const fetchFilterOptions = async () => {
			setLoadingFilters(true);
			try {
				const [hospitalsData, degreesData, specialitiesData] =
					await Promise.all([
						fetchHospitals(0, 100), // Fetch first 100 hospitals
						fetchDegrees(),
						fetchMedicalSpecialities(),
					]);

				setHospitals(hospitalsData.hospitals || []);
				setDegrees(degreesData || []);
				setSpecialities(specialitiesData || []);
			} catch (error) {
				console.error("Failed to fetch filter options:", error);
			} finally {
				setLoadingFilters(false);
			}
		};

		fetchFilterOptions();
	}, []);

	const fetchData = async (page = 0, currentFilters = filters) => {
		setLoading(true);
		try {
			const response = await fetchDoctors(
				page,
				pagination.pageSize,
				currentFilters
			);
			setDoctors(response.doctors || []);
			setPagination({
				...pagination,
				current: response.currentPage,
				total: response.totalItems,
			});
		} catch (error) {
			console.error("Failed to fetch doctors:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSearch = (values: typeof filters) => {
		const newFilters = {
			name: values.name || "",
			bmdcNo: values.bmdcNo || "",
			hospitalId: values.hospitalId,
			degreeId: values.degreeId,
			specialityId: values.specialityId,
		};
		setFilters(newFilters);
		fetchData(0, newFilters);
	};

	const handleClear = () => {
		form.resetFields();
		const emptyFilters = {
			name: "",
			bmdcNo: "",
			hospitalId: undefined,
			degreeId: undefined,
			specialityId: undefined,
		};
		setFilters(emptyFilters);
		fetchData(0, emptyFilters);
	};

	const handlePageChange = (page: number) => {
		fetchData(page - 1); // API uses 0-based indexing
	};

	const viewDoctor = (id: number) => {
		router.push(`/doctors/${id}`);
	};

	// Table columns definition
	const columns = [
		{
			title: "Photo",
			dataIndex: ["profile", "photo"],
			key: "photo",
			render: (photo: string | null, record: Doctor) => (
				<Avatar
					src={photo || "https://via.placeholder.com/48"}
					size={48}
					alt={record.profile?.name}
				/>
			),
		},
		{
			title: "Name",
			dataIndex: ["profile", "name"],
			key: "name",
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
			render: (years: number | undefined) =>
				years ? `${years} years` : "Not specified",
		},
		{
			title: "Actions",
			key: "actions",
			render: (_: unknown, record: Doctor) => (
				<Button
					type="primary"
					icon={<EyeOutlined />}
					size="small"
					onClick={() => viewDoctor(record.id)}
				>
					Details
				</Button>
			),
		},
	];

	return (
		<div className="doctors-container" style={{ padding: "20px" }}>
			<Title level={2}>Doctors</Title>

			<Card className="filter-container" style={{ marginBottom: 24 }}>
				<Form form={form} layout="vertical" onFinish={handleSearch}>
					<Row gutter={16}>
						<Col xs={24} sm={12} md={8} lg={6}>
							<Form.Item name="name" label="Doctor Name">
								<Input placeholder="Search by name" />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} md={8} lg={6}>
							<Form.Item name="bmdcNo" label="BMDC Number">
								<Input placeholder="Enter BMDC number" />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} md={8} lg={6}>
							<Form.Item name="hospitalId" label="Hospital">
								<Select
									placeholder="Select hospital"
									allowClear
									loading={loadingFilters}
								>
									{hospitals.map((hospital) => (
										<Option key={hospital.id} value={hospital.id}>
											{hospital.name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} md={8} lg={6}>
							<Form.Item name="specialityId" label="Speciality">
								<Select
									placeholder="Select speciality"
									allowClear
									loading={loadingFilters}
								>
									{specialities.map((speciality) => (
										<Option key={speciality.id} value={speciality.id}>
											{speciality.name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} md={8} lg={6}>
							<Form.Item name="degreeId" label="Degree">
								<Select
									placeholder="Select degree"
									allowClear
									loading={loadingFilters}
								>
									{degrees.map((degree) => (
										<Option key={degree.id} value={degree.id}>
											{degree.name} ({degree.abbreviation})
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col
							xs={24}
							sm={12}
							md={8}
							lg={6}
							style={{ display: "flex", alignItems: "flex-end" }}
						>
							<Form.Item>
								<div style={{ display: "flex", gap: 8 }}>
									<Button
										type="primary"
										htmlType="submit"
										icon={<FilterOutlined />}
									>
										Filter
									</Button>
									<Button onClick={handleClear} icon={<ClearOutlined />}>
										Clear
									</Button>
								</div>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Card>

			{loading ? (
				<div style={{ textAlign: "center", padding: "50px" }}>
					<Spin size="large" />
					<p>Loading doctors...</p>
				</div>
			) : (
				<>
					{/* Desktop view with Table */}
					<div className="desktop-view" style={{ marginBottom: 24 }}>
						<Table
							columns={columns}
							dataSource={doctors}
							rowKey="id"
							pagination={{
								current: pagination.current + 1, // Convert 0-based to 1-based for display
								pageSize: pagination.pageSize,
								total: pagination.total,
								showSizeChanger: false,
								onChange: handlePageChange,
							}}
						/>
					</div>
				</>
			)}
		</div>
	);
}
