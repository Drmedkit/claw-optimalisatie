import { useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Home as HomeIcon, FileText, Camera, Check, ChevronDown, ChevronUp, Ruler, BarChart3, Zap, Send, MapPin, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { PropertyType, PropertySize, FotografiePakket, QuoteRequest } from "@shared/schema";
import { calculatorPricing, quoteRequestSchema } from "@shared/schema";

type ServiceOption = "energielabel" | "fotografie" | "label-fotografie";
type ExpandableService = "energielabel" | "puntentelling" | "adviesrapport" | "fotografie";

export function HomepageSelector() {
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);

  // Pricing calculator steps
  const [propertySize, setPropertySize] = useState<PropertySize | null>(null);
  const [fotografiePakket, setFotografiePakket] = useState<FotografiePakket | null>(null);

  // Extra diensten (upsells)
  const [nenMeting, setNenMeting] = useState(false);
  const [puntentelling, setPuntentelling] = useState(false);
  const [adviesrapport, setAdviesrapport] = useState(false);
  const [spoedService, setSpoedService] = useState(false);

  // Address lookup state
  const [showAddressLookup, setShowAddressLookup] = useState(false);
  const [addressPostcode, setAddressPostcode] = useState("");
  const [addressHuisnummer, setAddressHuisnummer] = useState("");
  const [addressToevoeging, setAddressToevoeging] = useState("");
  const [foundOppervlakte, setFoundOppervlakte] = useState<number | null>(null);
  const [foundAddress, setFoundAddress] = useState<string | null>(null);
  const [isLookingUpAddress, setIsLookingUpAddress] = useState(false);

  const { toast } = useToast();

  const form = useForm<QuoteRequest>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      name: "",
      companyName: "",
      email: "",
      phone: "",
      propertyPostcode: "",
      propertyAddress: "",
      calculatorState: {
        propertyType: "koop" as PropertyType,
        selectedService: "energielabel",
        propertySize: null,
        fotografiePakket: null,
        puntentelling: false,
        adviesrapport: false,
        spoedService: false,
      },
      totalPrice: 0,
    },
  });

  const quoteMutation = useMutation({
    mutationFn: async (data: QuoteRequest) => {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit quote");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Afspraak aangevraagd!",
        description: "Wij nemen zo snel mogelijk contact met u op.",
      });
      // Reset all state
      setSelectedService(null);
      setPropertySize(null);
      setFotografiePakket(null);
      setNenMeting(false);
      setPuntentelling(false);
      setAdviesrapport(false);
      setSpoedService(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Er ging iets mis",
        description: "Probeer het later opnieuw.",
        variant: "destructive",
      });
    },
  });

  const koopContent = {
    energielabels: {
      icon: <FileText className="w-12 h-12 text-primary" />,
      title: "Uitleg Energielabels",
      description: "Een energielabel is verplicht bij verkoop van uw woning. Het toont de energieprestatie op een schaal van A++++ (zeer zuinig) tot G (onzuinig).",
      features: [
        "Verplicht bij verkoop sinds 2008",
        "Moet zichtbaar zijn in advertenties",
        "Geldig voor 10 jaar",
        "BRL9500 gecertificeerd",
        "Binnen 5 werkdagen geleverd",
      ],
    },
    nen2580: {
      icon: <Ruler className="w-12 h-12 text-primary" />,
      title: "Uitleg NEN 2580 Meting",
      description: "NEN 2580 is de officiële meetmethode voor woningoppervlakte in Nederland. Essentieel voor transparante verkoop.",
      features: [
        "Gebruiksoppervlakte volgens norm",
        "Bruto vloeroppervlakte",
        "Gebouwgebonden buitenruimte",
        "Professionele tekeningen",
        "Officieel meetrapport",
      ],
    },
    fotografie: {
      icon: <Camera className="w-12 h-12 text-primary" />,
      title: "Fotografie",
      description: "Professionele woningfotografie maakt het verschil bij verkoop. Eerste indruk is cruciaal.",
      packages: [
        {
          name: "Visuals Basis",
          price: "€249",
          features: [
            "Professionele woningfotografie",
            "Inmeten op locatie",
            "NEN 2580 meting",
            "2D & 3D plattegrond",
          ],
        },
        {
          name: "Visuals Totaal",
          price: "€325",
          highlighted: true,
          features: [
            "Professionele woningfotografie",
            "Inmeten op locatie",
            "NEN 2580 meting",
            "2D & 3D plattegrond",
            "360° woningfotografie",
            "Standaard woningvideo",
          ],
        },
        {
          name: "Visuals Exclusief",
          price: "€399",
          features: [
            "Professionele woningfotografie",
            "Inmeten op locatie",
            "NEN 2580 meting",
            "2D & 3D plattegrond",
            "360° woningfotografie",
            "Standaard woningvideo",
            "Online woningbrochure",
          ],
        },
      ],
    },
  };

  const huurwoningenDiensten = [
    {
      id: "energielabel" as const,
      icon: <FileText className="w-12 h-12 text-primary" />,
      title: "Energielabel",
      subtitle: "Een officieel energielabel is verplicht bij verkoop of verhuur van uw woning. Ons gecertificeerd team zorgt voor een nauwkeurige beoordeling volgens de BRL9500 normen.",
      whatIs: {
        title: "Wat is het?",
        content: "Een energielabel is een officieel document dat de energieprestatie van uw woning weergeeft. Het label toont op een schaal van A++++ (zeer energiezuinig) tot G (niet energiezuinig) hoe efficiënt uw woning omgaat met energie.",
        details: [
          "Energieklasse van uw woning (A++++ tot G)",
          "Energie-index (getal tussen 0 en 5)",
          "Geschat energieverbruik per jaar",
          "CO2-uitstoot van uw woning",
          "Aanbevelingen voor verbetering",
        ],
      },
      whenNeeded: {
        title: "Wanneer heb je het nodig?",
        required: [
          { title: "Verkoop van uw woning", subtitle: "Moet zichtbaar zijn in advertenties" },
          { title: "Verhuur van uw woning", subtitle: "Verplicht voor alle huurwoningen" },
        ],
        important: [
          { title: "Sinds 2008 verplicht bij verkoop", icon: true },
          { title: "Sinds 2010 verplicht bij verhuur", icon: true },
          { title: "Boete tot €435 bij ontbreken", icon: true },
        ],
      },
      whatCosts: {
        title: "Wat kost het?",
        content: "De prijs van een energielabel hangt af van de grootte van uw woning. Wij hanteren transparante prijzen zonder verrassingen.",
      },
    },
    {
      id: "puntentelling" as const,
      icon: <BarChart3 className="w-12 h-12 text-primary" />,
      title: "Puntentelling",
      subtitle: "Voor elke huurwoning is na een puntentelling vereist. Wij berekenen het exacte aantal punten van uw woning volgens het Woningwaarderingsstelsel (WWS).",
      whatIs: {
        title: "Wat is het?",
        content: "Een puntentelling berekent de maximale huurprijs voor uw huurwoning volgens het Woningwaarderingsstelsel (WWS). Iedere woning krijgt punten op basis van verschillende kenmerken.",
        details: [
          "Oppervlakte van de woning",
          "Voorzieningen (keuken, badkamer, toilet)",
          "Energieprestatie (energielabel)",
          "WOZ-waarde",
          "Omgevingsfactoren",
        ],
      },
      whenNeeded: {
        title: "Wanneer heb je het nodig?",
        required: [
          { title: "Bij verhuur van uw woning", subtitle: "Verplicht voor bepaling maximale huur" },
          { title: "Bij huurprijscontrole", subtitle: "Voor bezwaar tegen te hoge huur" },
        ],
        important: [
          { title: "Bepaalt maximale huurprijs", icon: true },
          { title: "Voorkomt juridische problemen", icon: true },
          { title: "Transparantie voor huurder", icon: true },
        ],
      },
      whatCosts: {
        title: "Wat kost het?",
        content: "Een puntentelling kost €120 als toevoeging aan het energielabel. Dit is een vaste prijs, ongeacht de grootte van uw woning.",
      },
    },
    {
      id: "adviesrapport" as const,
      icon: <FileText className="w-12 h-12 text-primary" />,
      title: "Adviesrapport",
      subtitle: "Ontdek hoe u uw energielabel of puntentelling kunt verbeteren. Ons adviesrapport toont alle opties, zodat u doelgericht en kostenefficiënt de meest effectieve verbeteringen kunt doorvoeren.",
      whatIs: {
        title: "Wat is het?",
        content: "Een adviesrapport geeft u inzicht in alle mogelijkheden om uw energielabel of puntentelling te verbeteren. We analyseren uw woning en geven concrete aanbevelingen.",
        details: [
          "Overzicht huidige energieprestatie",
          "Concrete verbeteringsopties",
          "Kostenraming per optie",
          "Impact op energielabel en punten",
          "Terugverdientijd investeringen",
        ],
      },
      whenNeeded: {
        title: "Wanneer heb je het nodig?",
        required: [
          { title: "Bij laag energielabel", subtitle: "Om verkoop- of verhuurwaarde te verhogen" },
          { title: "Bij lage puntentelling", subtitle: "Om hogere huurprijs te kunnen vragen" },
        ],
        important: [
          { title: "Verhoogt waarde van uw woning", icon: true },
          { title: "Bespaart energiekosten", icon: true },
          { title: "Maakt subsidies inzichtelijk", icon: true },
        ],
      },
      whatCosts: {
        title: "Wat kost het?",
        content: "Een adviesrapport kost €100 als toevoeging aan het energielabel. U krijgt direct inzicht in alle verbetermogelijkheden en de financiële impact.",
      },
    },
    {
      id: "fotografie" as const,
      icon: <Camera className="w-12 h-12 text-primary" />,
      title: "Fotografie",
      subtitle: "Professionele woningfotografie maakt het verschil bij verhuur. Geef potentiële huurders direct een positieve eerste indruk.",
      whatIs: {
        title: "Wat is het?",
        content: "Professionele woningfotografie zorgt voor aantrekkelijke foto's van uw huurwoning. Met de juiste belichting en compositie komen alle ruimtes optimaal tot hun recht.",
        details: [
          "Professionele camera apparatuur",
          "Optimale belichting en compositie",
          "Alle ruimtes in beeld",
          "Bewerkte foto's voor advertenties",
          "Digitale levering binnen 48 uur",
        ],
      },
      whenNeeded: {
        title: "Wanneer heb je het nodig?",
        required: [
          { title: "Bij verhuur van uw woning", subtitle: "Voor aantrekkelijke advertenties" },
          { title: "Voor online platforms", subtitle: "Funda, Pararius, sociale media" },
        ],
        important: [
          { title: "Verhoogt aantrekkelijkheid advertentie", icon: true },
          { title: "Meer reacties van huurders", icon: true },
          { title: "Professionele uitstraling", icon: true },
        ],
      },
      whatCosts: {
        title: "Wat kost het?",
        content: "Kies uit drie professionele fotografie pakketten:",
        packages: [
          {
            name: "Visuals Basis",
            price: "€249",
            features: [
              "Professionele woningfotografie",
              "Inmeten op locatie",
              "NEN 2580 meting",
              "2D & 3D plattegrond",
            ],
          },
          {
            name: "Visuals Totaal",
            price: "€325",
            highlighted: true,
            features: [
              "Professionele woningfotografie",
              "Inmeten op locatie",
              "NEN 2580 meting",
              "2D & 3D plattegrond",
              "360° woningfotografie",
              "Standaard woningvideo",
            ],
          },
          {
            name: "Visuals Exclusief",
            price: "€399",
            features: [
              "Professionele woningfotografie",
              "Inmeten op locatie",
              "NEN 2580 meting",
              "2D & 3D plattegrond",
              "360° woningfotografie",
              "Standaard woningvideo",
              "Online woningbrochure",
            ],
          },
        ],
      },
    },
  ];

  const koopServices = [
    {
      id: "energielabel" as const,
      icon: <FileText className="w-12 h-12 text-primary" />,
      title: "Energielabel",
      description: "Officieel energielabel voor uw woning",
    },
    {
      id: "fotografie" as const,
      icon: <Camera className="w-12 h-12 text-primary" />,
      title: "Fotografie",
      description: "Professionele woningfotografie",
    },
    {
      id: "label-fotografie" as const,
      icon: <FileText className="w-12 h-12 text-primary" />,
      title: "Energielabel & Woningpresentatie",
      description: "Compleet pakket met voordeel",
    },
  ];

  // Show content cards based on selected service for koopwoningen
  const showEnergieLabelContent = selectedService === "energielabel" || selectedService === "label-fotografie";
  const showFotografieContent = selectedService === "fotografie" || selectedService === "label-fotografie";

  // Helper: Calculate total price
  const calculateTotalPrice = (): number => {
    if (!selectedService) return 0;

    let total = 0;

    // Energy label price (if applicable)
    if ((selectedService === "energielabel" || selectedService === "label-fotografie") && propertySize) {
      total += calculatorPricing.energielabel[propertySize];
    }

    // Photography price (if applicable)
    if ((selectedService === "fotografie" || selectedService === "label-fotografie") && fotografiePakket) {
      total += calculatorPricing.fotografie[fotografiePakket];
    }

    // Extra diensten (upsells)
    if (nenMeting) total += 150; // NEN 2580 meting prijs
    if (puntentelling) total += calculatorPricing.addons.puntentelling;
    if (adviesrapport) total += calculatorPricing.addons.adviesrapport;
    if (spoedService) total += calculatorPricing.addons.spoedService;

    return total;
  };

  // Helper: Can show pricing steps
  const canShowPricingSteps = () => {
    return selectedService !== null;
  };

  // Helper: Can submit form
  const canSubmitForm = () => {
    // Must have service
    if (!selectedService) return false;

    // If service includes energielabel, must have property size
    if (selectedService === "energielabel" || selectedService === "label-fotografie") {
      if (!propertySize) return false;
    }

    // If service includes fotografie, must have fotografie pakket
    if (selectedService === "fotografie" || selectedService === "label-fotografie") {
      if (!fotografiePakket) return false;
    }

    return true;
  };

  // Map oppervlakte (m²) to PropertySize category
  const mapOppervlakteToSize = (oppervlakte: number): PropertySize => {
    if (oppervlakte < 50) return "tot-50";
    if (oppervlakte < 100) return "50-100";
    if (oppervlakte < 150) return "100-150";
    return "150-plus";
  };

  // Handle address lookup via BAG API
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
    setFoundOppervlakte(null);

    try {
      const params = new URLSearchParams({
        postcode: addressPostcode,
        huisnummer: addressHuisnummer,
      });
      if (addressToevoeging) params.append("toevoeging", addressToevoeging);

      const response = await fetch(`/api/bag/oppervlakte?${params}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        toast({
          title: "Adres niet gevonden",
          description: data.error || "Controleer de ingevoerde gegevens.",
          variant: "destructive",
        });
        setIsLookingUpAddress(false);
        return;
      }

      const oppervlakte = data.oppervlakte;
      const adres = data.adres;

      // Build address string
      const addressString = `${adres.straatnaam} ${adres.huisnummer}, ${adres.postcode} ${adres.woonplaats}`;

      setFoundOppervlakte(oppervlakte);
      setFoundAddress(addressString);

      // Automatically select the correct size category
      const sizeCategory = mapOppervlakteToSize(oppervlakte);
      setPropertySize(sizeCategory);

      toast({
        title: "Oppervlakte gevonden!",
        description: `${addressString} - ${oppervlakte}m²`,
      });

      // Close the collapsible after a short delay
      setTimeout(() => {
        setShowAddressLookup(false);
        setIsLookingUpAddress(false);
      }, 1500);
    } catch (error) {
      console.error("Error looking up address:", error);
      toast({
        title: "Er ging iets mis",
        description: "Probeer het later opnieuw.",
        variant: "destructive",
      });
      setIsLookingUpAddress(false);
    }
  };

  // Handle form submission
  const handleSubmit = form.handleSubmit((data) => {
    quoteMutation.mutate({
      ...data,
      calculatorState: {
        propertyType: "koop" as PropertyType, // Default waarde, niet meer relevant
        selectedService: selectedService!,
        propertySize,
        fotografiePakket,
        puntentelling,
        adviesrapport,
        spoedService,
      },
      totalPrice: calculateTotalPrice(),
    });
  });

  return (
    <section id="homepage-selector" className="pt-12 md:pt-16 pb-32 md:pb-40 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Intro text */}
        <ScrollReveal>
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-lg text-muted-foreground">
              Energielabel of hulp bij woningpresentatie nodig? Doorloop de stappen en kies direct de juiste dienst
            </p>
          </div>
        </ScrollReveal>

        {/* Step 1: Service Selection */}
        <ScrollReveal>
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-center mb-6">Stap 1: Kies uw dienst</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {koopServices.map((service) => (
                    <Card
                      key={service.id}
                      data-testid={`card-homepage-service-${service.id}`}
                      className={`cursor-pointer transition-all duration-300 hover-elevate ${
                        selectedService === service.id
                          ? "border-primary border-2 bg-primary/5"
                          : "border-2"
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <CardContent className="p-8 text-center">
                        <div className="flex justify-center mb-4">{service.icon}</div>
                        <h4 className="text-lg font-semibold mb-2">{service.title}</h4>
                        <p className="text-muted-foreground text-sm mb-4">
                          {service.description}
                        </p>
                        {selectedService === service.id && (
                          <div className="flex justify-center">
                            <Check className="w-6 h-6" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </ScrollReveal>

        {/* STAP 2: Oppervlakte - for energielabel services */}
        {canShowPricingSteps() && (selectedService === "energielabel" || selectedService === "label-fotografie") && (
          <ScrollReveal>
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-center mb-6">Stap 2: Oppervlakte</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  { value: "tot-50" as PropertySize, label: "Tot 50m²", price: calculatorPricing.energielabel["tot-50"] },
                  { value: "50-100" as PropertySize, label: "50-100 m²", price: calculatorPricing.energielabel["50-100"] },
                  { value: "100-150" as PropertySize, label: "100-150m²", price: calculatorPricing.energielabel["100-150"] },
                  { value: "150-plus" as PropertySize, label: "150m2 +", price: calculatorPricing.energielabel["150-plus"] },
                ].map((option) => (
                  <button
                    key={option.value}
                    data-testid={`button-size-${option.value}`}
                    onClick={() => setPropertySize(option.value)}
                    className={`p-4 border-2 rounded-lg font-medium transition-all duration-300 hover-elevate active-elevate-2 ${
                      propertySize === option.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="text-sm md:text-base font-semibold">{option.label}</div>
                    <div className="text-xs md:text-sm mt-1 opacity-80">€{option.price}</div>
                  </button>
                ))}
              </div>

              {/* Address Confirmation (shown when address found) */}
              {foundAddress && foundOppervlakte && (
                <div className="mt-6 p-4 bg-primary/10 border-2 border-primary rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary">
                        ✓ {foundAddress}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Oppervlakte: {foundOppervlakte}m² (categorie: {propertySize?.replace("tot-", "tot ")})
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowAddressLookup(true);
                        setFoundAddress(null);
                        setFoundOppervlakte(null);
                      }}
                      className="text-primary hover:text-primary/80"
                    >
                      Wijzigen
                    </Button>
                  </div>
                </div>
              )}

              {/* Address Lookup Section */}
              <div className="mt-6">
                <Collapsible open={showAddressLookup} onOpenChange={setShowAddressLookup}>
                  <div className="flex justify-center">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Oppervlakte niet zeker?
                        {showAddressLookup ? (
                          <ChevronUp className="w-4 h-4 ml-2" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-2" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="mt-4">
                    <Card className="border-2 border-primary/20">
                      <CardContent className="p-6 space-y-4">
                        <p className="text-sm text-muted-foreground text-center">
                          Voer uw adres in om de oppervlakte op te zoeken via de BAG
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="postcode" className="text-sm font-medium">
                              Postcode
                            </label>
                            <Input
                              id="postcode"
                              placeholder="1234AB"
                              value={addressPostcode}
                              onChange={(e) => setAddressPostcode(e.target.value.toUpperCase())}
                              maxLength={7}
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="huisnummer" className="text-sm font-medium">
                              Huisnummer
                            </label>
                            <Input
                              id="huisnummer"
                              placeholder="42"
                              value={addressHuisnummer}
                              onChange={(e) => setAddressHuisnummer(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="toevoeging" className="text-sm font-medium">
                              Toevoeging
                            </label>
                            <Input
                              id="toevoeging"
                              placeholder="A / 2"
                              value={addressToevoeging}
                              onChange={(e) => setAddressToevoeging(e.target.value)}
                            />
                          </div>
                        </div>

                        {foundOppervlakte && (
                          <div className="p-4 bg-primary/10 border-2 border-primary rounded-lg">
                            <p className="text-sm font-medium text-primary text-center">
                              ✓ Gevonden oppervlakte: {foundOppervlakte}m²
                            </p>
                          </div>
                        )}

                        <Button
                          onClick={handleAddressLookup}
                          disabled={isLookingUpAddress || !addressPostcode || !addressHuisnummer}
                          className="w-full"
                        >
                          {isLookingUpAddress ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Zoeken...
                            </>
                          ) : (
                            <>
                              <MapPin className="w-4 h-4 mr-2" />
                              Zoek oppervlakte
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* STAP 2/3: Fotografie Pakket - for fotografie services */}
        {canShowPricingSteps() && (selectedService === "fotografie" || selectedService === "label-fotografie") && (
          <ScrollReveal>
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-center mb-6">
                {selectedService === "label-fotografie" ? "Stap 3: " : "Stap 2: "}Fotografie Pakket
              </h3>
              <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
                {[
                  { value: "basis" as FotografiePakket, label: "Visuals Basis", description: "Funda-ready foto's", price: calculatorPricing.fotografie.basis },
                  { value: "totaal" as FotografiePakket, label: "Visuals Totaal", description: "Foto's + 360° foto's + video", price: calculatorPricing.fotografie.totaal },
                  { value: "exclusief" as FotografiePakket, label: "Visuals Exclusief", description: "Foto's + 360° foto's + video + online woningbrochure", price: calculatorPricing.fotografie.exclusief },
                ].map((option) => (
                  <button
                    key={option.value}
                    data-testid={`button-fotografie-${option.value}`}
                    onClick={() => setFotografiePakket(option.value)}
                    className={`p-4 border-2 rounded-lg font-medium transition-all duration-300 hover-elevate active-elevate-2 text-left ${
                      fotografiePakket === option.value
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="text-base font-semibold mb-1">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                      <span className="text-sm text-muted-foreground ml-4">€{option.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Extra diensten (upsells) - altijd beschikbaar */}
        {canShowPricingSteps() && (
          <ScrollReveal>
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-center mb-6">Extra diensten (optioneel)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                <button
                  data-testid="button-addon-nen-meting"
                  onClick={() => setNenMeting(!nenMeting)}
                  className={`p-5 border-2 rounded-xl font-medium transition-all duration-300 hover-elevate active-elevate-2 text-left ${
                    nenMeting ? "border-primary bg-accent" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold">NEN 2580 Meting</span>
                    {nenMeting ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-border rounded" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">Officiële oppervlakte meting</div>
                  <div className="text-sm font-medium text-primary">+€150</div>
                </button>

                <button
                  data-testid="button-addon-puntentelling"
                  onClick={() => setPuntentelling(!puntentelling)}
                  className={`p-5 border-2 rounded-xl font-medium transition-all duration-300 hover-elevate active-elevate-2 text-left ${
                    puntentelling ? "border-primary bg-accent" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold">Puntentelling</span>
                    {puntentelling ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-border rounded" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">WWS puntentelling berekening</div>
                  <div className="text-sm font-medium text-primary">+€{calculatorPricing.addons.puntentelling}</div>
                </button>

                <button
                  data-testid="button-addon-adviesrapport"
                  onClick={() => setAdviesrapport(!adviesrapport)}
                  className={`p-5 border-2 rounded-xl font-medium transition-all duration-300 hover-elevate active-elevate-2 text-left ${
                    adviesrapport ? "border-primary bg-accent" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold">Adviesrapport</span>
                    {adviesrapport ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-border rounded" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">Verbeteringsadvies energielabel</div>
                  <div className="text-sm font-medium text-primary">+€{calculatorPricing.addons.adviesrapport}</div>
                </button>

                <button
                  data-testid="button-addon-spoed"
                  onClick={() => setSpoedService(!spoedService)}
                  className={`p-5 border-2 rounded-xl font-medium transition-all duration-300 hover-elevate active-elevate-2 text-left ${
                    spoedService ? "border-primary bg-accent" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold">Spoed service</span>
                    {spoedService ? (
                      <Zap className="w-5 h-5 text-primary" />
                    ) : (
                      <Zap className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">Binnen 24 uur geleverd</div>
                  <div className="text-sm font-medium text-primary">+€{calculatorPricing.addons.spoedService}</div>
                </button>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Price Display */}
        {canSubmitForm() && calculateTotalPrice() > 0 && (
          <ScrollReveal>
            <div className="mb-8 text-center">
              <div className="inline-block bg-primary/10 border-2 border-primary rounded-xl px-8 py-4">
                <div className="text-sm text-muted-foreground mb-1">Totaalprijs (excl. BTW)</div>
                <div className="text-3xl font-bold text-primary">€{calculateTotalPrice()}</div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Contact Form for Quote Request */}
        {canSubmitForm() && (
          <ScrollReveal>
            <div className="mb-12">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-2 text-center">Afspraak maken</h3>
                  <p className="text-center text-muted-foreground mb-6">
                    Laat uw gegevens achter, dan nemen wij direct contact met u op
                  </p>
                  <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Naam: *</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-name" placeholder="Uw naam" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Naam bedrijf (optioneel):</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-company" placeholder="Bedrijfsnaam" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefoon: *</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-phone" type="tel" placeholder="06-12345678" />
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
                              <FormLabel>E-mailadres: *</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-email" type="email" placeholder="naam@email.nl" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="propertyPostcode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postcode (de woning): *</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-postcode" placeholder="1234 AB" />
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
                              <FormLabel>Adres (de woning): *</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-address" placeholder="Straatnaam 123" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        data-testid="button-submit-quote"
                        type="submit"
                        size="lg"
                        className="w-full bg-primary text-primary-foreground hover-elevate active-elevate-2"
                        disabled={quoteMutation.isPending}
                      >
                        {quoteMutation.isPending ? (
                          "Verzenden..."
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Afspraak maken
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
