
import { User } from '../types';
import { MOCK_USERS } from './mockData';
import { supabase } from './supabaseClient';

const USE_SUPABASE = !!process.env.REACT_APP_SUPABASE_URL;

export const login = async (email: string, password?: string): Promise<{ user: User | null; error: string | null }> => {
  
  // 1. SUPABASE MODE
  if (USE_SUPABASE) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || 'password', // Fallback for demo ease if pw not provided
      });

      if (error) return { user: null, error: error.message };
      if (!data.user) return { user: null, error: 'No user data returned' };

      // Fetch the extended profile (RBAC roles)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) return { user: null, error: 'Profile load failed: ' + profileError.message };

      // Map Supabase Profile to App User Type
      const appUser: User = {
        user_id: data.user.id,
        name: profile.full_name || email,
        email: email,
        role: profile.role,
        org_id: profile.org_id,
        scope: profile.district_scope ? { district: profile.district_scope } : undefined,
        avatar: profile.avatar_url
      };

      return { user: appUser, error: null };

    } catch (e) {
      console.error(e);
      return { user: null, error: 'Supabase connection failed' };
    }
  }

  // 2. MOCK MODE (Fallback)
  await new Promise(resolve => setTimeout(resolve, 800)); // Sim delay
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return { user: null, error: 'Invalid email address.' };
  }
  
  // Accept any password for mock mode
  return { user, error: null };
};

export const logout = async (): Promise<void> => {
  if (USE_SUPABASE) {
    await supabase.auth.signOut();
  } else {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};
