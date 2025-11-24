import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SeedAutomations from "./pages/SeedAutomations";
import CreatorPartnerships from "./pages/CreatorPartnerships";
import BrandCampaigns from "./pages/BrandCampaigns";
import AutomationsSupport from "./pages/AutomationsSupport";
import GrowthStrategy from "./pages/GrowthStrategy";
import GetStarted from "./pages/GetStarted";
import AutomationsCatalog from "./pages/AutomationsCatalog";
import AutomationDetail from "./pages/AutomationDetail";
import BuildMyStack from "./pages/BuildMyStack";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Wishlist from "./pages/Wishlist";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalog" element={<AutomationsCatalog />} />
            <Route path="/automation/:id" element={<AutomationDetail />} />
            <Route path="/build-my-stack" element={<BuildMyStack />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/seed-automations" element={<SeedAutomations />} />
            <Route path="/creator-partnerships" element={<CreatorPartnerships />} />
            <Route path="/brand-campaigns" element={<BrandCampaigns />} />
            <Route path="/automations-support" element={<AutomationsSupport />} />
            <Route path="/growth-strategy" element={<GrowthStrategy />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
