import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

const UPSELLS = [
  { id: "priority-support", name: "Priority Support", price: 200, description: "24/7 priority response" },
  { id: "custom-automation", name: "Custom Automation Design", price: 1000, description: "One custom workflow" },
  { id: "monthly-optimization", name: "Monthly Optimization Upgrade", price: 300, description: "Weekly reviews & improvements" }
];

export default function Cart() {
  const { items: cartItems, removeItem } = useCart();
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const { toast } = useToast();

  // Intake form state
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const calculatePricing = () => {
    const count = cartItems.length;
    const discountRate = Math.min((count - 1) * 0.05, 0.20);
    const basePrice = 500;
    const effectivePrice = basePrice * (1 - discountRate);
    const subtotal = count * effectivePrice;
    const discount = (count * basePrice) - subtotal;
    
    const upsellsTotal = UPSELLS
      .filter(u => selectedUpsells.includes(u.id))
      .reduce((sum, u) => sum + u.price, 0);
    
    const total = subtotal + upsellsTotal;
    const totalHoursSaved = cartItems.reduce((sum, item) => sum + item.hoursSaved, 0);

    return { subtotal, discount, upsellsTotal, total, discountRate, totalHoursSaved };
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

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Order Submitted!",
      description: "We'll contact you within 24 hours to start your setup."
    });
    // Would normally process payment and create order
  };

  const pricing = calculatePricing();

  if (showCheckout) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
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
              <p>After submission, we'll contact you within 24 hours to:</p>
              <ul className="mt-2 space-y-1">
                <li>• Connect your accounts and tools</li>
                <li>• Configure your automations</li>
                <li>• Schedule your go-live date</li>
              </ul>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.length === 0 ? (
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
                      <Card key={item.id} className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                            <div className="flex gap-3 text-sm text-muted-foreground">
                              <span>{item.hoursSaved}h saved/month</span>
                              <span>•</span>
                              <span>${item.price}/month</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>

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
              <Card className="p-6 sticky top-24">
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
                      <span>
                        Multi-automation discount
                        <Badge variant="secondary" className="ml-2">
                          {Math.round(pricing.discountRate * 100)}% off
                        </Badge>
                      </span>
                      <span className="font-medium">-${pricing.discount.toFixed(2)}</span>
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
