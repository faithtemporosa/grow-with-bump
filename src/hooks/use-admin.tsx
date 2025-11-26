import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async (retryCount = 0, maxRetries = 2) => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (error) throw error;
        setIsAdmin(!!data);
      } catch (error) {
        // Silent retry
        if (retryCount < maxRetries) {
          setTimeout(() => checkAdminStatus(retryCount + 1, maxRetries), 1000);
          return;
        }
        // Silent failure - just set false
        setIsAdmin(false);
      } finally {
        if (retryCount === 0) {
          setLoading(false);
        }
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading };
};
