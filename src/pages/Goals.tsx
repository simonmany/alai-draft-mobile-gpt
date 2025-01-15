import { goals } from "@/data/dashboardData";
import { Progress } from "@/components/ui/progress";

const Goals = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Goals</h1>
      <div className="space-y-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">{goal.name}</h3>
              <span className="text-sm text-gray-500">{goal.status}</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Goals;