import { Link, useLocation } from "wouter";
import { Mail, Phone, MapPin, Building2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import logoImage from "@assets/image_1771231176708.webp";

export function Footer() {
  const [location] = useLocation();

  const handleSectionClick = (sectionId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <footer className="bg-card border-t border-card-border mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <img
              src={logoImage}
              alt="Label & Lens Vastgoed"
              className="h-12 w-auto mb-4"
             loading="lazy" decoding="async" />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigatie</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <a
                href="/#homepage-selector"
                data-testid="link-footer-energielabel"
                onClick={handleSectionClick("homepage-selector")}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Energielabel
              </a>
              <a
                href="/#onze-diensten"
                data-testid="link-footer-onze-diensten"
                onClick={handleSectionClick("onze-diensten")}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Onze diensten
              </a>
              <Link
                href="/fotografie"
                data-testid="link-footer-fotografie"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Fotografie
              </Link>
              <a
                href="/#prijzen"
                data-testid="link-footer-prijzen"
                onClick={handleSectionClick("prijzen")}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Prijzen
              </a>
              <a
                href="/#contact"
                data-testid="link-footer-contact"
                onClick={handleSectionClick("contact")}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Contact
              </a>
              <a
                href="/#faq"
                data-testid="link-footer-faq"
                onClick={handleSectionClick("faq")}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                FAQ
              </a>
              <a
                href="/#over-ons"
                data-testid="link-footer-over-ons"
                onClick={handleSectionClick("over-ons")}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Over ons
              </a>
            </nav>
          </div>

          {/* Onze diensten */}
          <div>
            <h4 className="font-semibold mb-4">Onze diensten</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link
                href="/energielabels"
                data-testid="link-footer-energielabels"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Energielabels
              </Link>
              <Link
                href="/wws-puntentelling/"
                data-testid="link-footer-wws-puntentelling"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                WWS Puntentelling
              </Link>
              <Link
                href="/nen-2580-metingen/"
                data-testid="link-footer-nen-2580"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                NEN 2580 Metingen
              </Link>
            </nav>
          </div>

          {/* Over energielabels */}
          <div>
            <h4 className="font-semibold mb-4">Over energielabels</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link
                href="/energielabel-aanvragen-amsterdam/"
                data-testid="link-footer-energielabel-amsterdam"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Energielabel Amsterdam
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="flex flex-col space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:Info@labelenlens.nl" className="hover:text-primary transition-colors">
                  <span data-testid="text-footer-email">Info@labelenlens.nl</span>
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+31643735719" className="hover:text-primary transition-colors">
                  <span data-testid="text-footer-phone">+31 6 43 73 57 19</span>
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FaWhatsapp className="w-4 h-4 text-primary" />
                <a
                  href="https://wa.me/31643735719"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                  data-testid="link-footer-whatsapp"
                >
                  WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span data-testid="text-footer-location">Amsterdam</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <Building2 className="w-4 h-4 text-primary" />
                <span data-testid="text-footer-kvk">KVK: 87532638</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-card-border text-center text-sm text-muted-foreground">
          <p data-testid="text-footer-copyright">
            © {new Date().getFullYear()} Label & Lens. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}
