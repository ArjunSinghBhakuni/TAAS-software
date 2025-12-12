
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS, MOCK_AUDIT_LOGS } from '../services/mockData';
import { Plus, Mail, Shield, Trash2, Search, History } from 'lucide-react';

interface UserManagementProps {
  currentUser: User;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'AUDIT'>('USERS');

  // Simple mock invite logic
  const handleInvite = () => {
    alert("Invite sent! (Simulated)");
  };

  if (currentUser.role !== 'SYSTEM_ROOT' && currentUser.role !== 'ORG_ADMIN') {
    return <div className="p-8 text-center text-red-500">Access Denied: Admin Permissions Required</div>;
  }

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto gap-6">
       <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500">Manage roles, permissions, and audit security events.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
           <button 
             onClick={() => setActiveTab('USERS')}
             className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'USERS' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
           >
             Users & Roles
           </button>
           <button 
             onClick={() => setActiveTab('AUDIT')}
             className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'AUDIT' ? 'bg-white shadow text-brand-700' : 'text-gray-500 hover:text-gray-900'}`}
           >
             Security Audit Log
           </button>
        </div>
      </header>

      {activeTab === 'USERS' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
           <div className="p-4 border-b border-gray-100 flex justify-between gap-4 bg-gray-50">
             <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-brand-500"
                />
             </div>
             <button onClick={handleInvite} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-700 flex items-center gap-2">
                <Plus size={16} /> Invite User
             </button>
           </div>

           <div className="flex-1 overflow-y-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                   <tr>
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Organization</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {MOCK_USERS.map(user => (
                     <tr key={user.user_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 overflow-hidden">
                                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-medium text-gray-900">{user.name}</p>
                                 <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold border border-blue-100">
                             {user.role}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{user.org_id}</td>
                        <td className="px-6 py-4 text-right">
                           <button className="text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                           </button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
      )}

      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2 text-gray-600">
             <Shield size={18} />
             <span className="text-sm font-medium">Immutable Audit Trail (Write-Only)</span>
          </div>
          <div className="flex-1 overflow-y-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                   <tr>
                      <th className="px-6 py-3">Timestamp</th>
                      <th className="px-6 py-3">Actor</th>
                      <th className="px-6 py-3">Action</th>
                      <th className="px-6 py-3">Resource</th>
                      <th className="px-6 py-3">Details</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {MOCK_AUDIT_LOGS.map(log => (
                     <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                           {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                           {log.actor_id}
                        </td>
                        <td className="px-6 py-4">
                           <span className="font-bold text-gray-700">{log.action}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                           {log.resource}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                           {log.details}
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
