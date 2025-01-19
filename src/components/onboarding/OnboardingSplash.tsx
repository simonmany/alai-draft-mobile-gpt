import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  const { toast } = useToast();

  const handleInitialContinue = () => {
    setStep(2);
  };

  const handleGoalsSelected = async (goals: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('profiles')
        .update({ goals: goals })
        .eq('id', user.id);

      if (error) throw error;

      setSelectedGoals(goals);
      setStep(3);
    } catch (error) {
      console.error('Error saving goals:', error);
      toast({
        title: "Error saving goals",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleGoalsRanked = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('profiles')
        .update({ 
          goals: selectedGoals,
          onboarding_step: 4
        })
        .eq('id', user.id);

      if (error) throw error;
      setStep(4);
    } catch (error) {
      console.error('Error updating ranked goals:', error);
      toast({
        title: "Error saving ranked goals",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handlePersonalityComplete = async (personalityData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Save personality assessment
      const { error: personalityError } = await supabase
        .from('personality_assessment')
        .insert([
          {
            user_id: user.id,
            social_energy: personalityData.social_energy,
            social_energy_notes: personalityData.social_energy_notes,
            social_style: personalityData.social_style,
            social_style_notes: personalityData.social_style_notes,
            planning_style: personalityData.planning_style,
            planning_style_notes: personalityData.planning_style_notes
          }
        ]);

      if (personalityError) throw personalityError;

      // Update profile completion status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          personality_traits: personalityData
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      onComplete();
    } catch (error) {
      console.error('Error saving personality assessment:', error);
      toast({
        title: "Error saving personality assessment",
        description: "Please try again",
        variant: "destructive",
      });
    }
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
    return <PersonalityAssessment onComplete={handlePersonalityComplete} />;
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