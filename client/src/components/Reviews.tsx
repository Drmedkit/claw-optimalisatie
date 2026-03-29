import { useRef } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
}

export function Reviews() {
  const reviews: Review[] = [
    {
      name: "Emma van der Berg",
      rating: 5,
      text: "Zeer professionele service! De adviseur was op tijd, vriendelijk en heeft alles goed uitgelegd. Het energielabel was binnen 3 dagen geleverd.",
      date: "2 weken geleden",
    },
    {
      name: "Thomas de Vries",
      rating: 5,
      text: "Perfect geregeld. Voor de verkoop van mijn appartement had ik snel een energielabel nodig. Label & Lens heeft dit keurig en snel afgehandeld. Aanrader!",
      date: "1 maand geleden",
    },
    {
      name: "Sophie Janssen",
      rating: 5,
      text: "Ik heb zowel het energielabel als fotografie laten doen voor mijn woning. Beide services waren uitstekend. De foto's maakten mijn woning echt aantrekkelijk!",
      date: "3 weken geleden",
    },
    {
      name: "Mark Hendriks",
      rating: 5,
      text: "Goede prijs-kwaliteit verhouding en deskundig advies over mogelijke verbeteringen aan mijn woning. Ik weet nu precies wat ik moet doen om mijn label te verbeteren.",
      date: "1 week geleden",
    },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    skipSnaps: false,
  });

  const canScrollPrev = useRef(false);
  const canScrollNext = useRef(false);

  const updateScrollButtons = () => {
    if (!emblaApi) return;
    canScrollPrev.current = emblaApi.canScrollPrev();
    canScrollNext.current = emblaApi.canScrollNext();
  };

  emblaApi?.on("select", updateScrollButtons);
  emblaApi?.on("init", updateScrollButtons);
  emblaApi?.on("reInit", updateScrollButtons);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating
                ? "fill-primary text-primary"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-12 md:py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Wat klanten zeggen
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tevreden klanten in Amsterdam en omgeving
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {reviews.map((review, index) => (
                <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0">
                  <ScrollReveal delay={index * 100}>
                    <Card 
                      data-testid={`card-review-${index}`}
                      className="hover-elevate transition-all duration-300 h-full"
                    >
                      <CardContent className="p-6">
                        {renderStars(review.rating)}
                        <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                          "{review.text}"
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-border gap-2">
                          <div>
                            <p className="font-semibold text-sm">{review.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">{review.date}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              disabled={!canScrollPrev.current}
              data-testid="button-reviews-prev"
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              disabled={!canScrollNext.current}
              data-testid="button-reviews-next"
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
