
import React from 'react';
import { MOCK_MIGRATION, MOCK_CREDENTIALS } from '../services/mockData';
import { Map, Users, TrendingUp, ShieldCheck, ExternalLink, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const GovtDashboard: React.FC = () => {
  const totalIncome = MOCK_MIGRATION.reduce((acc, curr) => acc + curr.new_rural_income_generated, 0);
  const totalFamilies = MOCK_MIGRATION.reduce((acc, curr) => acc + curr.families_stabilized, 0);

  return (
    <div className="h-full overflow-y-auto pb-12 pr-2">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Government Partner Dashboard</h2>
        <p className="text-slate-500 mt-1">Migration Prevention & National Goal Alignment</p>
      </header>

      {/* Migration Prevention Metrics (MPM) */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10"><Map size={200} /></div>
         
         <div className="relative z-10">
            <h3 className="text-xl font-bold text-teal-400 mb-6 flex items-center gap-2">
               <Activity /> Migration Prevention Metric (MPM)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div>
                  <p className="text-slate-400 text-sm uppercase tracking-wider font-bold">New Rural Income</p>
                  <p className="text-4xl font-bold mt-2">₹{(totalIncome / 100000).toFixed(1)} Lakhs</p>
                  <p className="text-green-400 text-xs mt-1">Annual Recurring</p>
               </div>
               <div>
                  <p className="text-slate-400 text-sm uppercase tracking-wider font-bold">Families Stabilized</p>
                  <p className="text-4xl font-bold mt-2">{totalFamilies}</p>
                  <p className="text-slate-400 text-xs mt-1">Prevented from migrating to slums</p>
               </div>
               <div>
                  <p className="text-slate-400 text-sm uppercase tracking-wider font-bold">Hill Districts Active</p>
                  <p className="text-4xl font-bold mt-2">{MOCK_MIGRATION.length}</p>
                  <div className="flex gap-2 mt-2">
                     {MOCK_MIGRATION.map(m => (
                        <span key={m.district} className="px-2 py-0.5 bg-white/10 rounded text-xs">{m.district}</span>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* District Breakdown */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Income Generation by District</h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_MIGRATION} layout="vertical">
                     <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                     <XAxis type="number" hide />
                     <YAxis dataKey="district" type="category" width={100} tick={{fontSize: 12}} />
                     <Tooltip cursor={{fill: 'transparent'}} />
                     <Bar dataKey="new_rural_income_generated" fill="#0d9488" radius={[0, 4, 4, 0]} barSize={30} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* National Credentials Status */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
               <ShieldCheck className="text-teal-600" />
               Credential Verification Status
            </h3>
            
            <div className="space-y-4">
               {MOCK_CREDENTIALS.map((cred, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50">
                     <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${cred.status === 'Live' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                        <div>
                           <p className="font-bold text-slate-900">{cred.platform}</p>
                           <p className="text-xs text-slate-500">Last Synced: {new Date(cred.last_synced).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold
                           ${cred.status === 'Live' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                           {cred.status}
                        </span>
                        <ExternalLink size={16} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                     </div>
                  </div>
               ))}
               
               <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">SDG Alignment</p>
                  <div className="flex gap-2 mt-2">
                     <span className="px-2 py-1 bg-white border border-blue-200 rounded text-xs font-bold text-blue-600">SDG 1: No Poverty</span>
                     <span className="px-2 py-1 bg-white border-blue-200 rounded text-xs font-bold text-blue-600">SDG 8: Decent Work</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default GovtDashboard;
