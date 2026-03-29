import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import pauloPortrait from "@assets/image_1774346625268.webp";

export function TeamContent() {
  return (
    <section className="py-8 md:py-12 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Ontmoet de oprichter
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              De persoon achter Label & Lens
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <Card data-testid="card-team-paulo" className="hover-elevate transition-all duration-300 max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                {/* Linkerkolom: afbeelding */}
                <div className="relative overflow-hidden rounded-lg min-h-[280px]">
                  <img
                    src={pauloPortrait}
                    alt="Paulo - Oprichter Label & Lens"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                </div>
                {/* Rechterkolom: naam + functietitel + tekst */}
                <div className="flex flex-col">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-1">Paulo</h3>
                  <p className="text-primary font-medium mb-4">Oprichter en EP-adviseur</p>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Als oprichter van Label & Lens bewaak ik de visie, kwaliteit en groei van het bedrijf.
                    </p>
                    <p>
                      Met mijn achtergrond als gecertificeerd EP-adviseur en passie voor vastgoed combineer ik technische kennis over energieprestaties met inzicht in de vastgoedmarkt en een persoonlijke aanpak.
                    </p>
                    <p>
                      In een markt waar snelheid en kwaliteit essentieel zijn, streef ik ernaar om beide te leveren, zorgvuldig, betrouwbaar en binnen enkele werkdagen.
                    </p>
                    <p>
                      Mijn doel is helder: één bedrijf dat alles biedt, van woonwaardering tot presentatie.
                    </p>
                    <p className="font-semibold text-foreground md:whitespace-nowrap">
                      Eén bedrijf, één aanspreekpunt, één oplossing.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}
