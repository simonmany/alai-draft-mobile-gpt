import { calendar_v3, google } from '@googleapis/calendar';

export const initializeGoogleCalendar = (apiKey: string) => {
  return google.calendar({
    version: 'v3',
    auth: apiKey
  });
};

export const listEvents = async (calendar: calendar_v3.Calendar) => {
  try {
    const response = await calendar.events.list({
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