"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	Typography,
	Table,
	Select,
	Space,
	Spin,
	Tag,
	Button,
	Card,
} from "antd";
import {
	EnvironmentOutlined,
	LinkOutlined,
	InfoCircleOutlined,
} from "@ant-design/icons";
import { fetchInstitutions } from "../../src/services/api";
import {
	District,
	Institution,
	HospitalType,
	OrganizationType,
} from "../../src/types";
import config from "../../src/config";

const { Title } = Typography;
const { Option } = Select;

export default function InstitutesPage() {
	const router = useRouter();
	const [institutes, setInstitutes] = useState<Institution[]>([]);
	const [districts, setDistricts] = useState<District[]>([]);
	const [organizationTypes, setOrganizationTypes] = useState<
		OrganizationType[]
	>([]);
	const [hospitalTypes, setHospitalTypes] = useState<HospitalType[]>([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: config.itemsPerPage || 5,
		total: 0,
	});

	// Filter states
	const [selectedDistrict, setSelectedDistrict] = useState<number | undefined>(
		undefined
	);
	const [selectedHospitalType, setSelectedHospitalType] = useState<
		string | undefined
	>(undefined);
	const [selectedOrgType, setSelectedOrgType] = useState<string | undefined>(
		undefined
	);

	useEffect(() => {
		// Fetch all filter data
		const fetchFilterData = async () => {
			try {
				// Update this to use Next.js API routes or direct fetch calls
				const [districtRes, orgTypeRes, hospitalTypeRes] = await Promise.all([
					fetch(`${config.apiUrl}api/districts`).then((res) => res.json()),
					fetch(`${config.apiUrl}api/organization-types`).then((res) =>
						res.json()
					),
					fetch(`${config.apiUrl}api/hospital-types`).then((res) => res.json()),
				]);

				setDistricts(districtRes);
				setOrganizationTypes(orgTypeRes);
				setHospitalTypes(hospitalTypeRes);
			} catch (error) {
				console.error("Failed to fetch filter data:", error);
			}
		};

		fetchFilterData();
	}, []);

	useEffect(() => {
		fetchInstituteList(1); // Reset to page 1 on filter change
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedDistrict, selectedHospitalType, selectedOrgType]);

	const fetchInstituteList = async (page: number) => {
		setLoading(true);
		try {
			const response = await fetchInstitutions(
				page - 1, // Convert 1-based to 0-based for the API
				pagination.pageSize,
				{
					districtIds: selectedDistrict,
					hospitalTypes: selectedHospitalType,
					organizationType: selectedOrgType,
				}
			);

			setInstitutes(response.institutions);
			setPagination({
				...pagination,
				current: page, // Keep 1-based for the UI
				total: response.totalItems || 0,
			});
		} catch (error) {
			console.error("Failed to fetch institutes:", error);
		} finally {
			setLoading(false);
		}
	};

	const handlePageChange = (page: number) => {
		setPagination({ ...pagination, current: page });
		fetchInstituteList(page);
	};

	const handleDistrictChange = (value: number | undefined) => {
		setSelectedDistrict(value);
	};

	const handleHospitalTypeChange = (value: string | undefined) => {
		setSelectedHospitalType(value);
	};

	const handleOrgTypeChange = (value: string | undefined) => {
		setSelectedOrgType(value);
	};

	const navigateToDetails = (instituteId: number) => {
		router.push(`/institutes/${instituteId}`);
	};

	const getOrgTypeColor = (type: string) => {
		switch (type) {
			case "GOVERNMENT":
				return "blue";
			case "MILITARY":
				return "red";
			case "PRIVATE":
				return "green";
			default:
				return "default";
		}
	};

	const getHospitalTypeColor = (type: string) => {
		switch (type) {
			case "GENERAL":
				return "purple";
			case "CANCER":
				return "magenta";
			case "CHEST_DISEASE":
				return "orange";
			default:
				return "default";
		}
	};

	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			render: (text: string, record: Institution) => (
				<Space direction="vertical" size={0}>
					<span style={{ fontWeight: "bold" }}>{text}</span>
					<span style={{ fontSize: "12px", color: "#888" }}>
						{record.bnName || "N/A"}
					</span>
				</Space>
			),
		},
		{
			title: "Number of Beds",
			dataIndex: "numberOfBed",
			key: "numberOfBed",
		},
		{
			title: "Organization Type",
			dataIndex: ["organizationType", "name"],
			key: "organizationType",
			render: (text: string) => <Tag color={getOrgTypeColor(text)}>{text}</Tag>,
		},
		{
			title: "Hospital Type",
			dataIndex: ["hospitalType", "name"],
			key: "hospitalType",
			render: (text: string) => (
				<Tag color={getHospitalTypeColor(text)}>{text}</Tag>
			),
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
			title: "Established",
			dataIndex: "establishedYear",
			key: "establishedYear",
			render: (year: string) => year || "N/A",
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
			render: (_: unknown, record: Institution) => (
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
						onClick={() => navigateToDetails(record.id)}
						icon={<InfoCircleOutlined />}
					>
						Details
					</Button>
				</Space>
			),
		},
	];

	return (
		<div className="institutes-container" style={{ padding: "20px" }}>
			<Title level={2}>Institutes</Title>

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
							onChange={handleDistrictChange}
							allowClear
							showSearch
							optionFilterProp="children"
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
							placeholder="Select Hospital Type"
							style={{ width: "100%" }}
							onChange={handleHospitalTypeChange}
							allowClear
							value={selectedHospitalType}
						>
							{hospitalTypes.map((type) => (
								<Option key={type.banglaName} value={type.banglaName}>
									{type.banglaName}
								</Option>
							))}
						</Select>
					</div>

					<div style={{ minWidth: 200 }}>
						<label
							style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
						>
							Organization Type
						</label>
						<Select
							placeholder="Select Organization Type"
							style={{ width: "100%" }}
							onChange={handleOrgTypeChange}
							allowClear
							value={selectedOrgType}
						>
							{organizationTypes.map((type) => (
								<Option key={type.name} value={type.name}>
									{type.name}
								</Option>
							))}
						</Select>
					</div>
				</div>
			</Card>

			{loading ? (
				<div style={{ textAlign: "center", padding: "50px" }}>
					<Spin size="large" />
					<div style={{ marginTop: 16 }}>Loading institutes...</div>
				</div>
			) : (
				<>
					{/* Desktop view */}
					<div className="desktop-view" style={{ marginBottom: 24 }}>
						<Table
							columns={columns}
							dataSource={institutes}
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
		</div>
	);
}
