import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";

export function ContactInfoContent() {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      label: "Email",
      value: "Info@labelenlens.nl",
      href: "mailto:Info@labelenlens.nl",
    },
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      label: "Telefoon",
      value: "+31 6 43 73 57 19",
      href: "tel:+31643735719",
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      label: "Locatie",
      value: "Amsterdam, Nederland",
      href: null,
    },
  ];

  return (
    <section className="py-12 md:py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Neem contact op
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Heeft u vragen? Neem gerust contact op
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Left: contact info */}
          <ScrollReveal>
            <Card className="h-full">
              <CardContent className="p-8 space-y-6">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    data-testid={`contact-info-item-${index}`}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 mt-1">{info.icon}</div>
                    <div>
                      <div className="font-medium mb-1">{info.label}</div>
                      {info.href ? (
                        <a
                          href={info.href}
                          data-testid={`link-contact-${info.label.toLowerCase()}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <div className="text-muted-foreground">{info.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Right: compact openingstijden + action buttons */}
          <ScrollReveal delay={100} className="h-full">
            <div className="flex flex-col gap-4 h-full">
              {/* Openingstijden – grows to fill available height */}
              <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-3 pt-5 px-6">
                  <CardTitle className="text-base">Openingstijden</CardTitle>
                </CardHeader>
                <CardContent data-testid="text-contact-opening-hours" className="px-6 pb-6 flex-1 flex flex-col justify-center">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex justify-between gap-4">
                      <span>Maandag - Vrijdag</span>
                      <span className="font-medium">08:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Weekend</span>
                      <span className="font-medium">Op afspraak</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-[#25D366] hover:bg-[#25D366] text-white border-[#25D366]"
                  data-testid="button-whatsapp"
                >
                  <a href="https://wa.me/31643735719" target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp className="w-5 h-5 mr-2" />
                    WhatsApp
                  </a>
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full"
                    data-testid="button-email"
                  >
                    <a href="mailto:Info@labelenlens.nl">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full"
                    data-testid="button-bellen"
                  >
                    <a href="tel:+31643735719">
                      <Phone className="w-4 h-4 mr-2" />
                      Bellen
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
