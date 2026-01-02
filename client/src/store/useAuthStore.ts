import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User, AuthState } from '@shared/types';

interface AuthStore extends AuthState {
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
  fetchUserProfile: (userId: string) => Promise<User | null>;
}

/**
 * Fetches the full user profile from the users table
 */
const fetchUserProfile = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('[Auth] Error fetching user profile:', error);
    return null;
  }

  return data as User;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  loading: false,
  error: null,

  fetchUserProfile: async (userId: string) => {
    return await fetchUserProfile(userId);
  },

  signUp: async (email: string, password: string, fullName: string) => {
    set({ loading: true, error: null });

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user');
      }

      // Insert user profile into users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          full_name: fullName,
        });

      if (profileError) {
        throw profileError;
      }

      // Fetch the complete user profile
      const userProfile = await fetchUserProfile(authData.user.id);

      if (userProfile) {
        set({
          user: userProfile,
          session: authData.session,
          loading: false,
          error: null,
        });
      } else {
        set({
          loading: false,
          error: 'Failed to fetch user profile after signup',
        });
      }
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to sign up',
      });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (!data.user || !data.session) {
        throw new Error('Failed to sign in');
      }

      // Fetch the complete user profile from users table
      const userProfile = await fetchUserProfile(data.user.id);

      if (userProfile) {
        set({
          user: userProfile,
          session: data.session,
          loading: false,
          error: null,
        });
      } else {
        set({
          loading: false,
          error: 'Failed to fetch user profile after sign in',
        });
      }
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to sign in',
      });
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      set({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to sign out',
      });
    }
  },

  initialize: async () => {
    set({ loading: true, error: null });

    try {
      // Check if user is already logged in
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (session?.user) {
        // Fetch user profile
        const userProfile = await fetchUserProfile(session.user.id);

        if (userProfile) {
          set({
            user: userProfile,
            session,
            loading: false,
            error: null,
          });
        } else {
          set({
            loading: false,
            error: 'Failed to fetch user profile',
          });
        }
      } else {
        set({
          user: null,
          session: null,
          loading: false,
          error: null,
        });
      }

      // Set up auth state change listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          set({
            user: userProfile,
            session,
            error: null,
          });
        } else {
          set({
            user: null,
            session: null,
            error: null,
          });
        }
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to initialize auth',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

