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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          if (sessionError.message.includes('refresh_token_not_found')) {
            await supabase.auth.signOut();
            setIsLoading(false);
            return;
          }
          throw sessionError;
        }

        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed, onboarding_step, phone_number')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          // Always show phone step if no phone number
          if (!profile?.phone_number) {
            console.log("No phone number found, showing phone step");
            setShowNewUserFlow(true);
            setSignupStep('phone');
            setIsLoading(false);
            return;
          }

          // Show onboarding if phone exists but onboarding not complete
          if (!profile?.onboarding_completed) {
            console.log("Phone exists but onboarding not complete, showing onboarding");
            setShowOnboarding(true);
            setIsLoading(false);
            return;
          }

          // Only navigate home if everything is complete
          console.log("Profile complete, navigating home");
          navigate("/", { replace: true });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error in checkUser:', error);
        await supabase.auth.signOut();
        toast({
          title: "Session Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event);
      
      if (event === 'TOKEN_REFRESHED') return;
      
      if (event === 'SIGNED_IN' && session) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed, phone_number')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          // Always show phone step for new users
          if (!profile?.phone_number) {
            console.log("No phone number found after sign in, showing phone step");
            setShowNewUserFlow(true);
            setSignupStep('phone');
            setIsLoading(false);
            return;
          }

          // Show onboarding if phone exists but onboarding not complete
          if (!profile?.onboarding_completed) {
            console.log("Phone exists but onboarding not complete after sign in");
            setShowOnboarding(true);
            setIsLoading(false);
            return;
          }

          // Only navigate home if everything is complete
          console.log("Profile complete after sign in, navigating home");
          navigate("/", { replace: true });
        } catch (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error",
            description: "Failed to load your profile. Please try again.",
            variant: "destructive",
          });
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

      const randomPassword = Math.random().toString(36).slice(-12) + 
                           Math.random().toString(36).toUpperCase().slice(-4) + 
                           "!2";

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: randomPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
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

      if (data.user?.confirmed_at || data.user?.confirmation_sent_at) {
        toast({
          title: "Success",
          description: "Please check your email to verify your account",
        });
      }

      // Explicitly set the signup step to phone after successful email signup
      setSignupStep('phone');
      setShowNewUserFlow(true);
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

      // After phone number is saved, show onboarding
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

  if (isLoading) {
    return null;
  }

  if (showOnboarding) {
    return <OnboardingSplash onComplete={() => navigate("/", { replace: true })} />;
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