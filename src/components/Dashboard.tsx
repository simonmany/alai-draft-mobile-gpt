import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PlanningDialog from "./PlanningDialog";
import DashboardHeader from "./dashboard/DashboardHeader";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import {
  upcomingEvents,
  goals,
  activities,
  recentContacts,
} from "@/data/dashboardData";
import UpNext from "./dashboard/UpNext";
import Memories from "./dashboard/Memories";
import WeeklyGoals from "./dashboard/WeeklyGoals";

const Dashboard = () => {
  const [isPlanningOpen, setIsPlanningOpen] = useState(false);
  const { googleEvents } = useGoogleCalendar();
  const navigate = useNavigate();

  const memories = [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901", title: "Game Night", date: "Last Week" },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04", title: "Movie Night", date: "2 Weeks Ago" },
    { id: 3, imageUrl: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d", title: "Hiking Trip", date: "Last Month" },
  ];

  const getNextEvent = () => {
    const allEvents = [...upcomingEvents, ...googleEvents].sort((a, b) => {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });
    return allEvents[0];
  };

  const getNextAvailableSlot = () => {
    const lastEvent = getNextEvent();
    if (!lastEvent) return "9:00 AM";
    
    const [hour, period] = lastEvent.time.split(" ");
    const [hourNum] = hour.split(":");
    let nextHour = parseInt(hourNum);
    
    nextHour = period === "PM" ? nextHour + 12 : nextHour;
    nextHour = nextHour + 1;
    if (nextHour >= 24) nextHour = 9;
    
    const finalPeriod = nextHour >= 12 ? "PM" : "AM";
    const displayHour = nextHour > 12 ? nextHour - 12 : nextHour;
    return `${displayHour}:00 ${finalPeriod}`;
  };

  return (
    <div className="space-y-6">
      <DashboardHeader onPlusClick={() => setIsPlanningOpen(true)} />

      <PlanningDialog
        isOpen={isPlanningOpen}
        onClose={() => setIsPlanningOpen(false)}
        activities={activities}
        contacts={recentContacts}
      />

      <UpNext 
        getNextEvent={getNextEvent}
        getNextAvailableSlot={getNextAvailableSlot}
        onPlanningClick={() => setIsPlanningOpen(true)}
        onCalendarClick={() => navigate('/calendar')}
      />

      <WeeklyGoals goals={goals} />

      <Memories memories={memories} />
    </div>
  );
};

export default Dashboard;