import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ActivityFeed from "./dashboard/ActivityFeed";
import ScheduleSection from "./dashboard/ScheduleSection";
import ContactsSection from "./dashboard/ContactsSection";
import HealthSection from "./dashboard/HealthSection";

const Dashboard = () => {
  const upcomingEvents = [
    { id: 1, title: "Team Meeting", time: "10:00 AM", type: "work" as const },
    { id: 2, title: "Lunch with Sarah", time: "12:30 PM", type: "social" as const },
  ];

  const recentContacts = [
    { id: 1, name: "Sarah Johnson", status: "Called yesterday", needsAttention: false },
    { id: 2, name: "Mike Peters", status: "Messaged 2 days ago", needsAttention: false },
    { id: 3, name: "David Chen", status: "Last contact: 3 weeks ago", needsAttention: true },
  ];

  const healthMetrics = [
    { id: 1, name: "Steps", value: "8,234", goal: "10,000" },
    { id: 2, name: "Sleep", value: "7h 20m", goal: "8h" },
  ];

  const activityFeed = [
    { 
      id: 1, 
      user: "Sarah Johnson", 
      action: "started a new workout routine",
      time: "2 hours ago",
      type: "fitness" as const
    },
    { 
      id: 2, 
      user: "Mike Peters", 
      action: "completed their daily meditation",
      time: "3 hours ago",
      type: "wellness" as const
    },
    { 
      id: 3, 
      user: "David Chen", 
      action: "achieved their step goal",
      time: "5 hours ago",
      type: "fitness" as const
    },
    { 
      id: 4, 
      user: "Emma Wilson", 
      action: "logged 8 hours of sleep",
      time: "8 hours ago",
      type: "wellness" as const
    },
    { 
      id: 5, 
      user: "Alex Thompson", 
      action: "completed a yoga session",
      time: "10 hours ago",
      type: "fitness" as const
    }
  ];

  const handleTimeSlotClick = () => {
    console.log("Opening scheduling interface");
  };

  const handleEventClick = (event: typeof upcomingEvents[0]) => {
    console.log("Opening event details for:", event.title, "at", event.time);
  };

  const handleContactClick = (contact: typeof recentContacts[0]) => {
    console.log("Opening contact details for:", contact.name);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
        <button className="p-2 text-gray-400 hover:text-gray-500">
          <Bell className="h-6 w-6" />
        </button>
      </div>

      <div className="w-full">
        <Button size="lg" className="bg-assistant-primary hover:bg-assistant-primary/90 text-white text-lg py-6 w-full">
          <Plus className="mr-2" />
          Let's Plan Something!
        </Button>
      </div>

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
          onEventClick={handleEventClick}
          onTimeSlotClick={handleTimeSlotClick}
        />
        <ContactsSection 
          contacts={recentContacts}
          onContactClick={handleContactClick}
        />
      </div>

      <HealthSection metrics={healthMetrics} />
    </div>
  );
};

export default Dashboard;