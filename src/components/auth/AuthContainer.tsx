import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PhoneSignupStep from "./PhoneSignupStep";
import PersonalityAssessment from "../onboarding/personality/PersonalityAssessment";
import InterestsSelection from "../onboarding/InterestsSelection";
import PhotosAccessScreen from "../onboarding/PhotosAccessScreen";
import { useAuthState } from "@/hooks/useAuthState";
import AuthUI from "./AuthUI";
import type { Json } from "@/integrations/supabase/types";

const AuthContainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentStep, setCurrentStep, isLoading, error, setError } = useAuthState();

  console.log("AuthContainer rendering - Current Step:", currentStep, "Loading:", isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-assistant-background flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-assistant-primary mb-4" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (currentStep === "complete") {
    console.log("Onboarding complete, navigating to home");
    navigate("/", { replace: true });
    return null;
  }

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
                    onboarding_step: 4
                  })
                  .eq('id', session.user.id);

                if (profileError) throw profileError;

                setCurrentStep("photos");
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

        {currentStep === "photos" && (
          <PhotosAccessScreen 
            onComplete={async () => {
              try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) throw new Error("No user found");

                const { error: profileError } = await supabase
                  .from('profiles')
                  .update({ 
                    onboarding_completed: true
                  })
                  .eq('id', session.user.id);

                if (profileError) throw profileError;

                setCurrentStep("complete");
              } catch (error) {
                console.error('Error completing photos step:', error);
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