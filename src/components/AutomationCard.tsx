import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, TrendingUp, Check } from "lucide-react";
import { Link } from "react-router-dom";
import type { Automation } from "@/data/automations";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface AutomationCardProps {
  automation: Automation;
}

export const AutomationCard = ({ automation }: AutomationCardProps) => {
  const { addItem, items } = useCart();
  const { toast } = useToast();
  const isInCart = items.some((item) => item.id === automation.id);

  const handleAddToCart = () => {
    if (isInCart) {
      toast({
        title: "Already in Cart",
        description: `${automation.name} is already in your cart.`,
        variant: "default",
      });
      return;
    }

    addItem({
      id: automation.id,
      name: automation.name,
      price: 500,
      hoursSaved: automation.hoursSaved,
      thumbnail: automation.thumbnail,
    });

    toast({
      title: "Added to Cart! 🎉",
      description: `${automation.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-muted flex items-center justify-center">
        <img 
          src={automation.thumbnail} 
          alt={automation.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight">{automation.name}</h3>
            <Badge variant="secondary" className="shrink-0">
              {automation.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {automation.description}
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-primary">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{automation.hoursSaved}h saved/mo</span>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">${automation.monthlySavings}/mo</span>
          </div>
        </div>

        <Badge variant="outline" className="w-fit">
          ROI: {automation.roiLevel}
        </Badge>

        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/automation/${automation.id}`}>View Details</Link>
          </Button>
          <Button 
            onClick={handleAddToCart}
            className="flex-1"
            variant={isInCart ? "secondary" : "default"}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                In Cart
              </>
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
