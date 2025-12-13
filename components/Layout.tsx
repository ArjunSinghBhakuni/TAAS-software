
import React from 'react';
import { User } from '../types';
import { LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-teal-400 mb-1">
            <ShieldCheck size={24} />
            <span className="font-bold text-lg tracking-tight">TaaS Platform</span>
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Transparency as a Service</p>
        </div>

        <div className="flex-1 p-6">
          <div className="mb-8">
            <p className="text-xs font-bold text-slate-500 uppercase mb-4">Current Profile</p>
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-slate-600" />
              <div>
                <p className="text-sm font-bold text-slate-200">{user.name}</p>
                <p className="text-xs text-slate-400">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="mt-2 inline-block px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-300 border border-slate-700">
              {user.organization}
            </div>
          </div>

          <nav className="space-y-2">
            <div className="block px-4 py-2 rounded bg-teal-900/30 text-teal-400 border border-teal-900/50 text-sm font-medium">
              Dashboard Overview
            </div>
            {/* Future nav items could go here */}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm w-full"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-slate-800">
            {user.role === 'SUPER_ADMIN' && 'Admin Operations Center'}
            {user.role === 'CSR_USER' && 'CSR Impact Portal'}
            {user.role === 'GOVT_USER' && 'National Reporting Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
             <span className="text-xs text-slate-400">System Status: <span className="text-green-500 font-bold">Audit Ready</span></span>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
