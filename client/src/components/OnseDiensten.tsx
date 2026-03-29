import { ScrollReveal } from "@/components/ScrollReveal";
import { Zap, Calculator, Ruler, FileText, Camera, Presentation, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const diensten = [
  {
    icon: Zap,
    title: "Energielabels",
    description: "Energielabels voor woningen en utiliteitsgebouwen",
    href: "/energielabels",
  },
  {
    icon: Calculator,
    title: "WWS puntentelling",
    description: "Inzicht in huurpunten en maximale huurprijs",
    href: "/wws-puntentelling/",
  },
  {
    icon: Ruler,
    title: "NEN 2580 meting",
    description: "Professionele inmeting volgens de NEN 2580 norm",
    href: "/nen-2580-metingen/",
  },
  {
    icon: FileText,
    title: "Adviesrapporten",
    description: "Gericht advies op basis van jouw situatie en wensen",
  },
  {
    icon: Camera,
    title: "Woningfotografie",
    description: "Fotografie, video en 360°-beelden",
  },
  {
    icon: Presentation,
    title: "Woningpresentatie",
    description: "Ondersteuning bij styling en online presentatie",
  },
];

export function OnseDiensten() {
  return (
    <section className="py-10 md:py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">Onze diensten</h2>
            <p className="text-muted-foreground">
              Alles onder één dak, van energielabel tot woningpresentatie
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {diensten.map((dienst, index) => {
            const Icon = dienst.icon;
            const cardContent = (
              <div
                data-testid={`card-dienst-${index}`}
                className="group flex flex-col gap-4 rounded-lg border border-border bg-background p-5 md:p-7 h-full cursor-pointer hover-elevate transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-lg leading-snug mb-1">
                    {dienst.title}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground leading-snug">
                    {dienst.description}
                  </p>
                </div>
              </div>
            );
            return (
              <ScrollReveal key={index} delay={index * 40}>
                {"href" in dienst && dienst.href ? (
                  <Link href={dienst.href} className="block h-full">
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
