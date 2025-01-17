import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import GoalsSelectionStep from "./GoalsSelectionStep";
import GoalsRankingStep from "./GoalsRankingStep";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingSplashProps {
  onComplete: () => void;
}

const OnboardingSplash = ({ onComplete }: OnboardingSplashProps) => {
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const handleInitialContinue = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ onboarding_step: 2 })
      .eq('id', (await supabase.auth.getUser()).data.user?.id);

    if (!error) {
      setStep(2);
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
          >
            Let's Go Then!
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingSplash;