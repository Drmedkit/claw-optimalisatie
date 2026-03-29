import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { Home, Camera, Zap, Calculator as CalculatorIcon, Check, X, Send, FileText, Image, MapPin, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  nenMeting?: number;
  puntentelling?: number;
  adviesrapport?: number;
  spoedService?: number;
  subtotal: number;
  btw: number;
  total: number;
}

export function PricingCalculator() {
  const searchParams = new URLSearchParams(useSearch());
  const prefilledType = searchParams.get("type") as PropertyType | null;
  const prefilledService = searchParams.get("service") as ServiceType | null;

  const [state, setState] = useState<Partial<CalculatorState>>({
    propertyType: "koop" as PropertyType, // Default waarde, niet meer relevant in UI
    selectedService: prefilledService || undefined,
    propertySize: null,
    fotografiePakket: null,
    puntentelling: false,
    adviesrapport: false,
    spoedService: false,
  });

  const [nenMeting, setNenMeting] = useState(false);

  const [showBreakdown, setShowBreakdown] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      calculatorState: state as CalculatorState,
      totalPrice: 0,
    },
  });

  // Smart breakdown management: reset or recalculate based on state changes
  useEffect(() => {
    if (!showBreakdown) {
      // Breakdown not shown yet, nothing to do
      return;
    }

    if (!canCalculatePrice()) {
      // Required fields missing, hide breakdown
      setShowBreakdown(false);
      setPriceBreakdown(null);
      return;
    }

    // All required fields present, recalculate
    calculatePrice();
  }, [showBreakdown, state.selectedService, state.propertySize, state.fotografiePakket, nenMeting, state.puntentelling, state.adviesrapport, state.spoedService]);

  const calculatePrice = () => {
    if (!state.selectedService) {
      return;
    }

    let energielabelPrice = 0;
    let fotografiePrice = 0;
    let nenMetingPrice = 0;
    let puntentellingPrice = 0;
    let adviesrapportPrice = 0;
    let spoedServicePrice = 0;

    // Calculate energielabel price (if service includes it)
    if ((state.selectedService === "energielabel" || state.selectedService === "label-fotografie") && state.propertySize) {
      energielabelPrice = calculatorPricing.energielabel[state.propertySize];
    }

    // Calculate fotografie price (if service includes it)
    if ((state.selectedService === "fotografie" || state.selectedService === "label-fotografie") && state.fotografiePakket) {
      fotografiePrice = calculatorPricing.fotografie[state.fotografiePakket];
    }

    // Extra diensten (upsells) - beschikbaar voor iedereen
    if (nenMeting) {
      nenMetingPrice = 150; // NEN 2580 meting prijs
    }
    if (state.puntentelling) {
      puntentellingPrice = calculatorPricing.addons.puntentelling;
    }
    if (state.adviesrapport) {
      adviesrapportPrice = calculatorPricing.addons.adviesrapport;
    }

    // Spoed service
    if (state.spoedService) {
      spoedServicePrice = calculatorPricing.addons.spoedService;
    }

    const subtotal = energielabelPrice + fotografiePrice + nenMetingPrice + puntentellingPrice + adviesrapportPrice + spoedServicePrice;
    const btw = Math.round(subtotal * calculatorPricing.btw);
    const total = subtotal + btw;

    const breakdown: PriceBreakdown = {
      subtotal,
      btw,
      total,
    };

    if (energielabelPrice > 0) breakdown.energielabel = energielabelPrice;
    if (fotografiePrice > 0) breakdown.fotografie = fotografiePrice;
    if (nenMetingPrice > 0) breakdown.nenMeting = nenMetingPrice;
    if (puntentellingPrice > 0) breakdown.puntentelling = puntentellingPrice;
    if (adviesrapportPrice > 0) breakdown.adviesrapport = adviesrapportPrice;
    if (spoedServicePrice > 0) breakdown.spoedService = spoedServicePrice;

    setPriceBreakdown(breakdown);
    setShowBreakdown(true);
  };

  const resetCalculator = () => {
    setState({
      propertyType: "koop" as PropertyType,
      selectedService: undefined,
      propertySize: null,
      fotografiePakket: null,
      puntentelling: false,
      adviesrapport: false,
      spoedService: false,
    });
    setNenMeting(false);
    setShowBreakdown(false);
    setPriceBreakdown(null);
    setIsDialogOpen(false);
    setIsSubmitted(false);
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
        title: "Afspraak aangevraagd!",
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
    if (!state.selectedService) return false;

    // Check required fields based on service
    if (state.selectedService === "energielabel") {
      return state.propertySize !== null;
    } else if (state.selectedService === "fotografie") {
      return state.fotografiePakket !== null;
    } else if (state.selectedService === "label-fotografie") {
      return state.propertySize !== null && state.fotografiePakket !== null;
    }

    return false;
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
      setState({ ...state, propertySize: sizeCategory });

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

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Card
          data-testid="card-calculator"
          className="border-2 border-primary/20 shadow-2xl rounded-2xl bg-card"
        >
          <CardHeader className="bg-accent py-6 rounded-t-2xl text-center">
            <div className="flex items-center justify-center mb-3 gap-3">
              <CalculatorIcon className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl md:text-3xl">
                Jouw pakket prijs berekenen
              </CardTitle>
            </div>
            <p className="text-muted-foreground">
              Stel eenvoudig jouw pakket samen en bereken binnen één minuut jouw persoonlijke prijs.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 p-6 md:p-8">
            {/* Step 1: Service Selection */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-semibold">
                Stap 1: Kies uw dienst
              </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    data-testid="button-service-energielabel"
                    onClick={() =>
                      setState({ ...state, selectedService: "energielabel", fotografiePakket: null })
                    }
                    className={`p-6 border-2 rounded-xl font-medium transition-all duration-300 hover-elevate active-elevate-2 min-h-[100px] flex flex-col items-center justify-center ${
                      state.selectedService === "energielabel"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <FileText className="w-6 h-6 mb-2" />
                    <div className="text-base font-semibold">
                      Energielabel
                    </div>
                  </button>

                  <button
                    data-testid="button-service-fotografie"
                    onClick={() =>
                      setState({ ...state, selectedService: "fotografie", propertySize: null })
                    }
                    className={`p-6 border-2 rounded-xl font-medium transition-all duration-300 hover-elevate active-elevate-2 min-h-[100px] flex flex-col items-center justify-center ${
                      state.selectedService === "fotografie"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Camera className="w-6 h-6 mb-2" />
                    <div className="text-base font-semibold">
                      Fotografie
                    </div>
                  </button>

                  <button
                    data-testid="button-service-label-fotografie"
                    onClick={() =>
                      setState({ ...state, selectedService: "label-fotografie" })
                    }
                    className={`p-6 border-2 rounded-xl font-medium transition-all duration-300 hover-elevate active-elevate-2 min-h-[100px] flex flex-col items-center justify-center ${
                      state.selectedService === "label-fotografie"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex gap-2 mb-2">
                      <FileText className="w-5 h-5" />
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="text-base font-semibold">
                      Label & Fotografie
                    </div>
                  </button>
                </div>
              </div>

            {/* Step 2: Property Size (for energielabel services) */}
            {(state.selectedService === "energielabel" || state.selectedService === "label-fotografie") && (
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold">
                  Stap 2: Oppervlakte
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
                      data-testid={`button-size-${option.value}`}
                      onClick={() =>
                        setState({ ...state, propertySize: option.value })
                      }
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

                {/* Address Confirmation (shown when address found) */}
                {foundAddress && foundOppervlakte && (
                  <div className="mt-6 p-4 bg-primary/10 border-2 border-primary rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-primary">
                          ✓ {foundAddress}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Oppervlakte: {foundOppervlakte}m² (categorie: {state.propertySize?.replace("tot-", "tot ")})
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
                              <label htmlFor="postcode-calc" className="text-sm font-medium">
                                Postcode *
                              </label>
                              <Input
                                id="postcode-calc"
                                placeholder="1234AB"
                                value={addressPostcode}
                                onChange={(e) => setAddressPostcode(e.target.value.toUpperCase())}
                                maxLength={7}
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="huisnummer-calc" className="text-sm font-medium">
                                Huisnummer *
                              </label>
                              <Input
                                id="huisnummer-calc"
                                placeholder="42"
                                value={addressHuisnummer}
                                onChange={(e) => setAddressHuisnummer(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="toevoeging-calc" className="text-sm font-medium">
                                Toevoeging
                              </label>
                              <Input
                                id="toevoeging-calc"
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
            )}

            {/* Step 3: Photography Package (for fotografie services) */}
            {(state.selectedService === "fotografie" || state.selectedService === "label-fotografie") && (
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold">
                  {state.selectedService === "label-fotografie" ? "Stap 3: " : "Stap 2: "}Fotografie pakket
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-4">Kies uw fotografie pakket</p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { 
                        value: "basis" as FotografiePakket, 
                        label: "Visuals Basis", 
                        price: calculatorPricing.fotografie.basis,
                        subtitle: "Funda-ready foto's"
                      },
                      { 
                        value: "totaal" as FotografiePakket, 
                        label: "Visuals Totaal", 
                        price: calculatorPricing.fotografie.totaal,
                        subtitle: "Foto's + 360° foto's + video"
                      },
                      { 
                        value: "exclusief" as FotografiePakket, 
                        label: "Visuals Exclusief", 
                        price: calculatorPricing.fotografie.exclusief,
                        subtitle: "Foto's + 360° foto's + video + online woningbrochure"
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        data-testid={`button-fotografie-${option.value}`}
                        onClick={() =>
                          setState({ ...state, fotografiePakket: option.value })
                        }
                        className={`p-4 border-2 rounded-lg font-medium transition-all duration-300 hover-elevate active-elevate-2 text-left flex justify-between items-center ${
                          state.fotografiePakket === option.value
                            ? "border-primary bg-accent"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="text-base font-semibold">{option.label}</div>
                          <div className="text-sm text-foreground mt-1">{option.subtitle}</div>
                        </div>
                        <span className="text-sm text-muted-foreground ml-4">€{option.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Extra diensten (available when energielabel is selected) */}
            {(state.selectedService === "energielabel" || state.selectedService === "label-fotografie") && state.propertySize && (
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold">Extra diensten</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    data-testid="button-addon-nen-meting"
                    onClick={() => setNenMeting(!nenMeting)}
                    className={`p-5 border-2 rounded-xl font-medium transition-all duration-300 hover-elevate active-elevate-2 text-left ${
                      nenMeting
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-semibold">
                        NEN 2580 Meting
                      </span>
                      {nenMeting ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-border rounded" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Officiële oppervlakte meting
                    </div>
                    <div className="text-sm font-medium text-primary">
                      +€150
                    </div>
                  </button>

                  <button
                    data-testid="button-addon-puntentelling"
                    onClick={() => setState({ ...state, puntentelling: !state.puntentelling })}
                    className={`p-5 border-2 rounded-xl font-medium transition-all duration-300 hover-elevate active-elevate-2 text-left ${
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
                        <Check className="w-5 h-5" />
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

                  <button
                    data-testid="button-addon-adviesrapport"
                    onClick={() => setState({ ...state, adviesrapport: !state.adviesrapport })}
                    className={`p-5 border-2 rounded-xl font-medium transition-all duration-300 hover-elevate active-elevate-2 text-left ${
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
                        <Check className="w-5 h-5" />
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

                  <button
                    data-testid="button-addon-spoed"
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

            {/* Spoed Service for non-energielabel services */}
            {canCalculatePrice() && state.selectedService !== "energielabel" && state.selectedService !== "label-fotografie" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    data-testid="button-addon-spoed"
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
                  data-testid="button-calculate-price"
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
                      <span>Energielabel</span>
                      <span>€{priceBreakdown.energielabel}</span>
                    </div>
                  )}
                  {priceBreakdown.fotografie && (
                    <div className="flex justify-between">
                      <span>Fotografie ({state.fotografiePakket})</span>
                      <span>€{priceBreakdown.fotografie}</span>
                    </div>
                  )}
                  {priceBreakdown.nenMeting && (
                    <div className="flex justify-between">
                      <span>NEN 2580 Meting</span>
                      <span>€{priceBreakdown.nenMeting}</span>
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
                        data-testid="text-total-price"
                        className="text-2xl md:text-3xl font-bold text-primary"
                      >
                        €{priceBreakdown.total}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 flex-wrap">
                  <Button
                    data-testid="button-order"
                    onClick={handleOrderClick}
                    className="flex-1 bg-primary text-primary-foreground hover-elevate active-elevate-2"
                    size="lg"
                  >
                    Afspraak maken
                  </Button>
                  <Button
                    data-testid="button-reset"
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
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Afspraak maken</DialogTitle>
              <DialogDescription>
                Laat uw gegevens achter, dan nemen wij direct contact met u op
              </DialogDescription>
            </DialogHeader>

            {isSubmitted ? (
              <div
                data-testid="alert-quote-success"
                className="p-6 bg-primary/10 border-2 border-primary rounded-lg text-center"
              >
                <Check className="w-12 h-12 text-primary mx-auto mb-3" />
                <p className="text-primary font-medium">
                  Bedankt! Uw afspraak is ingepland. Wij nemen zo snel mogelijk contact met u op.
                </p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitQuote)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Naam:</FormLabel>
                          <FormControl>
                            <Input
                              data-testid="input-quote-name"
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
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Naam bedrijf (optioneel):</FormLabel>
                          <FormControl>
                            <Input
                              data-testid="input-quote-company"
                              placeholder="Bedrijfsnaam"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefoon:</FormLabel>
                          <FormControl>
                            <Input
                              data-testid="input-quote-phone"
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mailadres:</FormLabel>
                          <FormControl>
                            <Input
                              data-testid="input-quote-email"
                              type="email"
                              placeholder="naam@email.nl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="propertyPostcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postcode (de woning):</FormLabel>
                          <FormControl>
                            <Input
                              data-testid="input-quote-postcode"
                              placeholder="1234 AB"
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
                          <FormLabel>Adres (de woning):</FormLabel>
                          <FormControl>
                            <Input
                              data-testid="input-quote-address"
                              placeholder="Straatnaam 123"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Totaalprijs:</span>
                      <span className="text-2xl font-bold text-primary">
                        €{priceBreakdown?.total}
                      </span>
                    </div>
                    <Button
                      data-testid="button-submit-quote"
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover-elevate active-elevate-2"
                      disabled={form.formState.isSubmitting}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Afspraak maken
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
