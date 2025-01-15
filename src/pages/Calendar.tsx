import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { addHours, format, startOfToday, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { upcomingEvents } from "@/data/dashboardData";
import type { Event } from "@/data/dashboardData";

const CalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date(2024, 3, 13)); // April 13, 2024 (Monday)

  // Generate hours for the day view
  const hours = Array.from({ length: 24 }, (_, i) => {
    const time = addHours(startOfToday(), i);
    return format(time, 'h:mm a');
  });

  // Generate days for the week view
  const weekDays = eachDayOfInterval({
    start: startOfWeek(date),
    end: endOfWeek(date)
  });

  // Convert event times to hour indices for positioning
  const getEventHourIndex = (timeStr: string) => {
    const [time, period] = timeStr.split(" ");
    const [hourStr] = time.split(":");
    let hour = parseInt(hourStr);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return hour;
  };

  // Find available slots (excluding event times)
  const occupiedHours = upcomingEvents.map(event => getEventHourIndex(event.time));
  const availableSlots = hours.map((_, index) => {
    return !occupiedHours.includes(index);
  });

  // Helper function to check if an event occurs on a given day
  const getEventsForDay = (day: Date) => {
    return upcomingEvents.filter(() => isSameDay(day, date));
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Day View */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Day View</h2>
        <ScrollArea className="w-full border rounded-lg p-4">
          <div className="min-w-[1200px]">
            <div className="flex">
              {hours.map((hour, index) => (
                <div key={hour} className="flex-1 relative group">
                  <div className="text-sm text-gray-500 absolute -top-6 left-0 w-full text-left truncate px-2">
                    {hour}
                  </div>
                  <div className="h-20 border-l border-gray-200">
                    {upcomingEvents.map((event) => (
                      getEventHourIndex(event.time) === index && (
                        <div
                          key={event.id}
                          className={`absolute top-0 left-0 w-full p-2 rounded-md cursor-pointer overflow-hidden ${
                            event.type === 'work' ? 'bg-assistant-primary/20' : 'bg-assistant-secondary/20'
                          }`}
                        >
                          <p className="text-sm font-medium truncate">{event.title}</p>
                          <p className="text-xs text-gray-500 truncate">{event.time}</p>
                        </div>
                      )
                    ))}
                    {availableSlots[index] && (
                      <div className="absolute top-0 left-0 w-full h-full bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-2">
                          <p className="text-sm font-medium text-green-600 truncate">Available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Week View */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Week View</h2>
        <ScrollArea className="h-[400px] w-full border rounded-lg">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-4">
              <div className="sticky top-0 z-10 bg-white"></div>
              {weekDays.map((day) => (
                <div key={day.toString()} className="text-center border-b pb-2">
                  <div className="font-medium">{format(day, 'EEE')}</div>
                  <div className="text-sm text-gray-500">{format(day, 'd')}</div>
                </div>
              ))}
              {hours.map((hour) => (
                <React.Fragment key={hour}>
                  <div className="text-sm text-gray-500">
                    {hour}
                  </div>
                  {weekDays.map((day) => (
                    <div
                      key={`${day}-${hour}`}
                      className="border-t border-gray-200 min-h-[60px] relative"
                    >
                      {getEventsForDay(day).map((event) => (
                        getEventHourIndex(event.time) === hours.indexOf(hour) && (
                          <div
                            key={event.id}
                            className={`absolute top-0 left-0 right-0 p-2 m-1 rounded-md cursor-pointer overflow-hidden ${
                              event.type === 'work' ? 'bg-assistant-primary/20' : 'bg-assistant-secondary/20'
                            }`}
                          >
                            <p className="text-sm font-medium truncate">{event.title}</p>
                            <p className="text-xs text-gray-500 truncate">{event.time}</p>
                          </div>
                        )
                      ))}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Month View */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Month View</h2>
        <div className="rounded-md border w-full">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md w-full"
            components={{
              Day: ({ date: dayDate, ...props }) => {
                const dayEvents = getEventsForDay(dayDate);
                return (
                  <div className="relative w-full h-full min-h-[100px] p-1">
                    <button {...props} className="w-full h-full">
                      <time dateTime={dayDate.toISOString()} className="absolute top-1 left-1">
                        {format(dayDate, 'd')}
                      </time>
                      <div className="mt-6 space-y-1">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded-sm truncate ${
                              event.type === 'work' ? 'bg-assistant-primary/20' : 'bg-assistant-secondary/20'
                            }`}
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </button>
                  </div>
                );
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;