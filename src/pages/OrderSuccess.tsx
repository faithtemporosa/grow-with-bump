import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart when arriving at success page
    clearCart();

    // Redirect to homepage after 3 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [clearCart, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We'll contact you within 24 hours to get started on your automations.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Redirecting to homepage...</p>
          <p className="mt-2">
            Track your order status in{" "}
            <span 
              className="text-primary cursor-pointer hover:underline"
              onClick={() => navigate("/my-orders")}
            >
              My Orders
            </span>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default OrderSuccess;
