import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, Reorder } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const GOALS_MAP: Record<string, string> = {
  hangOutMore: "Hang Out More",
  hangOutBetter: "Hang Out Better",
  reconnect: "Reconnect with Old Friends",
  meetNew: "Meet New People",
  romance: "Find Romance",
  activities: "Find Partners for a Specific Activity",
  network: "Network Professionally",
};

interface GoalsRankingStepProps {
  selectedGoals: string[];
  onComplete: () => void;
}

const GoalsRankingStep = ({ selectedGoals, onComplete }: GoalsRankingStepProps) => {
  const [rankedGoals, setRankedGoals] = useState(selectedGoals);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        goals: rankedGoals.map((goalId, index) => ({
          id: goalId,
          label: GOALS_MAP[goalId],
          priority: index + 1
        })),
        onboarding_step: 3
      })
      .eq('id', (await supabase.auth.getUser()).data.user?.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error saving goals",
        description: "Please try again.",
      });
      setIsSubmitting(false);
      return;
    }

    onComplete();
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-assistant-background p-4">
      <div className="w-full max-w-2xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold text-assistant-primary">Prioritize Your Goals</h1>
          <p className="text-gray-600">Drag to reorder your goals from most to least important</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-4"
        >
          <Reorder.Group
            axis="y"
            values={rankedGoals}
            onReorder={setRankedGoals}
            className="space-y-2"
          >
            {rankedGoals.map((goalId, index) => (
              <Reorder.Item
                key={goalId}
                value={goalId}
                className="bg-white p-4 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-medium text-assistant-primary">
                    {index + 1}.
                  </span>
                  <span className="text-lg">{GOALS_MAP[goalId]}</span>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="lg"
            className="mt-8"
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default GoalsRankingStep;