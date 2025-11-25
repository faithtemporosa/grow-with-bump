import { Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return <footer className="bg-card text-card-foreground border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8">
          {/* Social */}
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/in/connectingtheworld/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-smooth text-primary">
              <Linkedin size={20} />
            </a>
            <a href="mailto:marketing@thebumpteam.com" className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-smooth text-primary">
              <Mail size={20} />
            </a>
          </div>

          <div className="text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Bump AI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
