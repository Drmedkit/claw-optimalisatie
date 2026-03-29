import { Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="max-w-md text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Pagina niet gevonden
          </h2>
          <p className="text-muted-foreground mb-8">
            De pagina die u zoekt bestaat niet of is verplaatst.
          </p>
          <Link href="/">
            <Button
              data-testid="button-home"
              className="bg-primary text-primary-foreground hover-elevate active-elevate-2"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Terug naar home
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
