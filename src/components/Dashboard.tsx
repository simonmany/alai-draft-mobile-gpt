import { useState, useEffect } from "react";
import PlanningDialog from "./PlanningDialog";
import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardContent from "./dashboard/DashboardContent";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { initializeGoogleCalendar, listEvents } from "@/utils/googleCalendar";
import {
  upcomingEvents,
  recentContacts,
  activityFeed,
  goals,
  activities,
  type Event,
  type Contact
} from "@/data/dashboardData";

const Dashboard = () => {
  const [isPlanningOpen, setIsPlanningOpen] = useState(false);
  const [googleEvents, setGoogleEvents] = useState<Event[]>([]);
  const { toast } = useToast();

  const handleTimeSlotClick = () => {
    console.log("Opening scheduling interface");
  };

  const handleEventClick = (event: Event) => {
    console.log("Opening event details for:", event.title, "at", event.time);
  };

  const handleContactClick = (contact: Contact) => {
    console.log("Opening contact details for:", contact.name);
  };

  const handlePlanClick = () => {
    setIsPlanningOpen(true);
  };

  const handleGoogleCalendarSync = async () => {
    try {
      const calendar = initializeGoogleCalendar('YOUR_API_KEY');
      const events = await listEvents(calendar);
      const formattedEvents: Event[] = (events || []).map((event: any, index: number) => ({
        id: index + 1000, // Using a number ID starting from 1000 to avoid conflicts
        title: event.summary || 'Untitled Event',
        time: new Date(event.start?.dateTime || event.start?.date).toLocaleTimeString(),
        type: 'work'
      }));
      setGoogleEvents(formattedEvents);
      toast({
        title: "Calendar Synced",
        description: "Your Google Calendar events have been imported successfully.",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync with Google Calendar. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader onPlanClick={handlePlanClick} />

      <div className="flex justify-end px-4">
        <Button 
          onClick={handleGoogleCalendarSync}
          className="bg-assistant-primary text-white hover:bg-assistant-primary/90"
        >
          Sync Google Calendar
        </Button>
      </div>

      <PlanningDialog
        isOpen={isPlanningOpen}
        onClose={() => setIsPlanningOpen(false)}
        activities={activities}
        contacts={recentContacts}
      />

      <DashboardContent
        activityFeed={activityFeed}
        upcomingEvents={[...upcomingEvents, ...googleEvents]}
        recentContacts={recentContacts}
        goals={goals}
        onEventClick={handleEventClick}
        onTimeSlotClick={handleTimeSlotClick}
        onContactClick={handleContactClick}
      />
    </div>
  );
};

export default Dashboard;