import { Card } from "@/components/ui/card";
import { Goal } from "@/types/dashboard";

interface WeeklyGoalsProps {
  goals: Goal[];
}

const WeeklyGoals = ({ goals }: WeeklyGoalsProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Goals for This Week</h2>
      <div className="space-y-4">
        {goals.slice(0, 3).map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{goal.name}</span>
              <span className="text-gray-900 font-medium">{goal.status}</span>
            </div>
            <div className="h-2 bg-assistant-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-assistant-primary rounded-full transition-all duration-300"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WeeklyGoals;