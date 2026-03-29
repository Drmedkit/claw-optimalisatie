import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Home as HomeIcon, Camera, Zap, Check, Send, FileText, Image, BarChart3, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  type CalculatorState,
  type PropertyType,
  type PropertySize,
  type ServiceType,
  type FotografiePakket,
  type QuoteRequest,
  calculatorPricing,
  quoteRequestSchema,
} from "@shared/schema";

interface PriceBreakdown {
  energielabel?: number;
  fotografie?: number;
  puntentelling?: number;
  adviesrapport?: number;
  spoedService?: number;
  subtotal: number;
  btw: number;
  total: number;
}

interface ServiceInfo {
  icon: JSX.Element;
  title: string;
  description: string;
  whatIsIt: string;
  whenNeeded: string;
  cost: string;
}

export function HomeCalculator() {
  const [state, setState] = useState<Partial<CalculatorState>>({
    propertyType: undefined,
    selectedService: undefined,
    propertySize: null,
    fotografiePakket: null,
    puntentelling: false,
    adviesrapport: false,
    spoedService: false,
  });

  const [showBreakdown, setShowBreakdown] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedService, setExpandedService] = useState<"energielabel" | "fotografie" | "label-fotografie" | "puntentelling" | "adviesrapport" | null>(null);
  const { toast } = useToast();

  const form = useForm<QuoteRequest>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      propertyAddress: "",
      calculatorState: state as CalculatorState,
      totalPrice: 0,
    },
  });

  // Service information for rental properties
  const rentalServiceInfo: Record<"energielabel" | "fotografie" | "label-fotografie", ServiceInfo> = {
    energielabel: {
      icon: <FileText className="w-6 h-6" />,
      title: "Energielabel",
      description: "Een officieel energielabel is verplicht bij verkoop of verhuur van uw woning. Ons gecertificeerde team zorgt voor een nauwkeurige beoordeling volgens de BRL9500 normen.",
      whatIsIt: "Een energielabel geeft aan hoe energiezuinig uw woning is. Het label loopt van A++++ (zeer zuinig) tot G (niet zuinig). Voor het label wordt uw woning grondig geïnspecteerd: isolatie, verwarming, ventilatie en warm water worden beoordeeld.",
      whenNeeded: "Een energielabel is verplicht bij verkoop of verhuur van een woning. Het label is 10 jaar geldig. Ook bij grote verbouwingen of als u wilt weten hoe energiezuinig uw woning is, kunt u een energielabel aanvragen.",
      cost: "€199 - €319 afhankelijk van de oppervlakte. Inclusief NEN 2580 opmeting en plattegrond.",
    },
    "label-fotografie": {
      icon: (
        <div className="flex gap-1">
          <FileText className="w-5 h-5" />
          <Camera className="w-5 h-5" />
        </div>
      ),
      title: "Label & Fotografie",
      description: "Combineer het energielabel met professionele fotografie voor een complete presentatie van uw woning.",
      whatIsIt: "Een compleet pakket met zowel het officiële energielabel als professionele fotografie van uw woning. Perfect voor verhuurders die hun woning optimaal willen presenteren.",
      whenNeeded: "Ideaal wanneer u uw woning gaat verhuren en direct een professionele presentatie wilt. Bespaart tijd doordat alles in één keer geregeld wordt.",
      cost: "Vanaf €348 afhankelijk van oppervlakte en fotografie pakket. Voordelige combinatie van beide diensten.",
    },
    fotografie: {
      icon: <Camera className="w-6 h-6" />,
      title: "Fotografie",
      description: "Professionele vastgoedfotografie om uw woning in het beste licht te zetten.",
      whatIsIt: "Professionele foto's van uw woning gemaakt door ervaren vastgoedfotografen. Verschillende pakketten beschikbaar van basic tot premium met extra opties zoals drone-opnames.",
      whenNeeded: "Voor online advertenties op Funda, Pararius of andere platforms. Goede foto's trekken meer bezichtigingen en verhogen de kans op snelle verhuur of verkoop.",
      cost: "€149 - €399 afhankelijk van het gekozen pakket (Basic, Standaard of Premium).",
    },
  };

  const rentalAddonsInfo = {
    puntentelling: {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Puntentelling",
      description: "Voor elke huurwoning is na een energielabel ook een puntentelling vereist. Wij berekenen het exacte aantal punten van uw woning volgens het Woningwaarderingsstelsel (WWS).",
      whatIsIt: "Het WWS-puntensysteem bepaalt de maximale huurprijs voor sociale huurwoningen. Elke woning krijgt punten voor oppervlakte, energielabel, voorzieningen en onderhoudsstaat. Het totaal aantal punten bepaalt of de woning in de sociale of vrije sector valt.",
      whenNeeded: "Verplicht voor verhuur van sociale huurwoningen (tot 879 punten). Ook nuttig voor vrije sector verhuur om een reële huurprijs te bepalen. Bij geschillen tussen huurder en verhuurder over de huurprijs is een officiële puntentelling vereist.",
      cost: "€120 - Officiële WWS puntentelling volgens de wettelijke normen.",
    },
    adviesrapport: {
      icon: <ClipboardList className="w-5 h-5" />,
      title: "Adviesrapport",
      description: "Ontdek hoe u uw energielabel of puntentelling kunt verbeteren. Ons adviesrapport toont alle opties, zodat u doelgericht en kostenefficiënt de meest effectieve verbeteringen kunt doorvoeren.",
      whatIsIt: "Een persoonlijk rapport met concrete verbetermaatregelen voor uw woning. We analyseren welke aanpassingen (isolatie, verwarming, ventilatie) de grootste impact hebben op uw energielabel of WWS-punten, inclusief kostenschatting en te verwachten besparing.",
      whenNeeded: "Handig als u uw label wilt verbeteren van bijvoorbeeld D naar B, of als u meer punten wilt halen voor een hogere maximale huurprijs. Ook nuttig vóór een verbouwing om te zien welke maatregelen het meest effectief zijn.",
      cost: "€100 - Compleet adviesrapport met concrete verbetermaatregelen en kostenschatting.",
    },
  };

  // Smart breakdown management: reset or recalculate based on state changes
  useEffect(() => {
    if (!showBreakdown) {
      return;
    }

    if (!canCalculatePrice()) {
      setShowBreakdown(false);
      setPriceBreakdown(null);
      return;
    }

    calculatePrice();
  }, [showBreakdown, state.propertyType, state.selectedService, state.propertySize, state.fotografiePakket, state.puntentelling, state.adviesrapport, state.spoedService]);

  const calculatePrice = () => {
    if (!state.propertyType || !state.selectedService) {
      return;
    }

    let energielabelPrice = 0;
    let fotografiePrice = 0;
    let puntentellingPrice = 0;
    let adviesrapportPrice = 0;
    let spoedServicePrice = 0;

    if ((state.selectedService === "energielabel" || state.selectedService === "label-fotografie") && state.propertySize) {
      energielabelPrice = calculatorPricing.energielabel[state.propertySize];
    }

    if ((state.selectedService === "fotografie" || state.selectedService === "label-fotografie") && state.fotografiePakket) {
      fotografiePrice = calculatorPricing.fotografie[state.fotografiePakket];
    }

    if (state.propertyType === "huur" && (state.selectedService === "energielabel" || state.selectedService === "label-fotografie")) {
      if (state.puntentelling) {
        puntentellingPrice = calculatorPricing.addons.puntentelling;
      }
      if (state.adviesrapport) {
        adviesrapportPrice = calculatorPricing.addons.adviesrapport;
      }
    }

    if (state.spoedService) {
      spoedServicePrice = calculatorPricing.addons.spoedService;
    }

    const subtotal = energielabelPrice + fotografiePrice + puntentellingPrice + adviesrapportPrice + spoedServicePrice;
    const btw = Math.round(subtotal * calculatorPricing.btw);
    const total = subtotal + btw;

    const breakdown: PriceBreakdown = {
      subtotal,
      btw,
      total,
    };

    if (energielabelPrice > 0) breakdown.energielabel = energielabelPrice;
    if (fotografiePrice > 0) breakdown.fotografie = fotografiePrice;
    if (puntentellingPrice > 0) breakdown.puntentelling = puntentellingPrice;
    if (adviesrapportPrice > 0) breakdown.adviesrapport = adviesrapportPrice;
    if (spoedServicePrice > 0) breakdown.spoedService = spoedServicePrice;

    setPriceBreakdown(breakdown);
    setShowBreakdown(true);
  };

  const resetCalculator = () => {
    setState({
      propertyType: undefined,
      selectedService: undefined,
      propertySize: null,
      fotografiePakket: null,
      puntentelling: false,
      adviesrapport: false,
      spoedService: false,
    });
    setShowBreakdown(false);
    setPriceBreakdown(null);
    setIsDialogOpen(false);
    setIsSubmitted(false);
    setExpandedService(null);
    form.reset();
  };

  const handleOrderClick = () => {
    if (priceBreakdown && state.propertyType && state.selectedService) {
      form.setValue("calculatorState", state as CalculatorState);
      form.setValue("totalPrice", priceBreakdown.total);
      setIsDialogOpen(true);
      setIsSubmitted(false);
    }
  };

  const onSubmitQuote = async (data: QuoteRequest) => {
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || result.error || "Failed to submit quote request");
      }

      setIsSubmitted(true);
      form.reset();
      
      toast({
        title: "Offerte aangevraagd!",
        description: "Wij nemen zo snel mogelijk contact met u op.",
      });
      
      setTimeout(() => {
        setIsDialogOpen(false);
        setTimeout(() => {
          setIsSubmitted(false);
          resetCalculator();
        }, 300);
      }, 2000);
    } catch (error) {
      console.error("Error submitting quote request:", error);
      toast({
        variant: "destructive",
        title: "Fout bij verzenden",
        description: error instanceof Error ? error.message : "Er is een fout opgetreden. Probeer het later opnieuw.",
      });
    }
  };

  const canCalculatePrice = () => {
    if (!state.propertyType || !state.selectedService) return false;
    
    if (state.selectedService === "energielabel") {
      return state.propertySize !== null;
    } else if (state.selectedService === "fotografie") {
      return state.fotografiePakket !== null;
    } else if (state.selectedService === "label-fotografie") {
      return state.propertySize !== null && state.fotografiePakket !== null;
    }
    
    return false;
  };

  return (
    <section id="calculator" className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Bereken direct uw prijs
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Kies uw woningtype en diensten om een op maat gemaakt prijsvoorstel te ontvangen
          </p>
        </div>

        <Card
          data-testid="card-home-calculator"
          className="border-2 border-primary/20 shadow-xl"
        >
          <CardContent className="p-6 md:p-8 space-y-8">
            {/* Step 1: Property Type */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-semibold">
                Stap 1: Woningtype
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  data-testid="button-home-property-koop"
                  onClick={() => setState({ ...state, propertyType: "koop", selectedService: undefined })}
                  className={`p-6 border-2 rounded-xl font-medium transition-all duration-300 hover-elevate active-elevate-2 min-h-[120px] flex flex-col items-center justify-center ${
                    state.propertyType === "koop"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <HomeIcon className="w-8 h-8 mb-2" />
                  <div className="text-lg font-semibold">Koopwoning</div>
                  <div className="text-sm opacity-80 mt-1">
                    Energielabel & NEN meting
                  </div>
                </button>

                <button
                  data-testid="button-home-property-huur"
                  onClick={() => setState({ ...state, propertyType: "huur", selectedService: undefined })}
                  className={`p-6 border-2 rounded-xl font-medium transition-all duration-300 hover-elevate active-elevate-2 min-h-[120px] flex flex-col items-center justify-center ${
                    state.propertyType === "huur"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <HomeIcon className="w-8 h-8 mb-2" />
                  <div className="text-lg font-semibold">Huurwoning</div>
                  <div className="text-sm opacity-80 mt-1">
                    Energielabel, puntentelling & advies
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Service Selection with Expandable Info */}
            {state.propertyType && (
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold">
                  Stap 2: Dienst
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(["energielabel", "fotografie", "label-fotografie"] as const).map((service) => {
                    const info = rentalServiceInfo[service];
                    const isSelected = state.selectedService === service;
                    const isExpanded = expandedService === service;

                    return (
                      <div key={service} className="space-y-2">
                        <button
                          data-testid={`button-home-service-${service}`}
                          onClick={() => {
                            if (service === "energielabel") {
                              setState({ ...state, selectedService: service, fotografiePakket: null });
                            } else if (service === "fotografie") {
                              setState({ ...state, selectedService: service, propertySize: null });
                            } else {
                              setState({ ...state, selectedService: service });
                            }
                          }}
                          className={`w-full p-6 border-2 rounded-xl font-medium transition-all duration-300 hover-elevate active-elevate-2 min-h-[140px] flex flex-col items-center justify-center ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="mb-2">{info.icon}</div>
                          <div className="text-base font-semibold text-center">
                            {info.title}
                          </div>
                          {isSelected && (
                            <Check className="w-5 h-5 mt-2" />
                          )}
                        </button>

                        {/* Lees meer button - only for rental properties */}
                        {state.propertyType === "huur" && (
                          <Collapsible open={isExpanded} onOpenChange={(open) => setExpandedService(open ? service : null)}>
                            <CollapsibleTrigger asChild>
                              <Button
                                data-testid={`button-read-more-${service}`}
                                variant="ghost"
                                size="sm"
                                className="w-full hover-elevate active-elevate-2"
                              >
                                {isExpanded ? (
                                  <>
                                    Minder <ChevronUp className="w-4 h-4 ml-1" />
                                  </>
                                ) : (
                                  <>
                                    Lees meer <ChevronDown className="w-4 h-4 ml-1" />
                                  </>
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2">
                              <Card className="border-primary/20">
                                <CardContent className="p-4 space-y-3 text-sm">
                                  <div>
                                    <h4 className="font-semibold text-primary mb-1">
                                      Wat is het?
                                    </h4>
                                    <p className="text-muted-foreground">
                                      {info.whatIsIt}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-primary mb-1">
                                      Wanneer heb je het nodig?
                                    </h4>
                                    <p className="text-muted-foreground">
                                      {info.whenNeeded}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-primary mb-1">
                                      Wat kost het?
                                    </h4>
                                    <p className="text-muted-foreground">
                                      {info.cost}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Property Size (for energielabel services) */}
            {(state.selectedService === "energielabel" || state.selectedService === "label-fotografie") && (
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold">
                  Stap 3: Oppervlakte
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {[
                    { value: "tot-50" as PropertySize, label: "Tot 50m²", price: calculatorPricing.energielabel["tot-50"] },
                    { value: "50-100" as PropertySize, label: "50-100 m²", price: calculatorPricing.energielabel["50-100"] },
                    { value: "100-150" as PropertySize, label: "100-150m²", price: calculatorPricing.energielabel["100-150"] },
                    { value: "150-plus" as PropertySize, label: "150m2 +", price: calculatorPricing.energielabel["150-plus"] },
                  ].map((option) => (
                    <button
                      key={option.value}
                      data-testid={`button-home-size-${option.value}`}
                      onClick={() => setState({ ...state, propertySize: option.value })}
                      className={`p-4 border-2 rounded-lg font-medium transition-all duration-300 hover-elevate active-elevate-2 ${
                        state.propertySize === option.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-sm md:text-base font-semibold">
                        {option.label}
                      </div>
                      <div className="text-xs md:text-sm mt-1 opacity-80">
                        €{option.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Photography Package (for fotografie services) */}
            {(state.selectedService === "fotografie" || state.selectedService === "label-fotografie") && (
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold">
                  {state.selectedService === "label-fotografie" ? "Stap 4: " : "Stap 3: "}Fotografie pakket
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { value: "basic" as FotografiePakket, label: "Basic", price: calculatorPricing.fotografie.basic, description: "10-15 professionele foto's" },
                    { value: "standaard" as FotografiePakket, label: "Standaard", price: calculatorPricing.fotografie.standaard, description: "20-25 foto's + plattegrond" },
                    { value: "premium" as FotografiePakket, label: "Premium", price: calculatorPricing.fotografie.premium, description: "30+ foto's + drone + 360° tour" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      data-testid={`button-home-fotografie-${option.value}`}
                      onClick={() => setState({ ...state, fotografiePakket: option.value })}
                      className={`p-4 border-2 rounded-lg font-medium transition-all duration-300 hover-elevate active-elevate-2 text-left flex justify-between items-center ${
                        state.fotografiePakket === option.value
                          ? "border-primary bg-accent"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div>
                        <div className="text-base font-semibold">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                      <span className="text-lg font-bold text-primary">€{option.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Options (huurwoning only) with expandable info */}
            {state.propertyType === "huur" && (state.selectedService === "energielabel" || state.selectedService === "label-fotografie") && state.propertySize && (
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold">
                  {state.selectedService === "label-fotografie" && state.fotografiePakket ? "Stap 5: " : "Stap 4: "}Extra diensten (optioneel)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Puntentelling */}
                  <div className="space-y-2">
                    <button
                      data-testid="button-home-addon-puntentelling"
                      onClick={() => setState({ ...state, puntentelling: !state.puntentelling })}
                      className={`w-full p-5 border-2 rounded-xl font-medium transition-all duration-300 hover-elevate active-elevate-2 text-left ${
                        state.puntentelling
                          ? "border-primary bg-accent"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-semibold">
                          Puntentelling
                        </span>
                        {state.puntentelling ? (
                          <Check className="w-5 h-5 text-primary" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-border rounded" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        WWS puntentelling berekening
                      </div>
                      <div className="text-sm font-medium text-primary">
                        +€{calculatorPricing.addons.puntentelling}
                      </div>
                    </button>

                    <Collapsible open={expandedService === "puntentelling"} onOpenChange={(open) => setExpandedService(open ? "puntentelling" as ServiceType : null)}>
                      <CollapsibleTrigger asChild>
                        <Button
                          data-testid="button-read-more-puntentelling"
                          variant="ghost"
                          size="sm"
                          className="w-full hover-elevate active-elevate-2"
                        >
                          {expandedService === "puntentelling" ? (
                            <>
                              Minder <ChevronUp className="w-4 h-4 ml-1" />
                            </>
                          ) : (
                            <>
                              Lees meer <ChevronDown className="w-4 h-4 ml-1" />
                            </>
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <Card className="border-primary/20">
                          <CardContent className="p-4 space-y-3 text-sm">
                            <div>
                              <h4 className="font-semibold text-primary mb-1">
                                Wat is het?
                              </h4>
                              <p className="text-muted-foreground">
                                {rentalAddonsInfo.puntentelling.whatIsIt}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-primary mb-1">
                                Wanneer heb je het nodig?
                              </h4>
                              <p className="text-muted-foreground">
                                {rentalAddonsInfo.puntentelling.whenNeeded}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-primary mb-1">
                                Wat kost het?
                              </h4>
                              <p className="text-muted-foreground">
                                {rentalAddonsInfo.puntentelling.cost}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  {/* Adviesrapport */}
                  <div className="space-y-2">
                    <button
                      data-testid="button-home-addon-adviesrapport"
                      onClick={() => setState({ ...state, adviesrapport: !state.adviesrapport })}
                      className={`w-full p-5 border-2 rounded-xl font-medium transition-all duration-300 hover-elevate active-elevate-2 text-left ${
                        state.adviesrapport
                          ? "border-primary bg-accent"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-semibold">
                          Adviesrapport
                        </span>
                        {state.adviesrapport ? (
                          <Check className="w-5 h-5 text-primary" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-border rounded" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Verduurzaming advies
                      </div>
                      <div className="text-sm font-medium text-primary">
                        +€{calculatorPricing.addons.adviesrapport}
                      </div>
                    </button>

                    <Collapsible open={expandedService === "adviesrapport"} onOpenChange={(open) => setExpandedService(open ? "adviesrapport" as ServiceType : null)}>
                      <CollapsibleTrigger asChild>
                        <Button
                          data-testid="button-read-more-adviesrapport"
                          variant="ghost"
                          size="sm"
                          className="w-full hover-elevate active-elevate-2"
                        >
                          {expandedService === "adviesrapport" ? (
                            <>
                              Minder <ChevronUp className="w-4 h-4 ml-1" />
                            </>
                          ) : (
                            <>
                              Lees meer <ChevronDown className="w-4 h-4 ml-1" />
                            </>
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <Card className="border-primary/20">
                          <CardContent className="p-4 space-y-3 text-sm">
                            <div>
                              <h4 className="font-semibold text-primary mb-1">
                                Wat is het?
                              </h4>
                              <p className="text-muted-foreground">
                                {rentalAddonsInfo.adviesrapport.whatIsIt}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-primary mb-1">
                                Wanneer heb je het nodig?
                              </h4>
                              <p className="text-muted-foreground">
                                {rentalAddonsInfo.adviesrapport.whenNeeded}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-primary mb-1">
                                Wat kost het?
                              </h4>
                              <p className="text-muted-foreground">
                                {rentalAddonsInfo.adviesrapport.cost}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
              </div>
            )}

            {/* Universal Extra: Spoed Service */}
            {canCalculatePrice() && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    data-testid="button-home-addon-spoed"
                    onClick={() => setState({ ...state, spoedService: !state.spoedService })}
                    className={`p-5 border-2 rounded-xl font-medium transition-all duration-300 hover-elevate active-elevate-2 text-left ${
                      state.spoedService
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-semibold">
                        Spoed service
                      </span>
                      {state.spoedService ? (
                        <Zap className="w-5 h-5 text-primary" />
                      ) : (
                        <Zap className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      binnen 24 uur geleverd
                    </div>
                    <div className="text-sm font-medium text-primary">
                      +€{calculatorPricing.addons.spoedService}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Calculate Price Button */}
            {canCalculatePrice() && !showBreakdown && (
              <div className="flex justify-center pt-4">
                <Button
                  data-testid="button-home-calculate-price"
                  onClick={calculatePrice}
                  size="lg"
                  className="bg-primary text-primary-foreground hover-elevate active-elevate-2 px-12 py-6 text-lg"
                >
                  Prijs berekenen
                </Button>
              </div>
            )}

            {/* Price Breakdown */}
            {showBreakdown && priceBreakdown && (
              <div className="mt-8 p-6 bg-accent/30 rounded-xl border-2 border-primary/20 space-y-4">
                <h3 className="text-xl font-semibold mb-4">Uw totale prijs:</h3>
                
                <div className="space-y-2 text-sm">
                  {priceBreakdown.energielabel && (
                    <div className="flex justify-between">
                      <span>Energielabel + NEN 2580 meting</span>
                      <span>€{priceBreakdown.energielabel}</span>
                    </div>
                  )}
                  {priceBreakdown.fotografie && (
                    <div className="flex justify-between">
                      <span>Fotografie ({state.fotografiePakket})</span>
                      <span>€{priceBreakdown.fotografie}</span>
                    </div>
                  )}
                  {priceBreakdown.puntentelling && (
                    <div className="flex justify-between">
                      <span>Puntentelling</span>
                      <span>€{priceBreakdown.puntentelling}</span>
                    </div>
                  )}
                  {priceBreakdown.adviesrapport && (
                    <div className="flex justify-between">
                      <span>Adviesrapport</span>
                      <span>€{priceBreakdown.adviesrapport}</span>
                    </div>
                  )}
                  {priceBreakdown.spoedService && (
                    <div className="flex justify-between">
                      <span>Spoed service</span>
                      <span>€{priceBreakdown.spoedService}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span>Subtotaal (excl. BTW)</span>
                      <span>€{priceBreakdown.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>BTW (21%)</span>
                      <span>€{priceBreakdown.btw}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Totaal (incl. BTW)</span>
                      <span
                        data-testid="text-home-total-price"
                        className="text-2xl md:text-3xl font-bold text-primary"
                      >
                        €{priceBreakdown.total}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 flex-wrap">
                  <Button
                    data-testid="button-home-order"
                    onClick={handleOrderClick}
                    className="flex-1 bg-primary text-primary-foreground hover-elevate active-elevate-2"
                    size="lg"
                  >
                    Nu bestellen
                  </Button>
                  <Button
                    data-testid="button-home-reset"
                    variant="outline"
                    onClick={resetCalculator}
                    className="hover-elevate active-elevate-2"
                    size="lg"
                  >
                    Opnieuw berekenen
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quote Request Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Offerte aanvragen</DialogTitle>
              <DialogDescription>
                Vul uw gegevens in om de offerte te ontvangen
              </DialogDescription>
            </DialogHeader>

            {isSubmitted ? (
              <div
                data-testid="alert-home-quote-success"
                className="p-6 bg-primary/10 border-2 border-primary rounded-lg text-center"
              >
                <Check className="w-12 h-12 text-primary mx-auto mb-3" />
                <p className="text-primary font-medium">
                  Bedankt! Uw offerte aanvraag is ontvangen. Wij nemen zo snel mogelijk contact met u op.
                </p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitQuote)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Naam *</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-home-quote-name"
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
                            data-testid="input-home-quote-email"
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
                        <FormLabel>Telefoon *</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-home-quote-phone"
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
                        <FormLabel>Woningadres *</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-home-quote-address"
                            placeholder="Straatnaam 123, Amsterdam"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Totaalprijs:</span>
                      <span className="text-2xl font-bold text-primary">
                        €{priceBreakdown?.total}
                      </span>
                    </div>
                    <Button
                      data-testid="button-home-submit-quote"
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover-elevate active-elevate-2"
                      disabled={form.formState.isSubmitting}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Verstuur aanvraag
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
