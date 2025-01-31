import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PhoneSignupStep from "./PhoneSignupStep";
import PersonalityAssessment from "../onboarding/personality/PersonalityAssessment";
import InterestsSelection from "../onboarding/InterestsSelection";
import { useAuthState } from "@/hooks/useAuthState";
import AuthUI from "./AuthUI";
import type { Json } from "@/integrations/supabase/types";
import { useEffect } from "react";

const AuthContainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentStep, setCurrentStep, error, setError } = useAuthState();

  console.log("AuthContainer rendering - Current Step:", currentStep);

  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking session...");
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          return;
        }

        console.log("Session check result:", session);
        
        if (session?.user) {
          console.log("User found in session:", session.user.id);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed, onboarding_step')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Profile fetch error:", profileError);
            setError(profileError.message);
            return;
          }

          console.log("Profile data:", profile);

          if (profile?.onboarding_completed) {
            console.log("Onboarding completed, navigating to home");
            navigate("/", { replace: true });
          } else if (profile?.onboarding_step) {
            console.log("Setting step based on onboarding_step:", profile.onboarding_step);
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
            console.log("No onboarding step found, setting to phone");
            setCurrentStep("phone");
          }
        } else {
          console.log("No session found, staying on auth page");
          setCurrentStep("email");
        }
      } catch (error) {
        console.error("Unexpected error in checkSession:", error);
        setError(error instanceof Error ? error.message : "An unexpected error occurred");
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("Signed in, checking session...");
        await checkSession();
      } else if (event === 'SIGNED_OUT') {
        console.log("Signed out, resetting to email step");
        setCurrentStep("email");
        setError(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, setCurrentStep, setError, toast]);

  // Handle completion
  useEffect(() => {
    if (currentStep === "complete") {
      console.log("Onboarding complete, navigating to home");
      navigate("/", { replace: true });
    }
  }, [currentStep, navigate]);

  return (
    <div className="min-h-screen bg-assistant-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {currentStep === "email" && (
          <AuthUI error={error} />
        )}

        {currentStep === "phone" && (
          <PhoneSignupStep 
            onSubmit={async (values) => {
              try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) throw new Error("No user found");

                const { error: updateError } = await supabase
                  .from('profiles')
                  .update({ 
                    phone_number: values.phone,
                    onboarding_step: 2
                  })
                  .eq('id', session.user.id);

                if (updateError) throw updateError;

                setCurrentStep("personality");
                
                toast({
                  title: "Success",
                  description: "Phone number updated successfully",
                });
              } catch (error) {
                console.error('Error in phone signup:', error);
                const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
                setError(errorMessage);
                toast({
                  title: "Error",
                  description: errorMessage,
                  variant: "destructive",
                });
              }
            }}
          />
        )}

        {currentStep === "personality" && (
          <PersonalityAssessment 
            onComplete={async (personalityData) => {
              try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) throw new Error("No user found");

                const personalityJson: { [key: string]: Json } = {
                  social_energy: personalityData.social_energy,
                  social_energy_notes: personalityData.social_energy_notes,
                  social_style: personalityData.social_style,
                  social_style_notes: personalityData.social_style_notes,
                  planning_style: personalityData.planning_style,
                  planning_style_notes: personalityData.planning_style_notes
                };

                const { error: assessmentError } = await supabase
                  .from('personality_assessment')
                  .insert([{
                    user_id: session.user.id,
                    ...personalityData
                  }]);

                if (assessmentError) throw assessmentError;

                const { error: profileError } = await supabase
                  .from('profiles')
                  .update({ 
                    personality_traits: personalityJson,
                    onboarding_step: 3
                  })
                  .eq('id', session.user.id);

                if (profileError) throw profileError;

                setCurrentStep("interests");
              } catch (error) {
                console.error('Error completing personality assessment:', error);
                const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
                setError(errorMessage);
                toast({
                  title: "Error",
                  description: errorMessage,
                  variant: "destructive",
                });
              }
            }}
          />
        )}

        {currentStep === "interests" && (
          <InterestsSelection 
            onComplete={async () => {
              try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) throw new Error("No user found");

                const { error: profileError } = await supabase
                  .from('profiles')
                  .update({ 
                    onboarding_completed: true,
                    onboarding_step: 4
                  })
                  .eq('id', session.user.id);

                if (profileError) throw profileError;

                setCurrentStep("complete");
              } catch (error) {
                console.error('Error completing interests:', error);
                const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
                setError(errorMessage);
                toast({
                  title: "Error",
                  description: errorMessage,
                  variant: "destructive",
                });
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AuthContainer;