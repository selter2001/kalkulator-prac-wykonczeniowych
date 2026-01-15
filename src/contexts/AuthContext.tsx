import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type AuthMode = 'authenticated' | 'guest' | null;

export interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  authMode: AuthMode;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, companyName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  continueAsGuest: () => void;
  exitGuestMode: () => void;
  resetPassword: (email: string) => Promise<{ error: any }>;
  getDisplayName: () => string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!error && data) {
      setProfile(data as UserProfile);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        setAuthMode('authenticated');
        // Defer profile fetch to avoid deadlock
        setTimeout(() => {
          fetchProfile(nextSession.user.id);
        }, 0);
      } else {
        setProfile(null);
        // IMPORTANT: do NOT persist guest mode across refresh.
        // But if the user already entered guest mode in this runtime, keep it.
        setAuthMode(prev => (prev === 'guest' ? 'guest' : null));
      }

      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        setAuthMode('authenticated');
        fetchProfile(initialSession.user.id);
      } else {
        // Keep guest mode if it was already set before getSession resolved
        setAuthMode(prev => (prev === 'guest' ? 'guest' : null));
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, companyName?: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          company_name: companyName || null,
        },
      },
    });

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      setAuthMode(null);
      setProfile(null);
    }

    return { error };
  };

  const continueAsGuest = () => {
    setAuthMode('guest');
  };

  const exitGuestMode = () => {
    setAuthMode(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const getDisplayName = () => {
    if (profile?.company_name) return profile.company_name;
    if (profile?.full_name) return profile.full_name;
    return '';
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    profile,
    authMode,
    loading,
    signUp,
    signIn,
    signOut,
    continueAsGuest,
    exitGuestMode,
    resetPassword,
    getDisplayName,
  }), [user, session, profile, authMode, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
