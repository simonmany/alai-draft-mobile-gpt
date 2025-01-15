export const activities = [
  "have coffee",
  "go for a walk",
  "have lunch",
  "exercise",
  "meet",
  "catch up",
] as const;

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute of [0, 30]) {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      slots.push(`${displayHour}:${minute === 0 ? '00' : '30'} ${period}`);
    }
  }
  return slots;
};

export const times = [
  "next available slot",
  ...generateTimeSlots(),
  "tomorrow",
  "this weekend",
  "next week",
] as const;

export const contacts = [
  { id: 1, name: "Sarah Johnson" },
  { id: 2, name: "Mike Peters" },
  { id: 3, name: "David Chen" },
  { id: 4, name: "Emma Wilson" },
  { id: 5, name: "Alex Thompson" },
] as const;