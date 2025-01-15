import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Event = {
  id: number;
  title: string;
  time: string;
  type: 'work' | 'social';
};

interface ScheduleSectionProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onTimeSlotClick: () => void;
}

const ScheduleSection = ({ events, onEventClick, onTimeSlotClick }: ScheduleSectionProps) => {
  const getNextAvailableSlot = () => {
    if (events.length === 0) return "9:00 AM";
    const lastEvent = events[events.length - 1];
    const [hour, period] = lastEvent.time.split(" ");
    const [hourNum, minutes] = hour.split(":");
    let nextHour = parseInt(hourNum);
    
    nextHour = period === "PM" ? nextHour + 12 : nextHour;
    nextHour = nextHour + 1;
    if (nextHour >= 24) nextHour = 9;
    
    const finalPeriod = nextHour >= 12 ? "PM" : "AM";
    const displayHour = nextHour > 12 ? nextHour - 12 : nextHour;
    return `${displayHour}:00 ${finalPeriod}`;
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
          <Link to="/calendar" className="text-assistant-primary hover:text-assistant-primary/80 transition-colors">
            <Calendar className="h-7 w-7" />
          </Link>
        </div>
        <div className="space-y-4">
          {events.map((event) => (
            <div 
              key={event.id} 
              onClick={() => onEventClick(event)}
              className="flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-assistant-muted/50 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full ${
                event.type === 'work' ? 'bg-assistant-primary' : 'bg-assistant-secondary'
              }`} />
              <div>
                <p className="font-medium text-gray-900">{event.title}</p>
                <p className="text-sm text-gray-500">{event.time}</p>
              </div>
            </div>
          ))}
          <div 
            onClick={onTimeSlotClick}
            className="flex items-center space-x-3 p-2 rounded-md bg-assistant-muted/50 cursor-pointer hover:bg-assistant-muted transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div>
              <p className="font-medium text-gray-900">Available Slot</p>
              <p className="text-sm text-gray-500">{getNextAvailableSlot()}</p>
            </div>
          </div>
        </div>
      </Card>
      <Button 
        variant="outline" 
        className="w-full bg-white hover:bg-assistant-muted/50"
      >
        Do Something New
      </Button>
    </div>
  );
};

export default ScheduleSection;