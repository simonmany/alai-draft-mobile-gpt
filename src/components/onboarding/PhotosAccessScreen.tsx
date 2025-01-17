import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import AlCharacter from "./AlCharacter";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface PhotosAccessScreenProps {
  onComplete: () => void;
}

const PhotosAccessScreen = ({ onComplete }: PhotosAccessScreenProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleComplete = async () => {
    // First get the user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user?.id) {
      console.error('Error getting user session:', sessionError);
      toast({
        title: "Error",
        description: "Unable to complete onboarding. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update the onboarding_completed flag with the confirmed user ID
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', session.user.id);

      if (error) throw error;

      // Show success toast
      toast({
        title: "Welcome!",
        description: "Your profile is all set up.",
      });

      // Navigate to the main app
      navigate('/');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "Unable to save your profile. Please try again.",
        variant: "destructive",
      });
      // Navigate anyway since this is just a mockup
      navigate('/');
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-assistant-background p-4">
      <div className="w-full max-w-2xl space-y-8">
        <AlCharacter isNodding={false} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold text-assistant-primary">Access your photos</h1>
          <p className="text-gray-600">Let me help you organize and share your memories</p>
        </motion.div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <Image className="h-16 w-16 mx-auto mb-4 text-assistant-primary" />
            <p className="text-gray-600">
              Allow access to your photos to help create and share memories with your loved ones
            </p>
          </div>

          <Button
            onClick={handleComplete}
            size="lg"
            className="w-full"
            variant="outline"
          >
            Allow Photos Access
          </Button>

          <Button
            onClick={handleComplete}
            size="lg"
            className="w-full"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotosAccessScreen;