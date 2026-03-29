import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Energielabel from "@/pages/Energielabel";
import Fotografie from "@/pages/Fotografie";
import NotFound from "@/pages/not-found";
import EnergielabelAmsterdam from "@/pages/EnergielabelAmsterdam";
import Energielabels from "@/pages/Energielabels";
import WwsPuntentelling from "@/pages/WwsPuntentelling";
import Nen2580Metingen from "@/pages/Nen2580Metingen";

function Router() {
  return (
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
