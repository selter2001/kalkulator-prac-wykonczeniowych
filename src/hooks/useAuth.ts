import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type AuthMode = 'authenticated' | 'guest' | null;

export interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
}

export const useAuth = () => {
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setAuthMode('authenticated');
          localStorage.removeItem('guestMode');
          // Defer profile fetch to avoid deadlock
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setAuthMode('authenticated');
        fetchProfile(session.user.id);
      } else {
        // Check if guest mode was previously set
        const isGuest = localStorage.getItem('guestMode') === 'true';
        if (isGuest) {
          setAuthMode('guest');
        }
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
          company_name: companyName || null
        }
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setAuthMode(null);
      setProfile(null);
      localStorage.removeItem('guestMode');
    }
    return { error };
  };

  const continueAsGuest = () => {
    localStorage.setItem('guestMode', 'true');
    setAuthMode('guest');
  };

  const exitGuestMode = () => {
    localStorage.removeItem('guestMode');
    setAuthMode(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { error };
  };

  const getDisplayName = () => {
    if (profile?.company_name) {
      return profile.company_name;
    }
    if (profile?.full_name) {
      return profile.full_name;
    }
    return '';
  };

  return {
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
    getDisplayName
  };
};
