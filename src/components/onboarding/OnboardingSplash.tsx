import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GoalsSelectionStep from "./GoalsSelectionStep";
import GoalsRankingStep from "./GoalsRankingStep";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OnboardingSplashProps {
  onComplete: () => void;
}

const OnboardingSplash = ({ onComplete }: OnboardingSplashProps) => {
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInitialContinue = async () => {
    setIsLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please sign in to continue",
        });
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_step: 2 })
        .eq('id', user.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update profile. Please try again.",
        });
        return;
      }

      setStep(2);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoalsSelected = (goals: string[]) => {
    setSelectedGoals(goals);
    setStep(3);
  };

  if (step === 2) {
    return <GoalsSelectionStep onComplete={handleGoalsSelected} />;
  }

  if (step === 3) {
    return <GoalsRankingStep selectedGoals={selectedGoals} onComplete={onComplete} />;
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-assistant-background">
      <div className="space-y-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl font-bold text-assistant-primary"
        >
          Hi! Welcome to Alai.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-xl text-gray-600"
        >
          We're excited to get to know you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <Button
            onClick={handleInitialContinue}
            size="lg"
            className="mt-8 text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Let's Go Then!"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingSplash;