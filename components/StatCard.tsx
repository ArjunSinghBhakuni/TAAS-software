
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'teal' | 'blue' | 'indigo' | 'amber';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon: Icon, color = 'teal' }) => {
  const colorClasses = {
    teal: 'bg-teal-50 text-teal-600',
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatCard;
