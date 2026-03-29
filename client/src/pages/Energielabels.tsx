import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Zap, Clock, Shield, MessageCircle, Search, Layers, ChevronDown, ChevronUp, MapPin, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useSEO } from "@/hooks/useSEO";
import { EnergieLabelVoorbeeld } from "@/components/EnergieLabelVoorbeeld";
import heroImage from "@assets/new-amsterdam-canal_1760876000697.webp";

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
    areaServed: { "@type": "Country", name: "NL" },
    description:
      "Officieel energielabel aanvragen. Persoonlijke aanpak, BRL9500 gecertificeerd en snelle levering, vaak binnen 48 uur.",
    priceRange: "€€",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Energielabel diensten",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Energielabel aanvragen",
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
          text: "Een energielabel is 10 jaar geldig.",
        },
      },
      {
        "@type": "Question",
        name: "Moet ik aanwezig zijn bij de opname?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, voor een correcte opname is toegang tot de woning nodig.",
        },
      },
      {
        "@type": "Question",
        name: "Kan het energielabel ook met spoed?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, in veel gevallen is spoed mogelijk. Neem hiervoor direct contact op.",
        },
      },
      {
        "@type": "Question",
        name: "Wat kost een energielabel aanvragen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "De kosten hangen af van het type woning en het aantal m². Bereken direct je pakketprijs via de prijscalculator op de website.",
        },
      },
      {
        "@type": "Question",
        name: "Kan ik ook meerdere woningen tegelijk laten opnemen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, dat is mogelijk. Neem contact op voor de mogelijkheden.",
        },
      },
    ],
  },
];

const faqs = [
  {
    question: "Hoe lang is een energielabel geldig?",
    answer: "Een energielabel is 10 jaar geldig.",
  },
  {
    question: "Moet ik aanwezig zijn bij de opname?",
    answer: "Ja, voor een correcte opname is toegang tot de woning nodig.",
  },
  {
    question: "Kan het ook met spoed?",
    answer: "Ja, in veel gevallen is spoed mogelijk. Neem hiervoor direct contact op.",
  },
  {
    question: "Wat kost een energielabel aanvragen?",
    answer: "De kosten hangen af van het type woning en het aantal m². Bereken je prijs eenvoudig via de prijscalculator.",
  },
  {
    question: "Kan ik ook meerdere woningen tegelijk laten opnemen?",
    answer: "Ja, dat is mogelijk. Neem contact op voor de mogelijkheden en eventuele combinatiekorting.",
  },
];

const values = [
  {
    icon: MessageCircle,
    title: "Persoonlijk contact",
    description: "Direct contact met mij als adviseur en uitvoerder, van opname tot oplevering.",
  },
  {
    icon: Zap,
    title: "Snel",
    description: "Vaak binnen 48 uur geregeld en altijd binnen 5 werkdagen.",
  },
  {
    icon: Layers,
    title: "Eén partner",
    description: "Alles onder één dak. Eén aanspreekpunt voor het hele traject.",
  },
  {
    icon: Search,
    title: "Uitgebreide opname",
    description: "Ik kijk verder dan alleen de basis en doe waar nodig extra onderzoek om alles goed in kaart te brengen.",
  },
  {
    icon: Check,
    title: "Advies op maat",
    description: "Gericht advies op basis van jouw situatie, wensen en budget.",
  },
  {
    icon: Clock,
    title: "Flexibel",
    description: "Ook op korte termijn of buiten werktijden mogelijk.",
  },
];

const obligatoryItems = [
  "Verkoop van een woning",
  "Verhuur van een woning",
  "Oplevering van nieuwbouw",
  "Verkoop of verhuur van bedrijfspanden",
  "Kantoren (minimaal energielabel C verplicht bij gebruik)",
  "Sociale huurwoningen (vanaf 2029 minimaal energielabel D)",
  "Monumentale panden (vanaf 29 mei 2026)",
];

const doelgroepen = [
  "Particuliere woningeigenaren",
  "Makelaars",
  "Vastgoedprofessionals",
  "Beleggers",
  "Verhuurders",
  "Beheerders",
];

const labelColors: Record<string, string> = {
  "A++++": "bg-[#00853e] text-white",
  "A+++": "bg-[#00853e] text-white",
  "A++": "bg-[#00853e] text-white",
  "A+": "bg-[#00853e] text-white",
  A: "bg-[#00853e] text-white",
  B: "bg-[#51b748] text-white",
  C: "bg-[#b3d235] text-foreground",
  D: "bg-[#fff12c] text-foreground",
  E: "bg-[#fcb130] text-foreground",
  F: "bg-[#f26522] text-white",
  G: "bg-[#ee1c25] text-white",
};

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
        <p className="pb-4 px-1 text-muted-foreground text-sm leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

interface LabelResult {
  found: boolean;
  energieklasse?: string;
  registratiedatum?: string;
  geldigTot?: string;
  gebouwtype?: string;
  gebouwsubtype?: string;
  bouwjaar?: number;
  oppervlakte?: number;
  adres?: { straatnaam?: string; postcode?: string; woonplaats?: string };
}

function AddressChecker() {
  const [postcode, setPostcode] = useState("");
  const [huisnummer, setHuisnummer] = useState("");
  const [toevoeging, setToevoeging] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LabelResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const params = new URLSearchParams({ postcode, huisnummer });
      if (toevoeging) params.append("huisnummertoevoeging", toevoeging);
      const res = await fetch(`/api/energielabel/check?${params.toString()}`);
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Er is een fout opgetreden.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Er is een fout opgetreden. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  const klasse = result?.energieklasse ?? "";
  const labelClass = labelColors[klasse] ?? "bg-muted text-foreground";

  function formatDate(dateStr?: string) {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return dateStr;
    }
  }

  function isVerlopen(geldigTot?: string) {
    if (!geldigTot) return false;
    return new Date(geldigTot) < new Date();
  }

  return (
    <div>
      <form onSubmit={handleCheck} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 mb-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Postcode</label>
            <input
              data-testid="input-postcode"
              type="text"
              placeholder="bijv. 1011AB"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              required
              className="px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Huisnummer</label>
            <input
              data-testid="input-huisnummer"
              type="text"
              placeholder="bijv. 42"
              value={huisnummer}
              onChange={(e) => setHuisnummer(e.target.value)}
              required
              className="w-full sm:w-28 px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Toevoeging <span className="font-normal text-muted-foreground/70">(bijv. H, A, 1)</span>
            </label>
            <input
              data-testid="input-toevoeging"
              type="text"
              placeholder="optioneel"
              value={toevoeging}
              onChange={(e) => setToevoeging(e.target.value)}
              className="w-full sm:w-28 px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Woont u in een appartement? Vul dan ook de toevoeging in (de letter of het getal na het huisnummer, bijv. <strong className="text-foreground">H</strong>, <strong className="text-foreground">A</strong> of <strong className="text-foreground">1</strong>).
        </p>
        <Button type="submit" disabled={loading || !postcode || !huisnummer} data-testid="button-check-label">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Bezig met zoeken...</> : "Controleer label"}
        </Button>
      </form>

      {error && (
        <div data-testid="checker-error" className="flex items-start gap-3 p-4 mt-4 rounded-md border border-destructive/30 bg-destructive/5 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {result && !result.found && (
        <div data-testid="checker-not-found" className="mt-4 p-4 rounded-md border border-border bg-muted/40 text-sm text-muted-foreground space-y-2">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">Geen geregistreerd energielabel gevonden</p>
              <p>Mogelijke oorzaken:</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs">
                <li>Het adres heeft geen energielabel in het EP-online register</li>
                <li>De toevoeging (H, A, 1 etc.) ontbreekt of klopt niet</li>
                <li>De postcode of het huisnummer is niet correct ingevoerd</li>
              </ul>
              <p className="mt-2">
                <a href="/#homepage-selector" className="text-primary hover:underline font-medium">
                  Vraag nu een nieuw label aan
                </a>{" "}
                of controleer via{" "}
                <a href="https://www.ep-online.nl" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  ep-online.nl
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      )}

      {result && result.found && (
        <div data-testid="checker-result" className="p-5 rounded-md border border-border bg-background">
          <div className="flex flex-wrap items-start gap-4 mb-4">
            {klasse && (
              <div className={`text-2xl font-bold w-14 h-14 flex items-center justify-center rounded-md flex-shrink-0 ${labelClass}`}>
                {klasse}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {result.adres?.straatnaam && (
                <p className="font-medium text-sm truncate">{result.adres.straatnaam}</p>
              )}
              {(result.adres?.postcode || result.adres?.woonplaats) && (
                <p className="text-sm text-muted-foreground">
                  {result.adres.postcode} {result.adres.woonplaats}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-4">
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Registratiedatum</p>
              <p className="font-medium">{formatDate(result.registratiedatum)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Geldig tot</p>
              <p className={`font-medium ${isVerlopen(result.geldigTot) ? "text-destructive" : ""}`}>
                {formatDate(result.geldigTot)}
              </p>
            </div>
            {result.gebouwtype && (
              <div>
                <p className="text-muted-foreground text-xs mb-0.5">Type</p>
                <p className="font-medium">{result.gebouwtype}{result.gebouwsubtype ? ` · ${result.gebouwsubtype}` : ""}</p>
              </div>
            )}
            {result.bouwjaar && (
              <div>
                <p className="text-muted-foreground text-xs mb-0.5">Bouwjaar</p>
                <p className="font-medium">{result.bouwjaar}</p>
              </div>
            )}
            {result.oppervlakte && (
              <div>
                <p className="text-muted-foreground text-xs mb-0.5">Oppervlakte</p>
                <p className="font-medium">{Math.round(result.oppervlakte)} m²</p>
              </div>
            )}
          </div>

          {isVerlopen(result.geldigTot) ? (
            <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/5 border border-destructive/20 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                Dit label is verlopen.{" "}
                <a href="/#homepage-selector" className="underline font-medium">
                  Vraag een nieuw label aan
                </a>
                .
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 rounded-md bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
              <span>
                Dit label is nog geldig. Wil je toch een nieuw of beter label?{" "}
                <a href="/#homepage-selector" className="text-primary hover:underline font-medium">
                  Plan een opname
                </a>
                .
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Energielabels() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useSEO({
    title: "Energielabel Aanvragen – Snel, Persoonlijk & Officieel | Label & Lens",
    description:
      "Energielabel aanvragen voor woning, verhuur of verkoop? Label & Lens regelt het snel en persoonlijk. BRL9500 gecertificeerd, vaak binnen 48 uur, gegarandeerd binnen 5 werkdagen. Check ook direct of jouw woning al een label heeft.",
    canonical: "/energielabels",
    jsonLd,
  });

  return (
    <div className="min-h-screen">
      <Navigation />

      <Hero
        title="Energielabel aanvragen"
        subtitle="Snel, persoonlijk en officieel erkend"
        imageSrc={heroImage}
        imageAlt="Energielabel aanvragen - Label & Lens"
      >
        <a href="/#homepage-selector">
          <Button size="lg" data-testid="button-hero-cta-energielabels">
            Opdracht uitzetten
          </Button>
        </a>
      </Hero>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24">

        {/* Intro */}
        <ScrollReveal>
          <section className="mb-16">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Wil je een <strong className="text-foreground font-medium">energielabel aanvragen</strong>? Label & Lens helpt je snel en persoonlijk verder. Geen massaproces, maar duidelijke communicatie, een zorgvuldige opname en direct contact met mij als adviseur en uitvoerder. Vaak is een <strong className="text-foreground font-medium">energielabel binnen 48 uur geregeld</strong>, gegarandeerd binnen 5 werkdagen.
            </p>
          </section>
        </ScrollReveal>

        {/* Adres checker */}
        <ScrollReveal>
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Heeft jouw woning al een energielabel?</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Vul je adres in en check direct of er al een officieel <strong className="text-foreground font-medium">energielabel geregistreerd</strong> staat bij RVO — en of het nog geldig is.
            </p>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Gegevens worden live opgezocht via het EP-online register van RVO</span>
                </div>
                <AddressChecker />
              </CardContent>
            </Card>
          </section>
        </ScrollReveal>

        {/* Wat is een energielabel */}
        <ScrollReveal>
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Wat is een energielabel?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Een <strong className="text-foreground font-medium">energielabel woning</strong> laat zien hoe energiezuinig een woning is. Het label loopt van A++++ (zeer energiezuinig) tot en met G (weinig energiezuinig) en is verplicht bij verkoop, verhuur en oplevering van woningen. Bij het bepalen van het energielabel wordt gekeken naar onder andere isolatie, glas, installaties en de totale energieprestatie van de woning.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Een correct opgesteld energielabel geeft niet alleen duidelijkheid over de woning, maar speelt ook een belangrijke rol bij verkoop, verhuur en verduurzaming.
            </p>
          </section>
        </ScrollReveal>

        {/* Voorbeeld label */}
        <ScrollReveal>
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Voorbeeld energielabel woning</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Zo ziet een officieel energielabel eruit. Het toont de energieklasse, isolatie- en installatiegegevens en drie indicatoren voor warmtebehoefte, oververhittingsrisico en hernieuwbare energie.
            </p>
            <EnergieLabelVoorbeeld />
          </section>
        </ScrollReveal>

        {/* Wanneer verplicht */}
        <ScrollReveal>
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Wanneer is een energielabel verplicht?</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Een <strong className="text-foreground font-medium">energielabel is verplicht</strong> in de volgende situaties:
            </p>
            <ul className="space-y-3 mb-6">
              {obligatoryItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Zorg dat dit op tijd geregeld is om vertraging of boetes te voorkomen.
            </p>
          </section>
        </ScrollReveal>

        {/* Hoe werkt het */}
        <ScrollReveal>
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Hoe werkt het aanvragen van een energielabel?</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Het aanvragen van een energielabel is eenvoudig en overzichtelijk:
            </p>
            <ol className="space-y-4 mb-8">
              {[
                <>Je zet de opdracht uit via het <a href="/#homepage-selector" className="text-primary hover:underline font-medium">opdrachtvenster</a></>,
                "Ik neem contact met je op om de afspraak in te plannen",
                "Ik kom langs voor de opname van de woning",
                "Je ontvangt het energielabel officieel geregistreerd",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            <p className="text-sm text-muted-foreground">
              Liever persoonlijk contact?{" "}
              <a
                href="https://wa.me/31643735719"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Stuur een bericht via WhatsApp
              </a>
              , mail of bel direct.
            </p>
          </section>
        </ScrollReveal>

        {/* Snelheid */}
        <ScrollReveal>
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Hoe snel is een energielabel geregeld?</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Snelheid is vaak belangrijk, zeker bij verkoop of verhuur. Daarom plan ik snel in en houd ik de lijnen kort.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Vaak binnen 48 uur geregeld", icon: Zap },
                { label: "Gegarandeerd binnen 5 werkdagen", icon: Check },
                { label: "Spoed in overleg mogelijk", icon: Clock },
              ].map(({ label, icon: Icon }, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-background">
                  <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Kosten */}
        <ScrollReveal>
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Wat kost een energielabel?</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              De kosten hangen af van het type woning en het aantal m². Bereken direct je pakketprijs via de prijscalculator.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/#prijzen">
                <Button variant="default" data-testid="button-kosten-prijzen">
                  Prijs berekenen
                </Button>
              </a>
              <a href="/#contact">
                <Button variant="outline" data-testid="button-kosten-contact">
                  Meerdere woningen? Neem contact op
                </Button>
              </a>
            </div>
          </section>
        </ScrollReveal>

        {/* Waarom Label & Lens */}
        <ScrollReveal>
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Waarom kiezen voor Label & Lens?</h2>
            <p className="text-muted-foreground text-sm mb-8">Geen massaproces, maar persoonlijk, duidelijk en goed geregeld</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-background">
                    <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm mb-0.5">{v.title}</p>
                      <p className="text-sm text-muted-foreground">{v.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </ScrollReveal>

        {/* Gecertificeerd */}
        <ScrollReveal>
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Gecertificeerd en officieel erkend</h2>
            <p className="text-muted-foreground leading-relaxed">
              Volledig gecertificeerd volgens de <strong className="text-foreground font-medium">BRL9500 norm</strong>. Energielabels worden officieel erkend en voldoen aan alle wettelijke eisen. Door regelmatige bijscholing werk ik altijd volgens de meest actuele richtlijnen.
            </p>
          </section>
        </ScrollReveal>

        {/* Voor wie */}
        <ScrollReveal>
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Voor wie is een energielabel interessant?</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Ik werk voor onder andere:
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {doelgroepen.map((d, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Of het nu gaat om één woning of meerdere objecten tegelijk: ik denk mee, schakel snel en zorg dat alles goed geregeld wordt.
            </p>
          </section>
        </ScrollReveal>

        {/* FAQ */}
        <ScrollReveal>
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Veelgestelde vragen</h2>
            <Card>
              <CardContent className="p-6">
                {faqs.map((faq, i) => (
                  <FAQItem key={i} question={faq.question} answer={faq.answer} />
                ))}
              </CardContent>
            </Card>
            <div className="mt-4">
              <a href="/#faq" className="text-primary hover:underline text-sm">
                Bekijk alle veelgestelde vragen
              </a>
            </div>
          </section>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal>
          <section>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl md:text-3xl font-semibold mb-3">Energielabel aanvragen?</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Zet direct je opdracht uit via het{" "}
                  <a href="/#homepage-selector" className="text-primary hover:underline font-medium">
                    opdrachtvenster
                  </a>{" "}
                  of neem persoonlijk contact op.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a href="/#homepage-selector">
                    <Button size="lg" data-testid="button-cta-opdracht">
                      Opdracht uitzetten
                    </Button>
                  </a>
                  <a
                    href="https://wa.me/31643735719"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="lg" variant="outline" data-testid="button-cta-whatsapp">
                      <FaWhatsapp className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                  <a href="mailto:Info@labelenlens.nl">
                    <Button size="lg" variant="outline" data-testid="button-cta-mail">
                      Mail ons
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </section>
        </ScrollReveal>

      </div>

      <Footer />
    </div>
  );
}
