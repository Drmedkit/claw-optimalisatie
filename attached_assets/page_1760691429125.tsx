"use client"

import { Home, Camera, Zap, Check, Calculator } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect, useRef } from "react"

export default function PrijzenCalculatorPage() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [woningType, setWoningType] = useState<"huur" | "koop" | null>(null)
  const [oppervlakte, setOppervlakte] = useState("")
  const [fotografie, setFotografie] = useState(false)
  const [spoedService, setSpoedService] = useState(false)
  const [puntentelling, setPuntentelling] = useState(false)
  const [adviesrapport, setAdviesrapport] = useState(false)
  const [berekendeprijs, setBerekendeprijs] = useState<number | null>(null)
  const calculatorRef = useRef<HTMLDivElement>(null)

  // Intersection Observer voor scroll animaties
  useEffect(() => {
    // Check if we should scroll to calculator on page load
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("scroll") === "calculator" && calculatorRef.current) {
      setTimeout(() => {
        calculatorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            setVisibleItems((prev) => [...prev, index])
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  // Prijs berekening functie
  const berekenPrijs = () => {
    if (!woningType || !oppervlakte) return

    let basisprijs = 0

    // Basis energielabel prijzen
    if (oppervlakte === "tot-50") {
      basisprijs = 199
    } else if (oppervlakte === "50-100") {
      basisprijs = 239
    } else if (oppervlakte === "100-150") {
      basisprijs = 279
    } else if (oppervlakte === "150-plus") {
      basisprijs = 319
    }

    // Voor koopwoning: +€30 voor NEN meting
    if (woningType === "koop") {
      basisprijs += 30
    }

    // Voor huurwoning: extra opties
    if (woningType === "huur") {
      if (puntentelling) {
        basisprijs += 120 // met puntentelling
      }
      if (adviesrapport) {
        basisprijs += 100 // met adviesrapport
      }
    }

    // Extra diensten
    if (fotografie) {
      basisprijs += 150
    }

    if (spoedService) {
      basisprijs += 50
    }

    setBerekendeprijs(basisprijs)
  }

  // Reset functie
  const resetCalculator = () => {
    setWoningType(null)
    setOppervlakte("")
    setFotografie(false)
    setSpoedService(false)
    setPuntentelling(false)
    setAdviesrapport(false)
    setBerekendeprijs(null)
  }

  // Generate URL for order button
  const generateOrderUrl = () => {
    const params = new URLSearchParams()

    if (woningType) params.set("propertyType", woningType)
    if (oppervlakte) params.set("oppervlakte", oppervlakte)
    if (puntentelling) params.set("puntentelling", "true")
    if (adviesrapport) params.set("adviesrapport", "true")
    if (fotografie) params.set("fotografie", "true")
    if (spoedService) params.set("spoedService", "true")

    return `/?${params.toString()}#energielabels`
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Header - Static positioning */}
      <header className="relative z-30 px-4 md:px-6 py-6 md:py-6 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-4 md:space-y-4">
            {/* Brand Name Above Navigation - Make it clickable */}
            <Link href="/" className="inline-block">
              <div className="text-white font-bold text-lg md:text-lg tracking-widest hover:text-lime-300 transition-colors cursor-pointer">
                Label & Lens
              </div>
            </Link>

            {/* Center Navigation - Responsive */}
            <nav
              className="flex items-center space-x-8 md:space-x-12 text-base md:text-base"
              role="navigation"
              aria-label="Hoofdnavigatie"
            >
              <div className="text-lime-300 font-medium tracking-wide">Prijzen</div>
              <Link
                href="/over-ons"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white font-light tracking-wide transition-colors duration-300"
              >
                Over ons
              </Link>
              <Link
                href="/veelgestelde-vragen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white font-light tracking-wide transition-colors duration-300"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="text-white/90 hover:text-white font-light tracking-wide transition-colors duration-300"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Background Image - Full screen height */}
      <section className="relative h-screen -mt-32 px-6">
        {/* Background image */}
        <div className="absolute inset-0 z-0 -mt-8">
          <img
            src="/images/amsterdam-canal-with-tower.jpg"
            alt="Prachtige Amsterdamse gracht met historische toren en grachtenpanden"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full pt-24 md:pt-32">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-4xl lg:text-5xl font-light text-white leading-tight mb-4 md:mb-6 tracking-wide">
              Prijzen Calculator
            </h1>
            <p className="text-lg md:text-lg lg:text-xl text-white max-w-2xl mx-auto font-medium tracking-wide">
              Bereken eenvoudig de prijs voor uw energielabel pakket
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section ref={calculatorRef} className="py-12 md:py-20 px-4 bg-[#FAF9F7]">
        <div className="max-w-4xl mx-auto">
          <div
            ref={(el) => (itemRefs.current[0] = el)}
            data-index={0}
            className={`transform transition-all duration-700 ease-out ${
              visibleItems.includes(0) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <Card className="border-2 border-lime-200 shadow-2xl rounded-2xl bg-white w-full">
              <CardHeader className="bg-lime-50 py-4 rounded-t-2xl text-center">
                <div className="flex items-center justify-center mb-3">
                  <Calculator className="w-8 h-8 text-lime-500 mr-3" />
                  <CardTitle className="text-3xl text-slate-800">Jouw pakket prijs berekenen</CardTitle>
                </div>
                <p className="text-gray-600">Selecteer uw opties en krijg direct inzicht in de totale kosten</p>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
                {/* Stap 1: Woningtype - Compacter gemaakt */}
                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Stap 1: Woningtype</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <button
                      onClick={() => setWoningType("koop")}
                      className={`p-4 md:p-4 border-2 rounded-xl font-medium transition-all duration-300 min-h-[80px] flex flex-col justify-center ${
                        woningType === "koop"
                          ? "border-lime-500 bg-lime-50 text-lime-700 shadow-lg"
                          : "border-gray-300 text-gray-700 hover:border-lime-500 hover:text-lime-700 hover:shadow-md"
                      }`}
                    >
                      <Home className="w-6 md:w-6 h-6 md:h-6 mx-auto mb-2 text-current" />
                      <div className="text-base md:text-base font-semibold">Koopwoning</div>
                      <div className="text-sm mt-1 opacity-75">Inclusief NEN 2580 meting & plattegrond</div>
                    </button>
                    <button
                      onClick={() => setWoningType("huur")}
                      className={`p-4 md:p-4 border-2 rounded-xl font-medium transition-all duration-300 min-h-[80px] flex flex-col justify-center ${
                        woningType === "huur"
                          ? "border-lime-500 bg-lime-50 text-lime-700 shadow-lg"
                          : "border-gray-300 text-gray-700 hover:border-lime-500 hover:text-lime-700 hover:shadow-md"
                      }`}
                    >
                      <Home className="w-6 md:w-6 h-6 md:h-6 mx-auto mb-2 text-current" />
                      <div className="text-base md:text-base font-semibold">Huurwoning</div>
                      <div className="text-sm mt-1 opacity-75">Energielabel & plattegrond</div>
                    </button>
                  </div>
                </div>

                {/* Stap 2: Oppervlakte - alleen tonen als woningtype is geselecteerd */}
                {woningType && (
                  <div className="space-y-3">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Stap 2: Oppervlakte</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      {[
                        { value: "tot-50", label: "Tot 50m²", price: woningType === "koop" ? 229 : 199 },
                        { value: "50-100", label: "50-100m²", price: woningType === "koop" ? 269 : 239 },
                        { value: "100-150", label: "100-150m²", price: woningType === "koop" ? 309 : 279 },
                        { value: "150-plus", label: "150m²+", price: woningType === "koop" ? 349 : 319 },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setOppervlakte(option.value)}
                          className={`p-4 md:p-4 border-2 rounded-lg font-medium transition-all duration-300 min-h-[60px] ${
                            oppervlakte === option.value
                              ? "border-lime-500 bg-lime-50 text-lime-700"
                              : "border-gray-300 text-gray-700 hover:border-lime-500 hover:text-lime-700"
                          }`}
                        >
                          <div className="text-base md:text-base font-semibold">{option.label}</div>
                          <div className="text-sm md:text-sm text-gray-600 mt-1">€{option.price}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stap 3: Puntentelling - alleen voor huurwoningen - Compacter gemaakt */}
                {woningType === "huur" && oppervlakte && (
                  <div className="space-y-3">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Stap 3: Puntentelling</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <button
                        onClick={() => setPuntentelling(true)}
                        className={`p-3 md:p-4 border-2 rounded-xl font-medium transition-all duration-300 min-h-[70px] flex flex-col justify-center ${
                          puntentelling === true
                            ? "border-lime-500 bg-lime-50 text-lime-700 shadow-lg"
                            : "border-gray-300 text-gray-700 hover:border-lime-500 hover:text-lime-700 hover:shadow-md"
                        }`}
                      >
                        <div className="text-sm md:text-base font-semibold">Puntentelling</div>
                        <div className="text-xs mt-1 opacity-75">+€120</div>
                      </button>
                      <button
                        onClick={() => setPuntentelling(false)}
                        className={`p-3 md:p-4 border-2 rounded-xl font-medium transition-all duration-300 min-h-[70px] flex flex-col justify-center ${
                          puntentelling === false
                            ? "border-lime-500 bg-lime-50 text-lime-700 shadow-lg"
                            : "border-gray-300 text-gray-700 hover:border-lime-500 hover:text-lime-700 hover:shadow-md"
                        }`}
                      >
                        <div className="text-sm md:text-base font-semibold">Zonder puntentelling</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Stap 4: Adviesrapport - alleen voor huurwoningen - Compacter gemaakt */}
                {woningType === "huur" && oppervlakte && (
                  <div className="space-y-3">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Stap 4: Adviesrapport</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <button
                        onClick={() => setAdviesrapport(true)}
                        className={`p-3 md:p-4 border-2 rounded-xl font-medium transition-all duration-300 min-h-[70px] flex flex-col justify-center ${
                          adviesrapport === true
                            ? "border-lime-500 bg-lime-50 text-lime-700 shadow-lg"
                            : "border-gray-300 text-gray-700 hover:border-lime-500 hover:text-lime-700 hover:shadow-md"
                        }`}
                      >
                        <div className="text-sm md:text-base font-semibold">Adviesrapport</div>
                        <div className="text-xs mt-1 opacity-75">indien nodig</div>
                        <div className="text-xs mt-1 opacity-75">+€100</div>
                      </button>
                      <button
                        onClick={() => setAdviesrapport(false)}
                        className={`p-3 md:p-4 border-2 rounded-xl font-medium transition-all duration-300 min-h-[70px] flex flex-col justify-center ${
                          adviesrapport === false
                            ? "border-lime-500 bg-lime-50 text-lime-700 shadow-lg"
                            : "border-gray-300 text-gray-700 hover:border-lime-500 hover:text-lime-700 hover:shadow-md"
                        }`}
                      >
                        <div className="text-sm md:text-base font-semibold">Geen adviesrapport</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Stap 5: Extra diensten (optioneel) */}
                {oppervlakte && (
                  <div className="space-y-3">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                      {woningType === "huur"
                        ? "Stap 5: Extra diensten (optioneel)"
                        : "Stap 3: Extra diensten (optioneel)"}
                    </h3>
                    <div className="space-y-3">
                      {/* Fotografie */}
                      <label
                        className={`flex items-center p-4 md:p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 min-h-[60px] ${
                          fotografie
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-300 hover:border-purple-500 hover:bg-purple-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={fotografie}
                          onChange={(e) => setFotografie(e.target.checked)}
                          className="sr-only"
                        />
                        <Camera className="w-6 md:w-6 h-6 md:h-6 text-purple-500 mr-4 md:mr-4 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 text-base md:text-base">
                            Professionele Fotografie
                          </div>
                          <div className="text-sm md:text-sm text-gray-600">Hoogwaardige vastgoedfoto's</div>
                        </div>
                        <div className="text-lg md:text-lg font-bold text-purple-600">+€150</div>
                      </label>

                      {/* Spoed Service */}
                      <label
                        className={`flex items-center p-4 md:p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 min-h-[60px] ${
                          spoedService
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 hover:border-red-500 hover:bg-red-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={spoedService}
                          onChange={(e) => setSpoedService(e.target.checked)}
                          className="sr-only"
                        />
                        <Zap className="w-6 md:w-6 h-6 md:h-6 text-red-500 mr-4 md:mr-4 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 text-base md:text-base">Spoed Service</div>
                          <div className="text-sm md:text-sm text-gray-600">Binnen 24 uur geleverd</div>
                        </div>
                        <div className="text-lg md:text-lg font-bold text-red-600">+€50</div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Bereken knop - alleen tonen als alle vereiste velden zijn ingevuld */}
                {woningType && oppervlakte && (
                  <div className="text-center space-y-4 pt-2">
                    <Button
                      onClick={berekenPrijs}
                      className="bg-lime-500 hover:bg-lime-600 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-lg shadow-lg transition-all duration-300"
                    >
                      <Calculator className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                      Prijs berekenen
                    </Button>

                    {berekendeprijs !== null && (
                      <div className="bg-lime-50 border-2 border-lime-200 rounded-xl p-4 md:p-6 mt-4">
                        <h4 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">Uw totale prijs:</h4>

                        {/* Prijs breakdown - exclusief BTW */}
                        <div className="text-left space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span>Energielabel {woningType === "koop" ? "+ NEN 2580 meting" : ""}</span>
                            <span>
                              €
                              {woningType === "koop"
                                ? oppervlakte === "tot-50"
                                  ? 229
                                  : oppervlakte === "50-100"
                                    ? 269
                                    : oppervlakte === "100-150"
                                      ? 309
                                      : 349
                                : oppervlakte === "tot-50"
                                  ? 199
                                  : oppervlakte === "50-100"
                                    ? 239
                                    : oppervlakte === "100-150"
                                      ? 279
                                      : 319}
                            </span>
                          </div>
                          {woningType === "huur" && puntentelling && (
                            <div className="flex justify-between">
                              <span>Puntentelling</span>
                              <span>€120</span>
                            </div>
                          )}
                          {woningType === "huur" && adviesrapport && (
                            <div className="flex justify-between">
                              <span>Adviesrapport (indien nodig)</span>
                              <span>€100</span>
                            </div>
                          )}
                          {fotografie && (
                            <div className="flex justify-between">
                              <span>Professionele fotografie</span>
                              <span>€150</span>
                            </div>
                          )}
                          {spoedService && (
                            <div className="flex justify-between">
                              <span>Spoed service</span>
                              <span>€50</span>
                            </div>
                          )}
                          <hr className="my-2" />
                          <div className="flex justify-between font-bold text-lg md:text-xl">
                            <span>Subtotaal (excl. BTW)</span>
                            <span>€{berekendeprijs}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>BTW (21%)</span>
                            <span>€{Math.round(berekendeprijs * 0.21)}</span>
                          </div>
                          <hr className="my-2" />
                          <div className="flex justify-between font-bold text-xl md:text-2xl text-lime-600">
                            <span>Totaal (incl. BTW)</span>
                            <span>€{Math.round(berekendeprijs * 1.21)}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Link href={generateOrderUrl()}>
                            <Button className="w-full bg-lime-500 hover:bg-lime-600 text-white py-4 md:py-5 text-lg md:text-xl font-semibold">
                              Nu bestellen
                            </Button>
                          </Link>
                          <Button
                            onClick={resetCalculator}
                            variant="outline"
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent py-4 md:py-5 text-lg md:text-xl font-semibold"
                          >
                            Opnieuw berekenen
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Waarom kiezen voor ons sectie */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div
            ref={(el) => (itemRefs.current[1] = el)}
            data-index={1}
            className={`text-center mb-12 transform transition-all duration-700 ease-out ${
              visibleItems.includes(1) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Waarom kiezen voor Label & Lens?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transparante prijzen, snelle levering en gecertificeerde kwaliteit
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div
              ref={(el) => (itemRefs.current[2] = el)}
              data-index={2}
              className={`text-center transform transition-all duration-700 ease-out ${
                visibleItems.includes(2) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="bg-lime-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Binnen 5 werkdagen</h3>
              <p className="text-gray-600">Snelle levering gegarandeerd. Spoed service binnen 24 uur mogelijk.</p>
            </div>

            <div
              ref={(el) => (itemRefs.current[3] = el)}
              data-index={3}
              className={`text-center transform transition-all duration-700 ease-out ${
                visibleItems.includes(3) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="bg-lime-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Gecertificeerd</h3>
              <p className="text-gray-600">Alle energielabels volgens BRL9500 normen door gecertificeerde adviseurs.</p>
            </div>

            <div
              ref={(el) => (itemRefs.current[4] = el)}
              data-index={4}
              className={`text-center transform transition-all duration-700 ease-out ${
                visibleItems.includes(4) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="bg-lime-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Transparante prijzen</h3>
              <p className="text-gray-600">Geen verborgen kosten. Wat u ziet is wat u betaalt.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Light Green Background */}
      <footer className="relative py-12 px-4 bg-[#f4fcec]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Bedrijfsinfo */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Label & Lens</h3>
              <div className="space-y-2">
                <Link href="/over-ons" className="block text-slate-700 hover:text-lime-600 transition-colors">
                  • Over ons
                </Link>
                <Link
                  href="/veelgestelde-vragen"
                  className="block text-slate-700 hover:text-lime-600 transition-colors"
                >
                  • FAQ
                </Link>
              </div>
            </div>

            {/* Diensten */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Onze Diensten</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/energielabels" className="text-slate-700 hover:text-lime-600 transition-colors">
                    • Energielabels
                  </Link>
                </li>
                <li>
                  <Link href="/energielabels" className="text-slate-700 hover:text-lime-600 transition-colors">
                    • Puntentellingen
                  </Link>
                </li>
                <li>
                  <Link href="/energielabels" className="text-slate-700 hover:text-lime-600 transition-colors">
                    • Adviesrapport
                  </Link>
                </li>
                <li>
                  <Link href="/energielabels" className="text-slate-700 hover:text-lime-600 transition-colors">
                    • Spoed service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Contact</h3>
              <Link href="/contact" className="inline-block text-slate-700 hover:text-lime-600 transition-colors mb-4">
                • Neem contact op
              </Link>
              <div className="space-y-2">
                <p className="text-slate-700">info@flipamsterdam.nl</p>
                <p className="text-slate-700">020 123 4567</p>
                <p className="text-slate-700">Amsterdam</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-300 mt-8 pt-8 text-center">
            <p className="text-slate-700">© 2024 Label & Lens - Alle rechten voorbehouden</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
