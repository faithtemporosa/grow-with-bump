import { Instagram, Twitter, Linkedin, Mail } from "lucide-react";
const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Bump Syndicate</h3>
            <p className="text-background/80">Build authentic communities, drive organic growth, and automate the process.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection("features")} className="text-background/80 hover:text-background transition-smooth">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("services")} className="text-background/80 hover:text-background transition-smooth">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("about")} className="text-background/80 hover:text-background transition-smooth">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("contact")} className="text-background/80 hover:text-background transition-smooth">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-background/80">
              <li>Creator Partnerships</li>
              <li>Brand Campaigns</li>
              <li>Automations Support</li>
              <li>Growth Strategy</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-smooth">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-smooth">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-smooth">
                <Linkedin size={20} />
              </a>
              <a href="mailto:hello@bumpsyndicate.com" className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-smooth">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-background/60">
          <p>&copy; {new Date().getFullYear()} Bump Syndicate. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;