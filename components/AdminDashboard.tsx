
import React, { useState } from 'react';
import { MOCK_STUDENTS, MOCK_ALERTS, MOCK_SLA } from '../services/mockData';
import { analyzeStudentAptitude } from '../services/geminiService';
import { Users, AlertTriangle, Wallet, GraduationCap, Search, Sparkles } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  const handleAIAnalysis = async (studentId: string) => {
    setAnalyzing(studentId);
    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    if(student) {
      await analyzeStudentAptitude(student, { logic: 85, comms: 72 }); // Mock scores
    }
    setAnalyzing(null);
    alert("Bias-Free Analysis Complete: Tier verified.");
  };

  return (
    <div className="h-full overflow-y-auto pb-12 pr-2">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Internal Admin (Engine A)</h2>
        <p className="text-slate-500 mt-1">Ops Center: Student Journey, Financial Risk & SLAs</p>
      </header>

      {/* Financial Survival Protocol */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg shadow-sm flex items-start justify-between">
         <div className="flex gap-3">
            <AlertTriangle className="text-red-600 shrink-0 mt-1" />
            <div>
               <h3 className="font-bold text-red-800">Financial Survival Protocol: WARNING</h3>
               <p className="text-sm text-red-700 mt-1">
                  Cash buffer for stipends is below 3 months (Currently 2.4 months). 
                  Release Tranche 2 immediately to prevent attrition.
               </p>
            </div>
         </div>
         <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700">
            View Cashflow
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Student Tracker (2/3 width) */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Users /> 9-Month Journey Tracker
               </h3>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input type="text" placeholder="Search trainee..." className="pl-9 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg" />
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
               <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                     <tr>
                        <th className="px-6 py-3">Student</th>
                        <th className="px-6 py-3">Phase</th>
                        <th className="px-6 py-3">Stipend</th>
                        <th className="px-6 py-3">Risk</th>
                        <th className="px-6 py-3">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {MOCK_STUDENTS.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50">
                           <td className="px-6 py-4 font-medium text-slate-900">{s.name}</td>
                           <td className="px-6 py-4">
                              <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{s.phase}</span>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold
                                 ${s.stipend_status === 'Disbursed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                 {s.stipend_status}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-1">
                                 <div className={`w-2 h-2 rounded-full ${s.risk_level === 'Low' ? 'bg-green-500' : s.risk_level === 'Medium' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                 {s.risk_level}
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <button 
                                onClick={() => handleAIAnalysis(s.id)}
                                disabled={analyzing === s.id}
                                className="text-teal-600 hover:text-teal-800 font-medium text-xs flex items-center gap-1"
                              >
                                 <Sparkles size={12} /> {analyzing === s.id ? 'Analyzing...' : 'AI Tier Check'}
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Right Sidebar: SLAs & Stats */}
         <div className="space-y-6">
            
            {/* EdTech SLA */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <GraduationCap size={18} /> EdTech SLA Monitor
               </h3>
               <div className="mb-4">
                  <p className="text-xs text-slate-500">Partner: {MOCK_SLA.partner_name}</p>
                  <div className="mt-2 flex justify-between items-end">
                     <div>
                        <p className="text-2xl font-bold text-slate-900">{MOCK_SLA.current_placement_rate}%</p>
                        <p className="text-xs text-slate-500">Current Placement Rate</p>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-bold text-red-600">{MOCK_SLA.placement_guarantee_percent}%</p>
                        <p className="text-xs text-slate-500">Guaranteed Min.</p>
                     </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 mt-2 rounded-full overflow-hidden">
                     <div className="bg-amber-500 h-full" style={{ width: `${MOCK_SLA.current_placement_rate}%` }}></div>
                  </div>
               </div>
               {MOCK_SLA.current_placement_rate < MOCK_SLA.placement_guarantee_percent && (
                  <div className="text-xs bg-red-50 text-red-700 p-2 rounded border border-red-100">
                     Warning: Penalty Clause 4.2 active. 110% Refund trigger risk.
                  </div>
               )}
            </div>

            {/* Money Management */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Wallet size={18} /> Stipend Management
               </h3>
               <p className="text-3xl font-bold text-slate-900">₹7.50L</p>
               <p className="text-xs text-slate-500 mb-4">Upcoming Monthly Disbursement (50 Trainees)</p>
               <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-slate-800">
                  Approve Batch Transfer
               </button>
            </div>

         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
