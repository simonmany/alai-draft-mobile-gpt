import { Event } from "@/types/dashboard";
import { Card } from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface UpNextProps {
  getNextEvent: () => Event | undefined;
  getNextAvailableSlot: () => string;
  onPlanningClick: () => void;
  onCalendarClick: () => void;
}

const UpNext = ({ getNextEvent, getNextAvailableSlot, onPlanningClick, onCalendarClick }: UpNextProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Up Next:</h2>
          {getNextEvent() && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Calendar</span>
              <ArrowRight 
                className="h-5 w-5 text-assistant-primary hover:text-assistant-primary/80 cursor-pointer" 
                onClick={onCalendarClick}
              />
            </div>
          )}
        </div>
        
        <div 
          className="flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsDetailsOpen(true)}
        >
          <div className={`w-2 h-2 rounded-full ${
            getNextEvent()?.type === 'work' ? 'bg-assistant-primary' : 'bg-assistant-secondary'
          }`} />
          <div>
            <p className="font-medium text-gray-900">{getNextEvent()?.title || "No upcoming events"}</p>
            <p className="text-sm text-gray-500">{getNextEvent()?.time || "Schedule something!"}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div 
            className="flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-assistant-muted transition-colors"
            onClick={onPlanningClick}
          >
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div>
              <p className="font-medium text-gray-900">Next Available</p>
              <p className="text-sm text-gray-500">{getNextAvailableSlot()}</p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Team Meeting Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Time</h3>
              <p className="text-sm text-gray-500">{getNextEvent()?.time}</p>
            </div>
            <div>
              <h3 className="font-medium">Location</h3>
              <p className="text-sm text-gray-500">Conference Room A</p>
            </div>
            <div>
              <h3 className="font-medium">Attendees</h3>
              <ul className="text-sm text-gray-500 space-y-1 mt-1">
                <li>Sarah Johnson (Host)</li>
                <li>Mike Peters</li>
                <li>David Chen</li>
                <li>Emma Wilson</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Context</h3>
              <p className="text-sm text-gray-500">Weekly team sync to discuss project progress and upcoming milestones.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UpNext;