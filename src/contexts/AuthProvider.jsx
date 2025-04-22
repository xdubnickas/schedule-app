import { useState, useEffect } from 'react';
import supabase from '../services/supabaseClient';
// import { authApi } from '../services/api';
import { AuthContext } from "./AuthContext";


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data when user ID is available
  useEffect(() => {
    const fetchProfile = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return null;
        }
        
        return data;
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        return null;
      }
    };

    const updateUserData = async (currentUser) => {
      if (currentUser?.id) {
        const profileData = await fetchProfile(currentUser.id);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    };

    if (user) {
      updateUserData(user);
    }
  }, [user]);

  useEffect(() => {
    // Check active sessions and set the user
    const getSession = async () => {
      try {
        const session = await supabase.auth.getSession();
        console.log("User from session:", session?.user);
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed, user:", session?.user);
      setUser(session?.user || null);
      console.log("Auth EVENT:", _event);
      console.log("Auth User:", session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, profileData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      console.log("Sign up response user:", data?.user);
      
      // If registration successful, create profile
      if (data?.user) {
        try {
          await supabase.from('profiles').insert([
            {
              user_id: data.user.id,
              username: profileData.username,
              first_name: profileData.first_name || null,
              last_name: profileData.last_name || null
            }
          ]);
        } catch (error) {
          console.error('Error creating profile:', error);
        }
      }
      
      return { data, error };
    } catch (err) {
      console.error("Error in signUp:", err);
      return { data: null, error: err };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log("Sign in response user:", data?.user);
      return { data, error };
    } catch (err) {
      console.error("Error in signIn:", err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    setProfile(null);
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      console.error("Error in signOut:", err);
      return { error: err };
    }
  };

  const value = {
    signUp,
    signIn,
    signOut,
    user,
    profile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
