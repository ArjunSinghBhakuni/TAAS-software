
export type UserRole = 'CSR_PARTNER' | 'GOVT_OFFICER' | 'INTERNAL_ADMIN' | 'SYSTEM_ROOT' | 'ORG_ADMIN';

export interface User {
  user_id: string;
  name: string;
  email: string;
  role: UserRole;
  org_id: string;
  avatar?: string;
  scope?: { district: string };
}

// --- CSR / FINANCIAL TYPES ---

export interface FinancialMetric {
  category: 'Stipends' | 'Training_Cost' | 'CAPEX' | 'Admin_Overhead';
  budget_allocated: number;
  amount_utilized: number;
  compliance_status: 'Compliant' | 'At_Risk' | 'Breach';
  notes: string;
}

export interface CSRImpactMetric {
  cohort_id: string;
  total_investment: number;
  students_placed: number; // Target 36-40
  avg_starting_salary: number; // Target 20k-50k
  roi_multiple: number; // e.g., 3.5x
  brsr_report_url?: string;
}

// --- GOVERNMENT / MACRO TYPES ---

export interface MigrationMetric {
  district: string;
  families_stabilized: number;
  new_rural_income_generated: number; // Target 60-70L
  reverse_migration_count: number;
}

export interface SDGAlignment {
  goal_id: string; // e.g., SDG-8
  description: string;
  progress: number; // 0-100
  status: 'On Track' | 'Lagging';
}

export interface CredentialStatus {
  platform: 'Skill India' | 'DigiLocker' | 'NULM';
  status: 'Live' | 'Pending' | 'Error';
  last_synced: string;
}

// --- ADMIN / OPERATIONS TYPES ---

export interface Student {
  id: string;
  name: string; // Internal only
  masked_id: string; // For AI/External
  phase: 'Phase 1 (Foundation)' | 'Phase 2 (Specialization)' | 'Phase 3 (Placement)';
  attendance_rate: number;
  stipend_status: 'Disbursed' | 'Pending' | 'Hold';
  aptitude_tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  risk_level: 'Low' | 'Medium' | 'High'; // Dropout risk
  risk_factors?: string[];
}

export interface RiskAlert {
  id: string;
  type: 'FINANCIAL' | 'SLA_BREACH' | 'ATTRITION';
  severity: 'CRITICAL' | 'WARNING';
  message: string;
  action_required: string;
}

export interface EdTechSLA {
  partner_name: string;
  placement_guarantee_percent: number;
  current_placement_rate: number;
  penalty_clause_active: boolean;
}

// --- NEW TYPES FOR MISSING MODULES ---

export interface ProjectBrief {
  title: string;
  estimated_budget: { confidence: number; value: number; currency: string };
  priority: 'high' | 'medium' | 'low';
  summary: string;
  timeline: { duration_days: number; start_by: string };
  deliverables: string[];
  skills_required: string[];
}

export interface EmployeeProfile {
  person_id: string;
  name: string;
  avatar: string;
  role: string;
  skills: { skill: string; level?: string }[];
}

export interface TeamRecommendation {
  overall_match_score: number;
  suggested_team: { person_id: string; role: string; match: number }[];
  explainability: string;
  risks: string[];
  suggested_mitigations: string[];
}

export interface SkillGapReport {
  team_gap_report: {
    person_id: string;
    missing: string[];
    recommended_microcourses: { id: string; title: string }[];
  }[];
}

export interface ProjectPlan {
  project_plan_id: string;
  milestones: {
    id: string;
    title: string;
    due: string;
    tasks: {
      id: string;
      assignee_id: string;
      title: string;
      est_hours: number;
      due_date: string;
      status: 'completed' | 'in-progress' | 'pending';
    }[];
  }[];
}

export interface MonitoringReport {
  project_health: 'green' | 'amber' | 'red';
  alerts: { message: string; ticket_id: string }[];
  task_status: {
    task_id: string;
    status: string;
    quality_score: number;
    authenticity_score: number;
    checks: string[];
  }[];
}

export interface LMSAssessment {
  score: number;
  feedback: string;
  demo_snippets?: { time: string; note: string }[];
  next_recommendation: { title: string };
}

export interface DailySummary {
  daily_summary: string;
  hours_logged: number;
  suggested_next_steps: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor_id: string;
  action: string;
  resource: string;
  details: string;
}

// --- VIEW NAVIGATION ---
export enum AppView {
  DASHBOARD = 'DASHBOARD', // Dynamic based on role
  STUDENT_TRACKER = 'STUDENT_TRACKER',
  FINANCIAL_AUDIT = 'FINANCIAL_AUDIT',
  GOV_COMPLIANCE = 'GOV_COMPLIANCE',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS'
}
