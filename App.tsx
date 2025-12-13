
import React, { useState } from 'react';
import { User } from './types';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import CSRDashboard from './pages/CSRDashboard';
import GovtDashboard from './pages/GovtDashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout user={currentUser} onLogout={handleLogout}>
      {currentUser.role === 'SUPER_ADMIN' && <AdminDashboard />}
      {currentUser.role === 'CSR_USER' && <CSRDashboard />}
      {currentUser.role === 'GOVT_USER' && <GovtDashboard />}
    </Layout>
  );
};

export default App;
