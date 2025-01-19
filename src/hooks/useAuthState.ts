import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type AuthStep = "email" | "phone" | "personality" | "interests" | "complete";

export const useAuthState = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>("email");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("User session found:", session.user.id);
          
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('phone_number, onboarding_completed, onboarding_step')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Profile fetch error:", profileError);
            throw profileError;
          }

          console.log("Profile data:", profile);

          if (profile.onboarding_completed) {
            setCurrentStep("complete");
          } else {
            // Determine step based on profile data
            if (!profile.phone_number) {
              setCurrentStep("phone");
            } else {
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
                case 4:
                  setCurrentStep("complete");
                  break;
                default:
                  setCurrentStep("phone");
              }
            }
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('phone_number, onboarding_completed, onboarding_step')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Profile fetch error:", profileError);
            return;
          }

          console.log("Profile data on auth change:", profile);

          if (profile.onboarding_completed) {
            setCurrentStep("complete");
          } else {
            if (!profile.phone_number) {
              setCurrentStep("phone");
            } else {
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
                case 4:
                  setCurrentStep("complete");
                  break;
                default:
                  setCurrentStep("phone");
              }
            }
          }
        } catch (error) {
          console.error("Error handling auth state change:", error);
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentStep("email");
        setError(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return {
    currentStep,
    setCurrentStep,
    isLoading,
    error,
    setError
  };
};