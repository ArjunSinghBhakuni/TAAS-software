
import React from 'react';
import { LayoutDashboard, PieChart, Users, ShieldCheck, FileText, AlertTriangle, LogOut, Landmark } from 'lucide-react';
import { AppView, UserRole } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  currentUserRole: UserRole;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, currentUserRole, onLogout }) => {
  
  const getMenuItems = () => {
    const items = [];

    // CSR PARTNER VIEW
    if (currentUserRole === 'CSR_PARTNER' || currentUserRole === 'SYSTEM_ROOT') {
      items.push({ id: AppView.DASHBOARD, label: 'TaaS Dashboard', icon: LayoutDashboard });
      items.push({ id: AppView.FINANCIAL_AUDIT, label: 'Fund Utilization', icon: PieChart });
      items.push({ id: AppView.REPORTS, label: 'ESG / BRSR Reports', icon: FileText });
    }

    // GOVERNMENT VIEW
    if (currentUserRole === 'GOVT_OFFICER' || currentUserRole === 'SYSTEM_ROOT') {
      if (!items.find(i => i.id === AppView.DASHBOARD)) items.push({ id: AppView.DASHBOARD, label: 'Impact Dashboard', icon: LayoutDashboard });
      items.push({ id: AppView.GOV_COMPLIANCE, label: 'National Alignment', icon: Landmark });
    }

    // INTERNAL ADMIN VIEW
    if (currentUserRole === 'INTERNAL_ADMIN' || currentUserRole === 'SYSTEM_ROOT') {
      if (!items.find(i => i.id === AppView.DASHBOARD)) items.push({ id: AppView.DASHBOARD, label: 'Ops Center', icon: LayoutDashboard });
      items.push({ id: AppView.STUDENT_TRACKER, label: 'Student Journey', icon: Users });
      items.push({ id: AppView.SETTINGS, label: 'Risk & SLA', icon: AlertTriangle });
    }

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-xl z-20 shrink-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldCheck className="text-teal-500" />
          TaaS Platform
        </h1>
        <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-widest">Transparency as a Service</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="mb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Module Access</div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
              ${currentView === item.id 
                ? 'bg-teal-600 text-white shadow-md' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <item.icon size={18} className={currentView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-3 mb-4">
           <p className="text-xs text-slate-400 mb-1">Engine B License</p>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span className="text-xs font-bold text-white">Active (Enterprise)</span>
           </div>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2 text-red-300 hover:text-white hover:bg-red-900/20 rounded w-full text-sm transition-colors"
        >
          <LogOut size={18} />
          <span>Secure Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
