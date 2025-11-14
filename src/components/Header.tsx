import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import logo from "@/assets/bump-syndicate-logo.png";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [badgeAnimate, setBadgeAnimate] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { itemCount } = useCart();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (itemCount > 0) {
      setBadgeAnimate(true);
      const timer = setTimeout(() => setBadgeAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);
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
            <img src={logo} alt="Bump Syndicate Logo" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full shadow-neon cursor-pointer transition-transform duration-300 hover:scale-110" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/catalog" onClick={() => window.scrollTo(0, 0)} className="text-foreground hover:text-primary transition-smooth">
              Automations
            </Link>
            <Link to="/build-my-stack" onClick={() => window.scrollTo(0, 0)} className="text-foreground hover:text-primary transition-smooth">
              Build My Stack
            </Link>
            <Link to="/cart" onClick={() => window.scrollTo(0, 0)} className="text-foreground hover:text-primary transition-smooth relative inline-flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Cart
              {itemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className={`absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 text-xs ${badgeAnimate ? 'animate-bounce' : ''}`}
                >
                  {itemCount}
                </Badge>
              )}
            </Link>
            <Link to="/get-started" onClick={() => window.scrollTo(0, 0)}>
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
            <Link to="/catalog" className="text-foreground hover:text-primary transition-smooth text-left" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}>
              Automations
            </Link>
            <Link to="/build-my-stack" className="text-foreground hover:text-primary transition-smooth text-left" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}>
              Build My Stack
            </Link>
            <Link to="/cart" className="text-foreground hover:text-primary transition-smooth text-left flex items-center gap-2" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}>
              <ShoppingCart className="w-5 h-5" />
              Cart
              {itemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className={`h-5 min-w-5 flex items-center justify-center p-0 text-xs ${badgeAnimate ? 'animate-bounce' : ''}`}
                >
                  {itemCount}
                </Badge>
              )}
            </Link>
            <Link to="/get-started" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}>
              <Button className="gradient-primary shadow-glow w-full">
                Get Started
              </Button>
            </Link>
          </nav>}
      </div>
    </header>;
};
export default Header;