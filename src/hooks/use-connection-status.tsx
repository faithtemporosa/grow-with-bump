import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    try {
      // Simple health check - try to query a small table
      const { error } = await supabase
        .from('automations')
        .select('id')
        .limit(1);
      
      setIsOnline(!error);
    } catch (error) {
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    // Also check when browser comes back online
    const handleOnline = () => checkConnection();
    window.addEventListener('online', handleOnline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return { isOnline, checkConnection };
};
