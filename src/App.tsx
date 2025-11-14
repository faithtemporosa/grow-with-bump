import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreatorPartnerships from "./pages/CreatorPartnerships";
import BrandCampaigns from "./pages/BrandCampaigns";
import AutomationsSupport from "./pages/AutomationsSupport";
import GrowthStrategy from "./pages/GrowthStrategy";
import GetStarted from "./pages/GetStarted";
import AutomationsCatalog from "./pages/AutomationsCatalog";
import AutomationDetail from "./pages/AutomationDetail";
import BuildMyStack from "./pages/BuildMyStack";
import Cart from "./pages/Cart";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/creator-partnerships" element={<CreatorPartnerships />} />
          <Route path="/brand-campaigns" element={<BrandCampaigns />} />
          <Route path="/automations-support" element={<AutomationsSupport />} />
          <Route path="/growth-strategy" element={<GrowthStrategy />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/catalog" element={<AutomationsCatalog />} />
          <Route path="/automation/:id" element={<AutomationDetail />} />
          <Route path="/build-my-stack" element={<BuildMyStack />} />
          <Route path="/cart" element={<Cart />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
