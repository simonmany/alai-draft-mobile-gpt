import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Calendar from "@/pages/Calendar";
import Contacts from "@/pages/Contacts";
import ContactDetails from "@/pages/ContactDetails";
import Goals from "@/pages/Goals";
import Activities from "@/pages/Activities";
import Auth from "@/pages/Auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event);
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-assistant-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-assistant-primary" />
    </div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/" /> : <Auth />} />
        
        {/* Protected routes */}
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/auth" />}>
          <Route index element={<Index />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="contacts/:id" element={<ContactDetails />} />
          <Route path="goals" element={<Goals />} />
          <Route path="activities" element={<Activities />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;