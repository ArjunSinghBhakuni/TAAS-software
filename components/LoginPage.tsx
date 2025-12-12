
import React, { useState } from 'react';
import { User } from '../types';
import { login } from '../services/authService';
import { MOCK_USERS } from '../services/mockData';
import { Lock, Mail, ArrowRight, Loader2, Landmark, Briefcase, Settings } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    const { user } = await login(email, password);
    if (user) onLoginSuccess(user);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      <div className="lg:w-1/2 bg-slate-900 text-white flex flex-col justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-lg mx-auto lg:mx-0">
          <div className="w-12 h-12 bg-teal-500 rounded flex items-center justify-center text-2xl font-bold mb-8">T</div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Transparency as a Service</h1>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
             The single source of truth for CSR compliance, migration prevention metrics, and audit-ready financial tracking.
          </p>
          <div className="flex gap-3">
             <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded text-xs">SEBI BRSR Ready</span>
             <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded text-xs">DigiLocker Integrated</span>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 flex flex-col justify-center items-center p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Secure Access</h2>
            <p className="mt-2 text-sm text-slate-600">Engine B Commercial Gateway</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                     </div>
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        placeholder="user@organization.com"
                     />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                     </div>
                     <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        placeholder="••••••••"
                     />
                  </div>
               </div>
            </div>

            <button
               type="submit"
               disabled={loading}
               className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-all"
            >
               {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight className="ml-2 h-5 w-5" /></>}
            </button>
          </form>

          <div className="mt-10">
             <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-4">Select Role to Demo</p>
             <div className="grid grid-cols-1 gap-3">
                {MOCK_USERS.map((user) => (
                   <button
                     key={user.user_id}
                     onClick={() => { setEmail(user.email); setPassword('demo'); }}
                     className="flex items-center gap-4 p-3 border border-slate-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-left"
                   >
                      <div className="p-2 bg-slate-100 rounded text-slate-600">
                         {user.role === 'CSR_PARTNER' ? <Briefcase size={16} /> : 
                          user.role === 'GOVT_OFFICER' ? <Landmark size={16} /> : <Settings size={16} />}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900">{user.role.replace('_', ' ')}</p>
                         <p className="text-xs text-slate-500">{user.org_id}</p>
                      </div>
                   </button>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
