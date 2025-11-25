import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package, Mail, LogIn } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const MyOrders = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  // Auto-populate email if user is authenticated
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      setSearchEmail(user.email);
    }
  }, [user]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", searchEmail],
    queryFn: async () => {
      if (!searchEmail) return [];
      
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .eq("email", searchEmail)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!searchEmail,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchEmail(email);
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 pt-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">My Orders</h1>
            <p className="text-muted-foreground">
              {user ? "View and track your automation orders" : "Sign in to view your order history"}
            </p>
          </div>

          {!user ? (
            <Card className="p-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-6">
                  <Package className="w-12 h-12 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Please Sign In to View Your Orders</h2>
                <p className="text-muted-foreground">
                  Your orders are private and secure. Sign in to access your order history and track delivery status.
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
          ) : (
            <>
              <Card className="p-6">
                <form onSubmit={handleSearch} className="flex gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                    disabled={!!user?.email}
                  />
                  <Button type="submit">
                    <Search className="w-4 h-4 mr-2" />
                    Search Orders
                  </Button>
                </form>
              </Card>

              {isLoading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading orders...</p>
                </div>
              )}

              {searchEmail && !isLoading && orders && orders.length === 0 && (
                <Card className="p-12 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No orders found for this email address.
                  </p>
                </Card>
              )}

              {orders && orders.length > 0 && (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="text-lg font-semibold">
                              Order #{order.order_id}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(order.created_at), "PPP 'at' p")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">
                              ${order.order_total}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.automation_count} {order.automation_count === 1 ? "automation" : "automations"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                          {order.brand_name && (
                            <div>
                              <p className="text-sm font-medium">Business Name</p>
                              <p className="text-sm text-muted-foreground">{order.brand_name}</p>
                            </div>
                          )}
                          
                          {order.estimated_completion_date && (
                            <div>
                              <p className="text-sm font-medium">Estimated Completion</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(order.estimated_completion_date), "PPP")}
                              </p>
                            </div>
                          )}
                        </div>

                        {order.cart_items && order.cart_items !== "No cart items" && (
                          <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium">Items</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="h-8 px-3 gap-2"
                              >
                                <a href="mailto:marketing@thebumpteam.com?subject=Order Status Request - Order #">
                                  <Mail className="w-4 h-4" />
                                  Contact for Status
                                </a>
                              </Button>
                            </div>
                            <div className="text-sm text-muted-foreground whitespace-pre-line">
                              {order.cart_items}
                            </div>
                          </div>
                        )}

                        {order.message && (
                          <div className="border-t pt-4">
                            <p className="text-sm font-medium mb-2">Additional Information</p>
                            <p className="text-sm text-muted-foreground">{order.message}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders;
