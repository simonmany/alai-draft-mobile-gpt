import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getAuthErrorMessage } from "@/utils/authErrors";
import AuthUI from "./AuthUI";
import EmailSignupStep from "./EmailSignupStep";
import PhoneSignupStep from "./PhoneSignupStep";
import PersonalityAssessment from "../onboarding/personality/PersonalityAssessment";
import { useAuthState } from "@/hooks/useAuthState";

const AuthContainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentStep, setCurrentStep, isLoading, error, setError } = useAuthState();

  if (isLoading) {
    return null;
  }

  if (currentStep === "complete") {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-assistant-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {currentStep === "login" && (
          <AuthUI error={error} onNewUser={() => setCurrentStep("email")} />
        )}
        {currentStep === "email" && (
          <EmailSignupStep 
            onSubmit={async (values) => {
              try {
                const randomPassword =
                  Math.random().toString(36).slice(-12) +
                  Math.random().toString(36).toUpperCase().slice(-4) +
                  "!2";

                const { error: signUpError } = await supabase.auth.signUp({
                  email: values.email,
                  password: randomPassword,
                  options: {
                    emailRedirectTo: `${window.location.origin}/auth`,
                  },
                });

                if (signUpError) throw signUpError;

                toast({
                  title: "Success",
                  description: "Please check your email to verify your account",
                });
              } catch (error) {
                console.error("Error in email signup:", error);
                const errorMessage =
                  error instanceof AuthError
                    ? getAuthErrorMessage(error)
                    : "An unexpected error occurred";
                setError(errorMessage);
                toast({
                  title: "Error",
                  description: errorMessage,
                  variant: "destructive",
                });
              }
            }}
            isSubmitting={isLoading}
            error={error}
          />
        )}
        {currentStep === "phone" && (
          <PhoneSignupStep 
            onSubmit={async (values) => {
              try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (!session?.user) {
                  throw new Error("Please complete email signup first");
                }

                const { error: updateError } = await supabase
                  .from('profiles')
                  .update({ 
                    phone_number: values.phone,
                    onboarding_step: 2
                  })
                  .eq('id', session.user.id);

                if (updateError) throw updateError;

                console.log("Moving to personality step after phone update");
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

                const { error: updateError } = await supabase
                  .from('profiles')
                  .update({ 
                    onboarding_completed: true,
                    personality_traits: personalityData,
                    onboarding_step: 3
                  })
                  .eq('id', session.user.id);

                if (updateError) throw updateError;

                console.log("Completing onboarding");
                setCurrentStep("complete");
                navigate("/", { replace: true });
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
      </div>
    </div>
  );
};

export default AuthContainer;