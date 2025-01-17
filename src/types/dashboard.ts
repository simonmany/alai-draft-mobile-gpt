export interface Event {
  id: number;
  title: string;
  time: string;
  type: 'work' | 'social';
}

export interface Contact {
  id: number;
  name: string;
  status: string;
  needsAttention: boolean;
}

export interface Goal {
  id: number;
  name: string;
  progress: number;
  status: string;
}

export interface Activity {
  id: number;
  name: string;
}