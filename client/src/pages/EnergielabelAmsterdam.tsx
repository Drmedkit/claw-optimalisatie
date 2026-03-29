import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Zap, Clock, Shield, MessageCircle, Phone, Mail, Star, ChevronDown, ChevronUp, BadgeCheck } from "lucide-react";
import { Link } from "wouter";
import { FaWhatsapp } from "react-icons/fa";
import { useSEO } from "@/hooks/useSEO";
import heroImage from "@assets/new-amsterdam-canal_1760876000697.png";
import { useState, useEffect } from "react";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Label & Lens",
    url: "https://www.labelenlens.nl",
    telephone: "+31643735719",
    email: "Info@labelenlens.nl",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Amsterdam",
      addressCountry: "NL",
    },
    areaServed: [
      { "@type": "City", name: "Amsterdam" },
      { "@type": "Place", name: "Amsterdam Zuid" },
      { "@type": "Place", name: "De Pijp" },
      { "@type": "Place", name: "Oud-West" },
      { "@type": "Place", name: "Amsterdam Noord" },
      { "@type": "Place", name: "Jordaan" },
    ],
    description:
      "EPA-gecertificeerd energielabel aanvragen in Amsterdam. Persoonlijke aanpak, officieel geregistreerd en gegarandeerd binnen 5 werkdagen.",
    priceRange: "€€",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Energielabel diensten Amsterdam",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Energielabel aanvragen Amsterdam",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "WWS puntentelling Amsterdam",
          },
        },
      ],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Hoe lang is een energielabel geldig?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Een energielabel is 10 jaar geldig na registratie bij EP-online.",
        },
      },
      {
        "@type": "Question",
        name: "Wanneer is een energielabel verplicht in Amsterdam?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bij verkoop of verhuur van een woning is een geldig energielabel verplicht. Heb je geen label of is het verlopen, dan ben je wettelijk verplicht dit te regelen voor overdracht.",
        },
      },
      {
        "@type": "Question",
        name: "Wat kost een energielabel in Amsterdam?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "De kosten hangen af van het aantal m² van de woning. Via de prijscalculator op de website bereken je binnen één minuut de prijs voor jouw specifieke woning.",
        },
      },
      {
        "@type": "Question",
        name: "Hoe snel kan ik een energielabel krijgen in Amsterdam?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In de meeste gevallen kan er binnen 1–2 werkdagen langsgekomen worden. Label & Lens garandeert levering binnen 5 werkdagen. Bij spoed wordt altijd gekeken naar de mogelijkheden.",
        },
      },
      {
        "@type": "Question",
        name: "Is Label & Lens EPA-gecertificeerd?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, Label & Lens werkt met EPA-gecertificeerde adviseurs. Het energielabel wordt officieel geregistreerd bij EP-online en is direct geldig voor verkoop, verhuur of andere doeleinden.",
        },
      },
    ],
  },
];

const faqs = [
  {
    question: "Hoe lang is een energielabel geldig?",
    answer: "Een energielabel is 10 jaar geldig na registratie bij EP-online.",
  },
  {
    question: "Wanneer is een energielabel verplicht in Amsterdam?",
    answer:
      "Bij verkoop of verhuur van een woning is een geldig energielabel verplicht. Heb je geen label of is het verlopen, dan ben je wettelijk verplicht dit te regelen voor overdracht.",
  },
  {
    question: "Wat kost een energielabel in Amsterdam?",
    answer:
      "De kosten hangen af van het aantal m² van de woning. Via de prijscalculator bereken je binnen één minuut de prijs voor jouw specifieke woning.",
  },
  {
    question: "Hoe snel kan ik een energielabel krijgen in Amsterdam?",
    answer:
      "In de meeste gevallen kan er binnen 1–2 werkdagen langsgekomen worden. Label & Lens garandeert levering binnen 5 werkdagen. Bij spoed wordt altijd gekeken naar de mogelijkheden.",
  },
  {
    question: "Is Label & Lens EPA-gecertificeerd?",
    answer:
      "Ja, Label & Lens werkt met EPA-gecertificeerde adviseurs. Het energielabel wordt officieel geregistreerd bij EP-online en is direct geldig voor verkoop, verhuur of andere doeleinden.",
  },
];

const reasons = [
  {
    icon: <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />,
    title: "EPA-gecertificeerd",
    text: "Officieel gecertificeerde adviseurs, geregistreerd bij EP-online. Direct geldig voor verkoop en verhuur.",
  },
  {
    icon: <Star className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />,
    title: "Persoonlijke aanpak",
    text: "Direct en persoonlijk contact, geen massaproces en geplaatste ZZP'ers.",
  },
  {
    icon: <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />,
    title: "Duidelijke communicatie",
    text: "Je weet altijd waar je aan toe bent.",
  },
  {
    icon: <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />,
    title: "Binnen 5 werkdagen",
    text: "Vaak binnen 48 uur geregeld, gegarandeerd binnen 5 werkdagen.",
  },
  {
    icon: <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />,
    title: "Kwaliteit",
    text: "Er wordt de tijd genomen om het goed te doen, je wordt meegenomen in het proces.",
  },
  {
    icon: <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />,
    title: "Flexibel",
    text: "Er wordt meegedacht over wat werkt voor jou.",
  },
  {
    icon: <MessageCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />,
    title: "Advies op maat",
    text: "Uitgebreid advies hoe de woning verbeterd kan worden binnen jouw eisen en budget.",
  },
];

const obligatoryItems = [
  "Verkoop of verhuur van een woning",
  "Oplevering van nieuwbouw",
  "Monumentale panden (vanaf 29 mei 2026)",
  "Verkoop of verhuur van bedrijfspanden",
  "Kantoren (minimaal energielabel C verplicht bij gebruik)",
  "Sociale huurwoningen (vanaf 2029 minimaal energielabel D)",
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        data-testid={`faq-toggle-${question.slice(0, 20).replace(/\s/g, "-").toLowerCase()}`}
        className="w-full flex items-center justify-between gap-4 py-4 text-left font-medium hover-elevate active-elevate-2 rounded-md px-1"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{question}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <p className="pb-4 px-1 text-muted-foreground text-sm leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function EnergielabelAmsterdam() {
  useSEO({
    title: "Energielabel aanvragen Amsterdam",
    description:
      "Energielabel aanvragen in Amsterdam? Label & Lens is EPA-gecertificeerd en levert binnen 5 werkdagen. Officieel geregistreerd, voor verkoop én verhuur. Bereken direct uw prijs.",
    canonical: "/energielabel-aanvragen-amsterdam/",
    jsonLd,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <Hero
        title="Energielabel aanvragen in Amsterdam"
        subtitle="EPA-gecertificeerd · officieel geregistreerd · binnen 5 werkdagen"
        imageSrc={heroImage}
        imageAlt="Karakteristieke Amsterdamse grachtenpanden"
      >
        <a href="/#homepage-selector">
          <Button
            data-testid="button-hero-aanvragen"
            size="lg"
            className="bg-primary text-primary-foreground border-2 border-primary-border px-8 text-lg font-semibold rounded-full"
          >
            Energielabel aanvragen
            <ChevronDown className="w-5 h-5 ml-2" />
          </Button>
        </a>
      </Hero>

      <main>
        {/* Vertrouwensbalk */}
        <div className="bg-card border-b border-card-border">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-primary" />
              <strong className="text-foreground">EPA-gecertificeerd</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-primary" />
              <strong className="text-foreground">Binnen 5 werkdagen</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary" />
              <strong className="text-foreground">Geldig voor verkoop &amp; verhuur</strong>
            </span>
          </div>
        </div>

        {/* Intro */}
        <ScrollReveal>
          <section className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Energielabel laten opmaken in Amsterdam
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Wil je een <strong>energielabel aanvragen in Amsterdam</strong>? Label &amp; Lens helpt je snel en persoonlijk verder. Als EPA-gecertificeerde adviseur regelen we het energielabel officieel via EP-online — geldig voor zowel verkoop als verhuur. Geen massaproces, maar duidelijke communicatie en kwaliteit. In veel gevallen binnen 48 uur afgerond, gegarandeerd binnen 5 werkdagen.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Label &amp; Lens is actief door heel Amsterdam: van{" "}
                <strong>Amsterdam Zuid</strong>, <strong>De Pijp</strong> en{" "}
                <strong>Oud-West</strong> tot <strong>Amsterdam Noord</strong>, de{" "}
                <strong>Jordaan</strong> en alle andere wijken.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* Hoe werkt het */}
        <ScrollReveal>
          <section className="py-12 md:py-16 bg-card border-y border-card-border">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Hoe werkt een energielabel aanvragen?
              </h2>
              <p className="text-muted-foreground mb-6">
                Het aanvragen van een energielabel is simpel en overzichtelijk:
              </p>
              <ol className="space-y-5">
                {[
                  {
                    step: "1",
                    text: (
                      <>
                        Je zet de opdracht uit via het{" "}
                        <a
                          href="/#homepage-selector"
                          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                          data-testid="link-step-opdrachtvenster"
                        >
                          opdrachtvenster
                        </a>
                        , liever persoonlijk contact? Stuur een bericht via{" "}
                        <a
                          href="https://wa.me/31643735719"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                          data-testid="link-step-whatsapp"
                        >
                          WhatsApp
                        </a>
                        ,{" "}
                        <a
                          href="mailto:Info@labelenlens.nl"
                          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                          data-testid="link-step-mail"
                        >
                          mail
                        </a>{" "}
                        of{" "}
                        <a
                          href="tel:+31643735719"
                          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                          data-testid="link-step-bel"
                        >
                          bel direct
                        </a>
                        .
                      </>
                    ),
                  },
                  { step: "2", text: "Er wordt contact opgenomen om de afspraak in te plannen." },
                  { step: "3", text: "Er wordt langsgekomen voor de opname van de woning." },
                  { step: "4", text: "Je ontvangt het energielabel officieel geregistreerd bij EP-online." },
                ].map(({ step, text }) => (
                  <li key={step} className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {step}
                    </span>
                    <p className="text-muted-foreground leading-relaxed pt-1">{text}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm text-muted-foreground">
                Bij vragen binnen dit proces wordt er contact opgenomen, zodat je niet voor verrassingen komt te staan.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* Kosten */}
        <ScrollReveal>
          <section className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Wat kost een energielabel in Amsterdam?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                De kosten van een <strong>energielabel in Amsterdam</strong> hangen af van het aantal m² van de woning. Bereken binnen één minuut eenvoudig de prijs van jouw woning. Heb je meerdere woningen of een VvE? Neem dan contact op voor een passend aanbod.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/#prijzen">
                  <Button
                    data-testid="button-prijs-berekenen"
                    size="lg"
                    className="bg-primary text-primary-foreground"
                  >
                    Jouw pakket prijs berekenen
                  </Button>
                </a>
                <Link href="/contact">
                  <Button
                    data-testid="button-contact-meerdere"
                    size="lg"
                    variant="outline"
                  >
                    Meerdere woningen? Neem contact op
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Snelheid */}
        <ScrollReveal>
          <section className="py-12 md:py-16 bg-card border-y border-card-border">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Hoe snel kan ik een energielabel krijgen?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Snelheid is een belangrijke factor in de vastgoedsector. Label &amp; Lens onderscheidt zich juist op snelheid en flexibiliteit.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Binnen 1–2 dagen langskomen voor de opname</span>
                </li>
                <li className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Het energielabel binnen 48 uur afronden</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Gegarandeerd binnen 5 werkdagen geregistreerd</span>
                </li>
              </ul>
              <p className="text-muted-foreground">
                Heb je spoed? Laat het weten, dan wordt er gekeken wat er mogelijk is.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* Verplicht */}
        <ScrollReveal>
          <section className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Wanneer is een energielabel verplicht?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Een <strong>energielabel is verplicht in Amsterdam</strong> in de volgende situaties:
              </p>
              <ul className="space-y-3 mb-6">
                {obligatoryItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Zorg dat dit op tijd geregeld is om vertraging of boetes te voorkomen. Heb je ook te maken met een{" "}
                    <Link
                      href="/energielabels"
                      className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                      data-testid="link-verbeteradvies"
                    >
                      verbeteradvies
                    </Link>{" "}
                    of een{" "}
                    <a
                      href="/#onze-diensten"
                      className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                      data-testid="link-wws"
                    >
                      WWS puntentelling
                    </a>
                    ? Label &amp; Lens regelt dit in één keer.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </ScrollReveal>

        {/* Waarom */}
        <ScrollReveal>
          <section className="py-12 md:py-16 bg-card border-y border-card-border">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Waarom kiezen voor Label &amp; Lens in Amsterdam?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Label &amp; Lens werkt bewust anders dan grote massale partijen. Geen "snelle opdracht en door", maar gewoon goed geregeld, met duidelijkheid en advies waar nodig.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {reasons.map(({ icon, title, text }) => (
                  <div key={title} className="flex gap-3 items-start">
                    {icon}
                    <div>
                      <h3 className="font-semibold mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Amsterdam specifiek */}
        <ScrollReveal>
          <section className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Energielabel woning Amsterdam – lokale kennis maakt het verschil
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Label &amp; Lens werkt dagelijks in Amsterdam en kent de verschillende woningtypes goed. Met name de oudere panden — zoals je die vindt in de <strong>Jordaan</strong>, <strong>De Pijp</strong>, <strong>Oud-West</strong> en <strong>Amsterdam Zuid</strong> — vragen extra aandacht bij de energieopname. Die aandacht wordt ook gegeven.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                De opgedane ervaring met Amsterdamse woningen helpt bij het onderzoek en de beoordeling. Dit heeft een positief effect op het energielabel — zeker bij renovaties en het opstellen van een{" "}
                <Link
                  href="/energielabels"
                  className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                  data-testid="link-verbeteradvies-amsterdam"
                >
                  verbeteradvies
                </Link>
                .
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Er wordt precies gelet op waar het op aankomt bij de opname en de nodige tijd genomen om alles uit de woning te halen. Of je nu in <strong>Amsterdam Noord</strong>, <strong>Oost</strong> of <strong>Nieuw-West</strong> zit: Label &amp; Lens komt langs.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* FAQ */}
        <ScrollReveal>
          <section className="py-12 md:py-16 bg-card border-y border-card-border">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Veelgestelde vragen over energielabel aanvragen in Amsterdam
              </h2>
              <div>
                {faqs.map((faq) => (
                  <FAQItem key={faq.question} {...faq} />
                ))}
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Andere vragen?{" "}
                <a
                  href="/#faq"
                  className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                  data-testid="link-faq-meer-vragen"
                >
                  Bekijk alle veelgestelde vragen
                </a>
                .
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal>
          <section className="py-12 md:py-20">
            <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Energielabel aanvragen in Amsterdam?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Zet direct je opdracht uit via het opdrachtvenster of neem persoonlijk contact op.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="/#homepage-selector">
                  <Button
                    data-testid="button-cta-aanvragen"
                    size="lg"
                    className="bg-primary text-primary-foreground px-8"
                  >
                    Opdracht uitzetten
                  </Button>
                </a>
                <a href="https://wa.me/31643735719" target="_blank" rel="noopener noreferrer">
                  <Button
                    data-testid="button-cta-whatsapp"
                    size="lg"
                    variant="outline"
                  >
                    <FaWhatsapp className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </a>
                <a href="mailto:Info@labelenlens.nl">
                  <Button
                    data-testid="button-cta-mail"
                    size="lg"
                    variant="outline"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Mail
                  </Button>
                </a>
                <a href="tel:+31643735719">
                  <Button
                    data-testid="button-cta-bel"
                    size="lg"
                    variant="outline"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Bel
                  </Button>
                </a>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
