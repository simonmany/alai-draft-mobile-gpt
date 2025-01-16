export const initializeGoogleCalendar = (apiKey: string) => {
  // Store the API key for later use
  localStorage.setItem('gcal_api_key', apiKey);
  return Promise.resolve(true);
};

export const listEvents = async () => {
  try {
    const apiKey = localStorage.getItem('gcal_api_key');
    if (!apiKey) throw new Error('Google Calendar API key not found');

    const timeMin = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?key=${apiKey}&timeMin=${timeMin}&maxResults=10&singleEvents=true&orderBy=startTime`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};