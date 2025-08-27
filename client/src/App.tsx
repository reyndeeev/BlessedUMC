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
import Users from "@/pages/users";
import Analytics from "@/pages/analytics";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/umyf" component={UMYF} />
      <Route path="/myaf" component={MYAF} />
      <Route path="/about" component={AboutPage} />
      <Route path="/ministries" component={MinistriesPage} />
      <Route path="/login" component={Login} />
      <Route path="/bumcdashboard">
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      </Route>
      <Route path="/bumcdashboard/messages">
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      </Route>
      <Route path="/bumcdashboard/users">
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      </Route>
      <Route path="/bumcdashboard/analytics">
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      </Route>
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