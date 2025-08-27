import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import UMYF from "@/pages/umyf";
import MYAF from "@/pages/myaf";
import AboutPage from "@/pages/about";
import MinistriesPage from "@/pages/ministries";
import Admin from "@/pages/admin";
import Messages from "@/pages/messages";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/umyf" component={UMYF} />
      <Route path="/myaf" component={MYAF} />
      <Route path="/about" component={AboutPage} />
      <Route path="/ministries" component={MinistriesPage} />
      <Route path="/bumcdashboard" component={Admin} />
      <Route path="/bumcdashboard/messages" component={Messages} />
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