
import { User } from '../types';
import { MOCK_USERS } from './mockData';

export const login = async (email: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simple check for demo
  const user = MOCK_USERS.find(u => u.email === email);
  return user || null;
};

export const logout = async () => {
  // Clear session logic would go here
};
