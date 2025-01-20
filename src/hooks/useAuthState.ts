import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type AuthStep = "email" | "phone" | "personality" | "interests" | "complete";

export const useAuthState = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>("email");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const determineStep = (profile: any) => {
    if (profile.onboarding_completed) {
      return "complete";
    }

    // If phone number is not set, user needs to complete that step
    if (!profile.phone_number) {
      return "phone";
    }

    // Otherwise, use the onboarding step to determine the current step
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
            await supabase.auth.signOut();
            setCurrentStep("email");
            setIsLoading(false);
            return;
          }

          console.log("Profile data:", profile);
          const nextStep = determineStep(profile);
          console.log("Determined next step:", nextStep);
          setCurrentStep(nextStep);
        }
      } catch (error) {
        console.error("Session check error:", error);
        await supabase.auth.signOut();
        setCurrentStep("email");
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
            await supabase.auth.signOut();
            setCurrentStep("email");
            return;
          }

          console.log("Profile data on auth change:", profile);
          const nextStep = determineStep(profile);
          console.log("Determined next step on auth change:", nextStep);
          setCurrentStep(nextStep);
        } catch (error) {
          console.error("Error handling auth state change:", error);
          await supabase.auth.signOut();
          setCurrentStep("email");
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
