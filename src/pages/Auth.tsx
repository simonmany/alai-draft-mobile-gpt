import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthContainer from "@/components/auth/AuthContainer";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Auth page: Checking profile...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error in Auth:", sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log("No session found in Auth page");
          return;
        }

        console.log("Session found, fetching profile...");
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed, phone_number, onboarding_step')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw profileError;
        }

        console.log("Profile check in Auth:", profile);
        
        if (profile.onboarding_completed) {
          console.log("Onboarding completed, navigating to home");
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error("Error checking profile:", error);
        await supabase.auth.signOut();
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change in Auth page:", event);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed, phone_number, onboarding_step')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (profile.onboarding_completed) {
            navigate('/', { replace: true });
          }
        } catch (error) {
          console.error("Error in auth state change:", error);
          await supabase.auth.signOut();
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return <AuthContainer />;
};

export default Auth;