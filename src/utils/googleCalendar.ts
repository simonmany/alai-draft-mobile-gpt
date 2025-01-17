const CLIENT_ID = '478138990256-i31oqdho3lf07qq6ql97a0n9f9g990u2.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

export const initializeGoogleCalendar = async () => {
  try {
    const tokenResponse = await window.gapi.client.init({
      clientId: CLIENT_ID,
      scope: SCOPES,
      plugin_name: 'calendar'
    });

    return tokenResponse;
  } catch (error) {
    console.error('Error initializing Google Calendar:', error);
    throw error;
  }
};

export const listEvents = async () => {
  try {
    await window.gapi.client.load('calendar', 'v3');
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

export const handleAuthClick = () => {
  return window.gapi.auth2.getAuthInstance().signIn();
};

export const loadGoogleAPI = () => {
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/api.js';
  script.onload = () => {
    window.gapi.load('client:auth2', initializeGoogleCalendar);
  };
  document.body.appendChild(script);
};