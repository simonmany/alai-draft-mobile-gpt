import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface DashboardHeaderProps {
  onPlusClick: () => void;
}

const DashboardHeader = ({ onPlusClick }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
      <Button 
        onClick={onPlusClick}
        aria-label="Let's Plan Something"
        variant="ghost"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default DashboardHeader;