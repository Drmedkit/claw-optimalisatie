import { useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function ContactContent() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      propertyAddress: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || result.error || "Failed to submit contact form");
      }

      setIsSubmitted(true);
      form.reset();
      
      toast({
        title: "Bericht verzonden!",
        description: "Wij nemen zo snel mogelijk contact met u op.",
      });
      
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        variant: "destructive",
        title: "Fout bij verzenden",
        description: error instanceof Error ? error.message : "Er is een fout opgetreden. Probeer het later opnieuw.",
      });
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      label: "Email",
      value: "info@labellens.nl",
      href: "mailto:info@labellens.nl",
    },
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      label: "Telefoon",
      value: "020-123-4567",
      href: "tel:020-123-4567",
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      label: "Locatie",
      value: "Amsterdam, Nederland",
      href: null,
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Neem contact op
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Heeft u vragen? Neem gerust contact met ons op
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <ScrollReveal>
            <div>
              <h3 className="text-2xl font-semibold mb-6">Stuur ons een bericht</h3>
              
              {isSubmitted && (
                <div
                  data-testid="alert-contact-success"
                  className="mb-6 p-4 bg-primary/10 border-2 border-primary rounded-lg"
                >
                  <p className="text-primary font-medium">
                    Bedankt voor uw bericht! Wij nemen zo snel mogelijk contact met u op.
                  </p>
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Naam *</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-contact-name"
                            placeholder="Uw naam"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-contact-email"
                            type="email"
                            placeholder="uw@email.nl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefoon</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-contact-phone"
                            type="tel"
                            placeholder="06-12345678"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="propertyAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Woningadres</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-contact-address"
                            placeholder="Straatnaam 123, Amsterdam"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bericht *</FormLabel>
                        <FormControl>
                          <Textarea
                            data-testid="input-contact-message"
                            placeholder="Uw vraag of opmerking..."
                            className="min-h-[150px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    data-testid="button-submit-contact-form"
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover-elevate active-elevate-2"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Verstuur bericht
                  </Button>
                </form>
              </Form>
            </div>
          </ScrollReveal>

          {/* Contact Info */}
          <ScrollReveal delay={200}>
            <div>
              <h3 className="text-2xl font-semibold mb-6">Contactgegevens</h3>
              
              <Card className="mb-8">
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

              <Card>
                <CardHeader>
                  <CardTitle>Openingstijden</CardTitle>
                </CardHeader>
                <CardContent data-testid="text-contact-opening-hours">
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Maandag - Vrijdag</span>
                      <span className="font-medium">09:00 - 17:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekend</span>
                      <span className="font-medium">Op afspraak</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
