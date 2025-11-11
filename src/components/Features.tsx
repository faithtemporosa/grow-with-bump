import { Card } from "@/components/ui/card";
import { Users, BarChart3, TrendingUp, Shield } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Creator Partnerships",
    description: "Connect with authentic creators who align with your brand values and target audience.",
  },
  {
    icon: BarChart3,
    title: "Audience Insights",
    description: "Get detailed analytics and insights about your audience engagement and growth metrics.",
  },
  {
    icon: TrendingUp,
    title: "Organic Brand Growth",
    description: "Build genuine relationships with your community through authentic content and collaborations.",
  },
  {
    icon: Shield,
    title: "Full Brand Control",
    description: "Maintain complete control over your brand identity while we handle the strategy and execution.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose Bump Syndicate?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We provide everything you need to grow your brand organically through strategic creator collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-glow transition-smooth cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
