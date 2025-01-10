import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/calendar" element={<div>Calendar Coming Soon</div>} />
          <Route path="/contacts" element={<div>Contacts Coming Soon</div>} />
          <Route path="/health" element={<div>Health Coming Soon</div>} />
          <Route path="/chat" element={<div>Chat Coming Soon</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;