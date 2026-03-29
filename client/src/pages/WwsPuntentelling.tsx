import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Check, Zap, Clock, Shield, MessageCircle, Star,
  Phone, Mail, ChevronDown, ChevronUp, Calculator,
  Home, Building2, Briefcase, Users, Scale, ArrowRight,
  AlertCircle, Quote, Maximize2, Thermometer, Leaf,
  UtensilsCrossed, ShowerHead, TreePine, Landmark, Accessibility, BarChart3, ExternalLink,
  Info,
} from "lucide-react";
import { Link } from "wouter";
import { FaWhatsapp } from "react-icons/fa";
import { useSEO } from "@/hooks/useSEO";
import heroImage from "@assets/new-amsterdam-canal_1760876000697.webp";
import { useState, useEffect, useRef } from "react";

const AMSTERDAM_STADSDELEN = [
  "Amsterdam-Centrum", "Amsterdam-West", "Amsterdam-Noord", "Amsterdam-Oost",
  "Amsterdam-Zuid", "Amsterdam-Nieuw-West", "Amsterdam-Zuidoost",
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.labelenlens.nl/#localbusiness",
    name: "Label & Lens",
    url: "https://www.labelenlens.nl",
    telephone: "+31643735719",
    email: "Info@labelenlens.nl",
    address: { "@type": "PostalAddress", addressLocality: "Amsterdam", addressRegion: "Noord-Holland", postalCodePrefix: "10", addressCountry: "NL" },
    geo: { "@type": "GeoCoordinates", latitude: 52.3676, longitude: 4.9041 },
    areaServed: AMSTERDAM_STADSDELEN.map(name => ({ "@type": "AdministrativeArea", name })),
    description: "WWS puntentelling laten uitvoeren in Amsterdam. Correcte berekening van huurpunten en maximale huurprijs, persoonlijk en binnen 5 werkdagen.",
    priceRange: "€€",
    knowsAbout: [
      "WWS puntentelling", "Woningwaarderingsstelsel", "Huurpunten berekenen",
      "Maximale huurprijs", "Energielabel woningen", "Wet betaalbare huur",
      "Huurcommissie", "Middenhuur Amsterdam",
    ],
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "18:00" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://www.labelenlens.nl/wws-puntentelling/#service",
    name: "WWS Puntentelling Amsterdam",
    alternateName: ["Woningwaarderingsstelsel puntentelling Amsterdam", "Huurpunten berekenen Amsterdam", "Huurprijscheck Amsterdam"],
    url: "https://www.labelenlens.nl/wws-puntentelling/",
    provider: { "@id": "https://www.labelenlens.nl/#localbusiness" },
    areaServed: AMSTERDAM_STADSDELEN.map(name => ({ "@type": "AdministrativeArea", name })),
    description: "Professionele WWS puntentelling voor huurwoningen in Amsterdam. Bepaal de maximale huurprijs en huursector op basis van het Woningwaarderingsstelsel.",
    serviceType: "WWS puntentelling / huurprijscheck",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "WWS puntentelling diensten",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "WWS puntentelling enkelvoudig" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "WWS puntentelling + energielabel combinatie" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "WWS puntentelling + energielabel + vastgoedfotografie" } },
      ],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",            item: "https://www.labelenlens.nl/" },
      { "@type": "ListItem", position: 2, name: "WWS Puntentelling", item: "https://www.labelenlens.nl/wws-puntentelling/" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Hoe vraag ik een WWS puntentelling aan?",
    description: "Zo vraagt u een officiële WWS puntentelling aan bij Label & Lens in Amsterdam.",
    step: [
      { "@type": "HowToStep", position: 1, name: "Aanvraag indienen",  text: "Vul het aanvraagformulier in met uw adres en contactgegevens." },
      { "@type": "HowToStep", position: 2, name: "Opname ter plaatse", text: "Een adviseur komt langs voor een professionele meting en beoordeling van de woning." },
      { "@type": "HowToStep", position: 3, name: "Rapport ontvangen",  text: "U ontvangt het officiële WWS rapport, vaak binnen 48 uur, altijd binnen 5 werkdagen." },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Wat is een WWS puntentelling?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "De WWS puntentelling (Woningwaarderingsstelsel) bepaalt de maximale huurprijs van een woning. Op basis van oppervlakte, energielabel, voorzieningen en locatie wordt een puntentotaal berekend dat bepaalt of een woning in de sociale huur of vrije sector valt.",
        },
      },
      {
        "@type": "Question",
        name: "Hoe wordt een WWS puntentelling berekend?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Factoren zoals oppervlakte van vertrekken, het energielabel, sanitaire voorzieningen, buitenruimte en de WOZ-waarde spelen een rol. Een correcte opname van de woning is essentieel voor een accurate uitkomst.",
        },
      },
      {
        "@type": "Question",
        name: "Wanneer heb ik een WWS puntentelling nodig?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bij verhuur van een woning, aankoop van een beleggingspand, herziening van huurprijzen, controle op bestaande huurcontracten en bij nieuwe regelgeving zoals de Wet betaalbare huur. Vanaf 1 januari 2025 is een puntentelling verplicht bij elke huurovereenkomst.",
        },
      },
      {
        "@type": "Question",
        name: "Kan ik zelf de huurpunten van mijn woning berekenen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Er zijn online tools beschikbaar, maar een nauwkeurige puntentelling vereist een correcte meting en kennis van de actuele regelgeving. Een fout kan leiden tot juridische problemen. Een professional geeft zekerheid.",
        },
      },
      {
        "@type": "Question",
        name: "Wat is de maximale huurprijs van mijn woning?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "De maximale huurprijs wordt bepaald door het puntentotaal. Woningen boven de liberalisatiegrens (187 punten) vallen in de vrije sector. Woningen daaronder vallen onder de sociale huur of middenhuur met een wettelijk maximum.",
        },
      },
      {
        "@type": "Question",
        name: "Waar in Amsterdam kunt u een WWS puntentelling aanvragen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Label & Lens voert WWS puntentellingen uit door heel Amsterdam, inclusief alle stadsdelen: Centrum, West, Noord, Oost, Zuid, Nieuw-West en Zuidoost. Wij komen bij u langs voor een professionele opname.",
        },
      },
      {
        "@type": "Question",
        name: "Wat kost een WWS puntentelling in Amsterdam?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Neem contact op via onze website of WhatsApp voor een offerte op maat. Wij bieden scherpe tarieven en combinatiepakketten met energielabel en vastgoedfotografie.",
        },
      },
      {
        "@type": "Question",
        name: "Hoeveel huurpunten heeft een gemiddeld appartement in Amsterdam?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Een gemiddeld Amsterdams appartement van 65–80 m² scoort doorgaans tussen de 150 en 220 huurpunten, afhankelijk van energielabel, WOZ-waarde, keuken, sanitair en buitenruimte. Door de hoge WOZ-waarden in Amsterdam vallen veel woningen in de vrije sector (≥ 187 punten).",
        },
      },
      {
        "@type": "Question",
        name: "Wat is het effect van de hoge WOZ-waarde in Amsterdam op de huurpunten?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "De WOZ-waarde levert maximaal 33 huurpunten op (plafond bij €495.000). In Amsterdam liggen veel woningen al boven dit plafond, waardoor zij sowieso de maximale WOZ-bijdrage meenemen. Dit maakt een goede puntentelling extra belangrijk — ook kleinere woningen kunnen door hoge WOZ-waarden richting vrije sector verschuiven.",
        },
      },
      {
        "@type": "Question",
        name: "Geldt de Wet betaalbare huur ook in Amsterdam?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja. De Wet betaalbare huur (ingegaan 1 juli 2024) geldt landelijk en dus ook in Amsterdam. Woningen tot 186 punten vallen nu onder de gereguleerde middenhuur met een wettelijk maximale huurprijs. Verhuurders in Amsterdam zijn verplicht een WWS puntentelling toe te voegen aan nieuwe huurovereenkomsten.",
        },
      },
    ],
  },
];

const faqs = [
  {
    question: "Wat is een WWS puntentelling?",
    answer: "De WWS puntentelling (Woningwaarderingsstelsel) bepaalt de maximale huurprijs van een woning. Op basis van oppervlakte, energielabel, voorzieningen en locatie wordt een puntentotaal berekend dat bepaalt of een woning in de sociale huur of vrije sector valt.",
  },
  {
    question: "Hoe wordt een WWS puntentelling berekend?",
    answer: "Factoren zoals de oppervlakte van vertrekken, het energielabel, sanitaire voorzieningen, buitenruimte en de WOZ-waarde spelen een rol. Een correcte opname van de woning is essentieel voor een accurate uitkomst.",
  },
  {
    question: "Wanneer heb ik een WWS puntentelling nodig?",
    answer: "Bij verhuur van een woning, aankoop van een beleggingspand, herziening van huurprijzen, controle op bestaande huurcontracten en bij nieuwe regelgeving zoals de Wet betaalbare huur. Vanaf 1 januari 2025 is een puntentelling verplicht bij elke huurovereenkomst.",
  },
  {
    question: "Kan ik zelf de huurpunten van mijn woning berekenen?",
    answer: "Er zijn online tools beschikbaar, maar een nauwkeurige puntentelling vereist een correcte meting en kennis van de actuele regelgeving. Een fout kan leiden tot juridische problemen. Een professional geeft zekerheid.",
  },
  {
    question: "Wat is de maximale huurprijs van mijn woning?",
    answer: "De maximale huurprijs wordt bepaald door het puntentotaal. Woningen boven de liberalisatiegrens (187 punten) vallen in de vrije sector. Woningen daaronder vallen onder de sociale huur of middenhuur met een wettelijk maximum.",
  },
  {
    question: "Waar in Amsterdam kunt u een WWS puntentelling aanvragen?",
    answer: "Label & Lens voert WWS puntentellingen uit door heel Amsterdam, inclusief alle stadsdelen: Centrum, West, Noord, Oost, Zuid, Nieuw-West en Zuidoost. Wij komen bij u langs voor een professionele opname.",
  },
  {
    question: "Wat kost een WWS puntentelling in Amsterdam?",
    answer: "Neem contact op via onze website of WhatsApp voor een offerte op maat. Wij bieden scherpe tarieven en combinatiepakketten met energielabel en vastgoedfotografie.",
  },
  {
    question: "Hoeveel huurpunten heeft een gemiddeld appartement in Amsterdam?",
    answer: "Een gemiddeld Amsterdams appartement van 65–80 m² scoort doorgaans tussen de 150 en 220 huurpunten, afhankelijk van energielabel, WOZ-waarde, keuken, sanitair en buitenruimte. Door de hoge WOZ-waarden in Amsterdam vallen veel woningen in de vrije sector (≥ 187 punten).",
  },
  {
    question: "Wat is het effect van de hoge WOZ-waarde in Amsterdam op de huurpunten?",
    answer: "De WOZ-waarde levert maximaal 33 huurpunten op (plafond bij €495.000). In Amsterdam liggen veel woningen al boven dit plafond, waardoor zij sowieso de maximale WOZ-bijdrage meenemen. Dit maakt een goede puntentelling extra belangrijk — ook kleinere woningen kunnen door hoge WOZ-waarden richting vrije sector verschuiven.",
  },
  {
    question: "Geldt de Wet betaalbare huur ook in Amsterdam?",
    answer: "Ja. De Wet betaalbare huur (ingegaan 1 juli 2024) geldt landelijk en dus ook in Amsterdam. Woningen tot 186 punten vallen nu onder de gereguleerde middenhuur met een wettelijk maximale huurprijs. Verhuurders in Amsterdam zijn verplicht een WWS puntentelling toe te voegen aan nieuwe huurovereenkomsten.",
  },
];

const wwsOnderdelen = [
  { icon: Maximize2,       label: "Oppervlakte",               desc: "Woonoppervlak en overige ruimten" },
  { icon: Thermometer,     label: "Verwarming",                desc: "Verwarmde vertrekken (cv of stadsverwarming)" },
  { icon: UtensilsCrossed, label: "Keukenuitrusting",          desc: "Kwaliteit en uitrusting van de keuken" },
  { icon: ShowerHead,      label: "Sanitaire voorzieningen",   desc: "Badkamer, toilet en overig sanitair" },
  { icon: TreePine,        label: "Buitenruimte",              desc: "Balkon, tuin of terras" },
  { icon: Home,            label: "Type woning",               desc: "Eengezinswoning of etagewoning" },
  { icon: Accessibility,   label: "Gehandicaptenvoorzieningen", desc: "Extra punten indien aanwezig" },
  { icon: BarChart3,       label: "WOZ-waarde",                desc: "Onderdeel van de berekening sinds 2015" },
];

const sectorRegels = [
  {
    sector: "Sociale huur",
    punten: "< 144 pt",
    regels: [
      "Wettelijk maximum huurprijs (via WWS)",
      "Recht op huurtoeslag (afhankelijk van inkomen)",
      "Huurcommissie bevoegd bij geschil",
      "Jaarlijkse huurverhoging aan maximum gebonden",
    ],
  },
  {
    sector: "Middenhuur",
    punten: "144–186 pt",
    regels: [
      "Gereguleerde maximale huurprijs",
      "Geen huurtoeslag",
      "Huurcommissie bevoegd bij geschil",
      "Jaarlijkse huurverhoging aan maximum gebonden",
    ],
  },
  {
    sector: "Vrije sector",
    punten: "≥ 187 pt",
    regels: [
      "Geen maximale huurprijs",
      "Geen huurtoeslag",
      "Bij geschil naar de rechtbank",
      "Max. 4,4% huurverhoging per jaar (vanaf 2026)",
    ],
  },
];

const scenarios = [
  { icon: Home,      title: "Verhuurder",      desc: "Weet exact wat je mag vragen en verhuur zonder risico." },
  { icon: Building2, title: "Belegger",        desc: "Check de huurwaarde vóór aankoop van een beleggingspand." },
  { icon: Briefcase, title: "Makelaar",        desc: "Lever je klanten een correcte en onderbouwde puntentelling." },
  { icon: Scale,     title: "Huurprijscheck",  desc: "Controleer of een bestaande huurprijs nog klopt." },
  { icon: Users,     title: "VvE / beheerder", desc: "Meerdere woningen tegelijk? Wij regelen het efficiënt." },
];

const reasons = [
  { icon: <Star className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />,          title: "Persoonlijk contact",  text: "Direct contact met de adviseur en uitvoerder. Geen tussenpersonen." },
  { icon: <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />,           title: "Binnen 5 werkdagen",   text: "Rapport vaak binnen 48 uur klaar, altijd binnen 5 werkdagen." },
  { icon: <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />,         title: "Eén partner",          text: "Energielabel, puntentelling, fotografie — alles bij Label & Lens." },
  { icon: <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />,        title: "Uitgebreide opname",   text: "Er wordt verder gekeken dan alleen de basis." },
  { icon: <MessageCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />, title: "Advies op maat",       text: "Gericht advies op basis van jouw situatie en plannen." },
  { icon: <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />,         title: "Flexibel",             text: "Ook op korte termijn mogelijk." },
];

// ── WWS Calculator ──────────────────────────────────────────────────────────

const LABEL_PUNTEN: Record<string, number> = {
  "A++++": 52, "A+++": 44, "A++": 40, "A+": 36,
  "A": 30, "B": 22, "C": 14, "D": 8, "E": 4, "F": 0, "G": -4,
};
const BUITENRUIMTE_PUNTEN: Record<string, number> = { geen: 0, klein: 2, middel: 5, groot: 8 };

// Energielabel bonus: nieuwer label correlleert met nieuwere woning = betere voorzieningen
const LABEL_BONUS: Record<string, number> = {
  "A++++": 8, "A+++": 7, "A++": 6, "A+": 5, "A": 3, "B": 2, "C": 1, "D": 0, "E": 0, "F": 0, "G": 0,
};

function berekenOverige(opp: number, label: string) {
  // Verwarmde vertrekken: vast op 8 punten
  const verwarming = 8;

  // Keuken (aanrechtlengte + inbouwapparatuur) geschat op m² — ruime schatting
  const keukenBase = opp < 40 ? 7 : opp < 60 ? 10 : opp < 80 ? 13 : opp < 100 ? 15 : 17;

  // Sanitair (toilet + douche/bad + wastafel, evt 2e toilet) geschat op m²
  const sanitairBase = opp < 50 ? 10 : opp < 75 ? 13 : opp < 100 ? 15 : 17;

  // Bonus van energielabel (nieuwer label → modernere uitrusting)
  const bonus = LABEL_BONUS[label] ?? 0;
  const keuken   = keukenBase   + Math.round(bonus * 0.5);
  const sanitair = sanitairBase + Math.round(bonus * 0.5);

  return { keuken, sanitair, verwarming, totaal: keuken + sanitair + verwarming };
}

const SECTOR_INFO = {
  sociaal:    { label: "Sociale huur",  kleur: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",    balk: "bg-blue-500",  tip: "De woning valt onder de sociale huur. De maximale huurprijs is wettelijk begrensd." },
  middenhuur: { label: "Middenhuur",    kleur: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300", balk: "bg-amber-500", tip: "De woning valt in de gereguleerde middenhuur. Er geldt een wettelijk maximum." },
  vrij:       { label: "Vrije sector",  kleur: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", balk: "bg-green-500", tip: "De woning valt in de vrije sector. Je kunt een marktconforme huurprijs vragen." },
} as const;

function useAnimatedNumber(target: number | null, duration = 700) {
  const [display, setDisplay] = useState<number | null>(null);
  const rafRef   = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const fromRef  = useRef<number>(0);
  useEffect(() => {
    if (target === null) { setDisplay(null); return; }
    fromRef.current = display ?? 0;
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / duration, 1);
      setDisplay(Math.round(fromRef.current + (target - fromRef.current) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target]);
  return display;
}

function WwsCalculator() {
  // ── address inputs ──
  const [postcode,   setPostcode]   = useState("");
  const [huisnummer, setHuisnummer] = useState("");
  const [toevoeging, setToevoeging] = useState("");

  // ── lookup state ──
  const [looking,       setLooking]       = useState(false);
  const [lookupErr,     setLookupErr]     = useState("");
  const [adresLabel,    setAdresLabel]    = useState(""); // human-readable
  const [foundOpp,      setFoundOpp]      = useState<number | null>(null);
  const [foundLabel,    setFoundLabel]    = useState<string | null>(null);
  const [labelFromApi,  setLabelFromApi]  = useState(true);  // false = niet gevonden, handmatig
  const [manualLabel,   setManualLabel]   = useState("");

  // ── manual overrides / extras ──
  const [woz,    setWoz]    = useState("");
  const [buiten, setBuiten] = useState("geen");

  const oppVal  = foundOpp ?? 0;
  const lbl     = foundLabel ?? manualLabel;  // API label heeft voorrang; anders handmatige keuze
  const wozVal  = Math.max(0, parseFloat(woz.replace(/\D/g, "")) || 0);
  const ready   = foundOpp !== null && lbl !== "" && wozVal > 0;

  const oppPt    = Math.round(oppVal);
  const labelPt  = LABEL_PUNTEN[lbl] ?? 0;
  const wozPt    = Math.min(Math.round(wozVal / 15000), 33);
  const buitenPt = BUITENRUIMTE_PUNTEN[buiten] ?? 0;
  const overige  = berekenOverige(oppVal, lbl);
  const totaal   = ready ? oppPt + labelPt + wozPt + buitenPt + overige.totaal : null;

  const sector: keyof typeof SECTOR_INFO | null =
    totaal === null ? null : totaal < 144 ? "sociaal" : totaal < 187 ? "middenhuur" : "vrij";

  const animated = useAnimatedNumber(totaal);
  const MAX_RANGE = 250;
  const pct = animated !== null ? Math.min(animated / MAX_RANGE, 1) * 100 : 0;

  async function handleLookup() {
    const pc = postcode.replace(/\s/g, "").toUpperCase();
    const hn = huisnummer.trim();
    if (!pc || !hn) { setLookupErr("Vul postcode en huisnummer in."); return; }
    setLooking(true); setLookupErr(""); setFoundOpp(null); setFoundLabel(null); setAdresLabel("");

    const params = new URLSearchParams({ postcode: pc, huisnummer: hn });
    if (toevoeging.trim()) params.set("toevoeging", toevoeging.trim());

    try {
      const [bagRes, epRes] = await Promise.all([
        fetch(`/api/bag/oppervlakte?${params}`),
        fetch(`/api/energielabel/check?${new URLSearchParams({ postcode: pc, huisnummer: hn, huisnummertoevoeging: toevoeging.trim() })}`),
      ]);
      const bagData = await bagRes.json();
      const epData  = await epRes.json();

      if (!bagData.success) { setLookupErr("Adres niet gevonden. Controleer postcode en huisnummer."); return; }

      const opp   = bagData.oppervlakte ?? bagData.adres?.oppervlakte ?? null;
      const adres = bagData.adres;
      const toev  = adres?.toevoeging ? ` ${adres.toevoeging}` : "";
      setAdresLabel(adres ? `${adres.straatnaam} ${adres.huisnummer}${toev}, ${adres.postcode} ${adres.woonplaats}` : `${pc} ${hn}`);
      setFoundOpp(opp);

      if (epData.success && epData.Energieklasse) {
        setFoundLabel(epData.Energieklasse);
        setLabelFromApi(true);
      } else {
        setFoundLabel(null);
        setLabelFromApi(false);
        setManualLabel("");
      }
    } catch {
      setLookupErr("Er is iets misgegaan. Probeer het opnieuw.");
    } finally {
      setLooking(false);
    }
  }

  const breakdown = ready ? [
    { label: `Oppervlakte (${oppVal} m²)`,              punten: oppPt,             muted: false },
    { label: `Energielabel (${lbl})`,                   punten: labelPt,           muted: false },
    { label: `WOZ-waarde (indicatie)`,                  punten: wozPt,             muted: false },
    { label: `Buitenruimte`,                            punten: buitenPt,          muted: false },
    { label: `Verwarmde vertrekken (schatting)`,         punten: overige.verwarming, muted: true },
    { label: `Keuken (schatting)`,                      punten: overige.keuken,    muted: true },
    { label: `Sanitair (schatting)`,                    punten: overige.sanitair,  muted: true },
  ] : [];

  return (
    <div className="space-y-6">
      {/* ── Step 1: Address lookup ── */}
      <div className="p-5 rounded-md border border-border bg-background space-y-4">
        <p className="text-sm font-semibold">Stap 1 — Voer het adres in</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="col-span-2 sm:col-span-2">
            <Label htmlFor="calc-pc" className="text-xs text-muted-foreground mb-1 block">Postcode</Label>
            <Input id="calc-pc" data-testid="input-calc-postcode" placeholder="1234 AB" value={postcode} onChange={e => setPostcode(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="calc-hn" className="text-xs text-muted-foreground mb-1 block">Huisnummer</Label>
            <Input id="calc-hn" data-testid="input-calc-huisnummer" placeholder="12" value={huisnummer} onChange={e => setHuisnummer(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="calc-tv" className="text-xs text-muted-foreground mb-1 block">Toevoeging</Label>
            <Input id="calc-tv" data-testid="input-calc-toevoeging" placeholder="A" value={toevoeging} onChange={e => setToevoeging(e.target.value)} />
          </div>
        </div>
        <Button
          data-testid="button-calc-opzoeken"
          onClick={handleLookup}
          disabled={looking}
          className="bg-primary text-primary-foreground"
          size="default"
        >
          {looking ? "Opzoeken…" : "Adres opzoeken"}
          {!looking && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
        {lookupErr && <p className="text-xs text-red-500">{lookupErr}</p>}

        {/* Fetched results */}
        {foundOpp !== null && (
          <div className="border-t border-border pt-4 space-y-2">
            <p className="text-xs text-muted-foreground font-medium">{adresLabel}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-2.5 rounded-md bg-muted/40 border border-border">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground leading-none">Oppervlak</p>
                  <p className="text-sm font-semibold">{foundOpp} m²</p>
                </div>
              </div>
              {labelFromApi && foundLabel ? (
                <div className="flex items-center gap-2 p-2.5 rounded-md bg-muted/40 border border-border">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground leading-none">Energielabel</p>
                    <p className="text-sm font-semibold">{foundLabel}</p>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-snug mb-1.5">Geen label geregistreerd — kies handmatig:</p>
                  <Select value={manualLabel} onValueChange={setManualLabel}>
                    <SelectTrigger data-testid="select-manual-label" className="h-7 text-xs">
                      <SelectValue placeholder="Selecteer label" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LABEL_PUNTEN).map(([lbl2, pt]) => (
                        <SelectItem key={lbl2} value={lbl2} className="text-xs">
                          {lbl2} ({pt >= 0 ? "+" : ""}{pt} pt)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Step 2: Extra gegevens + result ── */}
      {foundOpp !== null && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="p-5 rounded-md border border-border bg-background space-y-5">
            <p className="text-sm font-semibold">Stap 2 — Vul aanvullende gegevens in</p>
            <div>
              <Label htmlFor="calc-woz" className="text-xs text-muted-foreground mb-1 block">WOZ-waarde (€)</Label>
              <Input id="calc-woz" data-testid="input-calc-woz" type="number" min={0} placeholder="bijv. 350000" value={woz} onChange={e => setWoz(e.target.value)} />
              <p className="text-xs text-muted-foreground mt-1.5">
                Terug te vinden via{" "}
                <a href="https://www.wozwaardeloket.nl" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2" data-testid="link-wozwaardeloket">
                  wozwaardeloket.nl
                </a>.
              </p>
            </div>
            <div>
              <Label htmlFor="calc-buiten" className="text-xs text-muted-foreground mb-1 block">Buitenruimte</Label>
              <Select value={buiten} onValueChange={setBuiten}>
                <SelectTrigger id="calc-buiten" data-testid="select-calc-buitenruimte"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="geen">Geen buitenruimte (0 pt)</SelectItem>
                  <SelectItem value="klein">Klein balkon / terras — &lt; 5 m² (+2 pt)</SelectItem>
                  <SelectItem value="middel">Balkon / terras — 5–25 m² (+5 pt)</SelectItem>
                  <SelectItem value="groot">Tuin of groot terras — &gt; 25 m² (+8 pt)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Result */}
          <div className={`rounded-md border border-border p-5 flex flex-col gap-4 transition-colors duration-300 ${!ready ? "bg-muted/30" : "bg-background"}`}>
            {!ready ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-8">
                <Calculator className="w-8 h-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Vul de WOZ-waarde in voor de berekening.</p>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Geschatte huurpunten</p>
                  <p className="text-5xl font-bold tabular-nums tracking-tight" data-testid="text-calc-totaal">{animated ?? "—"}</p>
                  <p className="text-xs text-muted-foreground mt-1">punten (indicatief)</p>
                </div>

                {/* Spectrum balk */}
                <div>
                  <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${sector ? SECTOR_INFO[sector].balk : "bg-primary"}`}
                      style={{ width: `${pct}%` }}
                    />
                    <div className="absolute top-0 h-full w-0.5 bg-background/70" style={{ left: `${(144 / MAX_RANGE) * 100}%` }} />
                    <div className="absolute top-0 h-full w-0.5 bg-background/70" style={{ left: `${(187 / MAX_RANGE) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span><span>144</span><span>187</span><span>250+</span>
                  </div>
                </div>

                {sector && (
                  <div className={`rounded-md px-3 py-2.5 text-sm font-semibold text-center ${SECTOR_INFO[sector].kleur}`}>
                    {SECTOR_INFO[sector].label}
                  </div>
                )}
                {sector && <p className="text-xs text-muted-foreground leading-snug">{SECTOR_INFO[sector].tip}</p>}

                <div className="border-t border-border pt-3 space-y-1.5">
                  {breakdown.map(({ label: lbl2, punten, muted }) => (
                    <div key={lbl2} className="flex items-center justify-between text-xs">
                      <span className={muted ? "text-muted-foreground/60 italic" : "text-muted-foreground"}>{lbl2}</span>
                      <span className={`font-semibold tabular-nums ${punten < 0 ? "text-red-500" : muted ? "text-muted-foreground/60" : ""}`}>
                        {punten >= 0 ? "+" : ""}{punten}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3">
                  <a href="/#homepage-selector">
                    <Button data-testid="button-calc-aanvragen" className="w-full bg-primary text-primary-foreground" size="default">
                      Officiële puntentelling aanvragen
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-md bg-muted/40 border border-border">
        <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>Indicatieve berekening.</strong> Verwarmde vertrekken, keuken en sanitair worden geschat op basis van m² en energielabel — een groter en energiezuiniger huis heeft doorgaans meer voorzieningen. De echte puntentelling vereist een opname ter plaatse. Gebruik dit alleen als eerste richtlijn.
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────

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
        {open
          ? <ChevronUp className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
          : <ChevronDown className="w-4 h-4 flex-shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <p className="pb-4 px-1 text-muted-foreground text-sm leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export default function WwsPuntentelling() {
  useSEO({
    title: "WWS Puntentelling Amsterdam — Maximale Huurprijs Berekenen",
    description:
      "WWS puntentelling nodig in Amsterdam? Label & Lens berekent huurpunten en maximale huurprijs. Verplicht per 2025. Persoonlijk, snel en officieel conform. Vraag direct aan.",
    canonical: "/wws-puntentelling/",
    jsonLd,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <Hero
        title="Puntentellingen"
        imageSrc={heroImage}
        imageAlt="Amsterdamse grachtenpanden – WWS puntentelling Amsterdam"
      >
        <a href="/#homepage-selector">
          <Button
            data-testid="button-hero-aanvragen"
            size="lg"
            className="bg-primary text-primary-foreground border-2 border-primary-border px-8 text-lg font-semibold rounded-full"
          >
            Puntentelling aanvragen
            <ChevronDown className="w-5 h-5 ml-2" />
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
                <strong>Wettelijk verplicht vanaf 2025.</strong>{" "}
                Bij elke nieuwe huurovereenkomst moet een huurpuntentelling worden bijgevoegd als officiële bewijslast. Label &amp; Lens levert een volledig conform rapport.
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
                <p className="text-xs text-muted-foreground mt-0.5">Gemiddelde levertijd</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">187 pt</p>
                <p className="text-xs text-muted-foreground mt-0.5">Liberalisatiegrens</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground mt-0.5">Persoonlijk contact</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Wat is het + uitkomsten ── */}
        <ScrollReveal>
          <section className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Wat is een WWS puntentelling?
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                De <strong>WWS puntentelling</strong> (Woningwaarderingsstelsel) bepaalt wat je maximaal mag vragen voor een huurwoning in Amsterdam. Op basis van oppervlakte, <Link href="/energielabels" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" data-testid="link-energielabel-intro">energielabel</Link>, voorzieningen en locatie wordt een puntentotaal berekend. Dat totaal bepaalt de <strong>maximale huurprijs</strong> en of de woning in de sociale huur, middenhuur of vrije sector valt — een onderscheid dat in Amsterdam groot financieel verschil maakt.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Sociale huur</p>
                    <p className="text-lg font-bold mb-1">&lt; 144 pt</p>
                    <p className="text-xs text-muted-foreground">Laagste maximale huurprijs</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Middenhuur</p>
                    <p className="text-lg font-bold mb-1">144–186 pt</p>
                    <p className="text-xs text-muted-foreground">Gereguleerde middenhuur</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Vrije sector</p>
                    <p className="text-lg font-bold mb-1">≥ 187 pt</p>
                    <p className="text-xs text-muted-foreground">Marktconforme huurprijs</p>
                  </CardContent>
                </Card>
              </div>

              <p className="text-sm text-muted-foreground">
                Een goed energielabel kan het puntentotaal positief beïnvloeden.{" "}
                <Link href="/energielabels" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" data-testid="link-energielabel-tip">
                  Bekijk onze energielabeldienst
                </Link>.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Amsterdam marktcontext ── */}
        <ScrollReveal>
          <section className="py-12 md:py-16 bg-primary/5 border-y border-primary/15" aria-labelledby="amsterdam-context-heading">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 id="amsterdam-context-heading" className="text-2xl md:text-3xl font-bold mb-3">
                WWS puntentelling in Amsterdam — wat maakt het anders?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Amsterdam heeft een van de krapste huurmarkten van Nederland. Door de hoge WOZ-waarden, het grote aandeel middenhuur en de verscherpte handhaving onder de <strong>Wet betaalbare huur</strong> is een correcte puntentelling hier geen formaliteit — het is een juridische noodzaak.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="p-5">
                    <p className="font-semibold mb-1 text-sm">Hoge WOZ-waarden</p>
                    <p className="text-sm text-muted-foreground">Amsterdam-woningen stoten snel het WOZ-plafond (€495.000) aan, waardoor de maximale 33 WOZ-punten bijna altijd worden meegenomen.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <p className="font-semibold mb-1 text-sm">Groot middenhuur-segment</p>
                    <p className="text-sm text-muted-foreground">Woningen tussen 144 en 186 punten vallen in de gereguleerde middenhuur. In Amsterdam is dit segment relatief groot — een fout van enkele punten kost maanden huurverschil.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <p className="font-semibold mb-1 text-sm">Alle stadsdelen</p>
                    <p className="text-sm text-muted-foreground">Wij voeren puntentellingen uit in Centrum, West, Noord, Oost, Zuid, Nieuw-West en Zuidoost. Opname ter plaatse, rapport binnen 48 uur.</p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Heeft u ook een <Link href="/energielabel-aanvragen-amsterdam/" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" data-testid="link-energielabel-amsterdam-context">energielabel nodig</Link> voor uw Amsterdamse woning? Wij combineren beide diensten voor een scherp tarief.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Welke onderdelen tellen mee ── */}
        <ScrollReveal>
          <section className="py-12 md:py-16 bg-card border-y border-card-border">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Welke woningonderdelen tellen mee?
              </h2>
              <p className="text-muted-foreground mb-8">
                Het puntensysteem (Woningwaarderingsstelsel) kent negen categorieën. Elk onderdeel levert een bepaald aantal punten op:
              </p>
              {/* Energielabel — uitgelicht */}
              <div className="flex gap-4 items-start p-5 rounded-md border border-primary/30 bg-primary/5 mb-4">
                <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">Energielabel</p>
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">Meeste invloed</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug">
                    Het energielabel heeft de grootste impact op de puntentelling. Een label A levert significant meer punten op dan label E of F. Een goed label kan het verschil maken tussen sociale huur en de vrije sector.{" "}
                    <Link href="/energielabels" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" data-testid="link-energielabel-onderdelen">
                      Meer over ons energielabel
                    </Link>.
                  </p>
                </div>
              </div>

              {/* Overige onderdelen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {wwsOnderdelen.map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-md border border-border bg-background">
                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm leading-none mb-0.5">{label}</p>
                      <p className="text-xs text-muted-foreground truncate">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 p-4 rounded-md border border-border bg-background">
                <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Wil je alvast een indicatie?{" "}
                  <a
                    href="https://checkjeprijs.huurcommissie.nl/onderwerpen/huurprijs-en-punten/huurprijscheck-en-puntentelling"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                    data-testid="link-huurprijscheck"
                  >
                    Bereken punten via de officiële huurprijscheck van de Huurcommissie
                  </a>. Voor een officieel rapport heb je een professionele opname nodig.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Regels per sector ── */}
        <ScrollReveal>
          <section className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Welke regels gelden per sector?
              </h2>
              <p className="text-muted-foreground mb-8">
                De uitkomst van de <strong>huurpuntentelling</strong> bepaalt welke regels voor jouw woning gelden:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {sectorRegels.map(({ sector, punten, regels }) => (
                  <div key={sector} className="rounded-md border border-border bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">{sector}</p>
                    <p className="text-lg font-bold mb-3">{punten}</p>
                    <ul className="space-y-2">
                      {regels.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Indicatieve calculator ── */}
        <ScrollReveal>
          <section className="py-12 md:py-16 bg-card border-y border-card-border">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Bereken uw huurpunten — indicatief
                </h2>
                <p className="text-muted-foreground">
                  Vul de basisgegevens in en zie direct in welke sector uw woning valt. Voor een officieel rapport is een professionele opname vereist.
                </p>
              </div>
              <WwsCalculator />
            </div>
          </section>
        </ScrollReveal>

        {/* ── Persoonlijk verhaal / casus ── */}
        <ScrollReveal>
          <section className="py-10 md:py-14 bg-card border-y border-card-border">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">Voorbeeldcasus</p>
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Mark (44) uit Amsterdam
              </h2>
              <div className="flex gap-4 items-start mb-5">
                <Quote className="w-7 h-7 text-primary/30 flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground leading-relaxed">
                  Mark bezit een appartement van 85 m² in de Rivierenbuurt en wilde het voor het eerst gaan verhuren. Hij wist niet of de woning in de vrije sector zou vallen en wat de maximale huurprijs mocht zijn. Via Label &amp; Lens werd in één bezoek de puntentelling gedaan. Het rapport — inclusief alle bewijslast — lag binnen 2 werkdagen klaar en kon direct als bijlage bij het huurcontract worden gevoegd.
                </p>
              </div>
              <div className="rounded-md border border-border bg-background p-4">
                <p className="text-sm font-semibold mb-2">Uitkomst voor Mark:</p>
                <ul className="space-y-2">
                  {[
                    "Woning had 201 huurpunten → vrije sector",
                    "Wettelijk conforme bewijslast klaar voor huurcontract",
                    "Rapport binnen 2 werkdagen ontvangen",
                    "Alles in één afspraak geregeld",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Voor wie ── */}
        <ScrollReveal>
          <section className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Wanneer heb je een puntentelling nodig?
              </h2>
              <p className="text-muted-foreground mb-6">
                Een <strong>huurpuntentelling</strong> is in meerdere situaties essentieel:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {scenarios.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex flex-col gap-2 p-4 rounded-md border border-border bg-background">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                      <p className="font-semibold text-sm">{title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
                  </div>
                ))}
              </div>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Combineer de puntentelling met een{" "}
                    <Link href="/energielabels" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" data-testid="link-energielabel-card">
                      energielabel
                    </Link>{" "}
                    of{" "}
                    <Link href="/energielabel-aanvragen-amsterdam/" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" data-testid="link-amsterdam-card">
                      energielabel aanvragen in Amsterdam
                    </Link>
                    . Label &amp; Lens regelt alles in één keer.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Hoe werkt het ── */}
        <ScrollReveal>
          <section className="py-12 md:py-16 bg-card border-y border-card-border">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Hoe werkt een puntentelling aanvragen?
              </h2>
              <p className="text-muted-foreground mb-8">
                Vier stappen, geen gedoe.
              </p>
              <ol className="space-y-5 mb-8">
                {[
                  {
                    step: "1",
                    title: "Opdracht uitzetten",
                    text: (
                      <>
                        Via het{" "}
                        <a href="/#homepage-selector" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" data-testid="link-step-opdrachtvenster">opdrachtvenster</a>
                        , of direct via{" "}
                        <a href="https://wa.me/31643735719" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" data-testid="link-step-whatsapp">WhatsApp</a>
                        ,{" "}
                        <a href="mailto:Info@labelenlens.nl" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" data-testid="link-step-mail">mail</a>
                        {" "}of{" "}
                        <a href="tel:+31643735719" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" data-testid="link-step-bel">telefoon</a>.
                      </>
                    ),
                  },
                  { step: "2", title: "Afspraak inplannen",   text: "Er wordt snel contact opgenomen voor een moment dat werkt." },
                  { step: "3", title: "Opname van de woning", text: "Nauwkeurige opname ter plaatse — inclusief meting en inspectie." },
                  { step: "4", title: "Rapport ontvangen",    text: "Volledig conform rapport met puntentelling, maximale huurprijs en bewijslast — klaar als bijlage bij het huurcontract." },
                ].map(({ step, title, text }) => (
                  <li key={step} className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {step}
                    </span>
                    <div className="pt-1">
                      <p className="font-semibold text-sm mb-0.5">{title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="flex flex-wrap gap-3">
                <a href="/#homepage-selector">
                  <Button data-testid="button-stap-aanvragen" size="lg" className="bg-primary text-primary-foreground">
                    Direct aanvragen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <a href="/#prijzen">
                  <Button data-testid="button-prijs-berekenen" size="lg" variant="outline">
                    <Calculator className="w-4 h-4 mr-2" />
                    Prijs berekenen
                  </Button>
                </a>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Waarom Label & Lens ── */}
        <ScrollReveal>
          <section className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Waarom kiezen voor Label &amp; Lens?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Geen massaproces. Persoonlijk contact, actuele kennis van de regelgeving en ruim op tijd klaar.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {reasons.map(({ icon, title, text }) => (
                  <div key={title} className="flex gap-3 items-start">
                    {icon}
                    <div>
                      <h3 className="font-semibold mb-0.5 text-sm">{title}</h3>
                      <p className="text-sm text-muted-foreground">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── FAQ ── */}
        <ScrollReveal>
          <section className="py-12 md:py-16 bg-card border-y border-card-border">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Veelgestelde vragen over de WWS puntentelling
              </h2>
              <div>
                {faqs.map((faq) => (
                  <FAQItem key={faq.question} {...faq} />
                ))}
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Andere vragen?{" "}
                <a href="/#faq" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" data-testid="link-faq-meer-vragen">
                  Bekijk alle veelgestelde vragen
                </a>.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* ── CTA ── */}
        <ScrollReveal>
          <section className="py-12 md:py-20">
            <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Puntentelling laten uitvoeren?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Zet direct je opdracht uit of neem persoonlijk contact op.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="/#homepage-selector">
                  <Button data-testid="button-cta-aanvragen" size="lg" className="bg-primary text-primary-foreground px-8">
                    Opdracht uitzetten
                  </Button>
                </a>
                <a href="https://wa.me/31643735719" target="_blank" rel="noopener noreferrer">
                  <Button data-testid="button-cta-whatsapp" size="lg" variant="outline">
                    <FaWhatsapp className="w-4 h-4 mr-2" /> WhatsApp
                  </Button>
                </a>
                <a href="tel:+31643735719">
                  <Button data-testid="button-cta-bel" size="lg" variant="outline">
                    <Phone className="w-4 h-4 mr-2" /> Bel
                  </Button>
                </a>
                <a href="mailto:Info@labelenlens.nl">
                  <Button data-testid="button-cta-mail" size="lg" variant="outline">
                    <Mail className="w-4 h-4 mr-2" /> Mail
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
