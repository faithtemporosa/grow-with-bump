import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FuturisticBackground } from "@/components/FuturisticBackground";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ROICalculator from "@/components/ROICalculator";
import { CheckCircle2, Clock, Zap, DollarSign, TrendingUp, Mail, BarChart3, ShoppingBag, FolderKanban, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import bumpsyndicate from "@/assets/bump-syndicate-logo.png";

const Index = () => {
  const benefits = [
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Save 20-80 Hours Per Month",
      description: "Automate repetitive tasks and reclaim your time for strategic work"
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "AI Built & Managed For You",
      description: "We handle everything from setup to optimization - you never touch the code"
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "24-72 Hour Deployment",
      description: "Get your automations up and running in days, not weeks or months"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "10-20x ROI Guaranteed",
      description: "Most clients see massive returns from month one onwards"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Pick Your Automations",
      description: "Choose from email, marketing, operations, and content workflows"
    },
    {
      number: "02",
      title: "We Deploy Them",
      description: "Connect integrations and configure AI logic tailored to your business"
    },
    {
      number: "03",
      title: "We Optimize Monthly",
      description: "We continuously fix, refine, and upgrade your automations"
    }
  ];

  const popularAutomations = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Marketing Automation",
      description: "Automated email sequences with lead management and personalized outreach",
      hoursSaved: "85h/mo",
      tag: "Highest ROI"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "AI LinkedIn Comments Responder",
      description: "Automated intelligent responses to LinkedIn comments with AI personalization",
      hoursSaved: "45h/mo",
      tag: "Featured"
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: "AI TikTok/Shorts Generator",
      description: "Auto-generate short-form videos for TikTok, YouTube Shorts & Reels",
      hoursSaved: "65h/mo",
      tag: "Content Creation"
    },
    {
      icon: <FolderKanban className="w-6 h-6" />,
      title: "AI Telegram Assistant",
      description: "Complete AI assistant managing email, calendar, and tasks via Telegram",
      hoursSaved: "50h/mo",
      tag: "Productivity"
    }
  ];

  const stats = [
    { value: "80h", label: "Avg Hours Saved/Month" },
    { value: "$6,000", label: "Avg Cost Savings/Month" },
    { value: "<72h", label: "Time to Deploy" }
  ];

  return (
    <div className="min-h-screen relative">
      <FuturisticBackground />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 tech-grid overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 border-2 border-primary/20 rounded-lg rotate-12 animate-float pointer-events-none hidden sm:block" />
        <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-accent/20 rounded-full animate-pulse-glow pointer-events-none hidden sm:block" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block px-4 py-1 rounded-full border border-accent/20 bg-accent/5 text-sm font-medium text-accent mb-6 animate-fade-in">
              AI Automations Deployed in 24 Hours
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
              Automate Your Biz
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in">
              Stop doing repetitive work. Let AI handle your email, marketing, analytics, and operations — fully managed for one flat monthly fee.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in">
              <Button size="lg" className="gradient-primary shadow-glow text-lg px-8 h-14" asChild>
                <Link to="/catalog">Browse Automations</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14" asChild>
                <Link to="/get-started">Book Enterprise Consultation</Link>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground pt-8 border-t border-border/50">
              <span>Trusted by founders, creators, and growing teams</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 sm:py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 glass hover:shadow-neon transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your workflow
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />
            
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-8 glass hover:shadow-neon transition-all duration-300 h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground mb-6 shadow-glow relative z-10">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                    <div className="mt-6 pt-6 border-t border-border/50 w-full">
                      <p className="text-sm text-primary font-medium">
                        {index === 0 && "Choose from 1000+ pre-built workflows"}
                        {index === 1 && "Live in 24-72 hours, fully configured"}
                        {index === 2 && "Monthly check-ins & improvements"}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Automations */}
      <section className="py-16 sm:py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Popular Automations</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The most requested AI workflows that save time and money
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularAutomations.map((automation, index) => (
              <Card key={index} className="p-6 glass hover:shadow-neon transition-all duration-300 hover:-translate-y-1 group">
                <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                  {automation.icon}
                </div>
                <div className="inline-block px-2 py-1 rounded text-xs font-medium bg-accent/10 text-accent mb-3">
                  {automation.tag}
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {automation.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{automation.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-sm font-medium text-primary">{automation.hoursSaved}</span>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View Details →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" className="gradient-primary shadow-glow" asChild>
              <Link to="/catalog">View All Automations</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              AI That Saves Hundreds of Hours a Year
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate your exact savings and ROI with our interactive calculator
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center glass">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>

          <ROICalculator />
        </div>
      </section>

      {/* CTA Block */}
      <section className="py-16 sm:py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-primary">
            Ready to Automate Your Business?
          </h2>
          <p className="text-lg text-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of founders who've reclaimed their time with AI automation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 h-14 gradient-primary text-white shadow-glow" asChild>
              <Link to="/catalog">Browse Automations</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild>
              <Link to="/get-started">Book Consultation</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
