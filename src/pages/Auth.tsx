import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthContainer from "@/components/auth/AuthContainer";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed, phone_number, onboarding_step')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          return;
        }

        console.log("Profile check in Auth:", profile);
        
        // Only redirect to home if onboarding is completed
        if (profile.onboarding_completed) {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      }
    };

    checkProfile();
  }, [navigate]);

  return <AuthContainer />;
};

export default Auth;