import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type AuthStep = "login" | "email" | "phone" | "personality" | "complete";

export const useAuthState = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>("login");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('phone_number, onboarding_completed')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          console.log("Profile state:", profile);

          if (!profile?.phone_number) {
            setCurrentStep("phone");
          } else if (!profile?.onboarding_completed) {
            setCurrentStep("personality");
          } else {
            setCurrentStep("complete");
          }
        } else {
          setCurrentStep("login");
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
        const { data: profile } = await supabase
          .from('profiles')
          .select('phone_number, onboarding_completed')
          .eq('id', session.user.id)
          .single();

        console.log("Profile after sign in:", profile);

        if (!profile?.phone_number) {
          setCurrentStep("phone");
        } else if (!profile?.onboarding_completed) {
          setCurrentStep("personality");
        } else {
          setCurrentStep("complete");
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentStep("login");
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