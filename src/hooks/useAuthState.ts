import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type AuthStep = "email" | "phone" | "personality" | "interests" | "photos" | "complete";

export const useAuthState = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>("email");
  const [isLoading, setIsLoading] = useState(true);
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

    if (!profile.phone_number) {
      console.log("No phone number, returning to phone step");
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
        return "photos";
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
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!session?.user) {
          console.log("No session found, setting email step");
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
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw profileError;
        }

        if (mounted) {
          const nextStep = determineStep(profile);
          console.log("Setting next step to:", nextStep);
          setCurrentStep(nextStep);
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
        if (mounted) {
          setError(error instanceof Error ? error.message : "An error occurred");
          setCurrentStep("email");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session ? "with session" : "no session");
      
      if (!mounted) return;
      
      setIsLoading(true);

      if (event === 'SIGNED_OUT') {
        setCurrentStep("email");
        setError(null);
        setIsLoading(false);
        return;
      }
      
      if (event === 'SIGNED_IN' && session) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('phone_number, onboarding_completed, onboarding_step')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          const nextStep = determineStep(profile);
          console.log("Auth change: setting next step to:", nextStep);
          setCurrentStep(nextStep);
        } catch (error) {
          console.error("Error in auth state change:", error);
          setCurrentStep("email");
          setError(error instanceof Error ? error.message : "An error occurred");
        }
      }
      
      setIsLoading(false);
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