import { calendar } from '@googleapis/calendar';

export const initializeGoogleCalendar = (apiKey: string) => {
  return calendar({
    version: 'v3',
    auth: apiKey
  });
};

export const listEvents = async (calendarInstance: any) => {
  try {
    const response = await calendarInstance.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};