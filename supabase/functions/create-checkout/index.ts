import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

// Price IDs for volume tiers (monthly recurring)
const PRICE_TIERS = {
  350: "price_1SXS2gFmhb5GR0vFAiIjpu3F", // $350/month per automation
  325: "price_1SXT4MFmhb5GR0vFLRgiCpwd", // $325/month per automation
  300: "price_1SXT6FFmhb5GR0vFnSUlpZK5", // $300/month per automation
  275: "price_1SXT6rFmhb5GR0vF8aFyU5K0", // $275/month per automation
  250: "price_1SXT7BFmhb5GR0vFbk7YS6Zr", // $250/month per automation (10+ automations)
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse request body
    const { cartItems, businessInfo, upsells } = await req.json();
    logStep("Request parsed", { itemCount: cartItems?.length, hasBusinessInfo: !!businessInfo });

    if (!cartItems || cartItems.length === 0) {
      throw new Error("No cart items provided");
    }

    // Calculate total quantity and determine price tier
    const totalQuantity = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
    let pricePerAutomation = 350;
    
    if (totalQuantity >= 10) {
      pricePerAutomation = 250;
    } else if (totalQuantity >= 6) {
      pricePerAutomation = 275;
    } else if (totalQuantity >= 4) {
      pricePerAutomation = 300;
    } else if (totalQuantity >= 2) {
      pricePerAutomation = 325;
    }

    const priceId = PRICE_TIERS[pricePerAutomation as keyof typeof PRICE_TIERS];
    logStep("Price tier determined", { totalQuantity, pricePerAutomation, priceId });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { 
      apiVersion: "2025-08-27.basil" 
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("No existing customer, will create during checkout");
    }

    // Prepare line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price: priceId,
        quantity: totalQuantity,
      }
    ];

    // Add upsells if any
    if (upsells && upsells.length > 0) {
      logStep("Adding upsells", { upsellCount: upsells.length });
      // Note: Upsells would need their own price IDs created in Stripe
      // For now, we'll just log them
    }

    logStep("Creating checkout session");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/order-success`,
      cancel_url: `${req.headers.get("origin")}/cart`,
      metadata: {
        user_id: user.id,
        business_name: businessInfo?.businessName || "",
        website: businessInfo?.website || "",
        total_automations: totalQuantity.toString(),
        cart_items: JSON.stringify(cartItems.map((item: any) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity
        }))),
      }
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
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
