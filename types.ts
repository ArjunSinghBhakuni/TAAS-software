
export type UserRole = 'SUPER_ADMIN' | 'CSR_USER' | 'GOVT_USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  avatar?: string;
}

export type FundSource = 'CSR' | 'GOVT';
export type FundPurpose = 'Training' | 'Stipend' | 'Devices' | 'Rent' | 'Mentors' | 'Ops';

export interface Fund {
  id: string;
  source: FundSource;
  donor_name: string; // e.g., "TechCorp Foundation" or "State Rural Mission"
  amount_sanctioned: number;
  amount_utilized: number;
  purpose_tags: FundPurpose[];
  start_date: string;
  end_date: string;
  status: 'Active' | 'Depleted' | 'Planned';
}

export interface Expense {
  id: string;
  fund_id: string;
  category: FundPurpose;
  amount: number;
  date: string;
  description: string;
  proof_url?: string; // Mock URL for invoice
}

export type StudentStatus = 'Enrolled' | 'Training_Phase_1' | 'Training_Phase_2' | 'Placed' | 'Dropped';
export type IncomeBracket = 'BPL' | 'Low_Income' | 'Middle_Income';

export interface Student {
  id: string;
  name: string;
  district: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  family_income: IncomeBracket;
  status: StudentStatus;
  placement_salary?: number;
  funded_by_fund_id?: string; // Link specific student to a CSR fund for transparency
}

// Analytics Types
export interface DashboardStats {
  total_funds: number;
  utilization_rate: number;
  total_students: number;
  placement_rate: number;
  avg_salary: number;
  migration_prevented: number;
}
