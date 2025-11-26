import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/use-admin";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FuturisticBackground } from "@/components/FuturisticBackground";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionRow {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string;
  automation_limit: number;
  automations_used: number;
  status: string;
  current_period_end: string | null;
}

interface UserProfile {
  email: string | null;
}

const TIER_NAMES: Record<string, string> = {
  "price_1SXS2gFmhb5GR0vFAiIjpu3F": "Standard ($350)",
  "price_1SXT4MFmhb5GR0vFLRgiCpwd": "Volume Saver ($325)",
  "price_1SXT6FFmhb5GR0vFnSUlpZK5": "Business Bundle ($300)",
  "price_1SXT6rFmhb5GR0vF8aFyU5K0": "Enterprise Pack ($275)",
  "price_1SXT7BFmhb5GR0vFbk7YS6Zr": "Maximum Savings ($250)",
};

export default function AdminSubscriptions() {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([]);
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadSubscriptions();
    }
  }, [isAdmin]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);

      // Fetch all subscriptions
      const { data: subs, error: subsError } = await supabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (subsError) throw subsError;

      setSubscriptions(subs || []);

      // Fetch user emails
      if (subs && subs.length > 0) {
        const userIds = [...new Set(subs.map((s) => s.user_id))];
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("user_id, email")
          .in("user_id", userIds);

        if (profilesError) throw profilesError;

        const emailMap: Record<string, string> = {};
        profiles?.forEach((profile) => {
          if (profile.email) {
            emailMap[profile.user_id] = profile.email;
          }
        });
        setUserEmails(emailMap);
      }
    } catch (error) {
      console.error("Error loading subscriptions:", error);
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (adminLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <FuturisticBackground />
      <Header />

      <main className="flex-1 container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-4xl font-bold">Subscription Management</h1>
            </div>
            <Button onClick={loadSubscriptions} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <Card className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No subscriptions found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Period End</TableHead>
                      <TableHead>Stripe Customer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">
                          {userEmails[sub.user_id] || "Unknown"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {TIER_NAMES[sub.stripe_price_id] || sub.stripe_price_id}
                          </Badge>
                        </TableCell>
                        <TableCell>{sub.automation_limit}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>
                              {sub.automations_used} / {sub.automation_limit}
                            </span>
                            {sub.automations_used >= sub.automation_limit && (
                              <Badge variant="destructive" className="text-xs">
                                Limit Reached
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              sub.status === "active"
                                ? "default"
                                : sub.status === "canceled"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {sub.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {sub.current_period_end
                            ? new Date(sub.current_period_end).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {sub.stripe_customer_id
                            ? `${sub.stripe_customer_id.substring(0, 12)}...`
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
