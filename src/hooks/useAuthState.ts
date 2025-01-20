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
        console.log("Checking session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session?.user) {
          console.log("No session found, setting to email step");
          if (mounted) {
            setCurrentStep("email");
            setIsLoading(false);
          }
          return;
        }

        console.log("Session found, checking profile...");
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('phone_number, onboarding_completed, onboarding_step')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        console.log("Profile data:", profile);
        const nextStep = determineStep(profile);
        console.log("Determined next step:", nextStep);
        
        if (mounted) {
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
      console.log("Auth state change:", event);
      
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true);
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('phone_number, onboarding_completed, onboarding_step')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) throw profileError;

          console.log("Profile data on auth change:", profile);
          const nextStep = determineStep(profile);
          console.log("Determined next step on auth change:", nextStep);
          
          if (mounted) {
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
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setCurrentStep("email");
          setError(null);
          setIsLoading(false);
        }
      }
    });

    checkSession();

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