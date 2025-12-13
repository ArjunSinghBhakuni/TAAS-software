
import React, { useState } from 'react';
import { MOCK_USERS } from '../services/mockData';
import { login } from '../services/authService';
import { User } from '../types';
import { ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = async (email: string) => {
    setLoading(true);
    const user = await login(email);
    if (user) onLogin(user);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        
        {/* Brand Side */}
        <div className="md:w-1/2 bg-teal-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
               <ShieldCheck size={32} />
               <span className="text-2xl font-bold tracking-tight">TaaS Platform</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Transparency as a Service</h1>
            <p className="text-teal-100 text-lg leading-relaxed">
              The single source of truth for NGO impact, CSR compliance, and Government monitoring.
            </p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-teal-500 rounded-full opacity-50"></div>
        </div>

        {/* Login Side */}
        <div className="md:w-1/2 p-12 bg-white flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Select Access Role</h2>
          <p className="text-slate-500 mb-8">Choose a persona to explore the V1 MVP.</p>

          <div className="space-y-4">
            {MOCK_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleRoleSelect(user.email)}
                disabled={loading}
                className="w-full text-left p-4 border border-slate-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all group relative"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                    ${user.role === 'SUPER_ADMIN' ? 'bg-slate-800' : 
                      user.role === 'CSR_USER' ? 'bg-indigo-600' : 'bg-amber-500'}`}>
                    {user.role === 'SUPER_ADMIN' ? 'A' : user.role === 'CSR_USER' ? 'C' : 'G'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-teal-700">{user.role.replace('_', ' ')}</p>
                    <p className="text-xs text-slate-500">{user.organization}</p>
                  </div>
                </div>
                <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-teal-500" size={20} />
              </button>
            ))}
          </div>
          
          {loading && (
             <div className="mt-6 flex justify-center text-teal-600">
                <Loader2 className="animate-spin" />
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
