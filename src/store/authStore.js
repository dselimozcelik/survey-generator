import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  // Initialize auth state
  initialize: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      set({ 
        session, 
        user: session?.user ?? null, 
        loading: false 
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ 
          session, 
          user: session?.user ?? null 
        });
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      set({ 
        user: data.user, 
        session: data.session, 
        loading: false 
      });
      
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ 
        user: null, 
        session: null, 
        loading: false 
      });
      
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;

