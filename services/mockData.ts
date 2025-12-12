
import { FinancialMetric, CSRImpactMetric, MigrationMetric, Student, RiskAlert, EdTechSLA, CredentialStatus, User, EmployeeProfile, AuditLog } from '../types';

// --- USERS ---
export const MOCK_USERS: User[] = [
  { user_id: 'u1', name: 'Priya Mehta', email: 'priya@corp-csr.com', role: 'CSR_PARTNER', org_id: 'TechCorp_Foundation' },
  { user_id: 'u2', name: 'Rajesh Singh', email: 'rajesh.gov@uk.gov.in', role: 'GOVT_OFFICER', org_id: 'State_Rural_Mission' },
  { user_id: 'u3', name: 'Amit Negi', email: 'amit@pahad.org', role: 'INTERNAL_ADMIN', org_id: 'WorkFromPahad' },
  { user_id: 'u4', name: 'System Root', email: 'root@taas.org', role: 'SYSTEM_ROOT', org_id: 'TaaS_System' },
];

// --- CSR DATA ---
export const MOCK_FINANCIALS: FinancialMetric[] = [
  { category: 'Stipends', budget_allocated: 6750000, amount_utilized: 2250000, compliance_status: 'Compliant', notes: 'Direct Benefit Transfer (DBT) to 50 trainees' },
  { category: 'Training_Cost', budget_allocated: 4000000, amount_utilized: 1500000, compliance_status: 'Compliant', notes: 'Paid to EdTech Partners' },
  { category: 'CAPEX', budget_allocated: 2500000, amount_utilized: 2400000, compliance_status: 'Compliant', notes: 'Asset Tagged: 50 Mac Minis' },
  { category: 'Admin_Overhead', budget_allocated: 500000, amount_utilized: 120000, compliance_status: 'Compliant', notes: 'Within 5% Cap' },
];

export const MOCK_CSR_IMPACT: CSRImpactMetric = {
  cohort_id: 'WFP-2025-BatchA',
  total_investment: 14000000,
  students_placed: 38, // Target 36-40
  avg_starting_salary: 28000,
  roi_multiple: 4.2,
};

// --- GOVT DATA ---
export const MOCK_MIGRATION: MigrationMetric[] = [
  { district: 'Pauri Garhwal', families_stabilized: 22, new_rural_income_generated: 2800000, reverse_migration_count: 15 },
  { district: 'Almora', families_stabilized: 18, new_rural_income_generated: 2100000, reverse_migration_count: 12 },
];

export const MOCK_CREDENTIALS: CredentialStatus[] = [
  { platform: 'Skill India', status: 'Live', last_synced: '2025-02-28T10:00:00Z' },
  { platform: 'DigiLocker', status: 'Pending', last_synced: '2025-02-27T14:30:00Z' },
];

// --- ADMIN DATA ---
export const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'Rohan Rawat', masked_id: 'WFP-S-8821', phase: 'Phase 2 (Specialization)', attendance_rate: 98, stipend_status: 'Disbursed', aptitude_tier: 'Tier 1', risk_level: 'Low' },
  { id: 's2', name: 'Kavita Devi', masked_id: 'WFP-S-9912', phase: 'Phase 2 (Specialization)', attendance_rate: 82, stipend_status: 'Pending', aptitude_tier: 'Tier 2', risk_level: 'Medium', risk_factors: ['Attendance Drop', 'Remote Connectivity'] },
  { id: 's3', name: 'Suraj Panwar', masked_id: 'WFP-S-1102', phase: 'Phase 1 (Foundation)', attendance_rate: 65, stipend_status: 'Hold', aptitude_tier: 'Tier 3', risk_level: 'High', risk_factors: ['Assessment Fail', 'SLA Breach Risk'] },
];

export const MOCK_ALERTS: RiskAlert[] = [
  { id: 'a1', type: 'FINANCIAL', severity: 'CRITICAL', message: 'Cash Buffer < 3 Months', action_required: 'Release Tranche 2 immediately to prevent stipend freeze.' },
  { id: 'a2', type: 'SLA_BREACH', severity: 'WARNING', message: 'EdTech Partner Placement Rate Dip', action_required: 'Trigger Warning Letter as per Clause 4.2' },
];

export const MOCK_SLA: EdTechSLA = {
  partner_name: 'CodeMountain Academy',
  placement_guarantee_percent: 80,
  current_placement_rate: 76,
  penalty_clause_active: false
};

// --- EMPLOYEES (New) ---
export const MOCK_EMPLOYEES: EmployeeProfile[] = [
  { person_id: 'e1', name: 'Vikram Seth', avatar: 'https://i.pravatar.cc/150?u=e1', role: 'Full Stack Dev', skills: [{ skill: 'React' }, { skill: 'Node.js' }] },
  { person_id: 'e2', name: 'Anjali Sharma', avatar: 'https://i.pravatar.cc/150?u=e2', role: 'UI/UX Designer', skills: [{ skill: 'Figma' }, { skill: 'Tailwind' }] },
  { person_id: 'e3', name: 'Kabir Das', avatar: 'https://i.pravatar.cc/150?u=e3', role: 'Backend Engineer', skills: [{ skill: 'Python' }, { skill: 'PostgreSQL' }] },
];

// --- AUDIT LOGS (New) ---
export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'log1', timestamp: '2025-02-28T09:15:00Z', actor_id: 'u3', action: 'UPDATE', resource: 'Student_s2', details: 'Changed Risk Level to Medium' },
  { id: 'log2', timestamp: '2025-02-28T08:30:00Z', actor_id: 'u1', action: 'VIEW', resource: 'Financial_Dashboard', details: 'Generated BRSR Report' },
];
