/** Real counts from `GET /api/superadmin/dashboard/overview`. */
export interface DashboardOverview {
  totalDoctors: number;
  totalNurses: number;
  totalPatients: number;
  totalAdmins: number;
  totalHospitals: number;
  totalInstitutions: number;
  ambulancesRegistered: number;
  associationsRegistered: number;
  socialOrganizations: number;
  lastUpdated: string;
}
