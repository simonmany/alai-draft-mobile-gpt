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

const RATE_LIMIT_SECONDS = 60;

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showNewUserFlow, setShowNewUserFlow] = useState(false);
  const [signupStep, setSignupStep] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed, onboarding_step, phone_number')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            if (!profile.onboarding_completed) {
              if (!profile.phone_number) {
                setShowNewUserFlow(true);
                setSignupStep('phone');
              } else {
                setShowOnboarding(true);
              }
            } else {
              navigate("/");
            }
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
        const { data: profile } = await supabase
          .from('profiles')
          .select('phone_number, onboarding_completed')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          if (!profile.phone_number) {
            setShowNewUserFlow(true);
            setSignupStep('phone');
          } else if (!profile.onboarding_completed) {
            setShowOnboarding(true);
          } else {
            navigate("/");
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setError(null);
        setShowOnboarding(false);
        setShowNewUserFlow(false);
        setSignupStep('email');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleEmailSubmit = async (values: EmailFormValues) => {
    try {
      const now = Date.now();
      if (isSubmitting) {
        toast({
          title: "Please wait",
          description: "Your previous request is still processing",
          variant: "destructive",
        });
        return;
      }

      // Check rate limiting
      const timeSinceLastSubmit = now - lastSubmitTime;
      if (timeSinceLastSubmit < RATE_LIMIT_SECONDS * 1000) {
        const remainingTime = Math.ceil((RATE_LIMIT_SECONDS * 1000 - timeSinceLastSubmit) / 1000);
        toast({
          title: "Rate limit",
          description: `Please wait ${remainingTime} seconds before trying again`,
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
      setError(null);
      setLastSubmitTime(now);

      // Try to sign in first to check if user exists
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        // Use a dummy password since we don't know the actual one
        password: "dummy-password-for-check"
      });

      if (!signInError || (signInError as AuthApiError).status === 400) {
        // User exists (either signed in or wrong password)
        toast({
          title: "Account exists",
          description: "This email is already registered. Please use the sign in option below.",
          variant: "destructive",
        });
        setShowNewUserFlow(false);
        return;
      }

      // If we get here, user doesn't exist, proceed with signup
      const randomPassword = Math.random().toString(36).slice(-12) + 
                           Math.random().toString(36).toUpperCase().slice(-4) + 
                           "!2";

      const { error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: randomPassword,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (signUpError) {
        if (signUpError instanceof AuthApiError) {
          switch (signUpError.status) {
            case 429:
              throw new Error("Please wait before trying again");
            case 422:
              toast({
                title: "Account exists",
                description: "This email is already registered. Please sign in instead.",
                variant: "destructive",
              });
              setShowNewUserFlow(false);
              return;
            default:
              throw signUpError;
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
      let errorMessage = "Failed to sign up";
      
      if (error instanceof AuthApiError) {
        switch (error.status) {
          case 429:
            errorMessage = "Please wait before trying again";
            break;
          case 422:
            errorMessage = "This email is already registered. Please sign in instead.";
            setShowNewUserFlow(false);
            break;
          case 400:
            if (error.message.includes("already registered")) {
              errorMessage = "This email is already registered. Please sign in instead.";
              setShowNewUserFlow(false);
            }
            break;
          default:
            errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

      setShowNewUserFlow(false);
      setShowOnboarding(true);
      
      toast({
        title: "Success",
        description: "Phone number updated successfully",
      });
    } catch (error) {
      console.error('Error in phone signup:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update phone number";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("No user found");

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', session.user.id);

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
            <EmailSignupStep 
              onSubmit={handleEmailSubmit} 
              isSubmitting={isSubmitting}
            />
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