import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Activity, Bell } from "lucide-react";

const Dashboard = () => {
  const upcomingEvents = [
    { id: 1, title: "Team Meeting", time: "10:00 AM", type: "work" },
    { id: 2, title: "Lunch with Sarah", time: "12:30 PM", type: "social" },
  ];

  const recentContacts = [
    { id: 1, name: "Sarah Johnson", status: "Called yesterday" },
    { id: 2, name: "Mike Peters", status: "Messaged 2 days ago" },
  ];

  const healthMetrics = [
    { id: 1, name: "Steps", value: "8,234", goal: "10,000" },
    { id: 2, name: "Sleep", value: "7h 20m", goal: "8h" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center mb-8">
        <Button size="lg" className="bg-assistant-primary hover:bg-assistant-primary/90 text-white">
          Let's Plan Something!
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
        <button className="p-2 text-gray-400 hover:text-gray-500">
          <Bell className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Schedule */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
            <Calendar className="h-5 w-5 text-assistant-primary" />
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  event.type === 'work' ? 'bg-assistant-primary' : 'bg-assistant-secondary'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Contacts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Contacts</h2>
            <Users className="h-5 w-5 text-assistant-primary" />
          </div>
          <div className="space-y-4">
            {recentContacts.map((contact) => (
              <div key={contact.id} className="flex items-center space-x-3">
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

        {/* Health Overview */}
        <Card className="p-6">
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
    </div>
  );
};

export default Dashboard;