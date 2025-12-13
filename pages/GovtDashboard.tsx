
import React from 'react';
import { MOCK_STUDENTS } from '../services/mockData';
import StatCard from '../components/StatCard';
import { Map, Activity, Users, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const GovtDashboard: React.FC = () => {
  const totalIncomeGenerated = MOCK_STUDENTS.reduce((acc, s) => acc + (s.placement_salary || 0), 0) * 12; // Annualized
  const districts = [...new Set(MOCK_STUDENTS.map(s => s.district))];
  
  const districtData = districts.map(d => ({
    name: d,
    count: MOCK_STUDENTS.filter(s => s.district === d).length,
    income: MOCK_STUDENTS.filter(s => s.district === d).reduce((acc, s) => acc + (s.placement_salary || 0), 0)
  }));

  return (
    <div className="space-y-8 animate-in fade-in">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Youth Skilled" value={MOCK_STUDENTS.length} icon={Users} color="blue" />
        <StatCard title="Migration Prevented" value={MOCK_STUDENTS.filter(s => s.status === 'Placed').length} subtext="Youth retained in Hill Districts" icon={Map} color="teal" />
        <StatCard title="New Rural Income (Annual)" value={`₹${(totalIncomeGenerated / 100000).toFixed(2)}L`} icon={Activity} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">District-wise Impact Heatmap</h3>
            <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtData} layout="vertical" margin={{ left: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fill: '#64748b' }} />
                     <Tooltip cursor={{fill: 'transparent'}} />
                     <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} name="Youth Count" />
                     <Bar dataKey="income" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} name="Monthly Income" />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Priority Alerts (Migration Hotspots)</h3>
            <div className="space-y-4">
               <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start justify-between">
                  <div>
                     <p className="font-bold text-red-800">Pauri Garhwal: High Youth Outflow</p>
                     <p className="text-sm text-red-600 mt-1">Migration rate increased by 5% this quarter. Recommended Action: Increase DDU-GKY allocation.</p>
                  </div>
                  <ArrowUpRight className="text-red-500" />
               </div>
               <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start justify-between">
                  <div>
                     <p className="font-bold text-amber-800">Almora: Skill Gap Identified</p>
                     <p className="text-sm text-amber-600 mt-1">High demand for digital marketing, low supply of trainers.</p>
                  </div>
                  <ArrowUpRight className="text-amber-500" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default GovtDashboard;
