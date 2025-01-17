import React from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthUIProps {
  error: string | null;
  onNewUser: () => void;
}

const AuthUI = ({ error, onNewUser }: AuthUIProps) => {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Welcome</h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
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
            className: {
              anchor: 'hidden',
            },
          }}
          providers={[]}
        />

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={onNewUser}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Don't have an account?
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthUI;