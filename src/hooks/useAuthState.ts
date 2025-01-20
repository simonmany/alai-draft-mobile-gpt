import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type AuthStep = "email" | "phone" | "personality" | "interests" | "photos" | "complete";

export const useAuthState = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>("email");
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const determineStep = (profile: any) => {
    console.log("Determining step from profile:", profile);
    
    if (!profile) {
      console.log("No profile found, returning to email step");
      return "email";
    }

    if (profile.onboarding_completed) {
      console.log("Onboarding completed, returning complete step");
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
        return "photos";
      default:
        return "email";
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        console.log("Initial session check...");
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          console.log("No session found, setting email step");
          if (mounted) {
            setCurrentStep("email");
            setIsLoading(false); // Make sure to set loading to false here
          }
          return;
        }

        console.log("Session found, fetching profile...");
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed, onboarding_step')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;

        if (mounted) {
          const nextStep = determineStep(profile);
          console.log("Setting next step to:", nextStep);
          setCurrentStep(nextStep);
          setIsLoading(false); // Make sure to set loading to false after setting the step
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
        if (mounted) {
          setError(error instanceof Error ? error.message : "An error occurred");
          setCurrentStep("email");
          setIsLoading(false); // Make sure to set loading to false in case of error
        }
      }
    };

    checkSession(); // Run the initial check

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session ? "with session" : "no session");
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setCurrentStep("email");
        setError(null);
        setIsLoading(false);
        return;
      }
      
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true); // Set loading true when signed in
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed, onboarding_step')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          const nextStep = determineStep(profile);
          console.log("Auth change: setting next step to:", nextStep);
          if (mounted) {
            setCurrentStep(nextStep);
            setIsLoading(false); // Set loading false after updating step
          }
        } catch (error) {
          console.error("Error in auth state change:", error);
          if (mounted) {
            setCurrentStep("email");
            setError(error instanceof Error ? error.message : "An error occurred");
            setIsLoading(false); // Set loading false in case of error
          }
        }
      }
    });

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