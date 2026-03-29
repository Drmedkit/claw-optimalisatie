import { useState, useCallback } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useEmblaCarousel from "embla-carousel-react";

const faqs = [
  {
    question: "Wat is een energielabel?",
    answer:
      "Een energielabel is een officieel document dat de energieprestatie van een woning aangeeft. Het label loopt van A++++ (zeer zuinig) tot G (zeer onzuinig). Het is verplicht bij verkoop of verhuur van een woning.",
  },
  {
    question: "Hoe lang is een energielabel geldig?",
    answer:
      "Een energielabel is 10 jaar geldig, tenzij er ingrijpende verbouwingen aan de woning zijn gedaan die de energieprestatie beïnvloeden. In dat geval moet er een nieuw label worden aangevraagd.",
  },
  {
    question: "Wat is een NEN 2580 meting?",
    answer:
      "Een NEN 2580 meting is een officiële oppervlakte meting van een woning volgens een vastgestelde norm. Deze meting is belangrijk voor de verkoop van een woning en geeft inzicht in de gebruiksoppervlakte, bruto vloeroppervlakte en inhoud.",
  },
  {
    question: "Wat is een WWS puntentelling?",
    answer:
      "De WWS puntentelling (Woningwaarderingsstelsel) wordt gebruikt om de maximale huurprijs van een sociale huurwoning te bepalen. Aan verschillende aspecten van de woning worden punten toegekend, zoals oppervlakte, voorzieningen en isolatie.",
  },
  {
    question: "Hoe lang duurt het voordat ik mijn energielabel ontvang?",
    answer:
      "Na de opname ter plaatse ontvangt u binnen 5 werkdagen uw officiële energielabel. Bij spoedservice kunnen we dit verkorten tot 2 werkdagen.",
  },
  {
    question: "Moet ik zelf aanwezig zijn bij de opname?",
    answer:
      "Ja, bij voorkeur wel. De adviseur moet toegang hebben tot alle ruimtes in de woning om een correcte meting te kunnen uitvoeren. U kunt ook iemand anders machtigen om aanwezig te zijn.",
  },
  {
    question: "Wat zijn de kosten voor een energielabel?",
    answer:
      "De kosten voor een energielabel zijn afhankelijk van de grootte van de woning en of het een koop- of huurwoning betreft. Gebruik onze prijscalculator om een exacte prijs te berekenen voor uw situatie.",
  },
  {
    question: "Kan ik het energielabel gebruiken voor subsidieaanvragen?",
    answer:
      "Ja, een officieel energielabel kan vaak gebruikt worden als onderbouwing bij subsidieaanvragen voor verduurzaming van uw woning. Check wel altijd de specifieke eisen van de subsidieregeling.",
  },
  {
    question: "Wat gebeurt er tijdens de opname?",
    answer:
      "Tijdens de opname meet onze adviseur de woning op, bekijkt de isolatie, verwarming, ventilatie en andere energiegerelateerde aspecten. Dit duurt gemiddeld 1 tot 1,5 uur, afhankelijk van de grootte van de woning.",
  },
  {
    question: "Kan ik mijn energielabel verbeteren?",
    answer:
      "Ja, door verduurzaming maatregelen zoals betere isolatie, zonnepanelen of een efficiënter verwarmingssysteem kunt u uw energielabel verbeteren. Wij kunnen u adviseren welke maatregelen het meeste effect hebben.",
  },
];

const leftFaqs = faqs.slice(0, 5);
const rightFaqs = faqs.slice(5, 10);

function FaqColumn({ items, offset = 0 }: { items: typeof faqs; offset?: number }) {
  return (
    <Accordion type="single" collapsible className="space-y-3">
      {items.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`item-${offset + index}`}
          data-testid={`faq-item-${offset + index}`}
          className="border-2 border-card-border rounded-lg px-5 hover-elevate transition-all duration-300"
        >
          <AccordionTrigger
            data-testid={`faq-trigger-${offset + index}`}
            className="text-left font-semibold hover:no-underline text-sm"
          >
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed pt-1 text-sm">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function FAQContent() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false });
  const [activeSlide, setActiveSlide] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  emblaApi?.on("select", onSelect);

  const slides = [leftFaqs, rightFaqs];

  return (
    <section className="py-8 md:py-12 px-4" id="faq">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Veelgestelde Vragen
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Vind antwoorden op de meest gestelde vragen. Niet het juiste antwoord gevonden?{" "}
              <a href="#contact" className="text-primary hover:underline">
                Neem contact op
              </a>
            </p>
          </div>
        </ScrollReveal>

        {/* Desktop: 2 kolommen */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-6">
          <ScrollReveal>
            <FaqColumn items={leftFaqs} offset={0} />
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <FaqColumn items={rightFaqs} offset={5} />
          </ScrollReveal>
        </div>

        {/* Mobiel: Embla carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slides.map((slideItems, slideIndex) => (
                <div
                  key={slideIndex}
                  className="flex-none w-full px-1"
                >
                  <FaqColumn items={slideItems} offset={slideIndex * 5} />
                </div>
              ))}
            </div>
          </div>
          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeSlide === i ? "bg-primary w-4" : "bg-muted-foreground/30"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
