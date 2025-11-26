import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  const checkConnection = async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    try {
      const { error } = await supabase
        .from('automations')
        .select('id')
        .limit(1);
      
      const nowOnline = !error;
      
      // If we just reconnected, trigger a page refresh to clear old errors
      if (wasOffline && nowOnline) {
        console.clear(); // Clear console logs
        setWasOffline(false);
        // Dispatch custom event for contexts to reload
        window.dispatchEvent(new Event('backend-reconnected'));
      } else if (!nowOnline && isOnline) {
        setWasOffline(true);
      }
      
      setIsOnline(nowOnline);
    } catch (error) {
      if (isOnline) {
        setWasOffline(true);
      }
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();

    // Check every 10 seconds for faster reconnection detection
    const interval = setInterval(checkConnection, 10000);

    // Also check when browser comes back online
    const handleOnline = () => checkConnection();
    window.addEventListener('online', handleOnline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
    };
  }, [isOnline, wasOffline]);

  return { isOnline, checkConnection };
};
