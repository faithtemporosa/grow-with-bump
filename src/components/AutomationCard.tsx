import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import type { Automation } from "@/data/automations";

interface AutomationCardProps {
  automation: Automation;
  onAddToCart?: (automation: Automation) => void;
}

export const AutomationCard = ({ automation, onAddToCart }: AutomationCardProps) => {
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
            onClick={() => onAddToCart?.(automation)}
            className="flex-1"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
};
