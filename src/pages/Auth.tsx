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
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUser(session.user);
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed, onboarding_step')
            .eq('id', session.user.id)
            .single();

          if (profile && !profile.onboarding_completed) {
            setShowOnboarding(true);
          } else {
            navigate("/");
          }
        }
      } catch (error) {
        console.error('Error in checkUser:', error);
        toast({
          title: "Error",
          description: "Failed to check user session",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setCurrentUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed, onboarding_step')
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
        setCurrentUser(null);
        setError(null);
        setShowOnboarding(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleEmailSubmit = async (values: EmailFormValues) => {
    try {
      setError(null);
      const { error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: "temporary-password",
      });

      if (signUpError) throw signUpError;

      setSignupStep('phone');
      toast({
        title: "Success",
        description: "Please check your email to verify your account",
      });
    } catch (error) {
      console.error('Error in email signup:', error);
      setError(error instanceof AuthApiError ? error.message : "Failed to sign up");
      toast({
        title: "Error",
        description: error instanceof AuthApiError ? error.message : "Failed to sign up",
        variant: "destructive",
      });
    }
  };

  const handlePhoneSubmit = async (values: PhoneFormValues) => {
    try {
      if (!currentUser) {
        throw new Error("Please complete email signup first");
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          phone_number: values.phone,
          onboarding_step: 2
        })
        .eq('id', currentUser.id);

      if (updateError) throw updateError;

      setShowOnboarding(true);
      toast({
        title: "Success",
        description: "Phone number updated successfully",
      });
    } catch (error) {
      console.error('Error in phone signup:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update phone number",
        variant: "destructive",
      });
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      if (!currentUser) throw new Error("No user found");

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', currentUser.id);

      if (updateError) throw updateError;

      navigate("/");
      toast({
        title: "Welcome!",
        description: "Your profile has been set up successfully.",
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return null;
  }

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