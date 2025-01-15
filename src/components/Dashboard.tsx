import { useState } from "react";
import PlanningDialog from "./PlanningDialog";
import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardContent from "./dashboard/DashboardContent";
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

  return (
    <div className="space-y-6">
      <DashboardHeader onPlanClick={handlePlanClick} />

      <PlanningDialog
        isOpen={isPlanningOpen}
        onClose={() => setIsPlanningOpen(false)}
        activities={activities}
        contacts={recentContacts}
      />

      <DashboardContent
        activityFeed={activityFeed}
        upcomingEvents={upcomingEvents}
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