import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/bump-syndicate-logo.png";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
      setIsMobileMenuOpen(false);
    }
  };
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${isScrolled ? "glass border-b border-primary/10 shadow-neon" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-3">
            <img src={logo} alt="Bump Syndicate Logo" className="w-10 h-10 rounded-full shadow-neon cursor-pointer" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/creator-partnerships" onClick={() => window.scrollTo(0, 0)} className="text-foreground hover:text-primary transition-smooth">
              Creator Partnerships
            </Link>
            <Link to="/brand-campaigns" onClick={() => window.scrollTo(0, 0)} className="text-foreground hover:text-primary transition-smooth">
              Brand Campaigns
            </Link>
            <Link to="/automations-support" onClick={() => window.scrollTo(0, 0)} className="text-foreground hover:text-primary transition-smooth">
              Automation
            </Link>
            <Link to="/growth-strategy" onClick={() => window.scrollTo(0, 0)} className="text-foreground hover:text-primary transition-smooth">
              Growth Strategy
            </Link>
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <Button className="gradient-primary shadow-glow">
                Get Started
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4 animate-fade-in">
            <Link to="/creator-partnerships" className="text-foreground hover:text-primary transition-smooth text-left" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}>
              Creator Partnerships
            </Link>
            <Link to="/brand-campaigns" className="text-foreground hover:text-primary transition-smooth text-left" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}>
              Brand Campaigns
            </Link>
            <Link to="/automations-support" className="text-foreground hover:text-primary transition-smooth text-left" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}>
              Automation
            </Link>
            <Link to="/growth-strategy" className="text-foreground hover:text-primary transition-smooth text-left" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}>
              Growth Strategy
            </Link>
            <Link to="/" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}>
              <Button className="gradient-primary shadow-glow w-full">
                Get Started
              </Button>
            </Link>
          </nav>}
      </div>
    </header>;
};
export default Header;