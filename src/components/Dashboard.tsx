import { useState, useEffect } from "react";
import PlanningDialog from "./PlanningDialog";
import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardContent from "./dashboard/DashboardContent";
import { Button } from "./ui/button";
import { loadGoogleAPI } from "@/utils/googleCalendar";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import {
  upcomingEvents,
  recentContacts,
  activityFeed,
  goals,
  activities,
} from "@/data/dashboardData";
import type { Event, Contact } from "@/types/dashboard";

const Dashboard = () => {
  const [isPlanningOpen, setIsPlanningOpen] = useState(false);
  const { googleEvents, handleGoogleCalendarSync } = useGoogleCalendar();

  useEffect(() => {
    loadGoogleAPI();
  }, []);

  const handleTimeSlotClick = () => {
    console.log("Opening scheduling interface");
  };

  const handleEventClick = (event: Event) => {
    console.log("Opening event details for:", event.title, "at", event.time);
  };

  const handleContactClick = (contact: Contact) => {
    console.log("Opening contact details for:", contact.name);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader onPlanClick={() => setIsPlanningOpen(true)} />

      <div className="flex justify-end px-4">
        <Button 
          onClick={handleGoogleCalendarSync}
          className="bg-assistant-primary text-white hover:bg-assistant-primary/90"
        >
          Connect Google Calendar
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