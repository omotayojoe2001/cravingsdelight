import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin } from "lucide-react";
import { brandContent } from "@/data/menu";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-3xl font-bold mb-4">
              Cravings Delight
            </h3>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              {brandContent.aboutStory}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${settings.contact_email}`}
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/menu" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Menu
              </Link>
              <Link to="/catering" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Catering Services
              </Link>
              <Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <div className="flex flex-col gap-3 text-primary-foreground/80">
              <a
                href={`mailto:${settings.contact_email}`}
                className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                {settings.contact_email}
              </a>
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
                {settings.instagram_handle}
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1" />
                <span>{settings.business_location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <p className="text-center text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Cravings Delight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
