"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	Typography,
	Select,
	Space,
	Spin,
	Card,
	Tag,
	Button,
	Table,
} from "antd";
import {
	EnvironmentOutlined,
	LinkOutlined,
	InfoCircleOutlined,
} from "@ant-design/icons";
import { fetchHospitals } from "../../src/services/api";
import { District, Hospital } from "../../src/types";
import config from "../../src/config";

const { Title } = Typography;
const { Option } = Select;

export default function HospitalsPage() {
	const router = useRouter();
	const [hospitals, setHospitals] = useState<Hospital[]>([]);
	const [districts, setDistricts] = useState<District[]>([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: config.itemsPerPage || 10,
		total: 0,
	});

	// Filter states
	const [selectedDistrict, setSelectedDistrict] = useState<
		number | undefined
	>();
	const [selectedHospitalType, setSelectedHospitalType] = useState<
		string | undefined
	>();
	const [selectedOrgType, setSelectedOrgType] = useState<string | undefined>();

	useEffect(() => {
		// Fetch districts for filter
		const fetchDistricts = async () => {
			try {
				const response = await fetch(`${config.apiUrl}api/districts`);
				const data = await response.json();
				setDistricts(data);
			} catch (error) {
				console.error("Failed to fetch districts:", error);
			}
		};

		fetchDistricts();
	}, []);

	useEffect(() => {
		const fetchHospitalsData = async () => {
			setLoading(true);
			try {
				const response = await fetchHospitals(
					pagination.current - 1, // API uses 0-based indexing
					pagination.pageSize,
					{
						districtIds: selectedDistrict,
						hospitalTypes: selectedHospitalType,
						organizationType: selectedOrgType,
					}
				);

				setHospitals(response.hospitals || []);
				setPagination({
					...pagination,
					total: response.totalItems || 0,
				});
			} catch (error) {
				console.error("Failed to fetch hospitals:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchHospitalsData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		pagination.current,
		pagination.pageSize,
		selectedDistrict,
		selectedHospitalType,
		selectedOrgType,
	]);

	const handlePageChange = (page: number) => {
		setPagination({
			...pagination,
			current: page,
		});
	};

	const handleViewDetails = (id: number) => {
		router.push(`/hospitals/${id}`);
	};

	// Table columns definition
	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			render: (text: string) => (
				<span style={{ fontWeight: "bold" }}>{text}</span>
			),
		},
		{
			title: "Organization Type",
			dataIndex: ["organizationType", "name"],
			key: "organizationType",
			render: (text: string) => <Tag color="blue">{text}</Tag>,
		},
		{
			title: "Hospital Type",
			dataIndex: ["hospitalType", "name"],
			key: "hospitalType",
			render: (text: string) => <Tag color="green">{text}</Tag>,
		},
		{
			title: "District",
			dataIndex: ["district", "name"],
			key: "district",
			render: (text: string) => (
				<Space>
					<EnvironmentOutlined />
					{text}
				</Space>
			),
		},
		{
			title: "Beds",
			dataIndex: "numberOfBed",
			key: "beds",
			render: (number: number) => number.toLocaleString(),
		},
		{
			title: "Website",
			dataIndex: "websiteUrl",
			key: "website",
			render: (url: string) =>
				url ? (
					<a href={url} target="_blank" rel="noopener noreferrer">
						<LinkOutlined /> Visit
					</a>
				) : (
					"N/A"
				),
		},
		{
			title: "Actions",
			key: "actions",
			render: (_: unknown, record: Hospital) => (
				<Space size="small">
					{record.lat && record.lon ? (
						<Button
							type="default"
							size="small"
							onClick={() =>
								window.open(
									`https://www.google.com/maps?q=${record.lat},${record.lon}`,
									"_blank"
								)
							}
						>
							Map
						</Button>
					) : null}
					<Button
						type="primary"
						size="small"
						onClick={() => handleViewDetails(record.id)}
						icon={<InfoCircleOutlined />}
					>
						Details
					</Button>
				</Space>
			),
		},
	];

	return (
		<div className="hospitals-container" style={{ padding: "20px" }}>
			<Title level={2}>Hospitals</Title>

			{/* Filters */}
			<Card style={{ marginBottom: 24 }}>
				<div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
					<div style={{ minWidth: 200 }}>
						<label
							style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
						>
							District
						</label>
						<Select
							placeholder="Select District"
							style={{ width: "100%" }}
							allowClear
							onChange={(value) => setSelectedDistrict(value)}
							value={selectedDistrict}
						>
							{districts.map((district) => (
								<Option key={district.id} value={district.id}>
									{district.name}
								</Option>
							))}
						</Select>
					</div>

					<div style={{ minWidth: 200 }}>
						<label
							style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
						>
							Hospital Type
						</label>
						<Select
							placeholder="Select Type"
							style={{ width: "100%" }}
							allowClear
							onChange={(value) => setSelectedHospitalType(value)}
							value={selectedHospitalType}
						>
							<Option value="General">General</Option>
							<Option value="Specialized">Specialized</Option>
							<Option value="Teaching">Teaching</Option>
							<Option value="Community">Community</Option>
						</Select>
					</div>

					<div style={{ minWidth: 200 }}>
						<label
							style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
						>
							Organization Type
						</label>
						<Select
							placeholder="Select Organization"
							style={{ width: "100%" }}
							allowClear
							onChange={(value) => setSelectedOrgType(value)}
							value={selectedOrgType}
						>
							<Option value="Public">Public</Option>
							<Option value="Private">Private</Option>
							<Option value="Non-profit">Non-profit</Option>
						</Select>
					</div>
				</div>
			</Card>

			{/* Hospitals Display */}
			{loading ? (
				<div style={{ textAlign: "center", padding: "50px" }}>
					<Spin size="large" />
					<div style={{ marginTop: 16 }}>Loading hospitals...</div>
				</div>
			) : (
				<>
					{/* Desktop Table View */}
					<div className="desktop-view" style={{ marginBottom: 24 }}>
						<Table
							columns={columns}
							dataSource={hospitals}
							rowKey="id"
							pagination={{
								current: pagination.current,
								pageSize: pagination.pageSize,
								total: pagination.total,
								showSizeChanger: false,
								onChange: handlePageChange,
							}}
						/>
					</div>
				</>
			)}

			{/* End of main content */}
		</div>
	);
}
