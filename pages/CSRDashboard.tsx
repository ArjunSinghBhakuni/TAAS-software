
import React, { useState } from 'react';
import { MOCK_FUNDS, MOCK_STUDENTS, MOCK_CSR_IMPACT, MOCK_FINANCIALS } from '../services/mockData';
import { generateESGReport } from '../services/geminiService';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, FileText, CheckCircle, TrendingUp, IndianRupee, Info } from 'lucide-react';
import StatCard from '../components/StatCard';

const COLORS = ['#0d9488', '#0ea5e9', '#8b5cf6', '#f59e0b'];

const CSRDashboard: React.FC = () => {
  const [reportText, setReportText] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showRoiInfo, setShowRoiInfo] = useState(false);

  // Filter for TechCorp (Mocked as the logged in user's org)
  const myFunds = MOCK_FUNDS.filter(f => f.donor_name.includes('TechCorp'));
  
  const totalInvestment = MOCK_CSR_IMPACT.total_investment;
  const totalUtilized = myFunds.reduce((acc, f) => acc + f.amount_utilized, 0);
  
  // Dynamic S-ROI Calculation
  // Formula: (Annual Income of Placed Students * 3 Years) / Total Investment
  const annualIncomeGenerated = MOCK_CSR_IMPACT.students_placed * MOCK_CSR_IMPACT.avg_starting_salary * 12;
  const projectedEconomicValue = annualIncomeGenerated * 3; // 3-Year Horizon
  const dynamicROI = (projectedEconomicValue / totalInvestment).toFixed(1);

  const PIE_DATA = [
    { name: 'Utilized', value: totalUtilized },
    { name: 'Remaining', value: totalInvestment - totalUtilized }
  ];

  const handleGenerateReport = async () => {
    setGenerating(true);
    const text = await generateESGReport(MOCK_CSR_IMPACT, MOCK_FINANCIALS); // Ensure MOCK_FINANCIALS is imported if used, otherwise use local data
    setReportText(text);
    setGenerating(false);
  };

  return (
    <div className="h-full overflow-y-auto pb-12 pr-2">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Corporate Partner Dashboard</h2>
          <p className="text-slate-500 mt-1">Real-time Fund Utilization & SEBI BRSR Compliance</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
             <CheckCircle size={16} />
             SEBI Compliant
          </div>
        </div>
      </header>

      {/* ROI & Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Investment</p>
            <p className="text-2xl font-bold text-slate-900 mt-2 flex items-center">
              <IndianRupee size={20} /> {(totalInvestment / 100000).toFixed(1)} Lakhs
            </p>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Rate</p>
            <p className="text-2xl font-bold text-teal-600 mt-2">
               {MOCK_CSR_IMPACT.students_placed} / 50 <span className="text-sm text-slate-400 font-normal">Students</span>
            </p>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Start Salary</p>
            <p className="text-2xl font-bold text-slate-900 mt-2 flex items-center">
               <IndianRupee size={20} /> {MOCK_CSR_IMPACT.avg_starting_salary.toLocaleString()}
            </p>
         </div>
         
         {/* Dynamic S-ROI Card */}
         <div 
            className="relative bg-white p-6 rounded-xl border border-slate-200 shadow-sm bg-gradient-to-br from-white to-teal-50 cursor-help group"
            onMouseEnter={() => setShowRoiInfo(true)}
            onMouseLeave={() => setShowRoiInfo(false)}
         >
            <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Social ROI (3-Yr)</p>
                <Info size={14} className="text-teal-400" />
            </div>
            <p className="text-2xl font-bold text-teal-700 mt-2 flex items-center gap-2">
               <TrendingUp size={24} /> {dynamicROI}x
            </p>
            <p className="text-[10px] text-slate-500 mt-1">Economic Value Generated</p>

            {/* Hover Tooltip for Calculation */}
            {showRoiInfo && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl z-20">
                    <p className="font-bold mb-2 border-b border-slate-700 pb-1">Calculation Logic</p>
                    <div className="space-y-1">
                        <div className="flex justify-between"><span>Annual Income:</span> <span>₹{(annualIncomeGenerated/100000).toFixed(2)}L</span></div>
                        <div className="flex justify-between"><span>Horizon:</span> <span>3 Years</span></div>
                        <div className="flex justify-between border-t border-slate-700 pt-1 text-teal-300">
                            <span>Projected Value:</span> <span>₹{(projectedEconomicValue/100000).toFixed(2)}L</span>
                        </div>
                        <div className="mt-2 text-[10px] text-slate-400 italic">
                            Formula: (Annual Income × 3) / Investment
                        </div>
                    </div>
                </div>
            )}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Financial Transparency Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px] flex flex-col">
           <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-800">Fund Utilization Audit</h3>
              <p className="text-xs text-slate-500">Strict adherence to Schedule VII. Admin overhead capped at 5%.</p>
           </div>
           <div className="flex-1 flex">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MOCK_FINANCIALS}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="amount_utilized"
                    >
                      {MOCK_FINANCIALS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `₹${(value / 100000).toFixed(2)}L`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 flex flex-col justify-center space-y-3">
                 {MOCK_FINANCIALS.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                          <span className="text-slate-600">{item.category}</span>
                       </div>
                       <span className="font-bold text-slate-900">
                          ₹{(item.amount_utilized / 100000).toFixed(2)}L
                       </span>
                    </div>
                 ))}
                 <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-green-600 text-xs font-bold bg-green-50 p-2 rounded">
                       <CheckCircle size={14} /> 100% of Stipends Disbursed Directly
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Regulatory Reporting Module */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px] flex flex-col">
           <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-800">ESG / BRSR Reporting</h3>
              <p className="text-xs text-slate-500">AI-generated narratives for Annual Reports.</p>
           </div>
           
           <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-100 overflow-y-auto mb-4">
              {generating ? (
                 <div className="flex items-center justify-center h-full text-slate-400 gap-2">
                    <span className="animate-spin">⏳</span> Generating Compliance Narrative...
                 </div>
              ) : reportText ? (
                 <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{reportText}</p>
              ) : (
                 <p className="text-sm text-slate-400 italic text-center mt-10">Click generate to create SEBI-aligned text.</p>
              )}
           </div>

           <button 
             onClick={handleGenerateReport}
             disabled={generating}
             className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2"
           >
             <FileText size={18} />
             Generate BRSR Narrative
           </button>
        </div>
      </div>
    </div>
  );
};

export default CSRDashboard;
