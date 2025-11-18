import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Track user presence
    let presenceChannel: ReturnType<typeof supabase.channel> | null = null;
    
    if (user) {
      presenceChannel = supabase.channel("admin-presence");
      presenceChannel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel?.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          });
        }
      });
    }

    return () => {
      subscription.unsubscribe();
      if (presenceChannel) {
        supabase.removeChannel(presenceChannel);
      }
    };
  }, [user]);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    // Log login activity
    if (data.user) {
      try {
        // Parse user agent
        const userAgent = navigator.userAgent;
        let browser = "Unknown";
        let os = "Unknown";

        // Detect browser
        if (userAgent.includes("Chrome")) browser = "Chrome";
        else if (userAgent.includes("Safari")) browser = "Safari";
        else if (userAgent.includes("Firefox")) browser = "Firefox";
        else if (userAgent.includes("Edge")) browser = "Edge";

        // Detect OS
        if (userAgent.includes("Windows")) os = "Windows";
        else if (userAgent.includes("Mac")) os = "macOS";
        else if (userAgent.includes("Linux")) os = "Linux";
        else if (userAgent.includes("Android")) os = "Android";
        else if (userAgent.includes("iOS")) os = "iOS";

        // Get timezone as a proxy for location
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        await supabase.from("login_activity").insert({
          user_id: data.user.id,
          user_agent: userAgent,
          browser,
          os,
          city: timezone, // Using timezone as placeholder for city
          country: timezone.split("/")[0], // Extract region from timezone
        });
      } catch (error) {
        // Login activity tracking failed silently
      }
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
