import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { handleAuthClick, listEvents } from "@/utils/googleCalendar";
import { Event } from "@/types/dashboard";

export const useGoogleCalendar = () => {
  const [googleEvents, setGoogleEvents] = useState<Event[]>([]);
  const { toast } = useToast();

  const handleGoogleCalendarSync = async () => {
    try {
      await handleAuthClick();
      const events = await listEvents();
      const formattedEvents: Event[] = (events || []).map((event: any) => ({
        id: parseInt(event.id.substring(0, 8), 16),
        title: event.summary || 'Untitled Event',
        time: new Date(event.start?.dateTime || event.start?.date).toLocaleTimeString(),
        type: 'work'
      }));
      setGoogleEvents(formattedEvents);
      toast({
        title: "Calendar Connected",
        description: "Your Google Calendar has been connected successfully.",
      });
    } catch (error) {
      console.error('Calendar sync error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Calendar. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { googleEvents, handleGoogleCalendarSync };
};