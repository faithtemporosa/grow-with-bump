import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FuturisticBackground } from "@/components/FuturisticBackground";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { X, Check, Plus, Minus, TrendingDown, ShoppingCart, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const UPSELLS = [
  { id: "priority-support", name: "Priority Support", price: 200, description: "24/7 priority response" },
  { id: "custom-automation", name: "Custom Automation Design", price: 1000, description: "One custom workflow" },
  { id: "monthly-optimization", name: "Monthly Optimization Upgrade", price: 300, description: "Weekly reviews & improvements" }
];

export default function Cart() {
  const { user } = useAuth();
  const { items: cartItems, removeItem, updateQuantity, loading, error, retryLoad } = useCart();
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const { toast } = useToast();
  const previousTierRef = useRef<number>(0);

  // Intake form state
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const DISCOUNT_TIERS = [
    { min: 1, max: 1, rate: 0, label: "Standard", price: 350 },
    { min: 2, max: 3, rate: 0.071, label: "Volume Saver", price: 325 },
    { min: 4, max: 5, rate: 0.143, label: "Business Bundle", price: 300 },
    { min: 6, max: 9, rate: 0.214, label: "Enterprise Pack", price: 275 },
    { min: 10, max: Infinity, rate: 0.286, label: "Maximum Savings", price: 250 }
  ];

  const calculatePricing = () => {
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const currentTier = DISCOUNT_TIERS.find(tier => totalQuantity >= tier.min && totalQuantity <= tier.max);
    const discountRate = currentTier?.rate || 0;
    const basePrice = 350;
    const effectivePrice = currentTier?.price || basePrice;
    const subtotal = totalQuantity * effectivePrice;
    const discount = (totalQuantity * basePrice) - subtotal;
    
    const upsellsTotal = UPSELLS
      .filter(u => selectedUpsells.includes(u.id))
      .reduce((sum, u) => sum + u.price, 0);
    
    const total = subtotal + upsellsTotal;
    const totalHoursSaved = cartItems.reduce((sum, item) => sum + (item.hoursSaved * item.quantity), 0);

    const nextTier = DISCOUNT_TIERS.find(tier => tier.min > totalQuantity);
    const automationsUntilNextTier = nextTier ? nextTier.min - totalQuantity : 0;

    return { 
      subtotal, 
      discount, 
      upsellsTotal, 
      total, 
      discountRate, 
      totalHoursSaved,
      currentTier,
      nextTier,
      automationsUntilNextTier,
      totalQuantity,
      basePrice
    };
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast({
      title: "Item Removed",
      description: "Automation removed from cart"
    });
  };

  const toggleUpsell = (id: string) => {
    setSelectedUpsells(prev =>
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format cart items for submission
    const cartItemsText = cartItems.map((item, index) => 
      `${index + 1}. ${item.name} - Quantity: ${item.quantity} - Price: $${item.price} each - Hours Saved: ${item.hoursSaved}h`
    ).join('\n');
    
    try {
      // Save to contact_submissions for record keeping
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert({
          name: businessName,
          email: email,
          brand_name: website || null,
          message: `${additionalInfo || 'Cart checkout submission'}\n\nORDER DETAILS:\n${cartItemsText}`,
          cart_items: cartItemsText,
          order_total: pricing.total,
          automation_count: pricing.totalQuantity
        });
      
      if (dbError) {
        console.error('Error saving to contact_submissions:', dbError);
        // Don't fail checkout if this fails, just log it
      }

      toast({
        title: "Creating checkout session...",
        description: "Please wait while we prepare your payment"
      });

      // Call Stripe checkout edge function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          cartItems: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            hoursSaved: item.hoursSaved
          })),
          businessInfo: {
            businessName,
            email,
            website,
            additionalInfo
          },
          upsells: selectedUpsells
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to create checkout session');
      }

      if (!data?.url) {
        throw new Error('No checkout URL received');
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : "Failed to create checkout session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const pricing = calculatePricing();

  // Confetti effect when unlocking new tier
  useEffect(() => {
    const currentTierIndex = DISCOUNT_TIERS.findIndex(
      tier => tier.min === pricing.currentTier?.min
    );
    
    if (currentTierIndex > previousTierRef.current && previousTierRef.current !== 0 && pricing.currentTier) {
      // Trigger confetti animation
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      toast({
        title: "🎉 New Tier Unlocked!",
        description: `You've reached ${pricing.currentTier.label} - ${Math.round(pricing.discountRate * 100)}% off!`
      });
    }
    
    previousTierRef.current = currentTierIndex;
  }, [pricing.currentTier, pricing.discountRate, toast]);

  if (showCheckout) {
    return (
      <div className="min-h-screen flex flex-col relative">
        <FuturisticBackground />
        <Header />
        <main className="flex-1 container mx-auto px-4 pt-28 pb-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Setup Information</h1>
            
            <Card className="p-8">
              <form onSubmit={handleCheckout} className="space-y-6">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    placeholder="Acme Inc."
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <Label htmlFor="additionalInfo">Tell us about your goals</Label>
                  <Textarea
                    id="additionalInfo"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="What are you hoping to achieve with these automations?"
                    rows={4}
                  />
                </div>

                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal ({cartItems.length} automations)</span>
                      <span>${pricing.subtotal.toFixed(2)}</span>
                    </div>
                    {pricing.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({Math.round(pricing.discountRate * 100)}% off)</span>
                        <span>-${pricing.discount.toFixed(2)}</span>
                      </div>
                    )}
                    {pricing.upsellsTotal > 0 && (
                      <div className="flex justify-between">
                        <span>Add-ons</span>
                        <span>${pricing.upsellsTotal.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${pricing.total.toFixed(2)}/month</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCheckout(false)}
                    className="flex-1"
                  >
                    Back to Cart
                  </Button>
                  <Button type="submit" className="flex-1 gradient-primary">
                    Complete Setup
                  </Button>
                </div>
              </form>
            </Card>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p className="mb-3 text-xs italic">Your checkout link will adjust automatically based on your total automations.</p>
              <p className="mb-2">After payment, we'll contact you within 24 hours to:</p>
              <ul className="space-y-1">
                <li>• Connect your accounts and tools</li>
                <li>• Configure your automations</li>
                <li>• Schedule your go-live date</li>
              </ul>
              <p className="mt-4">If you have any questions, please contact us at <a href="mailto:marketing@thebumpteam.com" className="text-primary hover:underline">marketing@thebumpteam.com</a></p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Authentication guard - show sign-in message for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col relative">
        <FuturisticBackground />
        <Header />
        
        <main className="flex-1 container mx-auto px-4 pt-28 pb-12">
          <div className="max-w-2xl mx-auto">
            <Card className="p-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-6">
                  <ShoppingCart className="w-12 h-12 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Please Sign In to View Your Cart</h2>
                <p className="text-muted-foreground">
                  Your cart is private and secure. Sign in to access your saved automations and complete your purchase.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/auth">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/catalog">Browse Automations</Link>
                </Button>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <FuturisticBackground />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {error ? (
                <Card className="p-12 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-destructive/10 p-4">
                      <X className="w-8 h-8 text-destructive" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Failed to Load Cart</h3>
                  <p className="text-muted-foreground mb-6">
                    We're having trouble connecting to your cart. Please check your connection and try again.
                  </p>
                  <Button onClick={retryLoad} className="gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Retry Loading Cart
                  </Button>
                </Card>
              ) : loading ? (
                <Card className="p-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                  <p className="text-muted-foreground mt-4">Loading your cart...</p>
                </Card>
              ) : cartItems.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">Your cart is empty</p>
                  <Button asChild>
                    <Link to="/catalog">Browse Automations</Link>
                  </Button>
                </Card>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <Card key={item.id} className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <span>{item.hoursSaved}h saved/month</span>
                              <span className="hidden sm:inline">•</span>
                              <span>${item.price}/month</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="font-semibold min-w-[60px] sm:min-w-[80px] text-right">${item.price * item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-destructive hover:text-destructive shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                   {/* Progress to Next Tier */}
                  {pricing.nextTier && (
                    <Card className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-sm text-muted-foreground">Current Tier</h4>
                            <p className="text-lg font-bold text-foreground">{pricing.currentTier?.label}</p>
                          </div>
                          <div className="text-right">
                            <h4 className="font-semibold text-sm text-muted-foreground">Next Tier</h4>
                            <p className="text-lg font-bold text-primary">{pricing.nextTier.label}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {pricing.totalQuantity} of {pricing.nextTier.min} automations
                            </span>
                            <span className="font-semibold text-primary">
                              {pricing.automationsUntilNextTier} more to unlock {Math.round(pricing.nextTier.rate * 100)}% off
                            </span>
                          </div>
                          
                          <Progress 
                            value={(pricing.totalQuantity / pricing.nextTier.min) * 100} 
                            className="h-3 animate-fade-in"
                          />
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Save ${pricing.discount.toFixed(0)} now</span>
                            <span className="text-primary font-semibold">
                              Save ${((pricing.totalQuantity + pricing.automationsUntilNextTier) * pricing.basePrice * pricing.nextTier.rate).toFixed(0)} at next tier
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                   {/* Volume Discount Tiers */}
                  <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-primary" />
                      Volume Discount Tiers
                    </h3>
                    <div className="space-y-2">
                      {DISCOUNT_TIERS.map((tier, index) => {
                        const isActive = pricing.totalQuantity >= tier.min && pricing.totalQuantity <= tier.max;
                        const isPast = pricing.totalQuantity > tier.max;
                        
                        return (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                              isActive 
                                ? 'bg-primary/20 border-2 border-primary shadow-sm' 
                                : isPast 
                                ? 'bg-muted/30 opacity-60' 
                                : 'bg-background/50 border border-border'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {isActive && <Check className="w-4 h-4 text-primary" />}
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {tier.label}
                                  {isActive && <Badge className="text-xs">Active</Badge>}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {tier.min === tier.max 
                                    ? `${tier.min} automation${tier.min > 1 ? 's' : ''}`
                                    : tier.max === Infinity
                                    ? `${tier.min}+ automations`
                                    : `${tier.min}-${tier.max} automations`
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">
                                ${tier.price}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {tier.rate > 0 ? `${Math.round(tier.rate * 100)}% off` : 'per month'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                   {/* Upsells */}
                  <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Enhance Your Stack</h3>
                    <div className="space-y-3">
                      {UPSELLS.map((upsell) => (
                        <div
                          key={upsell.id}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            id={`upsell-${upsell.id}`}
                            checked={selectedUpsells.includes(upsell.id)}
                            onCheckedChange={() => toggleUpsell(upsell.id)}
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={`upsell-${upsell.id}`}
                              className="cursor-pointer font-medium"
                            >
                              {upsell.name} (+${upsell.price}/mo)
                            </Label>
                            <p className="text-sm text-muted-foreground">{upsell.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-4 sm:p-6 lg:sticky lg:top-24">
                <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Automations ({cartItems.length})
                    </span>
                    <span className="font-medium">${pricing.subtotal.toFixed(2)}</span>
                  </div>
                  
                   {pricing.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" />
                        {pricing.currentTier?.label} Discount
                        <Badge variant="secondary" className="ml-1">
                          {Math.round(pricing.discountRate * 100)}% off
                        </Badge>
                      </span>
                      <span className="font-medium">-${pricing.discount.toFixed(2)}</span>
                    </div>
                  )}

                  {pricing.nextTier && pricing.automationsUntilNextTier > 0 && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-md">
                      <span>Add {pricing.automationsUntilNextTier} more to unlock {Math.round(pricing.nextTier.rate * 100)}% off</span>
                      <Badge variant="outline" className="text-xs">
                        Save ${((pricing.totalQuantity + pricing.automationsUntilNextTier) * pricing.basePrice * pricing.nextTier.rate - pricing.discount).toFixed(0)}
                      </Badge>
                    </div>
                  )}

                  {pricing.upsellsTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Add-ons</span>
                      <span className="font-medium">${pricing.upsellsTotal.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${pricing.total.toFixed(2)}/month</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <Check className="w-4 h-4 inline mr-1 text-green-600" />
                    Saves you {pricing.totalHoursSaved} hours/month
                  </div>
                </div>

                <Button
                  onClick={() => setShowCheckout(true)}
                  disabled={cartItems.length === 0}
                  className="w-full gradient-primary shadow-glow"
                  size="lg"
                >
                  Continue to Setup
                </Button>

                <div className="mt-4 pt-4 border-t text-xs text-muted-foreground space-y-2">
                  <p>• 24-72 hour deployment</p>
                  <p>• Fully managed & optimized</p>
                  <p>• Cancel anytime</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
