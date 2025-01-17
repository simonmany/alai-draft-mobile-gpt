import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import GoalsSelectionStep from "./GoalsSelectionStep";
import GoalsRankingStep from "./GoalsRankingStep";
import PersonalityAssessment from "./PersonalityAssessment";

interface OnboardingSplashProps {
  onComplete: () => void;
}

const OnboardingSplash = ({ onComplete }: OnboardingSplashProps) => {
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInitialContinue = () => {
    setStep(2);
  };

  const handleGoalsSelected = (goals: string[]) => {
    setSelectedGoals(goals);
    setStep(3);
  };

  const handleGoalsRanked = () => {
    setStep(4);
  };

  console.log('Current step:', step);

  if (step === 2) {
    console.log('Rendering GoalsSelectionStep');
    return <GoalsSelectionStep onComplete={handleGoalsSelected} />;
  }

  if (step === 3) {
    console.log('Rendering GoalsRankingStep');
    return <GoalsRankingStep selectedGoals={selectedGoals} onComplete={handleGoalsRanked} />;
  }

  if (step === 4) {
    console.log('Rendering PersonalityAssessment');
    return <PersonalityAssessment />;
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