import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("@/pages/Home"));
const Energielabel = lazy(() => import("@/pages/Energielabel"));
const Energielabels = lazy(() => import("@/pages/Energielabels"));
const EnergielabelAmsterdam = lazy(() => import("@/pages/EnergielabelAmsterdam"));
const Fotografie = lazy(() => import("@/pages/Fotografie"));
const WwsPuntentelling = lazy(() => import("@/pages/WwsPuntentelling"));
const Nen2580Metingen = lazy(() => import("@/pages/Nen2580Metingen"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Laden...</div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/energielabel" component={Energielabel} />
        <Route path="/energielabels" component={Energielabels} />
        <Route path="/energielabel-aanvragen-amsterdam/" component={EnergielabelAmsterdam} />
        <Route path="/fotografie" component={Fotografie} />
        <Route path="/wws-puntentelling/" component={WwsPuntentelling} />
        <Route path="/nen-2580-metingen/" component={Nen2580Metingen} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
