import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ClipboardCheck, Leaf } from "lucide-react";

export function HoeHetWerkt() {

  const steps = [
    {
      icon: <Calendar className="w-8 h-8 text-primary" />,
      title: "U plant met ons een afspraak in",
    },
    {
      icon: <ClipboardCheck className="w-8 h-8 text-primary" />,
      title: "Wij komen langs voor de opname",
    },
    {
      icon: <Leaf className="w-8 h-8 text-primary" />,
      title: "U ontvangt uw documenten",
    },
  ];

  return (
    <section className="py-10 md:py-14 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Hoe het werkt
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              In drie eenvoudige stappen naar uw energielabel
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-fr">
          {steps.map((step, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <Card 
                data-testid={`card-step-${index + 1}`}
                className="hover-elevate transition-all duration-300 h-full"
              >
                <CardContent className="p-4 text-center flex flex-col justify-center h-full">
                  <div className="mb-4 flex justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">
                    {step.title}
                  </h3>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
