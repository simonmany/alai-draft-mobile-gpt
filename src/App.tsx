import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Contacts from "./pages/Contacts";
import ChatBubble from "./components/ChatBubble";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/calendar" element={<div>Calendar Coming Soon</div>} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/health" element={<div>Health Coming Soon</div>} />
        </Routes>
      </Layout>
      <ChatBubble />
    </BrowserRouter>
  </TooltipProvider>
);

export default App;