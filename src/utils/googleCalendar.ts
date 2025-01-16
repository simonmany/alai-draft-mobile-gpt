// Initialize the Google Calendar API client
export const initializeGoogleCalendar = (apiKey: string) => {
  // Load the Google Calendar API client
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      // @ts-ignore - gapi is loaded from external script
      if (!window.gapi) {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          // @ts-ignore - gapi is loaded from external script
          window.gapi.load('client', () => {
            // @ts-ignore - gapi is loaded from external script
            window.gapi.client.init({
              apiKey: apiKey,
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            }).then(() => {
              resolve(true);
            });
          });
        };
        document.body.appendChild(script);
      } else {
        resolve(true);
      }
    }
  });
};

export const listEvents = async () => {
  try {
    // @ts-ignore - gapi is loaded from external script
    const response = await window.gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    });
    return response.result.items;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};