import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AutomationCard } from "@/components/AutomationCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { automations, categories, type Automation, type AutomationCategory } from "@/data/automations";
import { useToast } from "@/hooks/use-toast";

export default function AutomationsCatalog() {
  const [selectedCategories, setSelectedCategories] = useState<AutomationCategory[]>([]);
  const [selectedRoiLevels, setSelectedRoiLevels] = useState<string[]>([]);
  const { toast } = useToast();

  const filteredAutomations = automations.filter((automation) => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(automation.category);
    const roiMatch = selectedRoiLevels.length === 0 || selectedRoiLevels.includes(automation.roiLevel);
    return categoryMatch && roiMatch;
  });

  const handleCategoryToggle = (category: AutomationCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleRoiToggle = (level: string) => {
    setSelectedRoiLevels((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    );
  };

  const handleAddToCart = (automation: Automation) => {
    toast({
      title: "Added to Cart",
      description: `${automation.name} has been added to your cart.`,
    });
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedRoiLevels([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Automation Catalog</h1>
          <p className="text-lg text-muted-foreground">
            Browse our library of AI-powered automations. Each saves you 10-80 hours per month.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                    className="h-auto p-1 text-sm"
                  >
                    Reset
                  </Button>
                </div>
                <Separator />
              </div>

              <div>
                <h4 className="font-medium mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <Label
                        htmlFor={`category-${category}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">ROI Level</h4>
                <div className="space-y-2">
                  {["high", "medium", "low"].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`roi-${level}`}
                        checked={selectedRoiLevels.includes(level)}
                        onCheckedChange={() => handleRoiToggle(level)}
                      />
                      <Label
                        htmlFor={`roi-${level}`}
                        className="text-sm font-normal cursor-pointer capitalize"
                      >
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredAutomations.length} of {automations.length} automations
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAutomations.map((automation) => (
                <AutomationCard
                  key={automation.id}
                  automation={automation}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {filteredAutomations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No automations match your filters.</p>
                <Button onClick={resetFilters} className="mt-4">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
