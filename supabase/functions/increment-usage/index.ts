import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[INCREMENT-USAGE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw userError;
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const { automationName } = await req.json();
    if (!automationName) throw new Error("Automation name is required");

    // Get current subscription
    const { data: subscription, error: subError } = await supabaseClient
      .from("subscriptions")
      .select("automation_limit, automations_used, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (subError) throw subError;
    if (!subscription) throw new Error("No active subscription found");

    // Check if user can create automation
    if (subscription.automations_used >= subscription.automation_limit) {
      throw new Error("Automation limit reached. Please upgrade your plan.");
    }

    // Increment usage
    const { error: updateError } = await supabaseClient
      .from("subscriptions")
      .update({ automations_used: subscription.automations_used + 1 })
      .eq("user_id", user.id);

    if (updateError) throw updateError;

    // Log automation usage
    const { error: logError } = await supabaseClient
      .from("automation_usage")
      .insert({
        user_id: user.id,
        automation_id: crypto.randomUUID(),
        automation_name: automationName
      });

    if (logError) {
      logStep("Warning: Failed to log usage", { error: logError });
    }

    const newUsed = subscription.automations_used + 1;
    const remaining = subscription.automation_limit - newUsed;

    logStep("Usage incremented successfully", {
      newUsed,
      limit: subscription.automation_limit,
      remaining
    });

    return new Response(JSON.stringify({
      success: true,
      used: newUsed,
      limit: subscription.automation_limit,
      remaining
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
