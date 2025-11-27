import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import NGODashboard from "./pages/NGODashboard";
import AcceptedDonations from "./pages/AcceptedDonations";
import NotFound from "./pages/NotFound";
import HowItWorks from "./pages/HowItWorks";
import Donors from "./pages/Donors";
import Recipients from "./pages/Recipients";
import ContactUs from "./pages/ContactUs";
import Volunteers from "./pages/Volunteers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/restaurant" element={<RestaurantDashboard />} />
          <Route path="/ngo" element={<NGODashboard />} />
          <Route path="/accepted-donations" element={<AcceptedDonations />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/recipients" element={<Recipients />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
