import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Check, Camera, Video, Globe, Send, MapPin, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import type { QuoteRequest } from "@shared/schema";
import { quoteRequestSchema, calculatorPricing } from "@shared/schema";
import heroImage from "@assets/amsterdam-canal-boats_1760692744422.webp";
import tabletImage from "@assets/generated_images/Tablet_with_360_virtual_tour_22a86885.webp";
import videoImage from "@assets/generated_images/Film_clapperboard_with_reels_f64149d2.webp";
import { useSEO } from "@/hooks/useSEO";

// Portfolio photos
import photo01 from "@assets/Welnastraat 159 Amsterdam-01_1761143910682.webp";
import photo02 from "@assets/Welnastraat 159 Amsterdam-02_1761143910683.webp";
import photo04 from "@assets/Welnastraat 159 Amsterdam-04_1761143910682.webp";
import photo05 from "@assets/Welnastraat 159 Amsterdam-05_1761143910683.webp";
import photo06 from "@assets/Welnastraat 159 Amsterdam-06_1761143910683.webp";
import photo10 from "@assets/Welnastraat 159 Amsterdam-10_1761143910683.webp";
import photo11 from "@assets/Welnastraat 159 Amsterdam-11_1761143910683.webp";
import photo12 from "@assets/Welnastraat 159 Amsterdam-12_1761143910683.webp";
import photo13 from "@assets/Welnastraat 159 Amsterdam-13_1761143910683.webp";
import photo14 from "@assets/Welnastraat 159 Amsterdam-14_1761143910683.webp";
import photo16 from "@assets/Welnastraat 159 Amsterdam-16_1761143910682.webp";
import photo17 from "@assets/Welnastraat 159 Amsterdam-17_1761143910683.webp";
import photo18 from "@assets/Welnastraat 159 Amsterdam-18_1761143910683.webp";
import photo19 from "@assets/Welnastraat 159 Amsterdam-19_1761143910682.webp";
import photo19a from "@assets/Welnastraat 159 Amsterdam-19a_1761143910683.webp";
import photo20 from "@assets/Welnastraat 159 Amsterdam-20_1761143910683.webp";
import floorplanImage from "@assets/629 (1)_1761217509236.webp";
import brochureScreenshot from "@assets/image_1761293948140.webp";

const fotografieJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Vastgoedfotografie Amsterdam",
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
  serviceType: "Vastgoedfotografie",
  areaServed: { "@type": "City", name: "Amsterdam" },
  description:
    "Professionele vastgoedfotografie in Amsterdam, inclusief 360° virtuele tours en promotievideo. Ideaal voor woningverkoop en verhuur.",
  url: "https://www.labelenlens.nl/fotografie",
  offers: [
    {
      "@type": "Offer",
      name: "Basis fotopakket",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Totaal fotopakket",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Exclusief fotopakket",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  ],
};

type FotografiePakket = "basis" | "totaal" | "exclusief";

const portfolioImages = [
  { src: photo01, alt: "Moderne woonkamer met designmeubelen" },
  { src: photo02, alt: "Lichte eetkamer met eettafel" },
  { src: photo04, alt: "Stijlvolle keuken met kookeiland" },
  { src: photo05, alt: "Ruime slaapkamer met boxspring" },
  { src: photo06, alt: "Moderne badkamer met douche" },
  { src: photo10, alt: "Open keuken met moderne apparatuur" },
  { src: photo11, alt: "Gang met strakke vloer" },
  { src: photo12, alt: "Werkkamer met bureau" },
  { src: photo13, alt: "Balkon met zithoek" },
  { src: photo14, alt: "Tweede slaapkamer" },
  { src: photo16, alt: "Toilet met wandcloset" },
  { src: photo17, alt: "Berging met wasmachine" },
  { src: photo18, alt: "Entree met garderobe" },
  { src: photo19, alt: "Plattegrond overzicht" },
  { src: photo19a, alt: "3D plattegrond" },
  { src: photo20, alt: "Exterieur van het pand" },
];

export default function Fotografie() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useSEO({
    title: "Vastgoedfotografie Amsterdam – Professionele Woningfoto's",
    description:
      "Professionele vastgoedfotografie in Amsterdam inclusief 360° virtuele tours en video. Tref kopers met stijlvolle woningfoto's. Direct offerte aanvragen.",
    canonical: "/fotografie",
    jsonLd: fotografieJsonLd,
  });

  const [selectedPackage, setSelectedPackage] = useState<FotografiePakket | null>("totaal");
  const [addressHuisnummer, setAddressHuisnummer] = useState("");
  const [addressToevoeging, setAddressToevoeging] = useState("");
  const [isLookingUpAddress, setIsLookingUpAddress] = useState(false);
  const { toast } = useToast();

  const handleAddressLookup = async () => {
    const postcode = form.getValues("propertyPostcode");
    if (!postcode || !addressHuisnummer) {
      toast({
        title: "Gegevens ontbreken",
        description: "Vul postcode en huisnummer in.",
        variant: "destructive",
      });
      return;
    }
    setIsLookingUpAddress(true);
    try {
      const params = new URLSearchParams({ postcode, huisnummer: addressHuisnummer });
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
      const addressString = `${adres.straatnaam} ${adres.huisnummer}${toev}`;
      form.setValue("propertyAddress", addressString);
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

  const packages = [
    {
      id: "basis" as FotografiePakket,
      name: "Visuals Basis",
      features: [
        "Professionele woningfotografie",
        "Inmeten op locatie",
        "NEN 2580 meting",
        "2D & 3D plattegrond",
      ],
    },
    {
      id: "totaal" as FotografiePakket,
      name: "Visuals Totaal",
      features: [
        "Professionele woningfotografie",
        "Inmeten op locatie",
        "NEN 2580 meting",
        "2D & 3D plattegrond",
        "360° woningfotografie",
        "Standaard woningvideo",
      ],
      highlighted: true,
    },
    {
      id: "exclusief" as FotografiePakket,
      name: "Visuals Exclusief",
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
  ];

  const form = useForm<QuoteRequest>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      name: "",
      companyName: "",
      email: "",
      phone: "",
      propertyPostcode: "",
      propertyAddress: "",
      extraNotes: "",
      calculatorState: {
        propertyType: "koop",
        selectedService: "fotografie",
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
      setSelectedPackage(null);
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

  const scrollToForm = () => {
    const formElement = document.getElementById("afspraak-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const onSubmit = (data: QuoteRequest) => {
    if (!selectedPackage) {
      toast({
        title: "Selecteer een pakket",
        description: "Kies eerst een fotografie pakket.",
        variant: "destructive",
      });
      return;
    }

    // Calculate total price based on selected package
    const basePrice = calculatorPricing.fotografie[selectedPackage];
    const totalPrice = basePrice;

    const submitData = {
      ...data,
      calculatorState: {
        ...data.calculatorState,
        fotografiePakket: selectedPackage,
      },
      totalPrice,
    };
    
    quoteMutation.mutate(submitData);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <Hero
        title="Professionele Woningfotografie"
        subtitle="Complete woningpresentatie, professionele fotografie en metingen binnen 5 werkdagen"
        imageSrc={heroImage}
        imageAlt="Amsterdamse grachten fotografie"
      />

      {/* Subtext under hero */}
      <section className="pt-12 pb-4 px-4 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-muted-foreground">
            Complete woningpresentatie, professionele fotografie en metingen binnen 5 werkdagen
          </p>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                Onze fotografie pakketten
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Zie hier meer info over het geschikte pakket voor jou!
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <ScrollReveal key={index} delay={index * 150}>
                <Card
                  data-testid={`card-foto-package-${index}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`hover-elevate active-elevate-2 transition-all duration-300 h-full cursor-pointer ${
                    selectedPackage === pkg.id
                      ? "border-4 border-primary shadow-xl"
                      : "border-2"
                  }`}
                >
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="h-8 mb-4">
                      {pkg.highlighted && (
                        <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                          Populair
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-6">{pkg.name}</h3>
                    <ul className="space-y-3 flex-grow">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          {/* Afspraak maken CTA button */}
          <ScrollReveal delay={300}>
            <div className="flex justify-center mt-12">
              <Button
                data-testid="button-scroll-to-form"
                onClick={scrollToForm}
                size="lg"
                className="bg-primary text-primary-foreground border-2 border-primary-border px-12 text-lg font-semibold"
              >
                afspraak maken
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Professionele woningfotografie Section */}
      <section className="py-16 md:py-24 px-4 bg-accent/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <ScrollReveal>
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                  <Camera className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl md:text-3xl font-semibold">
                    Professionele woningfotografie
                  </h2>
                </div>
                
                <p className="text-base mb-6 leading-relaxed">
                  Eén beeld zegt meer dan duizend woorden. Daarom leggen wij iedere woning vast met aandacht voor licht, compositie en sfeer. We nemen de tijd om elk detail goed in beeld te brengen en zorgen voor een presentatie die de woning laat opvallen - zowel online als offline.
                </p>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Professionele woningfotografie binnen & buiten</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Inclusief NEN 2580 meting – nauwkeurige vaststelling van gebruiksoppervlakte</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Inclusief 2D & 3D plattegrond – duidelijke weergave van indeling en ruimtelijkheid</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Perfect voorbereid voor Funda, social media en drukwerk</span>
                  </li>
                </ul>

                <p className="text-base text-muted-foreground">
                  Onze foto's zorgen voor een eerste indruk die vertrouwen wekt en kijkers nieuwsgierig maakt.
                </p>

                {/* Desktop: Floorplan under text (rotated 90 degrees) - pushed to bottom */}
                <div className="hidden lg:flex lg:justify-center lg:items-end mt-auto pt-8">
                  <img
                    src={floorplanImage}
                    alt="2D & 3D plattegrond voorbeeld"
                    className="w-auto h-80 object-contain"
                    style={{ transform: 'rotate(90deg)' }}
                    data-testid="floorplan-image"
                  />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div>
                <PhotoCarousel images={portfolioImages} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 360° Woningfotografie Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={tabletImage}
                  alt="360° woningfotografie op tablet"
                  className="w-full h-auto"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl md:text-3xl font-semibold">
                    360° Woningfotografie
                  </h2>
                </div>
                
                <p className="text-base mb-6 leading-relaxed">
                  Laat bezoekers jouw woning ervaren alsof ze er echt doorheen lopen. Met 360° fotografie creëren we een virtuele tour waarmee potentiële kopers of huurders op elk moment, vanaf elke locatie, de woning kunnen bekijken. Ze kunnen rustig door de ruimtes navigeren, de lichtinval zien en de indeling zelf ervaren - een unieke manier om de woning echt te voelen.
                </p>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Interactieve virtuele rondleiding in hoge kwaliteit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Realistisch en transparant beeld van de woning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Ideaal voor Funda en andere woningplatforms</span>
                  </li>
                </ul>

                <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-muted-foreground italic">
                    Een 360° tour vergroot het vertrouwen en maakt jouw woningpresentatie persoonlijk, modern en onderscheidend.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Woningvideo Section */}
      <section className="py-16 md:py-24 px-4 bg-accent/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Video className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl md:text-3xl font-semibold">
                    Woningvideo
                  </h2>
                </div>
                
                <p className="text-base mb-6 leading-relaxed">
                  Een woningvideo brengt sfeer, emotie en beleving samen in één vloeiende presentatie. Met zorgvuldig gekozen camerahoeken, zachte overgangen en sfeervolle beelden laten we de woning tot leven komen. De kijker krijgt een natuurlijk gevoel voor de ruimtes, de lichtinval en de sfeer - alsof hij al binnenstapt.
                </p>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Professionele videoproductie met oog voor detail</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Versterkt de uitstraling en beleving van de woning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Perfect voor Funda, social media en promotiecampagnes</span>
                  </li>
                </ul>

                <p className="text-base text-muted-foreground">
                  Een woningvideo vertelt niet alleen hoe de woning eruitziet, maar laat mensen voelen hoe het is om er te wonen.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={videoImage}
                  alt="Professionele woningvideo productie"
                  className="w-full h-auto"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Online Woningbrochure Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Online Woningbrochure
                </h2>
                
                <p className="text-lg mb-6 font-semibold">
                  Voor wie nét dat beetje extra wil geven.
                </p>

                <p className="text-base leading-relaxed mb-6">
                  Foto's laten een woning zien - maar met een online woningbrochure laat je mensen het echt vóelen.
                  Het is een stijlvolle, digitale presentatie waarin beeld, sfeer en verhaal samenkomen. Zo geef je de klant iets extra's: een persoonlijke ervaring die nieuwsgierigheid wekt en de interesse vergroot.
                </p>

                <p className="text-base font-semibold mb-3">
                  ✨ Waarom kiezen voor een online woningbrochure:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Je onderscheidt je van het standaard woningaanbod</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Je verhoogt de interesse bij potentiële kopers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Je biedt klanten iets extra's dat blijft hangen</span>
                  </li>
                </ul>

                <p className="text-base text-muted-foreground">
                  Zie hier voorbeelden van klanten en partijen die je voorgingen - elk met hun eigen unieke presentatie die nét dat verschil maakt.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div>
                <a
                  href="https://v0-brochure-two.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg overflow-hidden shadow-lg mb-4 hover-elevate active-elevate-2 transition-all duration-300"
                  data-testid="link-brochure-example"
                >
                  <img
                    src={brochureScreenshot}
                    alt="Online woningbrochure voorbeeld - Welnastraat 159"
                    className="w-full h-auto"
                  />
                </a>
                <div className="text-center">
                  <a
                    href="https://v0-brochure-two.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold text-lg hover:underline transition-all"
                    data-testid="link-welnastraat"
                  >
                    Welnastraat 159
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Afspraak maken Form Section */}
      {selectedPackage && (
        <section id="afspraak-form" className="py-16 md:py-24 px-4 bg-accent/30">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                  Plan een afspraak
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Vul onderstaand formulier in en wij nemen zo snel mogelijk contact met u op
                </p>

                {/* Package selector buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      data-testid={`button-form-package-${pkg.id}`}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`px-6 py-3 rounded-lg border-2 transition-all duration-300 hover-elevate active-elevate-2 ${
                        selectedPackage === pkg.id
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      <div className="text-sm md:text-base">{pkg.name}</div>
                      <div className="text-xs md:text-sm mt-1">€{calculatorPricing.fotografie[pkg.id]}</div>
                    </button>
                  ))}
                </div>

                {/* Total price display */}
                <div className="inline-block">
                  <Card className="border-2 border-primary bg-primary/5">
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground mb-1">Totaalprijs (excl. BTW)</p>
                      <p className="text-4xl font-bold text-primary">€{calculatorPricing.fotografie[selectedPackage]}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <Card className="border-2">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-6 text-center">Afspraak maken</h3>
                  <p className="text-muted-foreground text-center mb-8">
                    Laat uw gegevens achter, dan nemen wij direct contact met u op
                  </p>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Naam:</FormLabel>
                              <FormControl>
                                <Input
                                  data-testid="input-name"
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
                                  data-testid="input-company"
                                  placeholder="Bedrijfsnaam"
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
                              <FormLabel>Telefoon:</FormLabel>
                              <FormControl>
                                <Input
                                  data-testid="input-phone"
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
                                  data-testid="input-email"
                                  type="email"
                                  placeholder="naam@email.nl"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="propertyPostcode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postcode (de woning):</FormLabel>
                              <FormControl>
                                <Input
                                  data-testid="input-postcode"
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
                                  data-testid="input-address"
                                  placeholder="Straatnaam 123"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex flex-col h-full space-y-2">
                          <label className="text-sm font-medium leading-none flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            Adres automatisch opzoeken
                          </label>
                          <div className="flex-1 border rounded-md p-3 bg-muted/30 space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <label className="text-xs font-medium">Postcode</label>
                              <Input
                                data-testid="input-lookup-postcode"
                                placeholder="1234AB"
                                value={form.watch("propertyPostcode")}
                                onChange={(e) => form.setValue("propertyPostcode", e.target.value.toUpperCase())}
                                maxLength={7}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium">Huisnummer</label>
                              <Input
                                data-testid="input-lookup-huisnummer"
                                placeholder="42"
                                value={addressHuisnummer}
                                onChange={(e) => setAddressHuisnummer(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium">Toevoeging</label>
                              <Input
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
                            disabled={isLookingUpAddress || !addressHuisnummer}
                            data-testid="button-lookup-address"
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
                                Adres opzoeken
                              </>
                            )}
                          </Button>
                          </div>{/* end border box */}
                        </div>{/* end space-y-2 wrapper */}

                        <FormField
                          control={form.control}
                          name="extraNotes"
                          render={({ field }) => (
                            <FormItem className="flex flex-col h-full">
                              <FormLabel>Eventuele opmerkingen</FormLabel>
                              <FormControl className="flex-1">
                                <Textarea
                                  data-testid="input-extra-notes"
                                  placeholder="Bijv. specifieke wensen, vragen..."
                                  className="resize-none h-full min-h-0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-center pt-4">
                        <Button
                          data-testid="button-submit-appointment"
                          type="submit"
                          size="lg"
                          disabled={quoteMutation.isPending}
                          className="bg-primary text-primary-foreground hover-elevate active-elevate-2 px-12"
                        >
                          {quoteMutation.isPending ? (
                            "Bezig met verzenden..."
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Afspraak maken
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
