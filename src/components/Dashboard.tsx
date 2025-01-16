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
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

const Dashboard = () => {
  const [isPlanningOpen, setIsPlanningOpen] = useState(false);
  const [googleEvents, setGoogleEvents] = useState<Event[]>([]);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
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
    const storedApiKey = localStorage.getItem('gcal_api_key');
    if (!storedApiKey) {
      setApiKeyDialogOpen(true);
      return;
    }

    try {
      await initializeGoogleCalendar(storedApiKey);
      const events = await listEvents();
      const formattedEvents: Event[] = (events || []).map((event: any) => ({
        id: parseInt(event.id.substring(0, 8), 16), // Convert first 8 chars of event ID to number
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
      console.error('Calendar sync error:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync with Google Calendar. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleApiKeySubmit = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid Google Calendar API key.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('gcal_api_key', apiKey);
    setApiKeyDialogOpen(false);
    await handleGoogleCalendarSync();
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

      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Google Calendar API Key</DialogTitle>
            <DialogDescription>
              Please enter your Google Calendar API key to sync your calendar.
              You can obtain an API key from the Google Cloud Console.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button onClick={handleApiKeySubmit} className="w-full">
              Save and Sync
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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