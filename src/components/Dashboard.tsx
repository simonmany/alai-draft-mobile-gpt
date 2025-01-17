import { useState } from "react";
import PlanningDialog from "./PlanningDialog";
import DashboardHeader from "./dashboard/DashboardHeader";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import {
  upcomingEvents,
  goals,
  activities,
  recentContacts,
} from "@/data/dashboardData";
import { Card } from "./ui/card";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import type { Event, Contact } from "@/types/dashboard";

const Dashboard = () => {
  const [isPlanningOpen, setIsPlanningOpen] = useState(false);
  const { googleEvents } = useGoogleCalendar();

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

  const memories = [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901", title: "Game Night", date: "Last Week" },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04", title: "Movie Night", date: "2 Weeks Ago" },
    { id: 3, imageUrl: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d", title: "Hiking Trip", date: "Last Month" },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader onPlanClick={() => setIsPlanningOpen(true)} />

      <PlanningDialog
        isOpen={isPlanningOpen}
        onClose={() => setIsPlanningOpen(false)}
        activities={activities}
        contacts={recentContacts}
      />

      {/* Next Event and Available Slot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Next Event</h2>
            <Link to="/calendar" className="text-assistant-primary hover:text-assistant-primary/80">
              <Calendar className="h-5 w-5" />
            </Link>
          </div>
          {getNextEvent() ? (
            <div className="flex items-center space-x-3 p-2 rounded-md">
              <div className={`w-2 h-2 rounded-full ${
                getNextEvent()?.type === 'work' ? 'bg-assistant-primary' : 'bg-assistant-secondary'
              }`} />
              <div>
                <p className="font-medium text-gray-900">{getNextEvent()?.title}</p>
                <p className="text-sm text-gray-500">{getNextEvent()?.time}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No upcoming events</p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Next Available Slot</h2>
          </div>
          <div className="flex items-center space-x-3 p-2 rounded-md">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div>
              <p className="font-medium text-gray-900">Available</p>
              <p className="text-sm text-gray-500">{getNextAvailableSlot()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Memories Carousel */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Memories with Friends</h2>
        <Carousel className="w-full">
          <CarouselContent>
            {memories.map((memory) => (
              <CarouselItem key={memory.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <div className="overflow-hidden rounded-lg aspect-video relative">
                    <img
                      src={memory.imageUrl}
                      alt={memory.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <h3 className="text-white font-medium">{memory.title}</h3>
                      <p className="text-white/80 text-sm">{memory.date}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Card>

      {/* Weekly Goals */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Goals for This Week</h2>
        <div className="space-y-4">
          {goals.slice(0, 3).map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">{goal.name}</span>
                <span className="text-gray-900 font-medium">{goal.status}</span>
              </div>
              <div className="h-2 bg-assistant-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-assistant-primary rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;