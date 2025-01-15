import { Card } from "@/components/ui/card";
import ActivityFeed from "./ActivityFeed";
import ScheduleSection from "./ScheduleSection";
import ContactsSection from "./ContactsSection";
import GoalsSection from "./GoalsSection";
import { type Event, type Contact } from "@/data/dashboardData";

interface DashboardContentProps {
  activityFeed: Array<{
    id: number;
    user: string;
    action: string;
    time: string;
    type: 'fitness' | 'wellness';
  }>;
  upcomingEvents: Event[];
  recentContacts: Contact[];
  goals: Array<{
    id: number;
    name: string;
    progress: number;
    status: string;
  }>;
  onEventClick: (event: Event) => void;
  onTimeSlotClick: () => void;
  onContactClick: (contact: Contact) => void;
}

const DashboardContent = ({
  activityFeed,
  upcomingEvents,
  recentContacts,
  goals,
  onEventClick,
  onTimeSlotClick,
  onContactClick,
}: DashboardContentProps) => {
  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Activity Feed</h2>
          <div className="text-sm text-assistant-primary">Friends' Activities</div>
        </div>
        <ActivityFeed activities={activityFeed} />
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ScheduleSection 
          events={upcomingEvents}
          onEventClick={onEventClick}
          onTimeSlotClick={onTimeSlotClick}
        />
        <ContactsSection 
          contacts={recentContacts}
          onContactClick={onContactClick}
        />
      </div>

      <GoalsSection goals={goals} />
    </>
  );
};

export default DashboardContent;