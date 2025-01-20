import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type AuthStep = "email" | "phone" | "personality" | "interests" | "complete";

export const useAuthState = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>("email");
  const [isLoading, setIsLoading] = useState(false); // Changed to false initially
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const determineStep = (profile: any) => {
    if (!profile) return "email";
    
    if (profile.onboarding_completed) {
      return "complete";
    }

    if (!profile.phone_number) {
      return "phone";
    }

    switch (profile.onboarding_step) {
      case 1:
        return "phone";
      case 2:
        return "personality";
      case 3:
        return "interests";
      case 4:
        return "complete";
      default:
        return "phone";
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          if (mounted) {
            setCurrentStep("email");
            setIsLoading(false);
          }
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('phone_number, onboarding_completed, onboarding_step')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (mounted) {
          const nextStep = determineStep(profile);
          setCurrentStep(nextStep);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (mounted) {
          setCurrentStep("email");
          setError(error instanceof Error ? error.message : "An error occurred");
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        if (mounted) {
          setIsLoading(true);
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('phone_number, onboarding_completed, onboarding_step')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profileError) throw profileError;

            if (mounted) {
              const nextStep = determineStep(profile);
              setCurrentStep(nextStep);
              setIsLoading(false);
            }
          } catch (error) {
            console.error("Error handling auth state change:", error);
            if (mounted) {
              setCurrentStep("email");
              setError(error instanceof Error ? error.message : "An error occurred");
              setIsLoading(false);
            }
          }
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setCurrentStep("email");
          setError(null);
          setIsLoading(false);
        }
      }
    });

    // Only check session if we're not already on the email step
    if (currentStep !== "email") {
      checkSession();
    } else {
      setIsLoading(false);
    }

    return () => {
      mounted = false;
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