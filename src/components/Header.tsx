import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, ShoppingCart, Heart, LogIn, LogOut, User, Settings, Shield, Package } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAdmin } from "@/hooks/use-admin";
import { MiniCartPanel } from "@/components/MiniCartPanel";
import { NotificationCenter } from "@/components/NotificationCenter";
import logo from "@/assets/bump-ai-logo.png";
import robotMascot from "@/assets/robot-mascot.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [badgeAnimate, setBadgeAnimate] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const { wishlistIds } = useWishlist();
  const { isAdmin } = useAdmin();
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 20);
      
      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
  return (
    <>
      <MiniCartPanel />
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${isScrolled ? "glass border-b border-primary/10 shadow-neon backdrop-blur-xl" : "bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm"}`}>
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            onClick={() => window.scrollTo(0, 0)} 
            className="flex items-center gap-2 sm:gap-3 group"
          >
            <img 
              src={logo} 
              alt="Bump AI Logo" 
              className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain cursor-pointer transition-all duration-300 group-hover:scale-110 ${isScrolled ? 'drop-shadow-glow' : 'drop-shadow-lg'}`}
              style={{ 
                mixBlendMode: 'normal',
                isolation: 'isolate',
                imageRendering: 'crisp-edges'
              }}
            />
            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 flex items-center gap-2">
              <img 
                src={robotMascot} 
                alt="Robot Mascot" 
                className="h-[1em] w-auto object-contain"
              />
              Bump AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-4">
            <Link to="/catalog" onClick={() => window.scrollTo(0, 0)} className="text-sm xl:text-base text-foreground hover:text-primary transition-all duration-300 hover:scale-105 hover:drop-shadow-glow relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-accent after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap">
              Automations
            </Link>
            <Link to="/build-my-stack" onClick={() => window.scrollTo(0, 0)} className="text-sm xl:text-base text-foreground hover:text-primary transition-all duration-300 hover:scale-105 hover:drop-shadow-glow relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-accent after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap">
              Build Stack
            </Link>
            <Link to="/wishlist" onClick={() => window.scrollTo(0, 0)} className="text-sm xl:text-base text-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative inline-flex items-center gap-1.5 group whitespace-nowrap">
              <Heart className="w-4 h-4 group-hover:fill-primary transition-all duration-300" />
              <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-accent after:transition-all after:duration-300 group-hover:after:w-full hidden xl:inline">Wishlist</span>
              {wishlistIds.size > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                >
                  {wishlistIds.size}
                </Badge>
              )}
            </Link>
            <Link to="/cart" onClick={() => window.scrollTo(0, 0)} className="text-sm xl:text-base text-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative inline-flex items-center gap-1.5 group whitespace-nowrap">
              <ShoppingCart className="w-4 h-4 group-hover:drop-shadow-glow transition-all duration-300" />
              <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-accent after:transition-all after:duration-300 group-hover:after:w-full hidden xl:inline">Cart</span>
              {itemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className={`absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 text-xs ${badgeAnimate ? 'animate-bounce' : 'animate-pulse'}`}
                >
                  {itemCount}
                </Badge>
              )}
            </Link>
            <Link to="/my-orders" onClick={() => window.scrollTo(0, 0)} className="text-sm xl:text-base text-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative inline-flex items-center gap-1.5 group whitespace-nowrap">
              <Package className="w-4 h-4 group-hover:drop-shadow-glow transition-all duration-300" />
              <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-accent after:transition-all after:duration-300 group-hover:after:w-full hidden xl:inline">Orders</span>
            </Link>
            {user && <NotificationCenter />}
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => window.scrollTo(0, 0)}>
                    <Button variant="ghost" size="sm" className="gap-1 xl:gap-2">
                      <Shield className="w-4 h-4" />
                      <span className="hidden xl:inline">Admin</span>
                    </Button>
                  </Link>
                )}
                <Link to="/settings" onClick={() => window.scrollTo(0, 0)}>
                  <Button variant="ghost" size="sm" className="gap-1 xl:gap-2">
                    <Settings className="w-4 h-4" />
                    <span className="hidden xl:inline">Settings</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => signOut()} className="gap-1 xl:gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden xl:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => window.scrollTo(0, 0)}>
                <Button variant="ghost" size="sm" className="gap-1 xl:gap-2">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden xl:inline">Sign In</span>
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-foreground p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && <nav className="lg:hidden mt-4 pb-4 flex flex-col gap-4 animate-fade-in border-t border-border/20 pt-4">
            <Link to="/catalog" className="text-foreground hover:text-primary transition-smooth text-left" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}>
              Automations
            </Link>
            <Link to="/build-my-stack" className="text-foreground hover:text-primary transition-smooth text-left" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}>
              Build My Stack
            </Link>
            <Link to="/wishlist" className="text-foreground hover:text-primary transition-smooth text-left flex items-center gap-2" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}>
              <Heart className="w-5 h-5" />
              Wishlist
              {wishlistIds.size > 0 && (
                <Badge 
                  variant="secondary" 
                  className="h-5 min-w-5 flex items-center justify-center p-0 text-xs ml-auto"
                >
                  {wishlistIds.size}
                </Badge>
              )}
            </Link>
            <Link to="/cart" className="text-foreground hover:text-primary transition-smooth text-left flex items-center gap-2" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}>
              <ShoppingCart className="w-5 h-5" />
              Cart
              {itemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className={`h-5 min-w-5 flex items-center justify-center p-0 text-xs ml-auto ${badgeAnimate ? 'animate-bounce' : ''}`}
                >
                  {itemCount}
                </Badge>
              )}
            </Link>
            <Link to="/my-orders" className="text-foreground hover:text-primary transition-smooth text-left flex items-center gap-2" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}>
              <Package className="w-5 h-5" />
              My Orders
            </Link>
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}>
                    <Button variant="ghost" size="sm" className="gap-2 w-full justify-start">
                      <Shield className="w-4 h-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link to="/settings" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}>
                  <Button variant="ghost" size="sm" className="gap-2 w-full justify-start">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="gap-2 justify-start">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}>
                <Button variant="ghost" size="sm" className="gap-2 w-full justify-start">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </nav>}
        </div>
      </header>
    </>
  );
};
export default Header;