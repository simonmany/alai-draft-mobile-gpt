import { Link } from "react-router-dom";
import { Activity } from "lucide-react";
import { Card } from "@/components/ui/card";

type Metric = {
  id: number;
  name: string;
  value: string;
  goal: string;
};

interface HealthSectionProps {
  metrics: Metric[];
}

const HealthSection = ({ metrics }: HealthSectionProps) => {
  return (
    <Card className="p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Health Overview</h2>
        <Link to="/health" className="text-assistant-primary hover:text-assistant-primary/80 transition-colors">
          <Activity className="h-7 w-7" />
        </Link>
      </div>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{metric.name}</span>
              <span className="text-gray-900 font-medium">{metric.value}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div
                className="h-2 bg-assistant-primary rounded-full"
                style={{
                  width: metric.name === "Steps" 
                    ? `${(parseInt(metric.value.replace(',', '')) / parseInt(metric.goal.replace(',', ''))) * 100}%`
                    : `${(parseInt(metric.value) / parseInt(metric.goal)) * 100}%`
                }}
              />
            </div>
            <p className="text-xs text-gray-500">Goal: {metric.goal}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default HealthSection;