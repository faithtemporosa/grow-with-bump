import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  const scrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden tech-grid">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Brand growth and creator collaborations" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10" />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 border-2 border-primary/30 rounded-lg rotate-45 animate-float" />
        <div className="absolute bottom-40 right-20 w-32 h-32 border-2 border-accent/30 rounded-full animate-float" style={{
        animationDelay: "1s"
      }} />
        <div className="absolute top-1/3 right-10 w-16 h-16 border-2 border-primary/30 rotate-12 animate-float" style={{
        animationDelay: "2s"
      }} />
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{
        animationDelay: "1.5s"
      }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in">
            <span className="block mb-2">Turn Creators Into</span>
            <span className="block gradient-hero bg-clip-text text-transparent">
              Your Growth Engine
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{
          animationDelay: "0.1s"
        }}>
            Leverage AI-powered creator matching and data-driven campaigns to build authentic communities and drive exponential brand growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{
          animationDelay: "0.2s"
        }}>
            <Button size="lg" onClick={scrollToContact} className="gradient-primary shadow-neon hover:scale-105 transition-smooth text-lg px-8 group">
              Start Growing <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
            <Button size="lg" variant="outline" onClick={scrollToAbout} className="glass border-primary/30 hover:bg-primary/10 text-lg px-8">
              Explore Platform
            </Button>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto animate-fade-in" style={{
          animationDelay: "0.3s"
        }}>
            <div className="glass p-4 rounded-lg tech-border">
              
              <div className="text-sm text-muted-foreground">Creators</div>
            </div>
            <div className="glass p-4 rounded-lg tech-border">
              
              <div className="text-sm text-muted-foreground">Brands</div>
            </div>
            <div className="glass p-4 rounded-lg tech-border">
              
              <div className="text-sm text-muted-foreground">Reach</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full" />
        </div>
      </div>
    </section>;
};
export default Hero;