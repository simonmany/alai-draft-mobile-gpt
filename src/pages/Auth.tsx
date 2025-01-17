import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.message) {
        case 'Email not confirmed':
          return 'Please verify your email address before signing in.';
        case 'Invalid login credentials':
          return 'Invalid email or password. Please check your credentials and try again.';
        case 'Password is required':
          return 'Please enter your password.';
        case 'Email is required':
          return 'Please enter your email address.';
        case 'User not found':
          return 'No account exists with this email address. Please sign up first.';
        default:
          if (error.message.includes('valid email')) {
            return 'Please enter a valid email address.';
          }
          return error.message;
      }
    }
    return error.message;
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
      } else if (event === 'USER_UPDATED') {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: getErrorMessage(error),
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-assistant-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account or create a new one
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <SupabaseAuth 
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2D87C9',
                    brandAccent: '#34B3B3',
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;