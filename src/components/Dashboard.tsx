import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Activity, Bell, Plus } from "lucide-react";

const Dashboard = () => {
  const upcomingEvents = [
    { id: 1, title: "Team Meeting", time: "10:00 AM", type: "work" },
    { id: 2, title: "Lunch with Sarah", time: "12:30 PM", type: "social" },
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

  // Calculate next available slot (after the last event)
  const getNextAvailableSlot = () => {
    if (upcomingEvents.length === 0) return "9:00 AM";
    const lastEvent = upcomingEvents[upcomingEvents.length - 1];
    const [hour, period] = lastEvent.time.split(" ");
    const [hourNum, minutes] = hour.split(":");
    let nextHour = parseInt(hourNum);
    
    // Add 1.5 hours to the last event's time
    nextHour = period === "PM" ? nextHour + 12 : nextHour;
    nextHour = nextHour + 1;
    if (nextHour >= 24) nextHour = 9; // Reset to 9 AM if it goes past midnight
    
    const finalPeriod = nextHour >= 12 ? "PM" : "AM";
    const displayHour = nextHour > 12 ? nextHour - 12 : nextHour;
    return `${displayHour}:00 ${finalPeriod}`;
  };

  const handleTimeSlotClick = () => {
    console.log("Opening scheduling interface for:", getNextAvailableSlot());
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Today's Schedule */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
              <Calendar className="h-5 w-5 text-assistant-primary" />
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id} 
                  onClick={() => handleEventClick(event)}
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
              {/* Next Available Slot */}
              <div 
                onClick={handleTimeSlotClick}
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

        {/* Recent Contacts */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Contacts</h2>
              <Users className="h-5 w-5 text-assistant-primary" />
            </div>
            <div className="space-y-4">
              {recentContacts.map((contact) => (
                <div 
                  key={contact.id} 
                  onClick={() => handleContactClick(contact)}
                  className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors ${
                    contact.needsAttention 
                      ? 'bg-assistant-muted/50 hover:bg-assistant-muted' 
                      : 'hover:bg-assistant-muted/50'
                  }`}
                >
                  <div className="h-8 w-8 rounded-full bg-assistant-muted flex items-center justify-center">
                    <span className="text-assistant-primary font-medium">
                      {contact.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Button 
            variant="outline" 
            className="w-full bg-white hover:bg-assistant-muted/50"
          >
            Meet Someone New
          </Button>
        </div>
      </div>

      {/* Health Overview - Full Width */}
      <Card className="p-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Health Overview</h2>
          <Activity className="h-5 w-5 text-assistant-primary" />
        </div>
        <div className="space-y-4">
          {healthMetrics.map((metric) => (
            <div key={metric.id} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">{metric.name}</span>
                <span className="text-gray-900 font-medium">{metric.value}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-assistant-primary rounded-full"
                  style={{
                    width: metric.name === "Steps" 
                      ? `${(parseInt(metric.value.replace(',', '')) / parseInt(metric.goal.replace(',', ''))) * 100}%`
                      : `${(parseInt(metric.value) / parseInt(metric.goal)) * 100}%`
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">Goal: {metric.goal}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;