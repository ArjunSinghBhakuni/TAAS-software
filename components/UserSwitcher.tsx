
import React from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../services/mockData';
import { Users, Check } from 'lucide-react';

interface UserSwitcherProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
}

const UserSwitcher: React.FC<UserSwitcherProps> = ({ currentUser, onSwitchUser }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors border border-slate-600"
      >
        <Users size={14} />
        <span className="font-medium">{currentUser.role}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
              Switch Role (Demo Mode)
            </div>
            {MOCK_USERS.map((user) => (
              <button
                key={user.user_id}
                onClick={() => {
                  onSwitchUser(user);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-brand-50 transition-colors
                  ${currentUser.user_id === user.user_id ? 'bg-brand-50' : ''}`}
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                {currentUser.user_id === user.user_id && <Check size={16} className="text-brand-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserSwitcher;
