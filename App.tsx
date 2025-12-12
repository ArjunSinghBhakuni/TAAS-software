
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CSRDashboard from './components/CSRDashboard';
import GovtDashboard from './components/GovtDashboard';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import UserSwitcher from './components/UserSwitcher';
import { AppView, User } from './types';
import { logout } from './services/authService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  useEffect(() => {
    if (!currentUser) return;
    setCurrentView(AppView.DASHBOARD);
  }, [currentUser]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const renderContent = () => {
    if (!currentUser) return null;

    // View Routing Logic based on Role and Selection
    if (currentView === AppView.DASHBOARD) {
       if (currentUser.role === 'CSR_PARTNER') return <CSRDashboard />;
       if (currentUser.role === 'GOVT_OFFICER') return <GovtDashboard />;
       if (currentUser.role === 'INTERNAL_ADMIN') return <AdminDashboard />;
       if (currentUser.role === 'SYSTEM_ROOT') return <AdminDashboard />; // Root sees Admin by default
    }

    // Specific Module Routing
    if (currentView === AppView.FINANCIAL_AUDIT || currentView === AppView.REPORTS) return <CSRDashboard />;
    if (currentView === AppView.GOV_COMPLIANCE) return <GovtDashboard />;
    if (currentView === AppView.STUDENT_TRACKER || currentView === AppView.SETTINGS) return <AdminDashboard />;

    return <div className="p-10 text-center text-slate-400">View Not Implemented in TaaS V1</div>;
  };

  if (!isAuthenticated || !currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        currentUserRole={currentUser.role}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10 shrink-0">
           <div className="text-sm font-medium text-slate-500">
             Org ID: <span className="text-slate-900 font-mono font-semibold">{currentUser.org_id}</span>
           </div>
           
           <div className="flex items-center gap-4">
             <UserSwitcher currentUser={currentUser} onSwitchUser={setCurrentUser} />
             <div className="h-8 w-px bg-slate-200 mx-2"></div>
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
               <p className="text-xs text-slate-500">{currentUser.role.replace('_', ' ')}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border border-teal-200">
               {currentUser.name.charAt(0)}
             </div>
           </div>
        </div>

        <div className="flex-1 overflow-hidden p-6 md:p-8 relative">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
