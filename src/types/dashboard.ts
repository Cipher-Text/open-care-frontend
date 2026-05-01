export interface DashboardOverview {
  totalDoctors: number;
  totalNurses: number;
  totalPatients: number;
  totalAdmins: number;
  totalHospitals: number;
  totalInstitutions: number;
  bloodUnitsAvailable: number;
  ambulancesActive: number;
  associationsRegistered: number;
  socialOrganizations: number;
  lastUpdated: string;
}

export interface RealTimeStats {
  onlineUsers: number;
  activeAmbulances: number;
  pendingAppointments: number;
  criticalAlerts: number;
  systemLoad: number;
  memoryUsage: number;
}

export interface Alert {
  id: number;
  title: string;
  message: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  timestamp: string;
  category: string | null;
  acknowledged: boolean;
}

export interface RegistrationTrends {
  months: string[];
  doctors: number[];
  nurses: number[];
  hospitals: number[];
  patients: number[];
}

export interface RecentActivity {
  id: number;
  entityType: "PATIENT" | "DOCTOR" | "NURSE" | "HOSPITAL" | "BLOOD_BANK";
  action:
    | "LOGIN"
    | "LOGOUT"
    | "REGISTERED"
    | "UPDATED"
    | "DEACTIVATED"
    | "DELETED";
  status: "SUCCESS" | "FAILED" | "PENDING";
  timestamp: string;
  details: string;
  userId: number | null;
  ipAddress: string | null;
}
