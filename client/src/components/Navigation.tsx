import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Energielabel", sectionId: null },
    { href: "/fotografie", label: "Fotografie", sectionId: null },
    { href: "/#prijzen", label: "Prijzen", sectionId: "prijzen" },
    { href: "/#contact", label: "Contact", sectionId: "contact" },
  ];

  const closeSheet = () => setIsOpen(false);

  const handleSectionClick = (sectionId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeSheet();
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
    <header className="absolute top-0 left-0 right-0 z-30 px-4 md:px-6 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-col items-center space-y-4">
          {/* Brand Name Above Navigation */}
          <Link
            href="/"
            data-testid="link-home-brand"
            className="text-white font-bold text-lg md:text-xl tracking-widest hover-elevate transition-colors duration-300 inline-block"
          >
            Label & Lens
          </Link>

          {/* Center Navigation */}
          <nav
            className="flex items-center flex-wrap justify-center gap-x-8 md:gap-x-12 gap-y-2 text-sm md:text-base"
            role="navigation"
            aria-label="Hoofdnavigatie"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                onClick={link.sectionId ? handleSectionClick(link.sectionId) : undefined}
                className={`${
                  location === link.href
                    ? "text-primary font-medium"
                    : "text-white/90 hover:text-white font-light"
                } tracking-wide transition-colors duration-300`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-between">
          <Link
            href="/"
            data-testid="link-home-brand-mobile"
            className="text-white font-bold text-lg tracking-widest"
          >
            Label & Lens
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                data-testid="button-mobile-menu"
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-left">Navigatie</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                    onClick={(e) => {
                      if (link.sectionId) {
                        handleSectionClick(link.sectionId)(e);
                      } else {
                        closeSheet();
                      }
                    }}
                    className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                      location === link.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
