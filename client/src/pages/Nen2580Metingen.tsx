import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check, Clock, Shield, MessageCircle, Phone, Mail,
  ChevronDown, ChevronUp, Ruler, Home, Building2,
  Briefcase, Scale, ArrowRight, FileText, AlertCircle,
  Layers, SquareStack, Map, Users, X,
} from "lucide-react";
import { Link } from "wouter";
import { FaWhatsapp } from "react-icons/fa";
import { useSEO } from "@/hooks/useSEO";
import heroImage from "@assets/new-amsterdam-canal_1760876000697.webp";
import { useState, useEffect } from "react";

const AMSTERDAM_STADSDELEN = [
  "Amsterdam-Centrum", "Amsterdam-West", "Amsterdam-Noord", "Amsterdam-Oost",
  "Amsterdam-Zuid", "Amsterdam-Nieuw-West", "Amsterdam-Zuidoost",
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.labelenlens.nl/#website",
    name: "Label & Lens",
    url: "https://www.labelenlens.nl",
    inLanguage: "nl-NL",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.labelenlens.nl/nen-2580-metingen/#webpage",
    url: "https://www.labelenlens.nl/nen-2580-metingen/",
    name: "NEN 2580 Meting Amsterdam | Woning Inmeten & Meetrapport",
    description: "NEN 2580 meting laten uitvoeren in Amsterdam? Officieel meetrapport met GO, BVO en VVO. Conform NEN 2580 & Branchebrede Meetinstructie. Binnen 5 werkdagen.",
    inLanguage: "nl-NL",
    isPartOf: { "@id": "https://www.labelenlens.nl/#website" },
    about: { "@id": "https://www.labelenlens.nl/nen-2580-metingen/#service" },
    breadcrumb: { "@id": "https://www.labelenlens.nl/nen-2580-metingen/#breadcrumb" },
    mainEntity: { "@id": "https://www.labelenlens.nl/nen-2580-metingen/#service" },
    keywords: "NEN 2580 meting Amsterdam, woning inmeten Amsterdam, meetrapport GO BVO VVO, NEN 2580 meetcertificaat Amsterdam, gebruiksoppervlakte berekenen Amsterdam, NEN 2580 opnamerapport, 2D 3D plattegrond meting",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".speakable"],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.labelenlens.nl/#localbusiness",
    name: "Label & Lens",
    url: "https://www.labelenlens.nl",
    telephone: "+31643735719",
    email: "Info@labelenlens.nl",
    address: { "@type": "PostalAddress", addressLocality: "Amsterdam", addressRegion: "Noord-Holland", addressCountry: "NL" },
    geo: { "@type": "GeoCoordinates", latitude: 52.3676, longitude: 4.9041 },
    areaServed: AMSTERDAM_STADSDELEN.map(name => ({ "@type": "AdministrativeArea", name })),
    description: "NEN 2580 meting laten uitvoeren in Amsterdam. Professioneel meetrapport met gebruiksoppervlakte (GO), BVO en VVO binnen 5 werkdagen.",
    priceRange: "€€",
    knowsAbout: [
      "NEN 2580 meting",
      "Gebruiksoppervlakte berekenen",
      "Bruto vloeroppervlakte",
      "Verhuurbare vloeroppervlakte",
      "Energielabels woningen",
      "WWS puntentelling",
      "Vastgoedphotografie Amsterdam",
    ],
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "18:00" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://www.labelenlens.nl/nen-2580-metingen/#service",
    name: "NEN 2580 Meting Amsterdam",
    alternateName: [
      "Woning inmeten Amsterdam",
      "NEN 2580 meetrapport Amsterdam",
      "Gebruiksoppervlakte berekenen Amsterdam",
      "Meetcertificaat woning Amsterdam",
      "Opnamerapport NEN 2580 Amsterdam",
      "GO BVO VVO meting Amsterdam",
    ],
    url: "https://www.labelenlens.nl/nen-2580-metingen/",
    provider: { "@id": "https://www.labelenlens.nl/#localbusiness" },
    areaServed: AMSTERDAM_STADSDELEN.map(name => ({ "@type": "AdministrativeArea", name })),
    description: "Professionele NEN 2580 meting voor woningen en panden in Amsterdam. Ontvang een volledig meetrapport met GO, BVO en VVO conform de NEN 2580 norm en branchebrede meetinstructie. Inclusief 2D & 3D plattegrond.",
    serviceType: "NEN 2580 meting / woning inmeten",
    termsOfService: "https://www.labelenlens.nl/nen-2580-metingen/",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "NEN 2580 meetdiensten Amsterdam",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Meetcertificaat NEN 2580", description: "Beknopt overzicht met GO, BVO, externe bergruimten, bruto inhoud en 2D & 3D plattegrond" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Opnamerapport NEN 2580", description: "Meetcertificaat inclusief uitgewerkte berekening per ruimte, 2D & 3D plattegrond en toelichting per oppervlaktecategorie" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "NEN 2580 meting + energielabel", description: "Combinatie van NEN 2580 opname en officieel energielabel in één afspraak" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "NEN 2580 meting + WWS puntentelling", description: "Combinatie van NEN 2580 opname en WWS huurpuntentelling in één afspraak" } },
      ],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": "https://www.labelenlens.nl/nen-2580-metingen/#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",             item: "https://www.labelenlens.nl/" },
      { "@type": "ListItem", position: 2, name: "NEN 2580 Metingen", item: "https://www.labelenlens.nl/nen-2580-metingen/" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Hoe vraag ik een NEN 2580 meting aan in Amsterdam?",
    description: "Zo vraagt u een NEN 2580 meting aan bij Label & Lens in Amsterdam.",
    step: [
      { "@type": "HowToStep", position: 1, name: "Opdracht uitzetten",      text: "Neem contact op via het formulier, WhatsApp of telefoon en geef het adres en het type object door." },
      { "@type": "HowToStep", position: 2, name: "Afspraak inplannen",      text: "Ik neem contact op en plan de opname snel in — vaak al binnen 48 uur." },
      { "@type": "HowToStep", position: 3, name: "Meting ter plaatse",      text: "Ik meet alle ruimten zorgvuldig in op locatie: breedte, diepte én hoogte, met een laserafstandsmeter op 0,1 mm nauwkeurig." },
      { "@type": "HowToStep", position: 4, name: "Rapport ontvangen",       text: "U ontvangt een volledig NEN 2580 meetrapport conform de geldende norm, altijd binnen 5 werkdagen." },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Wat is een NEN 2580 meting?",
        acceptedAnswer: { "@type": "Answer", text: "Een NEN 2580 meting is de officiële Nederlandse meetmethode voor het bepalen van de oppervlakte van woningen en gebouwen. De norm beschrijft exact hoe je de gebruiksoppervlakte (GO), de bruto vloeroppervlakte (BVO) en de verhuurbare vloeroppervlakte (VVO) meet. Door deze eenduidige methode zijn meetresultaten van verschillende partijen altijd vergelijkbaar. De meting vindt altijd fysiek plaats op locatie — metingen vanuit tekeningen zijn niet voldoende en niet rechtsgeldig voor officiële doeleinden." },
      },
      {
        "@type": "Question",
        name: "Is een NEN 2580 meting verplicht bij verkoop?",
        acceptedAnswer: { "@type": "Answer", text: "Bij verkoop via een NVM-makelaar of via Funda is de NEN 2580 meetmethode in de praktijk verplicht. Naast de NEN 2580 norm geldt daarbij ook de Branchebrede Meetinstructie — aanvullende regels voor de verkoop, verhuur en taxatie van woningen. Een meetcertificaat of opnamerapport is het bewijs dat de oppervlakten correct en controleerbaar zijn bepaald. Zonder dit document loopt u risico op discussies of aansprakelijkheid achteraf." },
      },
      {
        "@type": "Question",
        name: "Kan ik ook gewoon de tekeningen gebruiken voor de oppervlakte?",
        acceptedAnswer: { "@type": "Answer", text: "Nee. Veel eigenaren denken dat bestaande bouwtekeningen volstaan, maar dat is onjuist. Ten eerste kloppen tekeningen niet altijd met de werkelijke situatie — verbouwingen, afwijkende maten of fouten in de originele tekening zijn veelvoorkomend. Ten tweede vereist een officieel NEN 2580 meetrapport altijd een fysieke opname op locatie, waarbij breedte, diepte én hoogte worden gemeten. Alleen zo kan worden gegarandeerd dat de gegevens kloppen en aan de norm voldoen." },
      },
      {
        "@type": "Question",
        name: "Wat is het verschil tussen GO, BVO en VVO?",
        acceptedAnswer: { "@type": "Answer", text: "GO (gebruiksoppervlakte) is de bruikbare vloeroppervlakte met een vrije hoogte van minimaal 1,5 m — dit is wat kopers en huurders ervaren als 'de woonoppervlakte'. BVO (bruto vloeroppervlakte) wordt gemeten op buitenwerkse maten en omvat ook buitenmuren en constructieve elementen — relevant voor nieuwbouw, taxaties en verzekeringen. VVO (verhuurbare vloeroppervlakte) is de oppervlakte die daadwerkelijk verhuurbaar is, exclusief gemeenschappelijke ruimten, leidingschachten en constructie — de standaard bij commercieel vastgoed en beleggingspanden." },
      },
      {
        "@type": "Question",
        name: "Voor wie is een NEN 2580 meting relevant?",
        acceptedAnswer: { "@type": "Answer", text: "Een NEN 2580 meting is relevant voor: makelaars die woningen of bedrijfsruimten verkopen of verhuren; taxateurs; particuliere kopers of verkopers die zekerheid willen over de juiste oppervlakte; vastgoedinvesteerders en -beheerders; en eigenaren van bedrijfsruimten of horecapanden waarbij de VVO de basis is voor de huurprijs. Ook verzekeringsmaatschappijen vragen soms om een officieel meetrapport voor de risicobeoordeling." },
      },
      {
        "@type": "Question",
        name: "Hoe nauwkeurig is een NEN 2580 meting?",
        acceptedAnswer: { "@type": "Answer", text: "Wij meten met een professionele laserafstandsmeter met een nauwkeurigheid van 0,1 mm op een meetafstand tot 100 meter. Alle ruimten worden individueel opgemeten: breedte, diepte én hoogte. De meetgegevens worden ter plekke schetsmatig uitgewerkt. Daarna worden ze verwerkt in een volledig meetrapport conform de NEN 2580 norm." },
      },
      {
        "@type": "Question",
        name: "Kunnen bestaande metingen worden gecontroleerd?",
        acceptedAnswer: { "@type": "Answer", text: "Ja. Als er al een meting is uitgevoerd door een derde partij en u twijfelt aan de juistheid, kan ik de bestaande meting controleren en indien nodig corrigeren. Zo heeft u de zekerheid dat de verstrekte informatie klopt en u niet voor verrassingen komt te staan bij verkoop, verhuur of taxatie." },
      },
      {
        "@type": "Question",
        name: "Hoe snel ontvang ik een NEN 2580 meetrapport in Amsterdam?",
        acceptedAnswer: { "@type": "Answer", text: "De opname wordt vaak al binnen 48 uur ingepland. Het volledige meetrapport ontvangt u altijd binnen 5 werkdagen. Spoed is mogelijk in overleg." },
      },
      {
        "@type": "Question",
        name: "Voert Label & Lens NEN 2580 metingen uit in heel Amsterdam?",
        acceptedAnswer: { "@type": "Answer", text: "Ja. Ik voer NEN 2580 metingen uit in alle Amsterdamse stadsdelen: Centrum, West (incl. Oud-West), Noord, Oost, Zuid (incl. De Pijp), Nieuw-West en Zuidoost. Door lokale kennis — inclusief de typisch Amsterdamse grachtenpanden en smalle bovenwoning — kan ik snel schakelen en flexibel plannen." },
      },
    ],
  },
];

const faqs = [
  {
    question: "Wat is een NEN 2580 meting precies?",
    answer: "Een NEN 2580 meting is de officiële Nederlandse meetmethode voor het bepalen van de oppervlakte van woningen en gebouwen. De norm beschrijft exact hoe je de gebruiksoppervlakte (GO), de bruto vloeroppervlakte (BVO) en de verhuurbare vloeroppervlakte (VVO) meet. Door deze eenduidige methode zijn meetresultaten altijd vergelijkbaar. De meting vindt altijd físiek op locatie plaats — metingen vanuit tekeningen zijn niet voldoende en niet rechtsgeldig.",
  },
  {
    question: "Is een NEN 2580 meting verplicht bij verkoop?",
    answer: "Bij verkoop via een NVM-makelaar of via Funda is de NEN 2580 meetmethode in de praktijk verplicht. Naast de NEN 2580 norm geldt dan ook de Branchebrede Meetinstructie — aanvullende regels voor de verkoop, verhuur en taxatie van woningen. Zonder een meetcertificaat of opnamerapport loopt u risico op discussies of aansprakelijkheid achteraf.",
  },
  {
    question: "Kan ik gewoon bestaande tekeningen gebruiken voor de oppervlakte?",
    answer: "Nee — dat is een veelgemaakte fout. Tekeningen kloppen niet altijd met de werkelijke situatie door verbouwingen, afwijkende maten of fouten in de originele bouwtekening. Een officieel NEN 2580 meetrapport vereist altijd een fysieke opname op locatie waarbij breedte, diepte én hoogte worden gemeten. Alleen zo is gegarandeerd dat de gegevens kloppen en rechtsgeldig zijn.",
  },
  {
    question: "Wat is het verschil tussen GO, BVO en VVO?",
    answer: "GO (gebruiksoppervlakte) is de bruikbare vloeroppervlakte met een vrije hoogte van minimaal 1,5 m — wat kopers en huurders ervaren als 'de woonoppervlakte'. BVO (bruto vloeroppervlakte) wordt gemeten op buitenwerkse maten inclusief buitenmuren — relevant voor taxaties en verzekeringen. VVO (verhuurbare vloeroppervlakte) is de oppervlakte die daadwerkelijk verhuurbaar is, exclusief gemeenschappelijke ruimten — de standaard bij beleggingspanden en commercieel vastgoed.",
  },
  {
    question: "Voor wie is een NEN 2580 meting relevant?",
    answer: "Voor makelaars die woningen of bedrijfsruimten verkopen of verhuren, voor taxateurs, voor particuliere kopers of verkopers die zekerheid willen, voor vastgoedinvesteerders en -beheerders, en voor eigenaren van bedrijfsruimten of horecapanden waarbij de VVO de basis is voor de huurprijs. Ook verzekeringsmaatschappijen kunnen om een officieel meetrapport vragen.",
  },
  {
    question: "Hoe nauwkeurig is een NEN 2580 meting?",
    answer: "Ik meet met een professionele laserafstandsmeter met een nauwkeurigheid van 0,1 mm op een meetafstand tot 100 meter. Alle ruimten worden individueel opgemeten: breedte, diepte én hoogte. De meetgegevens worden ter plekke schetsmatig uitgewerkt en daarna verwerkt in een volledig meetrapport conform de NEN 2580 norm.",
  },
  {
    question: "Kunnen bestaande metingen worden gecontroleerd?",
    answer: "Ja. Als er al een meting is uitgevoerd door een derde partij en u twijfelt aan de juistheid, kan ik de bestaande meting controleren en indien nodig corrigeren. Zo heeft u zekerheid dat de verstrekte informatie klopt voordat u een woning verkoopt, verhuurt of laat taxeren.",
  },
  {
    question: "Hoe snel ontvang ik een NEN 2580 meetrapport in Amsterdam?",
    answer: "De opname wordt vaak al binnen 48 uur ingepland. Het volledige meetrapport ontvangt u altijd binnen 5 werkdagen na de opname. Spoed is mogelijk in overleg.",
  },
];

const oppervlakteTypes = [
  {
    icon: Layers,
    afkorting: "GO",
    naam: "Gebruiksoppervlakte",
    uitleg: "De bruikbare vloeroppervlakte met een vrije hoogte van minimaal 1,5 m. Dit is de 'woonoppervlakte' die kopers en huurders ervaren — de meest gebruikte maat bij woningverkoop.",
    toepassing: "Woningverkoop, verhuur, hypotheek",
  },
  {
    icon: SquareStack,
    afkorting: "BVO",
    naam: "Bruto vloeroppervlakte",
    uitleg: "Gemeten op buitenwerkse maten, inclusief buitenmuren en constructieve elementen. Relevant voor nieuwbouw, taxaties, verzekeringen en energieberekeningen.",
    toepassing: "Taxaties, verzekeringen, nieuwbouw",
  },
  {
    icon: Map,
    afkorting: "VVO",
    naam: "Verhuurbare vloeroppervlakte",
    uitleg: "De oppervlakte die daadwerkelijk verhuurbaar is, exclusief gemeenschappelijke ruimten, leidingschachten en constructie. De standaard bij commercieel vastgoed.",
    toepassing: "Commercieel vastgoed, verhuur",
  },
];

const doelgroepen = [
  { icon: Home,       label: "Particuliere kopers & verkopers",    uitleg: "Zekerheid over de juiste m² bij aan- of verkoop van een woning" },
  { icon: Briefcase,  label: "Makelaars & taxateurs",              uitleg: "Conform NEN 2580 én de Branchebrede Meetinstructie (NVM/Funda)" },
  { icon: Building2,  label: "Vastgoedinvesteerders",              uitleg: "GO, BVO en VVO voor beleggingspanden en huurprijsbepaling (VVO)" },
  { icon: Users,      label: "Verhuurders & vastgoedbeheerders",   uitleg: "Correcte meetdata als basis voor huurcontracten en beheer" },
  { icon: Scale,      label: "Notarissen & juridische partijen",   uitleg: "Officieel meetdocument bij splitsing, erfenis of geschillen" },
  { icon: FileText,   label: "Verzekeringsmaatschappijen",         uitleg: "BVO-berekening voor risicobeoordeling en premievaststelling" },
];

const rapportTypes = [
  {
    naam: "Meetcertificaat",
    voor: "Makelaars, taxateurs, particulieren",
    omschrijving: "Beknopt overzicht van de belangrijkste oppervlakten en inhoud. Bevat de GO, BVO, externe bergruimten en bruto inhoud. Voldoet aan de NEN 2580 én de Branchebrede Meetinstructie (NVM/Funda). Altijd inclusief fysieke opname op locatie.",
    inhoud: ["Gebruiksoppervlakte (GO)", "Bruto vloeroppervlakte (BVO)", "Externe bergruimten", "Bruto inhoud woning", "2D plattegrond", "3D plattegrond"],
  },
  {
    naam: "Opnamerapport",
    voor: "Makelaars, taxateurs, eigenaren die volledige onderbouwing wensen",
    omschrijving: "Het meetcertificaat inclusief de uitgewerkte berekening per ruimte. U ziet exact hoe elke maat is bepaald en hoe de totalen zijn opgebouwd. Ideaal als volledige verantwoording gewenst is.",
    inhoud: ["Alles uit het meetcertificaat", "Uitgewerkte berekening per ruimte", "2D plattegrond (per verdieping)", "3D plattegrond (ruimtelijk inzicht)", "Toelichting per oppervlaktecategorie"],
  },
];

const procesStappen = [
  { nr: "1", titel: "Opdracht uitzetten",     omschrijving: "Via het formulier, WhatsApp of telefoon. Geef het adres en het type object door." },
  { nr: "2", titel: "Afspraak inplannen",     omschrijving: "Ik neem contact op — de opname is vaak binnen 48 uur ingepland." },
  { nr: "3", titel: "Meting ter plaatse",     omschrijving: "Alle ruimten worden opgemeten: breedte, diepte én hoogte — met een laserafstandsmeter op 0,1 mm nauwkeurig." },
  { nr: "4", titel: "Rapport ontvangen",      omschrijving: "Volledig meetrapport conform NEN 2580, altijd binnen 5 werkdagen na de opname." },
];

const voordelen = [
  "Direct contact, geen tussenpersonen of callcenters",
  "Snel ingepland — vaak binnen 48 uur",
  "Één aanspreekpunt van opname tot afgeleverd rapport",
  "2D & 3D plattegrond inbegrepen",
  "Conform NEN 2580 én Branchebrede Meetinstructie",
  "Verificatie van bestaande metingen mogelijk",
  "Combineerbaar met energielabel of WWS puntentelling",
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        className="w-full flex items-center justify-between py-4 text-left gap-4"
        onClick={() => setOpen(!open)}
        data-testid={`faq-toggle-${question.slice(0, 20).replace(/\s/g, "-").toLowerCase()}`}
        aria-expanded={open}
      >
        <span className="font-medium text-sm md:text-base">{question}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {open && (
        <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export default function Nen2580Metingen() {
  useSEO({
    title: "NEN 2580 Meting Amsterdam | Woning Inmeten & Meetrapport",
    description:
      "NEN 2580 meting laten uitvoeren in Amsterdam? Officieel meetrapport met GO, BVO en VVO. Inclusief 2D & 3D plattegrond. Conform NEN 2580 & Branchebrede Meetinstructie. Binnen 5 werkdagen.",
    canonical: "/nen-2580-metingen/",
    jsonLd,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <Hero
        title="NEN 2580 metingen"
        imageSrc={heroImage}
        imageAlt="Amsterdamse grachtenpanden – NEN 2580 meting Amsterdam"
      >
        <a href="/#homepage-selector">
          <Button
            data-testid="button-hero-aanvragen"
            size="lg"
            className="bg-primary text-primary-foreground border-2 border-primary-border px-8 text-lg font-semibold rounded-full"
          >
            Meting aanvragen
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </a>
      </Hero>

      <main>
        {/* ── Urgency banner ── */}
        <div className="bg-primary/10 border-b border-primary/20">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                <strong>Verplicht bij Funda-verkoop en taxaties.</strong>{" "}
                Bij verkoop via een NVM-makelaar is een NEN 2580 meting in de praktijk verplicht. Metingen vanuit tekeningen zijn niet rechtsgeldig — er is altijd een fysieke opname nodig.
              </p>
            </div>
          </div>
        </div>

        {/* ── Stat bar ── */}
        <div className="bg-card border-b border-card-border">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">48 uur</p>
                <p className="text-xs text-muted-foreground mt-0.5">Gemiddeld ingepland</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2D/3D</p>
                <p className="text-xs text-muted-foreground mt-0.5">plattegrond inbegrepen</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">5 dagen</p>
                <p className="text-xs text-muted-foreground mt-0.5">Max. levertijd rapport</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Wat is het ── */}
        <ScrollReveal>
          <section className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Wat is een NEN 2580 meting?
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg mb-5">
                Een <strong>NEN 2580 meting</strong> bepaalt officieel de oppervlakte van een woning of pand. De norm legt exact vast hoe de <strong>gebruiksoppervlakte (GO)</strong>, de <strong>bruto vloeroppervlakte (BVO)</strong> en de <strong>verhuurbare vloeroppervlakte (VVO)</strong> worden berekend — zodat meetresultaten van verschillende partijen altijd vergelijkbaar en rechtsgeldig zijn.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                De meting vindt altijd <strong>fysiek op locatie</strong> plaats — ik meet breedte, diepte én hoogte van alle ruimten met een laserafstandsmeter op 0,1 mm nauwkeurig. Metingen vanuit bestaande tekeningen zijn niet voldoende en niet rechtsgeldig voor verkoop, verhuur of taxatie.
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                {oppervlakteTypes.map(({ icon: Icon, afkorting, naam, uitleg, toepassing }) => (
                  <Card key={afkorting}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-bold text-primary text-lg">{afkorting}</span>
                      </div>
                      <p className="font-semibold text-sm mb-1">{naam}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{uitleg}</p>
                      <p className="text-xs font-medium text-primary/80">{toepassing}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Van tekening is niet voldoende ── */}
        <ScrollReveal>
          <section className="py-10 md:py-12 bg-amber-50 dark:bg-amber-950/20 border-y border-amber-200 dark:border-amber-800/40">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-md bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                  <X className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold mb-2 text-foreground">
                    Bestaande tekeningen zijn niet voldoende
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Veel eigenaren denken dat ze de oppervlaktegegevens van hun bouwtekeningen kunnen gebruiken. Dat is echter onjuist om twee redenen:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>Tekeningen kloppen niet altijd met de werkelijke situatie — verbouwingen, afwijkende maten of fouten in de originele bouwtekening komen vaak voor.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>Een officieel NEN 2580 meetrapport vereist altijd een <strong>fysieke opname op locatie</strong>. Alleen zo kunnen hoogte-uitsluitingen, dakkapellen en schuine plafonds correct worden meegenomen.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Soorten rapporten ── */}
        <ScrollReveal>
          <section className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Welk rapport heb je nodig?
              </h2>
              <p className="text-muted-foreground mb-8">
                Afhankelijk van het doel lever ik twee varianten, beide inclusief fysieke opname op locatie en conform de NEN 2580 norm én de Branchebrede Meetinstructie.
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                {rapportTypes.map(({ naam, voor, omschrijving, inhoud }) => (
                  <Card key={naam}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                        <p className="font-bold">{naam}</p>
                      </div>
                      <p className="text-xs text-primary/80 font-medium mb-3">{voor}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{omschrijving}</p>
                      <ul className="space-y-1.5">
                        {inhoud.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-5">
                Naast het opstellen van nieuwe rapporten controleer ik ook{" "}
                <strong>bestaande metingen van derden</strong>. Twijfelt u aan de juistheid? Ik check het en corrigeer waar nodig.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Voor wie ── */}
        <ScrollReveal>
          <section className="py-12 md:py-16 bg-card border-y border-card-border">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Voor wie is een NEN 2580 meting relevant?
              </h2>
              <p className="text-muted-foreground mb-8">
                Een correcte meting is relevant voor iedereen die te maken heeft met de aan- of verkoop, verhuur, beheer of taxatie van vastgoed.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {doelgroepen.map(({ icon: Icon, label, uitleg }) => (
                  <div key={label} className="flex gap-3 p-4 rounded-md border border-border bg-background">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-0.5">{label}</p>
                      <p className="text-xs text-muted-foreground">{uitleg}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Heeft u ook een{" "}
                <Link href="/wws-puntentelling/" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" data-testid="link-wws-van-nen">
                  WWS puntentelling
                </Link>{" "}
                of{" "}
                <Link href="/energielabels" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" data-testid="link-energielabel-van-nen">
                  energielabel
                </Link>{" "}
                nodig? Combineer diensten voor een scherp tarief.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Hoe werkt de meting technisch ── */}
        <ScrollReveal>
          <section className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Hoe werkt de meting in de praktijk?
              </h2>
              <p className="text-muted-foreground mb-8">Direct contact, geen tussenpersonen.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {procesStappen.map(({ nr, titel, omschrijving }) => (
                  <div key={nr} className="flex gap-4 p-4 rounded-md border border-border bg-background">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">{nr}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-0.5">{titel}</p>
                      <p className="text-xs text-muted-foreground">{omschrijving}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>
        </ScrollReveal>

        {/* ── Amsterdam sectie ── */}
        <ScrollReveal>
          <section className="py-12 md:py-16 bg-primary/5 border-y border-primary/15" aria-labelledby="amsterdam-nen-heading">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 id="amsterdam-nen-heading" className="text-2xl md:text-3xl font-bold mb-3">
                NEN 2580 meting in Amsterdam
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Label &amp; Lens voert NEN 2580 metingen uit in heel Amsterdam. Van smalle grachtenpanden in het <strong>Centrum</strong> en bovenwoningen in <strong>Oud-West</strong> tot appartementen in <strong>De Pijp</strong>, <strong>Amsterdam-Zuid</strong> en ruimere woningen in <strong>Nieuw-West</strong>. In <strong>Noord</strong> en <strong>Oost</strong> zijn de woningtypen anders — bredere straten, meer portiekwoningen — maar de aanpak is overal hetzelfde: zorgvuldig inmeten, ruimte voor ruimte.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Amsterdamse woningen vragen om specifieke kennis: schuine daken, dakkapellen, mezzanines en inpandige bergingen die net wel of niet meegeteld worden. Door dagelijks in de stad te werken is die kennis er, en dat scheelt tijd en discussie achteraf.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Clock,         title: "Snel ingepland",         sub: "Vaak binnen 48 uur" },
                  { icon: Shield,        title: "Binnen 5 werkdagen",      sub: "Rapport geleverd" },
                  { icon: MessageCircle, title: "Spoed mogelijk",          sub: "In overleg" },
                ].map(({ icon: Icon, title, sub }) => (
                  <Card key={title}>
                    <CardContent className="p-4 text-center">
                      <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <p className="font-semibold text-sm mb-0.5">{title}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Ook een{" "}
                <Link href="/energielabel-aanvragen-amsterdam/" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" data-testid="link-energielabel-amsterdam-nen">
                  energielabel aanvragen in Amsterdam
                </Link>{" "}
                of een{" "}
                <Link href="/wws-puntentelling/" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" data-testid="link-wws-amsterdam-nen">
                  WWS puntentelling
                </Link>? Ik combineer dit graag in één afspraak.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Waarom Label & Lens ── */}
        <ScrollReveal>
          <section className="py-12 md:py-16 bg-card border-y border-card-border">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Waarom kiezen voor Label &amp; Lens?</h2>
              <p className="text-muted-foreground mb-8">Geen massaproces, maar persoonlijk en zorgvuldig.</p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {voordelen.map((v) => (
                  <li key={v} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </ScrollReveal>

        {/* ── FAQ ── */}
        <ScrollReveal>
          <section className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Veelgestelde vragen</h2>
              <p className="text-muted-foreground mb-8">De meest gestelde vragen over NEN 2580 metingen in Amsterdam.</p>
              <div>
                {faqs.map((faq) => (
                  <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── CTA ── */}
        <ScrollReveal>
          <section className="py-14 md:py-20 bg-card border-t border-card-border">
            <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                NEN 2580 meting laten uitvoeren?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Zet direct je opdracht uit of neem contact op. Snel geregeld, persoonlijk afgehandeld.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="/#homepage-selector">
                  <Button
                    data-testid="button-cta-aanvragen"
                    size="lg"
                    className="px-8 rounded-full font-semibold"
                  >
                    Opdracht uitzetten
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <a
                  href="https://wa.me/31643735719"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-cta-whatsapp"
                >
                  <Button variant="outline" size="lg" className="px-8 rounded-full font-semibold">
                    <FaWhatsapp className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </a>
                <a href="tel:+31643735719" data-testid="link-cta-bel">
                  <Button variant="outline" size="lg" className="px-8 rounded-full font-semibold">
                    <Phone className="w-4 h-4 mr-2" />
                    Bel ons
                  </Button>
                </a>
                <a href="mailto:Info@labelenlens.nl" data-testid="link-cta-mail">
                  <Button variant="outline" size="lg" className="px-8 rounded-full font-semibold">
                    <Mail className="w-4 h-4 mr-2" />
                    Stuur een mail
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
