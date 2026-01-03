/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { User, AuthState } from "@shared/types";
import type { Session } from "@supabase/supabase-js";

interface AuthStore extends AuthState<Session> {
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
  fetchUserProfile: (userId: string) => Promise<User | null>;
}

const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("[Auth] Error fetching user profile:", error);
      return null;
    }

    if (!data) {
      console.error("[Auth] No user profile found for ID:", userId);
      return null;
    }

    return data as User;
  } catch (error) {
    console.error("[Auth] Exception fetching user profile:", error);
    return null;
  }
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

      console.log("[Auth] Auth Data:", authData);

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Failed to create user");
      }

      // If session exists, user is automatically signed in (email confirmation disabled)
      if (authData.session) {
        const profile = await fetchUserProfile(authData.user.id);
        console.log("[Auth] Profile fetched:", profile);

        if (!profile) {
          throw new Error("Profile creation failed. Please contact support.");
        }

        set({
          user: profile,
          session: authData.session,
          loading: false,
          error: null,
        });
      } else {
        // Email confirmation required - user needs to check their email
        set({
          loading: false,
          error: null,
        });
        // You might want to show a success message here instead
        alert("Account created! Please check your email to confirm.");
      }
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || "Failed to sign up",
      });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (!authData.user || !authData.session) {
        throw new Error("Failed to sign in");
      }

      // Fetch the complete user profile from public.users table
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
          error: "Failed to fetch user profile. Please try again.",
        });
      }
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || "Failed to sign in",
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
        error: error.message || "Failed to sign out",
      });
    }
  },

  initialize: async () => {
    set({ loading: true, error: null });

    try {
      // Check if user is already logged in
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (session?.user) {
        // Fetch user profile from public.users table
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
            error: "Failed to fetch user profile",
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
        console.log("[Auth] Auth state changed:", event);

        if (event === "SIGNED_IN" && session?.user) {
          // User signed in - fetch profile from public.users
          const userProfile = await fetchUserProfile(session.user.id);
          set({
            user: userProfile,
            session,
            error: null,
          });
        } else if (event === "SIGNED_OUT") {
          // User signed out - clear state
          set({
            user: null,
            session: null,
            error: null,
          });
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          // Token refreshed - update session but keep existing user data
          const currentUser = get().user;
          set({
            session,
            // Only update user if we don't have one (shouldn't happen, but safety check)
            user: currentUser || (await fetchUserProfile(session.user.id)),
            error: null,
          });
        } else if (event === "USER_UPDATED" && session?.user) {
          // User updated - refresh profile
          const userProfile = await fetchUserProfile(session.user.id);
          set({
            user: userProfile,
            session,
            error: null,
          });
        }
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || "Failed to initialize auth",
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
