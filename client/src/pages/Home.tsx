import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import heroImage from "@assets/new-amsterdam-canal_1760876000697.webp";
import { HomepageSelector } from "@/components/HomepageSelector";
import { HoeHetWerkt } from "@/components/HoeHetWerkt";
import { OnseDiensten } from "@/components/OnseDiensten";
import { Reviews } from "@/components/Reviews";
import { OverOnsContent } from "@/components/OverOnsContent";
import { ContactInfoContent } from "@/components/ContactInfoContent";
import { TeamContent } from "@/components/TeamContent";
import { FAQContent } from "@/components/FAQContent";
import { CertificationsContent } from "@/components/CertificationsContent";
import { PricingCalculator } from "@/components/PricingCalculator";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useEffect } from "react";

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Label & Lens",
    url: "https://www.labelenlens.nl",
    logo: "https://www.labelenlens.nl/favicon.png",
    image: "https://www.labelenlens.nl/og-image.png",
    description:
      "Professionele energielabels én vastgoedfotografie in Amsterdam. EPA-gecertificeerd, binnen 5 werkdagen geleverd.",
    telephone: "+31643735719",
    email: "Info@labelenlens.nl",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Amsterdam",
      addressRegion: "Noord-Holland",
      addressCountry: "NL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 52.3676,
      longitude: 4.9041,
    },
    areaServed: {
      "@type": "City",
      name: "Amsterdam",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    priceRange: "€€",
    sameAs: [],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Label & Lens",
    url: "https://www.labelenlens.nl",
  },
];

export default function Home() {
  useSEO({
    title: "Energielabel & Vastgoedfotografie Amsterdam",
    description:
      "Professionele energielabels én vastgoedfotografie in Amsterdam. EPA-gecertificeerd, binnen 5 werkdagen geleverd. Ook puntentelling & adviesrapport voor huurwoningen.",
    canonical: "/",
    jsonLd: homeJsonLd,
  });

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  }, []);

  const scrollToSelector = () => {
    const selectorElement = document.getElementById("homepage-selector");
    if (selectorElement) {
      selectorElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <Hero
        title="Energielabel & Woningpresentatie"
        subtitle={
          <>
            Volledige woonwaardering én high-end presentatie
            <br />
            Eén partner, één oplossing
          </>
        }
        imageSrc={heroImage}
        imageAlt="Karakteristieke Amsterdamse grachtenpanden met historische architectuur"
      >
        <Button
          data-testid="button-hero-scroll"
          size="lg"
          onClick={scrollToSelector}
          className="bg-primary text-primary-foreground border-2 border-primary-border px-8 text-lg font-semibold rounded-full"
        >
          Energielabel aanvragen
          <ChevronDown className="w-5 h-5 ml-2" />
        </Button>
      </Hero>

      {/* 1. De stappen - Homepage Selector/Calculator */}
      <div id="homepage-selector" className="scroll-mt-24">
        <HomepageSelector />
      </div>

      {/* 2. Onze diensten */}
      <div id="onze-diensten" className="scroll-mt-24">
        <OnseDiensten />
      </div>

      {/* 3. Hoe het werkt */}
      <HoeHetWerkt />

      {/* 4. Over Labels en Lens */}
      <div id="over-ons" className="scroll-mt-24">
        <OverOnsContent />
      </div>

      {/* 4. Wat klanten zeggen - Reviews */}
      <Reviews />

      {/* 5. Contact - Alleen contactgegevens */}
      <div id="contact">
        <ContactInfoContent />
      </div>

      {/* 6. Ontmoet de oprichters */}
      <TeamContent />

      {/* 7. FAQ */}
      <div id="faq" className="scroll-mt-24">
        <FAQContent />
      </div>

      {/* 8. Certificeringen */}
      <CertificationsContent />

      {/* 9. Prijs Calculator */}
      <div id="prijzen" className="scroll-mt-24">
        <PricingCalculator />
      </div>

      <Footer />
    </div>
  );
}
