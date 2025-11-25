import { Instagram, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return <footer className="bg-card text-card-foreground border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Bump AI</h3>
            <p className="text-muted-foreground">Build authentic communities, drive organic growth, and automate the process.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog" onClick={() => window.scrollTo(0, 0)} className="text-muted-foreground hover:text-primary transition-smooth">
                  Automations
                </Link>
              </li>
              <li>
                <Link to="/build-my-stack" onClick={() => window.scrollTo(0, 0)} className="text-muted-foreground hover:text-primary transition-smooth">
                  Build My Stack
                </Link>
              </li>
              <li>
                <Link to="/get-started" onClick={() => window.scrollTo(0, 0)} className="text-muted-foreground hover:text-primary transition-smooth">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/cart" onClick={() => window.scrollTo(0, 0)} className="text-muted-foreground hover:text-primary transition-smooth">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Connect With Us</h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/bump_syndicate/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-smooth text-primary">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com/in/connectingtheworld/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-smooth text-primary">
                <Linkedin size={20} />
              </a>
              <a href="mailto:marketing@thebumpteam.com" className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-smooth text-primary">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Bump AI. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;