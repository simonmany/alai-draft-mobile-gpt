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

  const handleInvalidSession = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      toast({
        title: "Session Expired",
        description: "Please sign in again.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error during sign out:", error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    // Check initial auth state
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Profile verification failed:", profileError);
          await handleInvalidSession();
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error verifying profile:", error);
        await handleInvalidSession();
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, updating state');
        setIsAuthenticated(false);
        return;
      }

      if (event === 'SIGNED_IN' && session) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Profile verification failed:", profileError);
            await handleInvalidSession();
            return;
          }

          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error verifying profile:", error);
          await handleInvalidSession();
        }
        return;
      }

      // For token/session related errors, sign out the user
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.log('Token refresh failed, signing out');
        await handleInvalidSession();
        return;
      }

      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-assistant-background" />;
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