import { Link } from "react-router-dom";
import { Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Goal = {
  id: number;
  name: string;
  progress: number;
  status: string;
};

interface GoalsSectionProps {
  goals: Goal[];
}

const GoalsSection = ({ goals }: GoalsSectionProps) => {
  return (
    <Card className="p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Goals</h2>
        <Link to="/goals" className="text-assistant-primary hover:text-assistant-primary/80 transition-colors">
          <Target className="h-7 w-7" />
        </Link>
      </div>
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{goal.name}</span>
              <span className="text-gray-900 font-medium">{goal.status}</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GoalsSection;