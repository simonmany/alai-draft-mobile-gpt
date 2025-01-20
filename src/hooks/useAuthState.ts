import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type AuthStep = "email" | "phone" | "personality" | "interests" | "complete";

export const useAuthState = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const determineStep = (profile: any) => {
    if (!profile) return "email";
    
    if (profile.onboarding_completed) {
      return "complete";
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
        console.log("Checking session...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No session found");
          if (mounted) {
            setCurrentStep("email");
            setIsLoading(false);
          }
          return;
        }

        console.log("Session found, fetching profile...");
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('phone_number, onboarding_completed, onboarding_step')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (mounted) {
          console.log("Profile found:", profile);
          const nextStep = determineStep(profile);
          console.log("Next step determined:", nextStep);
          setCurrentStep(nextStep);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
        if (mounted) {
          setCurrentStep("email");
          setError(error instanceof Error ? error.message : "An error occurred");
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event);
      
      if (event === 'SIGNED_IN' && session) {
        if (mounted) {
          setIsLoading(true);
          await checkSession();
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setCurrentStep("email");
          setError(null);
          setIsLoading(false);
        }
      }
    });

    // Only check session if not on email step
    if (currentStep === "email") {
      setIsLoading(false);
    } else {
      setIsLoading(true);
      checkSession();
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    currentStep,
    setCurrentStep,
    isLoading,
    setIsLoading,  // Added this line to expose setIsLoading
    error,
    setError
  };
};