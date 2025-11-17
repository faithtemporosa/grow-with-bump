import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("email_digest_enabled")
        .eq("user_id", user?.id)
        .single();

      if (error) {
        // Profile doesn't exist yet, create it
        if (error.code === "PGRST116") {
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({ user_id: user?.id, email_digest_enabled: true });

          if (insertError) throw insertError;
          setEmailDigestEnabled(true);
        } else {
          throw error;
        }
      } else {
        setEmailDigestEnabled(data.email_digest_enabled);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast({
        title: "Error",
        description: "Failed to load your settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEmailDigest = async (checked: boolean) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ email_digest_enabled: checked })
        .eq("user_id", user?.id);

      if (error) throw error;

      setEmailDigestEnabled(checked);
      toast({
        title: "Settings updated",
        description: checked
          ? "You'll receive weekly email digests"
          : "Email digests disabled",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update your settings",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 pt-28 pb-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                Please sign in to access your settings
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Settings</h1>

          <Card>
            <CardHeader>
              <CardTitle>Email Preferences</CardTitle>
              <CardDescription>
                Manage how you receive updates from us
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-digest" className="text-base">
                      Weekly Email Digest
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly email with new automations matching your
                      wishlist categories
                    </p>
                  </div>
                  <Switch
                    id="email-digest"
                    checked={emailDigestEnabled}
                    onCheckedChange={handleToggleEmailDigest}
                    disabled={updating}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
