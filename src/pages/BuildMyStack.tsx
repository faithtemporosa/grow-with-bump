import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { automations, categories, type Automation, type AutomationCategory } from "@/data/automations";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type QuizStep = "goals" | "tools" | "role" | "volume" | "results";

export default function BuildMyStack() {
  const [currentStep, setCurrentStep] = useState<QuizStep>("goals");
  const [selectedGoals, setSelectedGoals] = useState<AutomationCategory[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [role, setRole] = useState("");
  const [emailVolume, setEmailVolume] = useState("");
  const navigate = useNavigate();

  const steps: QuizStep[] = ["goals", "tools", "role", "volume", "results"];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const tools = [
    "Gmail", "Google Drive", "Notion", "Slack", "Shopify", "Stripe", 
    "Webflow", "n8n", "Zapier", "Excel", "Supabase", "HubSpot"
  ];

  const roles = [
    "Founder", "Marketer", "Sales", "Creator", "Operations Manager", "eCommerce Owner"
  ];

  const volumeOptions = [
    "0-50 emails/day", "50-200 emails/day", "200-500 emails/day", "500+ emails/day"
  ];

  const handleGoalToggle = (category: AutomationCategory) => {
    setSelectedGoals((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleToolToggle = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool)
        ? prev.filter((t) => t !== tool)
        : [...prev, tool]
    );
  };

  const getRecommendedAutomations = (): Automation[] => {
    const recommendations = automations.filter((automation) => {
      const categoryMatch = selectedGoals.length === 0 || selectedGoals.includes(automation.category);
      const toolMatch = selectedTools.length === 0 || automation.tools.some(tool => 
        selectedTools.some(selectedTool => tool.toLowerCase().includes(selectedTool.toLowerCase()))
      );
      return categoryMatch && toolMatch;
    });

    return recommendations.slice(0, 5);
  };

  const calculateTotals = (recommendedAutomations: Automation[]) => {
    const count = recommendedAutomations.length;
    const basePrice = 500;
    const discountRate = Math.min((count - 1) * 0.05, 0.20);
    const effectivePrice = basePrice * (1 - discountRate);
    const totalCost = count * effectivePrice;
    const totalHoursSaved = recommendedAutomations.reduce((sum, a) => sum + a.hoursSaved, 0);
    const totalSavings = recommendedAutomations.reduce((sum, a) => sum + a.monthlySavings, 0);
    const netGain = totalSavings - totalCost;

    return { count, totalCost, totalHoursSaved, totalSavings, netGain, discountRate };
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "goals":
        return selectedGoals.length > 0;
      case "tools":
        return true; // Optional
      case "role":
        return role !== "";
      case "volume":
        return emailVolume !== "";
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-4xl font-bold mb-4">Build Your Automation Stack</h1>
            <p className="text-lg text-muted-foreground">
              Answer a few questions to get personalized automation recommendations
            </p>
            <div className="mt-6">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                Step {currentStepIndex + 1} of {steps.length}
              </p>
            </div>
          </div>

          <Card className="p-8">
            {/* Step 1: Goals */}
            {currentStep === "goals" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">What do you want to automate?</h2>
                  <p className="text-muted-foreground">Select all that apply</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category}
                      onClick={() => handleGoalToggle(category)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedGoals.includes(category)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category}</span>
                        {selectedGoals.includes(category) && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Tools */}
            {currentStep === "tools" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">What tools do you use?</h2>
                  <p className="text-muted-foreground">Select all that apply (optional)</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {tools.map((tool) => (
                    <div key={tool} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tool-${tool}`}
                        checked={selectedTools.includes(tool)}
                        onCheckedChange={() => handleToolToggle(tool)}
                      />
                      <Label htmlFor={`tool-${tool}`} className="cursor-pointer">
                        {tool}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Role */}
            {currentStep === "role" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">What's your role?</h2>
                  <p className="text-muted-foreground">This helps us tailor recommendations</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {roles.map((roleOption) => (
                    <div
                      key={roleOption}
                      onClick={() => setRole(roleOption)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        role === roleOption
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{roleOption}</span>
                        {role === roleOption && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Volume */}
            {currentStep === "volume" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">How many emails do you handle daily?</h2>
                  <p className="text-muted-foreground">This helps us estimate time savings</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {volumeOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => setEmailVolume(option)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        emailVolume === option
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {emailVolume === option && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Results */}
            {currentStep === "results" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Your Recommended Stack</h2>
                  <p className="text-muted-foreground mb-6">
                    Based on your answers, here's what we recommend:
                  </p>
                </div>

                {(() => {
                  const recommended = getRecommendedAutomations();
                  const totals = calculateTotals(recommended);

                  return (
                    <>
                      {/* Summary Card */}
                      <Card className="p-6 bg-primary/5 border-primary/20">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Automations</p>
                            <p className="text-2xl font-bold">{totals.count}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly Cost</p>
                            <p className="text-2xl font-bold">${Math.round(totals.totalCost)}</p>
                            {totals.discountRate > 0 && (
                              <Badge variant="secondary" className="mt-1">
                                {Math.round(totals.discountRate * 100)}% off
                              </Badge>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Hours Saved</p>
                            <p className="text-2xl font-bold">{totals.totalHoursSaved}h/mo</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Net Gain</p>
                            <p className="text-2xl font-bold text-green-600">
                              ${Math.round(totals.netGain)}
                            </p>
                          </div>
                        </div>
                      </Card>

                      {/* Recommended Automations */}
                      <div className="space-y-4">
                        {recommended.map((automation) => (
                          <Card key={automation.id} className="p-4 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">{automation.name}</h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {automation.description}
                                </p>
                                <div className="flex gap-3 text-sm">
                                  <Badge variant="outline">{automation.hoursSaved}h saved</Badge>
                                  <Badge variant="outline">${automation.monthlySavings} saved</Badge>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/automation/${automation.id}`}>Details</Link>
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>

                      {/* CTAs */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button size="lg" className="flex-1 gradient-primary shadow-glow">
                          Add Bundle to Cart
                        </Button>
                        <Button size="lg" variant="outline" className="flex-1" asChild>
                          <Link to="/get-started">Schedule Consultation</Link>
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Navigation */}
            {currentStep !== "results" && (
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="gradient-primary"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
