
import React, { useState, useMemo } from 'react';
import { Fund, Student, Expense, FundSource, FundPurpose, StudentStatus, IncomeBracket } from '../types';
import { MOCK_FUNDS, MOCK_STUDENTS, MOCK_EXPENSES } from '../services/mockData';
import { generateESGReport } from '../services/geminiService'; // We will reuse this service but with a different prompt context
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { Wallet, Users, Receipt, Plus, Search, FileText, Trash2, TrendingUp, BrainCircuit, Download, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { GoogleGenAI } from "@google/genai";

// --- COLORS ---
const COLORS = ['#0d9488', '#f59e0b', '#6366f1', '#ec4899', '#10b981'];

const AdminDashboard: React.FC = () => {
  // --- STATE MANAGEMENT (The "Real" Feel) ---
  const [funds, setFunds] = useState<Fund[]>(MOCK_FUNDS);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FUNDS' | 'STUDENTS' | 'EXPENSES' | 'REPORTS'>('OVERVIEW');

  // --- MODAL STATE ---
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // --- REPORTING STATE ---
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- DYNAMIC CALCULATIONS ---
  // Calculate utilized amount per fund dynamically based on expenses
  const fundsWithDynamicUtilization = useMemo(() => {
    return funds.map(fund => {
      const fundExpenses = expenses.filter(e => e.fund_id === fund.id);
      const utilized = fundExpenses.reduce((sum, e) => sum + e.amount, 0);
      return { ...fund, amount_utilized: utilized };
    });
  }, [funds, expenses]);

  const totalFunds = fundsWithDynamicUtilization.reduce((acc, f) => acc + f.amount_sanctioned, 0);
  const totalUtilized = fundsWithDynamicUtilization.reduce((acc, f) => acc + f.amount_utilized, 0);
  const utilizationRate = totalFunds > 0 ? (totalUtilized / totalFunds) * 100 : 0;
  const placedStudents = students.filter(s => s.status === 'Placed').length;
  
  // Chart Data
  const sourceDistData = useMemo(() => {
    const csr = fundsWithDynamicUtilization.filter(f => f.source === 'CSR').reduce((a, b) => a + b.amount_sanctioned, 0);
    const govt = fundsWithDynamicUtilization.filter(f => f.source === 'GOVT').reduce((a, b) => a + b.amount_sanctioned, 0);
    return [
      { name: 'CSR Funds', value: csr },
      { name: 'Govt Grants', value: govt }
    ];
  }, [fundsWithDynamicUtilization]);

  // --- ACTIONS ---

  const handleAddFund = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newFund: Fund = {
      id: `f${Date.now()}`,
      source: formData.get('source') as FundSource,
      donor_name: formData.get('donor_name') as string,
      amount_sanctioned: Number(formData.get('amount')),
      amount_utilized: 0, // Starts at 0
      purpose_tags: [formData.get('purpose') as FundPurpose],
      start_date: new Date().toISOString().split('T')[0],
      end_date: '2025-12-31',
      status: 'Active'
    };
    setFunds([...funds, newFund]);
    setIsFundModalOpen(false);
  };

  const handleAddStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStudent: Student = {
      id: `s${Date.now()}`,
      name: formData.get('name') as string,
      district: formData.get('district') as string,
      age: Number(formData.get('age')),
      gender: formData.get('gender') as 'Male' | 'Female' | 'Other',
      family_income: formData.get('income') as IncomeBracket,
      status: 'Enrolled',
      funded_by_fund_id: formData.get('fund_id') as string || undefined
    };
    setStudents([...students, newStudent]);
    setIsStudentModalOpen(false);
  };

  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newExpense: Expense = {
      id: `e${Date.now()}`,
      fund_id: formData.get('fund_id') as string,
      category: formData.get('category') as FundPurpose,
      amount: Number(formData.get('amount')),
      date: new Date().toISOString().split('T')[0],
      description: formData.get('description') as string,
      proof_url: '#'
    };
    setExpenses([newExpense, ...expenses]); // Add to top
    setIsExpenseModalOpen(false);
  };

  const generateAdminReport = async () => {
    if (!process.env.API_KEY) {
      alert("API Key missing");
      return;
    }
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-2.5-flash';
      const prompt = `
        Act as a Senior Financial Auditor for an NGO.
        Analyze the following raw data and provide an "Operational Efficiency Report".
        
        Data:
        - Funds: ${JSON.stringify(fundsWithDynamicUtilization.map(f => ({ donor: f.donor_name, total: f.amount_sanctioned, used: f.amount_utilized })))}
        - Students: ${JSON.stringify({ total: students.length, placed: placedStudents, districts: [...new Set(students.map(s => s.district))] })}
        - Expenses Recent: ${JSON.stringify(expenses.slice(0, 5))}

        Output Sections (Use Markdown):
        1. **Executive Summary**: 2 sentences on overall health.
        2. **Burn Rate Analysis**: Are we spending too fast or too slow?
        3. **Cost Per Impact**: Estimate cost per student based on utilization.
        4. **Recommendations**: 3 bullet points for the Admin.
      `;

      const result = await ai.models.generateContent({ model, contents: prompt });
      setAiReport(result.text || "Failed to generate report.");
    } catch (e) {
      console.error(e);
      setAiReport("Error connecting to AI service.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* --- TABS --- */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
        {['OVERVIEW', 'FUNDS', 'STUDENTS', 'EXPENSES', 'REPORTS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
              activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Funds Managed" value={`₹${(totalFunds / 100000).toFixed(1)}L`} icon={Wallet} color="teal" />
            <StatCard title="Overall Utilization" value={`${utilizationRate.toFixed(1)}%`} icon={Receipt} color="blue" />
            <StatCard title="Active Students" value={students.length} icon={Users} color="indigo" />
            <StatCard title="Placements" value={placedStudents} subtext="Avg Salary: ₹28k" icon={FileText} color="amber" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Fund Source Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sourceDistData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                      {sourceDistData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value: number) => `₹${(value / 100000).toFixed(1)}L`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-slate-800">Recent Expenses</h3>
                 <button onClick={() => setActiveTab('EXPENSES')} className="text-xs text-teal-600 font-bold hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                 {expenses.slice(0, 4).map(exp => (
                   <div key={exp.id} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0">
                      <div className="p-2 bg-slate-100 rounded text-slate-500"><Receipt size={14} /></div>
                      <div>
                         <p className="text-sm text-slate-800 font-medium">{exp.description}</p>
                         <p className="text-xs text-slate-400">{exp.date} • ₹{exp.amount.toLocaleString()}</p>
                      </div>
                   </div>
                 ))}
                 {expenses.length === 0 && <p className="text-slate-400 text-sm">No expenses logged yet.</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FUNDS TAB --- */}
      {activeTab === 'FUNDS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-700">Managed Funds</h3>
            <button onClick={() => setIsFundModalOpen(true)} className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800">
               <Plus size={16} /> Add Fund
            </button>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
               <tr>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Donor</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Real-time Utilization</th>
                  <th className="px-6 py-4">Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {fundsWithDynamicUtilization.map(fund => (
                 <tr key={fund.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                       <span className={`text-xs font-bold px-2 py-1 rounded border ${fund.source === 'CSR' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {fund.source}
                       </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{fund.donor_name}</td>
                    <td className="px-6 py-4 text-slate-600">₹{(fund.amount_sanctioned / 100000).toFixed(2)} Lakhs</td>
                    <td className="px-6 py-4">
                       <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
                          <div className={`h-full ${fund.amount_utilized > fund.amount_sanctioned ? 'bg-red-500' : 'bg-teal-500'}`} 
                               style={{ width: `${Math.min((fund.amount_utilized / fund.amount_sanctioned) * 100, 100)}%` }}></div>
                       </div>
                       <div className="flex justify-between text-[10px] text-slate-500 w-32">
                          <span>{((fund.amount_utilized / fund.amount_sanctioned) * 100).toFixed(1)}%</span>
                          <span>₹{(fund.amount_utilized/1000).toFixed(0)}k Used</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">{fund.status}</span>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- STUDENTS TAB --- */}
      {activeTab === 'STUDENTS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-4">
               <h3 className="font-bold text-slate-700">Student Pipeline</h3>
               <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-500 font-bold">{students.length} Total</span>
            </div>
            <button onClick={() => setIsStudentModalOpen(true)} className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800">
               <Plus size={16} /> Register Student
            </button>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
               <tr>
                  <th className="px-6 py-4">Name / ID</th>
                  <th className="px-6 py-4">District</th>
                  <th className="px-6 py-4">Demographics</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Funded By</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {students.map(student => (
                 <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                       <p className="font-bold text-slate-900">{student.name}</p>
                       <p className="text-xs text-slate-400">ID: {student.id}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{student.district}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                       {student.age} yrs • {student.gender} • <span className="font-bold text-slate-700">{student.family_income.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`text-xs font-bold px-2 py-1 rounded-full 
                          ${student.status === 'Placed' ? 'bg-green-100 text-green-700' : 
                            student.status === 'Dropped' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                          {student.status.replace(/_/g, ' ')}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                       {funds.find(f => f.id === student.funded_by_fund_id)?.donor_name || 'Unassigned'}
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- EXPENSES TAB --- */}
      {activeTab === 'EXPENSES' && (
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-700">Expense Ledger</h3>
              <button onClick={() => setIsExpenseModalOpen(true)} className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800">
                 <Plus size={16} /> Log Expense
              </button>
            </div>
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                     <th className="px-6 py-4">Date</th>
                     <th className="px-6 py-4">Description</th>
                     <th className="px-6 py-4">Category</th>
                     <th className="px-6 py-4">Amount</th>
                     <th className="px-6 py-4">Fund Source</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {expenses.map(exp => (
                     <tr key={exp.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-500">{exp.date}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{exp.description}</td>
                        <td className="px-6 py-4">
                           <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">{exp.category}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800">₹{exp.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                           {funds.find(f => f.id === exp.fund_id)?.donor_name || 'Unknown Fund'}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      )}

      {/* --- REPORTS TAB --- */}
      {activeTab === 'REPORTS' && (
        <div className="animate-in fade-in">
           <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-8 text-white mb-8 shadow-lg">
              <div className="flex items-start justify-between">
                 <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                       <BrainCircuit className="text-teal-400" />
                       AI Operational Auditor
                    </h2>
                    <p className="text-indigo-200 max-w-2xl">
                       Generate a comprehensive analysis of burn rates, fund efficiency, and cost-per-impact using live data from your dashboard.
                    </p>
                 </div>
                 <button 
                    onClick={generateAdminReport}
                    disabled={isGenerating}
                    className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                 >
                    {isGenerating ? <TrendingUp className="animate-spin" /> : <FileText />}
                    {isGenerating ? 'Analyzing Data...' : 'Generate Audit Report'}
                 </button>
              </div>
           </div>

           {aiReport && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 animate-in slide-in-from-bottom-4">
                 <div className="prose prose-slate max-w-none">
                    <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Generated Executive Summary</h3>
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                       {aiReport}
                    </div>
                 </div>
                 <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <button className="text-slate-500 hover:text-slate-800 text-sm font-bold flex items-center gap-2">
                       <Download size={16} /> Export to PDF
                    </button>
                 </div>
              </div>
           )}
           
           {!aiReport && !isGenerating && (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                 <p className="text-slate-400">Click "Generate" to audit your current dashboard state.</p>
              </div>
           )}
        </div>
      )}

      {/* --- MODALS --- */}
      
      {/* 1. Add Fund Modal */}
      <Modal isOpen={isFundModalOpen} onClose={() => setIsFundModalOpen(false)} title="Add New Fund">
        <form onSubmit={handleAddFund} className="space-y-4">
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Donor / Organization Name</label>
             <input name="donor_name" required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="e.g. HDFC Parivartan" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Source Type</label>
                <select name="source" className="w-full p-2 border border-slate-300 rounded-lg outline-none">
                   <option value="CSR">CSR Corporate</option>
                   <option value="GOVT">Government Grant</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
                <input name="amount" type="number" required className="w-full p-2 border border-slate-300 rounded-lg outline-none" placeholder="5000000" />
             </div>
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Primary Purpose</label>
             <select name="purpose" className="w-full p-2 border border-slate-300 rounded-lg outline-none">
                <option value="Training">Training & Skilling</option>
                <option value="Stipend">Stipend Distribution</option>
                <option value="Devices">Device Procurement</option>
                <option value="Mentors">Mentor Salaries</option>
             </select>
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition mt-4">Create Fund</button>
        </form>
      </Modal>

      {/* 2. Add Student Modal */}
      <Modal isOpen={isStudentModalOpen} onClose={() => setIsStudentModalOpen(false)} title="Register New Student">
        <form onSubmit={handleAddStudent} className="space-y-4">
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
             <input name="name" required className="w-full p-2 border border-slate-300 rounded-lg outline-none" placeholder="e.g. Rahul Singh" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input name="age" type="number" required className="w-full p-2 border border-slate-300 rounded-lg outline-none" placeholder="22" />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select name="gender" className="w-full p-2 border border-slate-300 rounded-lg outline-none">
                   <option value="Male">Male</option>
                   <option value="Female">Female</option>
                   <option value="Other">Other</option>
                </select>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
                <input name="district" required className="w-full p-2 border border-slate-300 rounded-lg outline-none" placeholder="Almora" />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Income Bracket</label>
                <select name="income" className="w-full p-2 border border-slate-300 rounded-lg outline-none">
                   <option value="BPL">Below Poverty Line (BPL)</option>
                   <option value="Low_Income">Low Income</option>
                   <option value="Middle_Income">Middle Income</option>
                </select>
             </div>
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Link to Fund (Optional)</label>
             <select name="fund_id" className="w-full p-2 border border-slate-300 rounded-lg outline-none">
                <option value="">-- General / Unassigned --</option>
                {fundsWithDynamicUtilization.map(f => (
                   <option key={f.id} value={f.id}>{f.donor_name} (₹{(f.amount_sanctioned/100000).toFixed(1)}L)</option>
                ))}
             </select>
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition mt-4">Register Student</button>
        </form>
      </Modal>

      {/* 3. Log Expense Modal */}
      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Log New Expense">
        <form onSubmit={handleAddExpense} className="space-y-4">
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Select Fund to Debit</label>
             <select name="fund_id" required className="w-full p-2 border border-slate-300 rounded-lg outline-none">
                {fundsWithDynamicUtilization.map(f => (
                   <option key={f.id} value={f.id}>{f.donor_name} (Avail: ₹{((f.amount_sanctioned - f.amount_utilized)/1000).toFixed(0)}k)</option>
                ))}
             </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select name="category" className="w-full p-2 border border-slate-300 rounded-lg outline-none">
                   <option value="Training">Training</option>
                   <option value="Stipend">Stipend</option>
                   <option value="Devices">Devices</option>
                   <option value="Rent">Rent</option>
                   <option value="Mentors">Mentors</option>
                   <option value="Ops">Operations</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
                <input name="amount" type="number" required className="w-full p-2 border border-slate-300 rounded-lg outline-none" placeholder="10000" />
             </div>
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
             <textarea name="description" required rows={3} className="w-full p-2 border border-slate-300 rounded-lg outline-none" placeholder="e.g. Purchased 5 monitors for lab"></textarea>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
             <p className="text-xs text-amber-700">⚠️ This will immediately increase utilization % for the selected fund.</p>
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition mt-4">Confirm & Log Expense</button>
        </form>
      </Modal>

    </div>
  );
};

export default AdminDashboard;
