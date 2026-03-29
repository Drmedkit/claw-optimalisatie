import { ScrollReveal } from "@/components/ScrollReveal";
import { ShieldCheck, Check } from "lucide-react";

export function CertificationsContent() {
  const certifications = [
    "BRL9500 gecertificeerd",
    "EPA-W software licentie",
    "Verzekerd voor beroepsaansprakelijkheid",
  ];

  return (
    <section className="py-10 md:py-14 px-4 bg-muted/30">
      <ScrollReveal>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Tekst links */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-7 h-7 text-primary flex-shrink-0" />
                <h2 className="text-2xl md:text-3xl font-semibold">Certificeringen</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Volledig gecertificeerd volgens de BRL9500 norm. Energielabels worden officieel erkend en voldoen aan alle wettelijke eisen.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Door regelmatige bijscholing werk ik altijd volgens de meest actuele richtlijnen.
              </p>
            </div>

            {/* Certificeringen rechts */}
            <div className="flex flex-col gap-3">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-background border border-border rounded-lg px-5 py-4"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
