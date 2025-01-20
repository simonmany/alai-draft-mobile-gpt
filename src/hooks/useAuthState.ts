import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AuthStep = "email" | "phone" | "personality" | "interests" | "complete";

export const useAuthState = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>("email");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Initial session check:", session);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed, onboarding_step')
          .eq('id', session.user.id)
          .single();

        console.log("Profile data:", profile);

        if (profile?.onboarding_completed) {
          setCurrentStep("complete");
        } else if (profile?.onboarding_step) {
          switch (profile.onboarding_step) {
            case 1:
              setCurrentStep("phone");
              break;
            case 2:
              setCurrentStep("personality");
              break;
            case 3:
              setCurrentStep("interests");
              break;
            default:
              setCurrentStep("phone");
          }
        } else {
          setCurrentStep("phone");
        }
      }
    };

    checkInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event);
      console.log("Session:", session);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed, onboarding_step')
          .eq('id', session.user.id)
          .single();

        console.log("Profile data after sign in:", profile);

        if (profile?.onboarding_completed) {
          setCurrentStep("complete");
        } else if (profile?.onboarding_step) {
          switch (profile.onboarding_step) {
            case 1:
              setCurrentStep("phone");
              break;
            case 2:
              setCurrentStep("personality");
              break;
            case 3:
              setCurrentStep("interests");
              break;
            default:
              setCurrentStep("phone");
          }
        } else {
          setCurrentStep("phone");
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentStep("email");
        setError(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    currentStep,
    setCurrentStep,
    error,
    setError
  };
};