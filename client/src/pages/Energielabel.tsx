import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Home as HomeIcon, Camera, FileText, Star, Award, TrendingUp, Sparkles, Zap, BarChart3, Clock, Euro, AlertCircle, Shield, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { PropertySize, FotografiePakket } from "@shared/schema";
import heroImage from "@assets/amsterdam-canal-houses_1760692744422.png";
import { useSEO } from "@/hooks/useSEO";

type PropertyType = "koop" | "huur";
type ServiceOption = "energielabel" | "fotografie" | "label-fotografie" | "puntentelling" | "adviesrapport";

const energielabelJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Energielabel & Puntentelling Amsterdam",
  provider: {
    "@type": "LocalBusiness",
    name: "Label & Lens",
    url: "https://www.labelenlens.nl",
    telephone: "+31643735719",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Amsterdam",
      addressCountry: "NL",
    },
  },
  serviceType: "Energielabel",
  areaServed: { "@type": "City", name: "Amsterdam" },
  description:
    "Officieel energielabel aanvragen voor uw woning in Amsterdam. Gecertificeerd volgens BRL9500. Ook puntentelling (WWS) en adviesrapport voor huurwoningen.",
  url: "https://www.labelenlens.nl/energielabel",
  offers: [
    {
      "@type": "Offer",
      name: "Energielabel",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Puntentelling (WWS)",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Adviesrapport Verduurzaming",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  ],
};

export default function Energielabel() {
  useSEO({
    title: "Energielabel Aanvragen Amsterdam – Binnen 5 Werkdagen",
    description:
      "Officieel energielabel aanvragen voor uw woning in Amsterdam. EPA-gecertificeerd volgens BRL9500, inclusief puntentelling (WWS) en adviesrapport voor verduurzaming.",
    canonical: "/energielabel",
    jsonLd: energielabelJsonLd,
  });

  const [propertyType, setPropertyType] = useState<PropertyType>("koop");
  const [selectedService, setSelectedService] = useState<ServiceOption>("energielabel");
  const [propertySize, setPropertySize] = useState<PropertySize | null>(null);
  const [fotografiePakket, setFotografiePakket] = useState<FotografiePakket | null>(null);
  const [spoedService, setSpoedService] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [addressPostcode, setAddressPostcode] = useState("");
  const [addressHuisnummer, setAddressHuisnummer] = useState("");
  const [addressToevoeging, setAddressToevoeging] = useState("");
  const [isLookingUpAddress, setIsLookingUpAddress] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const mapOppervlakteToSize = (m2: number): PropertySize => {
    if (m2 < 50) return "tot-50";
    if (m2 < 100) return "50-100";
    if (m2 < 150) return "100-150";
    return "150-plus";
  };

  const handleAddressLookup = async () => {
    if (!addressPostcode || !addressHuisnummer) {
      toast({
        title: "Gegevens ontbreken",
        description: "Vul postcode en huisnummer in.",
        variant: "destructive",
      });
      return;
    }
    setIsLookingUpAddress(true);
    try {
      const params = new URLSearchParams({ postcode: addressPostcode, huisnummer: addressHuisnummer });
      if (addressToevoeging) params.append("toevoeging", addressToevoeging);
      const response = await fetch(`/api/bag/oppervlakte?${params}`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        toast({
          title: "Adres niet gevonden",
          description: data.error || "Controleer de ingevoerde gegevens.",
          variant: "destructive",
        });
        return;
      }
      const adres = data.adres;
      const toev = adres.toevoeging ? ` ${adres.toevoeging}` : "";
      const addressString = `${adres.straatnaam} ${adres.huisnummer}${toev}, ${adres.postcode} ${adres.woonplaats}`;
      setAddress(addressString);
      if (data.oppervlakte) {
        setPropertySize(mapOppervlakteToSize(data.oppervlakte));
      }
      toast({
        title: "Adres gevonden!",
        description: addressString,
      });
    } catch (error) {
      toast({
        title: "Fout bij opzoeken",
        description: "Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsLookingUpAddress(false);
    }
  };

  useEffect(() => {
    if (propertyType === "huur" && (selectedService === "fotografie" || selectedService === "label-fotografie")) {
      setSelectedService("energielabel");
    }
    if (propertyType === "koop" && (selectedService === "puntentelling" || selectedService === "adviesrapport")) {
      setSelectedService("energielabel");
    }
  }, [propertyType, selectedService]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const calculateTotalPrice = (): number => {
    let total = 0;

    // Base price for energielabel (based on property size)
    if (selectedService === "energielabel" && propertySize) {
      const basePrices: Record<PropertySize, number> = {
        "tot-50": 199,
        "50-100": 239,
        "100-150": 279,
        "150-plus": 319,
      };
      total = basePrices[propertySize];
    }

    // Puntentelling fixed price
    if (selectedService === "puntentelling") {
      total = 120;
    }

    // Adviesrapport fixed price
    if (selectedService === "adviesrapport") {
      total = 100;
    }

    // Fotografie pakket prices
    if ((selectedService === "fotografie" || selectedService === "label-fotografie") && fotografiePakket) {
      const fotografiePrices: Record<FotografiePakket, number> = {
        "basis": 249,
        "totaal": 325,
        "exclusief": 399,
      };
      total += fotografiePrices[fotografiePakket];
    }

    // Label + Fotografie combo (add energielabel base price)
    if (selectedService === "label-fotografie" && propertySize) {
      const basePrices: Record<PropertySize, number> = {
        "tot-50": 199,
        "50-100": 239,
        "100-150": 279,
        "150-plus": 319,
      };
      total += basePrices[propertySize];
    }

    // Spoed service addon
    if (spoedService) {
      total += 50;
    }

    return total;
  };

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/submissions", data);
    },
    onSuccess: () => {
      toast({
        title: "Aanvraag ontvangen!",
        description: "We hebben u een bevestiging gestuurd per email.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setExtraNotes("");
      setPropertySize(null);
      setFotografiePakket(null);
      setSpoedService(false);
    },
    onError: (error: any) => {
      toast({
        title: "Fout bij verzenden",
        description: error.message || "Er is iets misgegaan. Probeer het opnieuw.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalPrice = calculateTotalPrice();
    
    submitMutation.mutate({
      name,
      email,
      phone,
      propertyAddress: address,
      propertyType,
      selectedService,
      propertySize,
      fotografiePakket,
      spoedService,
      extraNotes,
      totalPrice,
    });
  };

  const handlePropertyTypeChange = (type: PropertyType) => {
    setPropertyType(type);
  };

  const getAvailableServices = () => {
    const koopServices = [
      {
        id: "energielabel" as ServiceOption,
        title: "Energielabel",
        icon: <FileText className="w-8 h-8" />,
        description: "Officieel energielabel voor uw woning",
        availableFor: ["koop"],
      },
      {
        id: "fotografie" as ServiceOption,
        title: "Fotografie",
        icon: <Camera className="w-8 h-8" />,
        description: "Professionele woningfotografie",
        availableFor: ["koop"],
      },
      {
        id: "label-fotografie" as ServiceOption,
        title: "Label + Fotografie",
        icon: <Award className="w-8 h-8" />,
        description: "Compleet pakket met voordeel",
        availableFor: ["koop"],
      },
    ];

    const huurServices = [
      {
        id: "energielabel" as ServiceOption,
        title: "Energielabel",
        icon: <FileText className="w-8 h-8" />,
        description: "Een officieel energielabel is verplicht bij verkoop of verhuur van uw woning. Ons gecertificeerde team zorgt voor een nauwkeurige beoordeling volgens de BRL9500 normen.",
        availableFor: ["huur"],
      },
      {
        id: "puntentelling" as ServiceOption,
        title: "Puntentelling",
        icon: <BarChart3 className="w-8 h-8" />,
        description: "Voor elke huurwoning is na een energielabel ook een puntentelling vereist. Wij berekenen het exacte aantal punten van uw woning volgens het Woningwaarderingsstelsel (WWS).",
        availableFor: ["huur"],
      },
      {
        id: "adviesrapport" as ServiceOption,
        title: "Adviesrapport",
        icon: <Shield className="w-8 h-8" />,
        description: "Ontdek hoe u uw energielabel of puntentelling kunt verbeteren. Ons adviesrapport toont alle opties, zodat u doelgericht en kostenefficiënt de meest effectieve verbeteringen kunt doorvoeren.",
        availableFor: ["huur"],
      },
    ];

    return propertyType === "koop" ? koopServices : huurServices;
  };

  const fotografiePakketten = [
    {
      title: "Basic Pakket",
      price: "€149",
      icon: <Camera className="w-10 h-10 text-primary" />,
      description: "Perfect voor kleine woningen",
      features: [
        "Tot 10 professionele foto's",
        "Basisbewerkingen",
        "Alle ruimtes in beeld",
        "Digitale levering binnen 2 dagen",
        "Geschikt voor standaard advertenties",
      ],
    },
    {
      title: "Standaard Pakket",
      price: "€249",
      icon: <Sparkles className="w-10 h-10 text-primary" />,
      description: "Meest gekozen optie",
      features: [
        "Tot 20 professionele foto's",
        "Geavanceerde bewerkingen",
        "HDR fotografie",
        "Twilight shots (avondfoto's)",
        "Digitale levering binnen 2 dagen",
        "360° panorama van woonkamer",
      ],
      popular: true,
    },
    {
      title: "Premium Pakket",
      price: "€399",
      icon: <Zap className="w-10 h-10 text-primary" />,
      description: "Voor maximale impact",
      features: [
        "Onbeperkt aantal foto's",
        "Premium bewerkingen",
        "HDR fotografie",
        "Twilight shots (avondfoto's)",
        "Drone fotografie (indien mogelijk)",
        "360° panorama's van alle ruimtes",
        "Virtuele tour",
        "Digitale levering binnen 1 dag",
      ],
    },
  ];

  const getServiceInfoBlocks = () => {
    if (propertyType === "huur") {
      if (selectedService === "energielabel") {
        return {
          whatIs: {
            icon: <FileText className="w-8 h-8 text-primary" />,
            title: "Wat is een energielabel?",
            content: "Een energielabel is een officieel document dat de energieprestatie van uw woning weergeeft. Het label toont op een schaal van A++++ (zeer energiezuinig) tot G (niet energiezuinig) hoe efficiënt uw woning omgaat met energie.",
            details: [
              "Energieklasse van uw woning (A++++ tot G)",
              "Energie-index (getal tussen 0 en 5)",
              "Geschat energieverbruik per jaar",
              "CO2-uitstoot van uw woning",
              "Aanbevelingen voor verbetering"
            ]
          },
          whenNeeded: {
            icon: <AlertCircle className="w-8 h-8 text-orange-500" />,
            title: "Wanneer heb je een energielabel nodig?",
            verplicht: [
              { title: "Verkoop van uw woning", description: "Moet zichtbaar zijn in advertenties" },
              { title: "Verhuur van uw woning", description: "Verplicht voor alle huurwoningen" },
              { title: "Nieuwbouw", description: "Voor oplevering van nieuwe woningen" },
              { title: "Grote renovaties", description: "Bij ingrijpende verbouwingen" }
            ],
            wetgeving: [
              "Sinds 2008 verplicht bij verkoop",
              "Sinds 2010 verplicht bij verhuur",
              "Boete tot €435 bij ontbreken",
              "Moet zichtbaar zijn in advertenties",
              "Geldig voor 10 jaar"
            ]
          },
          costs: {
            icon: <Euro className="w-8 h-8 text-primary" />,
            title: "Kosten en tarieven",
            prijzen: [
              { size: "Tot 50m²", price: "€199", note: "incl. BTW" },
              { size: "50m² - 100m²", price: "€239", note: "incl. BTW", popular: true },
              { size: "100m²+", price: "€279", note: "incl. BTW" }
            ],
            included: [
              "Officieel energielabel (10 jaar geldig)",
              "Professionele plattegrond",
              "Woningbezoek door gecertificeerde adviseur",
              "Levering binnen 5 werkdagen",
              "Digitale en fysieke versie"
            ],
            extras: [
              { name: "Spoed service (+€50)", description: "Binnen 24 uur" },
              { name: "Puntentelling (+€120)", description: "Voor huurwoningen" },
              { name: "Adviesrapport (+€100)", description: "Verbeteringsadvies" }
            ]
          }
        };
      } else if (selectedService === "puntentelling") {
        return {
          whatIs: {
            icon: <BarChart3 className="w-8 h-8 text-primary" />,
            title: "Wat is een puntentelling?",
            content: "Voor elke huurwoning is na een energielabel ook een puntentelling vereist. Wij berekenen het exacte aantal punten van uw woning volgens het Woningwaarderingsstelsel (WWS).",
            details: [
              "Officiële puntentelling WWS",
              "Huurprijsberekening",
              "Snelle levering",
              "Verplicht voor verhuur"
            ]
          },
          whenNeeded: {
            icon: <AlertCircle className="w-8 h-8 text-orange-500" />,
            title: "Wanneer heb je een puntentelling nodig?",
            verplicht: [
              { title: "Verhuur van woningen", description: "Voor alle huurwoningen verplicht" },
              { title: "Huurprijsbepaling", description: "Maximale huurprijs berekenen" },
              { title: "Huurcommissie procedures", description: "Bij geschillen" },
              { title: "Verhogen puntentelling", description: "Woning naar vrije sector krijgen" }
            ],
            wetgeving: [
              "WWS verplicht voor alle huurwoningen",
              "Maximale huurprijs afhankelijk van punten",
              "Sociale huur: tot 149 punten",
              "Middenhuur: 150-186 punten",
              "Vrije sector: vanaf 187 punten"
            ]
          },
          costs: {
            icon: <Euro className="w-8 h-8 text-primary" />,
            title: "Kosten en tarieven",
            prijs: "€120",
            note: "Inclusief officieel rapport",
            included: [
              "Officiële puntentelling WWS",
              "Huurprijsberekening",
              "Snelle levering",
              "Verplicht voor verhuur"
            ]
          }
        };
      } else if (selectedService === "adviesrapport") {
        return {
          whatIs: {
            icon: <Shield className="w-8 h-8 text-primary" />,
            title: "Wat is een adviesrapport?",
            content: "Ontdek hoe u uw energielabel of puntentelling kunt verbeteren. Ons adviesrapport toont alle opties, zodat u doelgericht en kostenefficiënt de meest effectieve verbeteringen kunt doorvoeren.",
            details: [
              "Uitgebreid verduurzamingsadvies",
              "Optimalisatie van puntentelling",
              "Advies op maat voor uw situatie",
              "Alle mogelijke opties"
            ]
          },
          whenNeeded: {
            icon: <AlertCircle className="w-8 h-8 text-orange-500" />,
            title: "Wanneer heb je een adviesrapport nodig?",
            verplicht: [
              { title: "Label verbeteren", description: "Van D naar C of hoger" },
              { title: "Puntentelling verhogen", description: "Woning naar vrije sector krijgen" },
              { title: "Verduurzaming plannen", description: "Subsidies en maatregelen" },
              { title: "Energiekosten besparen", description: "Rendement berekenen" }
            ],
            wetgeving: [
              "Woning krijgt te laag energielabel",
              "Huurwoning heeft te weinig punten",
              "Verduurzaming overwegen",
              "Isolatie verbeteren",
              "Zonnepanelen overwegen"
            ]
          },
          costs: {
            icon: <Euro className="w-8 h-8 text-primary" />,
            title: "Kosten en tarieven",
            prijs: "€100",
            note: "Indien nodig",
            included: [
              "Uitgebreid verduurzamingsadvies",
              "Optimalisatie van puntentelling",
              "Advies op maat voor uw situatie",
              "Alle mogelijke opties"
            ]
          }
        };
      }
    }
    return null;
  };

  const availableServices = getAvailableServices();
  const showFotografiePakketten = propertyType === "koop" && selectedService === "fotografie";
  const serviceInfo = getServiceInfoBlocks();

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <Hero
        title="Energielabel Aanvragen"
        subtitle="Snel, betrouwbaar en officieel gecertificeerd. Binnen 5 werkdagen geleverd."
        imageSrc={heroImage}
        imageAlt="Amsterdamse grachtenpanden bij avond"
      >
        <Button
          data-testid="button-cta-scroll"
          onClick={scrollToForm}
          size="lg"
          className="bg-primary text-primary-foreground hover-elevate active-elevate-2"
        >
          Direct Aanvragen
        </Button>
      </Hero>

      {/* Gecombineerd Menu: Woningtype + Dienst */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                Kies uw woningtype en dienst
              </h2>
              <p className="text-muted-foreground">
                Selecteer eerst het woningtype, daarna de gewenste dienst
              </p>
            </div>
          </ScrollReveal>

          {/* Stap 1: Woningtype */}
          <ScrollReveal delay={100}>
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-center">Stap 1: Woningtype</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  data-testid="button-toggle-koop"
                  onClick={() => handlePropertyTypeChange("koop")}
                  variant={propertyType === "koop" ? "default" : "outline"}
                  size="lg"
                  className={`min-w-[200px] ${propertyType === "koop" ? "bg-primary text-primary-foreground" : ""}`}
                >
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Koopwoning
                </Button>
                <Button
                  data-testid="button-toggle-huur"
                  onClick={() => handlePropertyTypeChange("huur")}
                  variant={propertyType === "huur" ? "default" : "outline"}
                  size="lg"
                  className={`min-w-[200px] ${propertyType === "huur" ? "bg-primary text-primary-foreground" : ""}`}
                >
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Huurwoning
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* Stap 2: Dienst */}
          <ScrollReveal delay={200}>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-center">Stap 2: Dienst</h3>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                {availableServices.map((service, index) => (
                  <Card
                    key={service.id}
                    data-testid={`card-service-${service.id}`}
                    onClick={() => setSelectedService(service.id)}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedService === service.id
                        ? "border-primary border-2 bg-primary/5"
                        : "hover-elevate"
                    }`}
                  >
                    <CardContent className="p-6 text-center flex flex-col h-full">
                      <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${
                        selectedService === service.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      }`}>
                        {service.icon}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground flex-grow">{service.description}</p>
                      {selectedService === service.id && (
                        <div className="mt-4">
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Fotografie Pakketten (alleen bij Koop + Fotografie) */}
      {showFotografiePakketten && (
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                  Kies uw Fotografie Pakket
                </h2>
                <p className="text-muted-foreground text-lg">
                  Professionele woningfotografie voor een perfecte eerste indruk
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fotografiePakketten.map((pakket, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <Card 
                    data-testid={`card-foto-pakket-${index}`}
                    className={`hover-elevate transition-all duration-300 h-full ${
                      pakket.popular ? "border-primary border-2" : ""
                    }`}
                  >
                    <CardContent className="p-8 h-full flex flex-col">
                      {pakket.popular && (
                        <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full w-fit mx-auto mb-4">
                          POPULAIR
                        </div>
                      )}
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                        {pakket.icon}
                      </div>
                      <h3 className="text-2xl font-semibold mb-2 text-center">{pakket.title}</h3>
                      <p className="text-3xl font-bold text-primary mb-4 text-center">{pakket.price}</p>
                      <p className="text-muted-foreground mb-6 text-center">{pakket.description}</p>
                      <div className="space-y-3 flex-grow">
                        {pakket.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Info Blokken (voor Huurwoning diensten) */}
      {serviceInfo && (
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Wat is het blok */}
            <ScrollReveal>
              <Card data-testid="card-what-is" className="border-l-4 border-l-primary">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {serviceInfo.whatIs.icon}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-semibold mb-3">{serviceInfo.whatIs.title}</h3>
                      <p className="text-muted-foreground mb-6">{serviceInfo.whatIs.content}</p>
                      {serviceInfo.whatIs.details && (
                        <div className="space-y-2">
                          {serviceInfo.whatIs.details.map((detail, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{detail}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Wanneer nodig blok */}
            <ScrollReveal delay={100}>
              <Card data-testid="card-when-needed" className="border-l-4 border-l-orange-500">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      {serviceInfo.whenNeeded.icon}
                    </div>
                    <h3 className="text-2xl font-semibold">{serviceInfo.whenNeeded.title}</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-4">Verplicht bij:</h4>
                      <div className="space-y-3">
                        {serviceInfo.whenNeeded.verplicht.map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-4">
                        {selectedService === "energielabel" ? "Belangrijke wetgeving:" : 
                         selectedService === "puntentelling" ? "Belangrijke wetgeving:" : 
                         "Veelvoorkomende situaties:"}
                      </h4>
                      <ul className="space-y-2">
                        {serviceInfo.whenNeeded.wetgeving.map((item, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Kosten blok */}
            <ScrollReveal delay={200}>
              <Card data-testid="card-costs" className="border-l-4 border-l-primary">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {serviceInfo.costs.icon}
                    </div>
                    <h3 className="text-2xl font-semibold">{serviceInfo.costs.title}</h3>
                  </div>

                  {serviceInfo.costs.prijzen ? (
                    <>
                      <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {serviceInfo.costs.prijzen.map((prijs, index) => (
                          <Card 
                            key={index}
                            className={`${prijs.popular ? "border-primary border-2 bg-primary/5" : ""}`}
                          >
                            <CardContent className="p-6 text-center">
                              {prijs.popular && (
                                <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full w-fit mx-auto mb-3">
                                  Populair
                                </div>
                              )}
                              <p className="text-sm text-muted-foreground mb-2">{prijs.size}</p>
                              <p className="text-3xl font-bold text-primary mb-1">{prijs.price}</p>
                              <p className="text-xs text-muted-foreground">{prijs.note}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-semibold mb-4">Wat is inbegrepen:</h4>
                          <div className="space-y-2">
                            {serviceInfo.costs.included.map((item, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-4">Extra opties:</h4>
                          <div className="space-y-3">
                            {serviceInfo.costs.extras.map((extra, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <Euro className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium text-sm">{extra.name}</p>
                                  <p className="text-xs text-muted-foreground">{extra.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center mb-8">
                      <p className="text-4xl font-bold text-primary mb-2">{serviceInfo.costs.prijs}</p>
                      <p className="text-sm text-muted-foreground mb-6">{serviceInfo.costs.note}</p>
                      <div className="max-w-md mx-auto space-y-2">
                        {serviceInfo.costs.included.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Formulier Sectie */}
      <section ref={formRef} className={`py-16 md:py-24 px-4 ${!showFotografiePakketten && !serviceInfo ? "bg-muted/30" : ""}`}>
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                Vraag Aanbieding Aan
              </h2>
              <p className="text-muted-foreground text-lg">
                Vul het formulier in en wij nemen zo snel mogelijk contact met u op
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="form-name">Naam *</Label>
                      <Input
                        id="form-name"
                        data-testid="input-form-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="form-email">Email *</Label>
                      <Input
                        id="form-email"
                        data-testid="input-form-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="form-phone">Telefoon *</Label>
                      <Input
                        id="form-phone"
                        data-testid="input-form-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="form-address">Adres Woning *</Label>
                      <Input
                        id="form-address"
                        data-testid="input-form-address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Straatnaam 123, 1234 AB Amsterdam"
                        required
                      />
                    </div>
                  </div>

                  <div className="border rounded-md p-4 space-y-3 bg-muted/30">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Adres automatisch opzoeken via postcode
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="lookup-postcode" className="text-sm">Postcode</Label>
                        <Input
                          id="lookup-postcode"
                          data-testid="input-lookup-postcode"
                          placeholder="1234AB"
                          value={addressPostcode}
                          onChange={(e) => setAddressPostcode(e.target.value.toUpperCase())}
                          maxLength={7}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="lookup-huisnummer" className="text-sm">Huisnummer</Label>
                        <Input
                          id="lookup-huisnummer"
                          data-testid="input-lookup-huisnummer"
                          placeholder="42"
                          value={addressHuisnummer}
                          onChange={(e) => setAddressHuisnummer(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="lookup-toevoeging" className="text-sm">Toevoeging</Label>
                        <Input
                          id="lookup-toevoeging"
                          data-testid="input-lookup-toevoeging"
                          placeholder="A / 2"
                          value={addressToevoeging}
                          onChange={(e) => setAddressToevoeging(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddressLookup}
                      disabled={isLookingUpAddress || !addressPostcode || !addressHuisnummer}
                      data-testid="button-lookup-address"
                    >
                      {isLookingUpAddress ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Zoeken...
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 mr-2" />
                          Adres opzoeken
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Property Size Selector (voor energielabel) */}
                  {(selectedService === "energielabel" || selectedService === "label-fotografie") && (
                    <div>
                      <Label>Oppervlakte Woning *</Label>
                      <RadioGroup 
                        value={propertySize || ""} 
                        onValueChange={(value) => setPropertySize(value as PropertySize)}
                        required
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                          <Label htmlFor="size-tot-50" className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover-elevate">
                            <RadioGroupItem value="tot-50" id="size-tot-50" />
                            <span className="text-sm">Tot 50m²</span>
                          </Label>
                          <Label htmlFor="size-50-100" className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover-elevate">
                            <RadioGroupItem value="50-100" id="size-50-100" />
                            <span className="text-sm">50-100m²</span>
                          </Label>
                          <Label htmlFor="size-100-150" className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover-elevate">
                            <RadioGroupItem value="100-150" id="size-100-150" />
                            <span className="text-sm">100-150m²</span>
                          </Label>
                          <Label htmlFor="size-150-plus" className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover-elevate">
                            <RadioGroupItem value="150-plus" id="size-150-plus" />
                            <span className="text-sm">150m²+</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Fotografie Pakket Selector */}
                  {(selectedService === "fotografie" || selectedService === "label-fotografie") && (
                    <div>
                      <Label>Fotografie Pakket *</Label>
                      <RadioGroup 
                        value={fotografiePakket || ""} 
                        onValueChange={(value) => setFotografiePakket(value as FotografiePakket)}
                        required
                      >
                        <div className="grid md:grid-cols-3 gap-4 mt-2">
                          <Label htmlFor="pakket-basic" className="flex flex-col space-y-2 border rounded-md p-4 cursor-pointer hover-elevate">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="basic" id="pakket-basic" />
                              <span className="font-semibold">Basic (€149)</span>
                            </div>
                            <span className="text-xs text-muted-foreground ml-6">Tot 10 foto's</span>
                          </Label>
                          <Label htmlFor="pakket-standaard" className="flex flex-col space-y-2 border rounded-md p-4 cursor-pointer hover-elevate">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="standaard" id="pakket-standaard" />
                              <span className="font-semibold">Standaard (€249)</span>
                            </div>
                            <span className="text-xs text-muted-foreground ml-6">Tot 20 foto's + drone</span>
                          </Label>
                          <Label htmlFor="pakket-premium" className="flex flex-col space-y-2 border rounded-md p-4 cursor-pointer hover-elevate">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="premium" id="pakket-premium" />
                              <span className="font-semibold">Premium (€399)</span>
                            </div>
                            <span className="text-xs text-muted-foreground ml-6">Onbeperkt + drone + 3D</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Spoed Service Checkbox */}
                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <Checkbox 
                      id="spoed-service" 
                      checked={spoedService}
                      onCheckedChange={(checked) => setSpoedService(checked as boolean)}
                      data-testid="checkbox-spoed-service"
                    />
                    <Label htmlFor="spoed-service" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="font-medium">Spoed service (+€50)</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Levering binnen 24 uur</p>
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="form-notes">Aanvullende Opmerkingen</Label>
                    <Textarea
                      id="form-notes"
                      data-testid="input-form-notes"
                      value={extraNotes}
                      onChange={(e) => setExtraNotes(e.target.value)}
                      placeholder="Bijv. specifieke wensen, vragen..."
                      rows={3}
                    />
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium mb-1">
                          <strong>Uw keuze:</strong> {propertyType === "koop" ? "Koopwoning" : "Huurwoning"} • {" "}
                          {availableServices.find(s => s.id === selectedService)?.title}
                        </p>
                        {propertySize && <p className="text-xs text-muted-foreground">Oppervlakte: {propertySize}</p>}
                        {fotografiePakket && <p className="text-xs text-muted-foreground">Pakket: {fotografiePakket}</p>}
                        {spoedService && <p className="text-xs text-muted-foreground">Spoed service inbegrepen</p>}
                      </div>
                      {calculateTotalPrice() > 0 && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Totaalprijs</p>
                          <p className="text-2xl font-bold text-primary">€{calculateTotalPrice()}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    data-testid="button-form-submit"
                    size="lg"
                    className="w-full bg-primary text-primary-foreground hover-elevate active-elevate-2"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? "Bezig met verzenden..." : "Aanvraag Versturen"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Reviews Sectie */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                Wat Klanten Zeggen
              </h2>
              <p className="text-muted-foreground text-lg">
                Ervaring van onze tevreden klanten
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Jan de Vries",
                rating: 5,
                text: "Zeer professioneel en snel geregeld. Energielabel binnen 3 dagen ontvangen!",
              },
              {
                name: "Lisa Bakker",
                rating: 5,
                text: "Uitstekende service. Adviseur was zeer kundig en geduldig met al mijn vragen.",
              },
              {
                name: "Mohammed Ahmed",
                rating: 5,
                text: "Goede prijs-kwaliteit verhouding. Aanrader voor iedereen die een energielabel nodig heeft.",
              },
            ].map((review, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <Card data-testid={`card-review-${index}`} className="hover-elevate transition-all duration-300 h-full">
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="flex gap-1 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 flex-grow italic">
                      "{review.text}"
                    </p>
                    <p className="font-semibold">- {review.name}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
