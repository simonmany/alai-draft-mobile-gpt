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
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          setOnboardingCompleted(null);
          return;
        }

        console.log("Initial session check:", session ? "Authenticated" : "Not authenticated");
        setIsAuthenticated(!!session);

        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Profile fetch error:", profileError);
            setOnboardingCompleted(null);
            return;
          }

          setOnboardingCompleted(profile.onboarding_completed);
        }
      } catch (error) {
        console.error("Session check error:", error);
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setOnboardingCompleted(null);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session ? "Authenticated" : "Not authenticated");
      
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.log("Token refresh failed, signing out");
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setOnboardingCompleted(null);
        return;
      }

      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setOnboardingCompleted(null);
        return;
      }

      setIsAuthenticated(!!session);

      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          setOnboardingCompleted(null);
          return;
        }

        setOnboardingCompleted(profile.onboarding_completed);
      }
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
        <Route 
          path="/auth" 
          element={
            isAuthenticated && onboardingCompleted 
              ? <Navigate to="/" /> 
              : <Auth />
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            !isAuthenticated 
              ? <Navigate to="/auth" />
              : !onboardingCompleted
                ? <Navigate to="/auth" />
                : <Layout />
          }
        >
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