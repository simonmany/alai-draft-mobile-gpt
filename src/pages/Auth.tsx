import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import OnboardingSplash from "@/components/onboarding/OnboardingSplash";
import AuthUI from "@/components/auth/AuthUI";
import EmailSignupStep from "@/components/auth/EmailSignupStep";
import PhoneSignupStep from "@/components/auth/PhoneSignupStep";
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
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showNewUserFlow, setShowNewUserFlow] = useState(false);
  const [signupStep, setSignupStep] = useState<'email' | 'phone'>('email');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', session.user.id)
          .single();

        if (profile && !profile.onboarding_completed) {
          setShowOnboarding(true);
        } else {
          navigate("/");
        }
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', session.user.id)
          .single();

        if (profile && !profile.onboarding_completed) {
          setShowOnboarding(true);
        } else {
          navigate("/");
          toast({
            title: "Welcome!",
            description: "You have successfully signed in.",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setError(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          return "Please enter both email and password.";
        case 401:
          return "Invalid email or password. Please try again.";
        case 422:
          return "Invalid email format. Please check your email address.";
        case 429:
          return "Too many attempts. Please try again later.";
        default:
          return error.message;
      }
    }
    return error.message;
  };

  const handleEmailSubmit = async (values: EmailFormValues) => {
    // For now, just proceed to phone step without storing email
    setSignupStep('phone');
  };

  const handlePhoneSubmit = async (values: PhoneFormValues) => {
    // For testing purposes, just proceed to onboarding
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = async () => {
    navigate("/");
  };

  if (showOnboarding) {
    return <OnboardingSplash onComplete={handleOnboardingComplete} />;
  }

  if (showNewUserFlow) {
    return (
      <div className="min-h-screen bg-assistant-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {signupStep === 'email' ? (
            <EmailSignupStep onSubmit={handleEmailSubmit} />
          ) : (
            <PhoneSignupStep onSubmit={handlePhoneSubmit} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-assistant-background flex items-center justify-center p-4">
      <AuthUI error={error} onNewUser={() => setShowNewUserFlow(true)} />
    </div>
  );
};

export default Auth;