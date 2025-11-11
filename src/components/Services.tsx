import { Card } from "@/components/ui/card";
import { Sparkles, Megaphone, Users2, Target } from "lucide-react";

const services = [
  {
    icon: Sparkles,
    title: "Creator Collaboration Hub (Kollabsy)",
    description: "Our proprietary platform connects you with vetted creators across all major social platforms. Find, manage, and track creator partnerships all in one place.",
  },
  {
    icon: Megaphone,
    title: "Organic Brand Campaigns",
    description: "We design and execute authentic campaigns that resonate with your target audience. From product launches to brand awareness, we create content that converts.",
  },
  {
    icon: Users2,
    title: "Audience & Community Insights",
    description: "Get deep insights into your audience demographics, behavior, and preferences. We help you understand what makes your community tick and how to grow it.",
  },
  {
    icon: Target,
    title: "Brand Strategy & Growth Management",
    description: "From positioning to execution, we provide comprehensive brand strategy services. We help you define your unique voice and amplify it across all channels.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            End-to-end solutions for brands looking to scale through authentic creator partnerships and organic growth strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="p-8 hover:shadow-glow transition-smooth group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-lg gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth">
                <service.icon className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
              <p className="text-muted-foreground text-lg">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
