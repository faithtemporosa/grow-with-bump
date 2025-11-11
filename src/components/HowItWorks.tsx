import { Card } from "@/components/ui/card";
import { Search, Handshake, Rocket, LineChart } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discovery",
    description: "We analyze your brand, target audience, and goals to create a custom growth strategy.",
  },
  {
    icon: Handshake,
    title: "Creator Matching",
    description: "We connect you with the perfect creators who align with your brand values and audience.",
  },
  {
    icon: Rocket,
    title: "Campaign Launch",
    description: "We execute organic campaigns across social platforms with authentic creator content.",
  },
  {
    icon: LineChart,
    title: "Growth & Optimization",
    description: "We track performance, provide insights, and continuously optimize for better results.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our proven 4-step process to accelerate your brand growth through authentic creator partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="p-6 h-full hover:shadow-glow transition-smooth">
                <div className="flex items-center justify-center w-12 h-12 rounded-full gradient-primary text-white font-bold text-lg mb-4">
                  {index + 1}
                </div>
                <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <step.icon className="text-primary" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/3 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-accent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
