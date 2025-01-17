import { Event } from "@/types/dashboard";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface UpNextProps {
  getNextEvent: () => Event | undefined;
  getNextAvailableSlot: () => string;
  onPlanningClick: () => void;
}

const UpNext = ({ getNextEvent, getNextAvailableSlot, onPlanningClick }: UpNextProps) => {
  return (
    <Card className="p-6">
      <div 
        className="cursor-pointer"
        onClick={onPlanningClick}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Up Next:</h2>
          {getNextEvent() && (
            <Popover>
              <PopoverTrigger>
                <ArrowRight className="h-5 w-5 text-assistant-primary hover:text-assistant-primary/80" />
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-2">
                  <h3 className="font-medium">{getNextEvent()?.title}</h3>
                  <p className="text-sm text-gray-500">Time: {getNextEvent()?.time}</p>
                  <p className="text-sm text-gray-500">Type: {getNextEvent()?.type}</p>
                  <p className="text-sm text-gray-500">Attendees: Sarah, Mike</p>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        
        <div className="flex items-center space-x-3 p-2 rounded-md">
          <div className={`w-2 h-2 rounded-full ${
            getNextEvent()?.type === 'work' ? 'bg-assistant-primary' : 'bg-assistant-secondary'
          }`} />
          <div>
            <p className="font-medium text-gray-900">{getNextEvent()?.title || "No upcoming events"}</p>
            <p className="text-sm text-gray-500">{getNextEvent()?.time || "Schedule something!"}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center space-x-3 p-2 rounded-md">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div>
              <p className="font-medium text-gray-900">Next Available</p>
              <p className="text-sm text-gray-500">{getNextAvailableSlot()}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UpNext;