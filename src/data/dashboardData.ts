export type Event = {
  id: number;
  title: string;
  time: string;
  type: 'work' | 'social';
};

export type Contact = {
  id: number;
  name: string;
  status: string;
  needsAttention: boolean;
};

export type Activity = {
  id: number;
  user: string;
  action: string;
  time: string;
  type: 'fitness' | 'wellness';
};

export type Goal = {
  id: number;
  name: string;
  progress: number;
  status: string;
};

export const upcomingEvents: Event[] = [
  { id: 1, title: "Team Meeting", time: "10:00 AM", type: "work" },
  { id: 2, title: "Lunch with Sarah", time: "12:30 PM", type: "social" },
];

export const recentContacts: Contact[] = [
  { id: 1, name: "Sarah Johnson", status: "Called yesterday", needsAttention: false },
  { id: 2, name: "Mike Peters", status: "Messaged 2 days ago", needsAttention: false },
  { id: 3, name: "David Chen", status: "Last contact: 3 weeks ago", needsAttention: true },
];

export const activityFeed: Activity[] = [
  { 
    id: 1, 
    user: "Sarah Johnson", 
    action: "started a new workout routine",
    time: "2 hours ago",
    type: "fitness"
  },
  { 
    id: 2, 
    user: "Mike Peters", 
    action: "completed their daily meditation",
    time: "3 hours ago",
    type: "wellness"
  },
  { 
    id: 3, 
    user: "David Chen", 
    action: "achieved their step goal",
    time: "5 hours ago",
    type: "fitness"
  },
  { 
    id: 4, 
    user: "Emma Wilson", 
    action: "logged 8 hours of sleep",
    time: "8 hours ago",
    type: "wellness"
  },
  { 
    id: 5, 
    user: "Alex Thompson", 
    action: "completed a yoga session",
    time: "10 hours ago",
    type: "fitness"
  }
];

export const goals: Goal[] = [
  { 
    id: 1, 
    name: "Reconnect with college friends", 
    progress: 30,
    status: "2 friends contacted"
  },
  { 
    id: 2, 
    name: "Meet new friends", 
    progress: 60,
    status: "3 new connections"
  },
  { 
    id: 3, 
    name: "Take a boxing class", 
    progress: 10,
    status: "Research phase"
  }
];

export const activities = [
  { id: 1, name: "Golf" },
  { id: 2, name: "Basketball" },
  { id: 3, name: "Soccer" },
  { id: 4, name: "Sushi" },
  { id: 5, name: "Pizza" },
  { id: 6, name: "Tacos" },
  { id: 7, name: "Dive Bar" },
  { id: 8, name: "Cocktail Bar" },
  { id: 9, name: "Beer Garden" },
  { id: 10, name: "Pottery" },
  { id: 11, name: "Workout" },
  { id: 12, name: "Boxing" },
  { id: 13, name: "Comedy Show" },
  { id: 14, name: "Jazz Club" },
  { id: 15, name: "Broadway" },
];