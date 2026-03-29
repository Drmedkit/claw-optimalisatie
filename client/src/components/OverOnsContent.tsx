import { useState, useCallback } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import pauloPortrait from "@assets/paulo-portrait_1760692744422.webp";
import { MessageCircle, Zap, Layers, Search, Lightbulb, Clock } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const values = [
  {
    icon: <MessageCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />,
    title: "Persoonlijk contact",
    description: "Direct contact met mij als adviseur en uitvoerder, van opname tot oplevering.",
  },
  {
    icon: <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />,
    title: "Snel",
    description: "Vaak binnen 48 uur geregeld en altijd binnen 5 werkdagen.",
  },
  {
    icon: <Layers className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />,
    title: "Eén partner",
    description: "Alles onder één dak. Eén aanspreekpunt voor het hele traject.",
  },
  {
    icon: <Search className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />,
    title: "Uitgebreide opname",
    description: "Ik kijk verder dan alleen de basis en doe waar nodig extra onderzoek om alles goed in kaart te brengen.",
  },
  {
    icon: <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />,
    title: "Advies op maat",
    description: "Gericht advies op basis van jouw situatie, wensen en budget.",
  },
  {
    icon: <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />,
    title: "Flexibel",
    description: "Ook op korte termijn of buiten werktijden mogelijk.",
  },
];

export function OverOnsContent() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false });
  const [activeSlide, setActiveSlide] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  emblaApi?.on("select", onSelect);

  const slides = [values.slice(0, 3), values.slice(3, 6)];

  return (
    <>
      {/* About Section */}
      <section className="pt-6 pb-10 md:pt-8 md:pb-14 px-4">
        <ScrollReveal>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-center">
              Over Label & Lens
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {/* Text – left */}
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  Label & Lens is gespecialiseerd in energielabels, woningopnames en high-end woningpresentatie in Amsterdam en omgeving.
                </p>
                <p>
                  Ik ben als gecertificeerd EP-adviseur jouw vaste aanspreekpunt voor alles wat te maken heeft met woonwaardering, zoals energielabels, puntentellingen, metingen en adviesrapporten. Voor de fotografie en presentatie werk ik samen met een ervaren vastgoedfotograaf, zodat technische kwaliteit en visuele presentatie goed op elkaar aansluiten.
                </p>
                <p>
                  Samen zorgen we ervoor dat je verzekerd bent van betrouwbare energielabels, nauwkeurige metingen en hoogwaardige woningfotografie en presentatie, waaronder brochures, video's en 360°-beelden.
                </p>
                <p>
                  Met Label & Lens heb je geen verschillende partijen nodig. Alles wordt persoonlijk en zorgvuldig geregeld via één aanspreekpunt.
                  <br />
                  <br />
                  <strong>Eén bedrijf, één aanspreekpunt, één oplossing.</strong>
                </p>
              </div>
              {/* Image – right */}
              <div className="flex justify-center md:justify-end">
                <div className="overflow-hidden rounded-lg w-full max-w-xs md:max-w-sm">
                  <img
                    src={pauloPortrait}
                    alt="Paulo – Oprichter Label & Lens"
                    className="w-full aspect-[3/4] object-cover object-top"
                   loading="lazy" decoding="async" />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Values Section */}
      <section className="py-10 md:py-14 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-semibold mb-2">
                Waarom Label & Lens?
              </h2>
              <p className="text-muted-foreground text-base font-medium">
                Onze werkwijze
              </p>
              <p className="text-muted-foreground text-sm mt-4 font-medium">
                Geen massaproces, maar persoonlijk, duidelijk en goed geregeld
              </p>
            </div>
          </ScrollReveal>

          {/* Mobile: 2-slide carousel, 3 cards per slide */}
          <div className="md:hidden">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {slides.map((slideItems, slideIndex) => (
                  <div key={slideIndex} className="flex-[0_0_100%] min-w-0 flex flex-col gap-3">
                    {slideItems.map((value, index) => (
                      <div
                        key={index}
                        data-testid={`card-value-${slideIndex * 3 + index}`}
                        className="flex gap-3 items-start p-4 rounded-md border border-border bg-background"
                      >
                        {value.icon}
                        <div>
                          <h3 className="font-semibold text-sm mb-0.5">{value.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Ga naar pagina ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    activeSlide === i ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop: 3-column grid */}
          <ScrollReveal>
            <div className="hidden md:grid grid-cols-3 gap-4">
              {values.map((value, index) => (
                <div
                  key={index}
                  data-testid={`card-value-desktop-${index}`}
                  className="flex gap-3 items-start p-4 rounded-md border border-border bg-background"
                >
                  {value.icon}
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
