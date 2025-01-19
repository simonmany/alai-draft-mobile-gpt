import { useNavigate } from "react-router-dom";
import { AuthApiError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import OnboardingSplash from "@/components/onboarding/OnboardingSplash";
import AuthUI from "@/components/auth/AuthUI";
import EmailSignupStep from "@/components/auth/EmailSignupStep";
import PhoneSignupStep from "@/components/auth/PhoneSignupStep";
import PersonalityAssessment from "@/components/onboarding/PersonalityAssessment";
import { useAuthState } from "@/hooks/useAuthState";
import * as z from "zod";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const phoneSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PhoneFormValues = z.infer<typeof phoneSchema>;

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentStep, setCurrentStep, isLoading, error } = useAuthState();

  const handleEmailSubmit = async (values: EmailFormValues) => {
    try {
      const randomPassword = Math.random().toString(36).slice(-12) + 
                           Math.random().toString(36).toUpperCase().slice(-4) + 
                           "!2";

      const { error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: randomPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        }
      });

      if (signUpError) {
        if (signUpError instanceof AuthApiError) {
          if (signUpError.status === 422) {
            // User already exists, show sign in suggestion
            toast({
              title: "Account exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
            setCurrentStep("login");
            return;
          }
        }
        throw signUpError;
      }

      toast({
        title: "Success",
        description: "Please check your email to verify your account",
      });
    } catch (error) {
      console.error('Error in email signup:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handlePhoneSubmit = async (values: PhoneFormValues) => {
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

      setCurrentStep("personality");
      
      toast({
        title: "Success",
        description: "Phone number updated successfully",
      });
    } catch (error) {
      console.error('Error in phone signup:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handlePersonalityComplete = async (personalityData: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("No user found");

      await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          personality_traits: personalityData
        })
        .eq('id', session.user.id);

      setCurrentStep("complete");
      navigate("/", { replace: true });
    } catch (error) {
      console.error('Error completing personality assessment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return null;
  }

  if (currentStep === "complete") {
    navigate("/", { replace: true });
    return null;
  }

  if (currentStep === "personality") {
    return <PersonalityAssessment onComplete={handlePersonalityComplete} />;
  }

  return (
    <div className="min-h-screen bg-assistant-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {currentStep === "login" && (
          <AuthUI error={error} onNewUser={() => setCurrentStep("email")} />
        )}
        {currentStep === "email" && (
          <EmailSignupStep onSubmit={handleEmailSubmit} />
        )}
        {currentStep === "phone" && (
          <PhoneSignupStep onSubmit={handlePhoneSubmit} />
        )}
      </div>
    </div>
  );
};

export default Auth;