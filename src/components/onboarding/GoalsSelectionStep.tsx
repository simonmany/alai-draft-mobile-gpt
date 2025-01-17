import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

interface Goal {
  id: string;
  label: string;
  description: string;
}

const GOALS: Goal[] = [
  { id: "hangOutMore", label: "Hang Out More", description: "Be more socially active" },
  { id: "hangOutBetter", label: "Hang Out Better", description: "Do more varied things; be intentional with how you spend time" },
  { id: "reconnect", label: "Reconnect with Old Friends", description: "Rekindle past friendships" },
  { id: "meetNew", label: "Meet New People", description: "Expand your social circle" },
  { id: "romance", label: "Find Romance", description: "Explore romantic connections" },
  { id: "activities", label: "Find Partners for a Specific Activity", description: "Connect with people who share your interests" },
  { id: "network", label: "Network Professionally", description: "Grow your professional connections" },
];

interface GoalsSelectionStepProps {
  onComplete: (selectedGoals: string[]) => void;
}

const GoalsSelectionStep = ({ onComplete }: GoalsSelectionStepProps) => {
  const [selectedGoals, setSelectedGoals] = React.useState<string[]>([]);

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(current =>
      current.includes(goalId)
        ? current.filter(id => id !== goalId)
        : [...current, goalId]
    );
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-assistant-background p-4">
      <div className="w-full max-w-2xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold text-assistant-primary">What are your goals?</h1>
          <p className="text-gray-600">Select all that apply to you</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {GOALS.map((goal) => (
            <div
              key={goal.id}
              className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Checkbox
                id={goal.id}
                checked={selectedGoals.includes(goal.id)}
                onCheckedChange={() => handleGoalToggle(goal.id)}
              />
              <div className="space-y-1.5">
                <label
                  htmlFor={goal.id}
                  className="text-lg font-medium cursor-pointer"
                >
                  {goal.label}
                </label>
                <p className="text-sm text-gray-600">{goal.description}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <Button
            onClick={() => onComplete(selectedGoals)}
            disabled={selectedGoals.length === 0}
            size="lg"
            className="mt-8"
          >
            Continue
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default GoalsSelectionStep;