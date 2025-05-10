import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  Input,
  Select,
  Spin,
  Avatar,
  Tag,
  Card,
  Row,
  Col,
  Form,
  Button,
  Pagination,
} from "antd";
import { FilterOutlined, ClearOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  fetchDoctors,
  fetchHospitals,
  fetchDegrees,
  fetchMedicalSpecialities,
} from "../services/api";
import config from "../config";
import { Doctor } from "../types";

const { Title } = Typography;
const { Option } = Select;

const Doctors: React.FC = () => {
  const navigate = useNavigate();
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
  }, []);

  const handleTableChange = (paginationInfo: any) => {
    // Convert from 1-based to 0-based for API
    fetchData(paginationInfo.current - 1);
  };

  const handleFilterSubmit = (values: typeof filters) => {
    const newFilters = { ...values };
    setFilters(newFilters);
    fetchData(0, newFilters); // Reset to first page with new filters
  };

  const handleFilterReset = () => {
    form.resetFields();
    const resetFilters = {
      name: "",
      bmdcNo: "",
      hospitalId: undefined,
      degreeId: undefined,
      specialityId: undefined,
    };
    setFilters(resetFilters);
    fetchData(0, resetFilters);
  };

  // Function to navigate to doctor details page
  const navigateToDetails = (doctorId: number) => {
    navigate(`/doctors/${doctorId}`);
  };

  // Updated columns with the function call instead of Link
  const columns = [
    {
      title: "Photo",
      dataIndex: ["profile", "photo"],
      key: "photo",
      render: (photo: string | null, record: Doctor) => (
        <Avatar
          src={photo || "https://via.placeholder.com/48"}
          size={48}
          alt={record.profile.name}
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
      render: (_: any, record: Doctor) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => navigateToDetails(record.id)}
        >
          Details
        </Button>
      ),
    },
  ];

  // Updated mobile view with function call instead of Link
  const renderMobileCard = (doctor: Doctor) => (
    <Card key={doctor.id} style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <Avatar
          src={doctor.profile.photo || "https://via.placeholder.com/64"}
          size={64}
          alt={doctor.profile.name}
        />
        <div style={{ marginLeft: 16 }}>
          <h3>{doctor.profile.name}</h3>
          <Tag color={doctor.profile.gender === "MALE" ? "blue" : "pink"}>
            {doctor.profile.gender}
          </Tag>
        </div>
      </div>
      <div>
        <p>
          <strong>BMDC No:</strong> {doctor.bmdcNo || "Not Available"}
        </p>
        <p>
          <strong>Experience:</strong>{" "}
          {doctor.yearOfExperience
            ? `${doctor.yearOfExperience} years`
            : "Not specified"}
        </p>
      </div>
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => navigateToDetails(doctor.id)}
        >
          View Details
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="doctors-container">
      <Title level={2}>Doctors</Title>

      <Card className="filter-container" style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFilterSubmit}
          initialValues={filters}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="name" label="Doctor Name">
                <Input placeholder="Search by name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="bmdcNo" label="BMDC Number">
                <Input placeholder="Enter BMDC Number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="hospitalId" label="Hospital">
                <Select
                  placeholder="Select Hospital"
                  loading={loadingFilters}
                  allowClear
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
              <Form.Item name="degreeId" label="Degree">
                <Select
                  placeholder="Select Degree"
                  loading={loadingFilters}
                  allowClear
                >
                  {degrees.map((degree) => (
                    <Option key={degree.id} value={degree.id}>
                      {degree.name} ({degree.abbreviation})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="specialityId" label="Speciality">
                <Select
                  placeholder="Select Speciality"
                  loading={loadingFilters}
                  allowClear
                >
                  {specialities.map((speciality) => (
                    <Option key={speciality.id} value={speciality.id}>
                      {speciality.name}
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
              style={{
                display: "flex",
                alignItems: "flex-end",
                marginBottom: 24,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                icon={<FilterOutlined />}
                style={{ marginRight: 8 }}
              >
                Filter
              </Button>
              <Button onClick={handleFilterReset} icon={<ClearOutlined />}>
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Desktop view */}
          <div
            className="desktop-view"
            style={{ display: { xs: "none", sm: "none", md: "block" } }}
          >
            <Table
              columns={columns}
              dataSource={doctors}
              rowKey="id"
              pagination={{
                current: pagination.current + 1, // Convert 0-based to 1-based for display
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: false,
              }}
              onChange={handleTableChange}
            />
          </div>

          {/* Mobile view */}
          <div
            className="mobile-view"
            style={{ display: { xs: "block", sm: "block", md: "none" } }}
          >
            {doctors.length > 0 ? (
              doctors.map(renderMobileCard)
            ) : (
              <Card>
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  No doctors found with the selected filters.
                </div>
              </Card>
            )}

            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <Pagination
                current={pagination.current + 1} // Convert 0-based to 1-based for display
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={(page) => fetchData(page - 1)}
                hideOnSinglePage
                showSizeChanger={false}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Doctors;
