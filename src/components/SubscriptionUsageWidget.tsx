import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Subscription {
  automation_limit: number;
  automations_used: number;
  status: string;
  stripe_price_id: string;
  current_period_end: string | null;
}

const TIER_NAMES: Record<string, string> = {
  "price_1SXS2gFmhb5GR0vFAiIjpu3F": "Standard",
  "price_1SXT4MFmhb5GR0vFLRgiCpwd": "Volume Saver",
  "price_1SXT6FFmhb5GR0vFnSUlpZK5": "Business Bundle",
  "price_1SXT6rFmhb5GR0vF8aFyU5K0": "Enterprise Pack",
  "price_1SXT7BFmhb5GR0vFbk7YS6Zr": "Maximum Savings",
};

export function SubscriptionUsageWidget() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscription();
    }
  }, [user]);

  const loadSubscription = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("subscriptions")
        .select("automation_limit, automations_used, status, stripe_price_id, current_period_end")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error("Error loading subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return null;
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>No active subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Subscribe to start creating automations
          </p>
        </CardContent>
      </Card>
    );
  }

  const usagePercent = (subscription.automations_used / subscription.automation_limit) * 100;
  const tierName = TIER_NAMES[subscription.stripe_price_id] || "Unknown";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Automation Usage</CardTitle>
          <CardDescription>
            {tierName} Plan
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={loadSubscription}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {subscription.automations_used} of {subscription.automation_limit} used
            </span>
            <Badge variant={usagePercent >= 100 ? "destructive" : usagePercent >= 80 ? "secondary" : "default"}>
              {Math.round(usagePercent)}%
            </Badge>
          </div>
          <Progress value={usagePercent} />
        </div>

        {subscription.current_period_end && (
          <p className="text-xs text-muted-foreground">
            Renews on {new Date(subscription.current_period_end).toLocaleDateString()}
          </p>
        )}

        {usagePercent >= 100 && (
          <p className="text-sm text-destructive font-medium">
            Limit reached. Upgrade to create more automations.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
