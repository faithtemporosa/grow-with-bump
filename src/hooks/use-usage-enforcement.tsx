import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UsageStatus {
  canCreate: boolean;
  reason: string;
  limit: number;
  used: number;
  remaining: number;
}

export function useUsageEnforcement() {
  const { toast } = useToast();
  const [checking, setChecking] = useState(false);
  const [incrementing, setIncrementing] = useState(false);

  const checkUsage = useCallback(async (): Promise<UsageStatus> => {
    setChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-usage");

      if (error) throw error;

      return data as UsageStatus;
    } catch (error) {
      console.error("Error checking usage:", error);
      toast({
        title: "Error",
        description: "Failed to check automation usage",
        variant: "destructive",
      });
      throw error;
    } finally {
      setChecking(false);
    }
  }, [toast]);

  const assertCanCreateAutomation = useCallback(async (): Promise<boolean> => {
    try {
      const status = await checkUsage();
      
      if (!status.canCreate) {
        toast({
          title: "Automation Limit Reached",
          description: status.reason === "No active subscription"
            ? "Please subscribe to create automations"
            : `You've reached your limit of ${status.limit} automations. Upgrade your plan to create more.`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }, [checkUsage, toast]);

  const incrementUsage = useCallback(async (automationName: string): Promise<boolean> => {
    setIncrementing(true);
    try {
      const { data, error } = await supabase.functions.invoke("increment-usage", {
        body: { automationName },
      });

      if (error) throw error;

      toast({
        title: "Automation Created",
        description: `${data.used} of ${data.limit} automations used (${data.remaining} remaining)`,
      });

      return true;
    } catch (error) {
      console.error("Error incrementing usage:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update usage count";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIncrementing(false);
    }
  }, [toast]);

  return {
    checkUsage,
    assertCanCreateAutomation,
    incrementUsage,
    checking,
    incrementing,
  };
}
