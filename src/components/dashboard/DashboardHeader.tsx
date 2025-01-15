import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onPlanClick: () => void;
}

const DashboardHeader = ({ onPlanClick }: DashboardHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
        <button className="p-2 text-gray-400 hover:text-gray-500">
          <Bell className="h-6 w-6" />
        </button>
      </div>

      <Button 
        onClick={onPlanClick}
        size="lg"
        className="w-full text-lg font-semibold"
      >
        <Plus className="w-5 h-5" /> Let's Plan Something
      </Button>
    </>
  );
};

export default DashboardHeader;