
import { User, Fund, Student, Expense } from '../types';

// --- USERS ---
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Amit Negi', email: 'admin@workfrompahad.org', role: 'SUPER_ADMIN', organization: 'WorkFromPahad Foundation', avatar: 'https://ui-avatars.com/api/?name=Amit+Negi&background=0d9488&color=fff' },
  { id: 'u2', name: 'Priya Mehta', email: 'priya@techcorp.com', role: 'CSR_USER', organization: 'TechCorp Foundation', avatar: 'https://ui-avatars.com/api/?name=Priya+Mehta&background=6366f1&color=fff' },
  { id: 'u3', name: 'Rajesh Singh', email: 'rajesh@gov.uk', role: 'GOVT_USER', organization: 'Uttarakhand Rural Mission', avatar: 'https://ui-avatars.com/api/?name=Rajesh+Singh&background=f59e0b&color=fff' },
];

// --- FUNDS ---
export const MOCK_FUNDS: Fund[] = [
  {
    id: 'f1',
    source: 'CSR',
    donor_name: 'TechCorp Foundation',
    amount_sanctioned: 5000000, // 50 Lakhs
    amount_utilized: 2200000,
    purpose_tags: ['Training', 'Devices', 'Mentors'],
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'Active'
  },
  {
    id: 'f2',
    source: 'GOVT',
    donor_name: 'State Rural Mission (DDU-GKY)',
    amount_sanctioned: 1500000, // 15 Lakhs
    amount_utilized: 1500000,
    purpose_tags: ['Stipend'],
    start_date: '2024-02-01',
    end_date: '2024-10-01',
    status: 'Depleted'
  },
  {
    id: 'f3',
    source: 'CSR',
    donor_name: 'Global Impact Fund',
    amount_sanctioned: 7500000,
    amount_utilized: 100000,
    purpose_tags: ['Training', 'Ops'],
    start_date: '2024-04-01',
    end_date: '2025-03-31',
    status: 'Active'
  }
];

// --- STUDENTS ---
export const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'Rohan Rawat', district: 'Almora', age: 22, gender: 'Male', family_income: 'BPL', status: 'Placed', placement_salary: 28000, funded_by_fund_id: 'f1' },
  { id: 's2', name: 'Kavita Devi', district: 'Pauri', age: 20, gender: 'Female', family_income: 'Low_Income', status: 'Training_Phase_2', funded_by_fund_id: 'f1' },
  { id: 's3', name: 'Suraj Panwar', district: 'Tehri', age: 24, gender: 'Male', family_income: 'BPL', status: 'Placed', placement_salary: 35000, funded_by_fund_id: 'f3' },
  { id: 's4', name: 'Anjali Bisht', district: 'Almora', age: 19, gender: 'Female', family_income: 'BPL', status: 'Enrolled', funded_by_fund_id: 'f2' },
  { id: 's5', name: 'Vikram Singh', district: 'Chamoli', age: 23, gender: 'Male', family_income: 'Middle_Income', status: 'Dropped', funded_by_fund_id: 'f1' },
  // Generate more dummy data logic could go here, keeping it simple for V1
];

// --- EXPENSES ---
export const MOCK_EXPENSES: Expense[] = [
  { id: 'e1', fund_id: 'f1', category: 'Devices', amount: 1250000, date: '2024-01-15', description: 'Procurement of 25 Mac Minis', proof_url: '#' },
  { id: 'e2', fund_id: 'f2', category: 'Stipend', amount: 750000, date: '2024-03-01', description: 'Batch A Stipend - March', proof_url: '#' },
  { id: 'e3', fund_id: 'f1', category: 'Mentors', amount: 200000, date: '2024-02-28', description: 'Trainer Salaries Feb', proof_url: '#' },
  { id: 'e4', fund_id: 'f1', category: 'Training', amount: 50000, date: '2024-02-10', description: 'LMS License Fees', proof_url: '#' },
];

// --- DASHBOARD ANALYTICS MOCK DATA ---
export const MOCK_FINANCIALS = [
  { category: 'Training', amount_utilized: 500000 },
  { category: 'Stipend', amount_utilized: 1500000 },
  { category: 'Devices', amount_utilized: 1250000 },
  { category: 'Mentors', amount_utilized: 200000 },
  { category: 'Ops', amount_utilized: 100000 },
];

export const MOCK_CSR_IMPACT = {
  total_investment: 14000000,
  students_placed: 42,
  avg_starting_salary: 28000,
  roi_multiple: 3.2,
};

export const MOCK_MIGRATION = [
  { district: 'Pauri', new_rural_income_generated: 2500000, families_stabilized: 45 },
  { district: 'Almora', new_rural_income_generated: 1800000, families_stabilized: 30 },
  { district: 'Tehri', new_rural_income_generated: 1200000, families_stabilized: 20 },
];

export const MOCK_CREDENTIALS = [
  { platform: 'DigiLocker', status: 'Live', last_synced: '2024-03-10' },
  { platform: 'SkillIndia', status: 'Live', last_synced: '2024-03-12' },
  { platform: 'StateRegistry', status: 'Pending', last_synced: '2024-02-28' },
];
