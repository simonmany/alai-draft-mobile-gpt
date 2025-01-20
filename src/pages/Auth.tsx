import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthContainer from "@/components/auth/AuthContainer";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error in Auth:", sessionError);
          await supabase.auth.signOut();
          return;
        }

        if (!session) return;

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed, phone_number, onboarding_step')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          await supabase.auth.signOut();
          toast({
            title: "Error",
            description: "Failed to fetch user profile. Please try again.",
            variant: "destructive",
          });
          return;
        }

        console.log("Profile check in Auth:", profile);
        
        // Only redirect to home if onboarding is completed
        if (profile.onboarding_completed) {
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

    checkProfile();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      
      if (event === 'SIGNED_IN' && session) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed, phone_number, onboarding_step')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error on auth change:", profileError);
          await supabase.auth.signOut();
          toast({
            title: "Error",
            description: "Failed to fetch user profile. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Only redirect to home if onboarding is completed
        if (profile.onboarding_completed) {
          navigate('/', { replace: true });
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