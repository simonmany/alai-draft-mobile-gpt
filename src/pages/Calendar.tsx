import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addHours, format, startOfToday, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { upcomingEvents } from "@/data/dashboardData";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Event } from "@/types/dashboard";

const CalendarPage = () => {
  const today = new Date();
  const [date, setDate] = useState<Date>(today);
  const isMobile = useIsMobile();

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

  // Helper function to check if an event occurs on a given day
  const getEventsForDay = (day: Date) => {
    return upcomingEvents;
  };

  const renderDayView = () => (
    <ScrollArea className="h-[calc(100vh-16rem)] w-full border rounded-lg p-4">
      <div className="min-w-[300px]">
        {hours.map((hour, index) => (
          <div key={hour} className="relative min-h-[60px] border-t border-gray-200">
            <span className="absolute -top-3 left-0 text-sm text-gray-500">
              {hour}
            </span>
            {upcomingEvents.map((event) => (
              getEventHourIndex(event.time) === index && (
                <div
                  key={event.id}
                  className={`absolute top-0 left-12 right-0 p-2 m-1 rounded-md cursor-pointer overflow-hidden ${
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
      </div>
    </ScrollArea>
  );

  const renderWeekView = () => (
    <ScrollArea className="h-[calc(100vh-16rem)] w-full border rounded-lg">
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
  );

  const renderMonthView = () => (
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
              <div className="relative w-full h-full min-h-[60px] p-1">
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
  );

  if (!isMobile) {
    return (
      <div className="container mx-auto p-4 space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {format(date, 'EEEE, MMMM d, yyyy')}
        </h1>
        {renderDayView()}
        {renderWeekView()}
        {renderMonthView()}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 h-[calc(100vh-8rem)] flex flex-col">
      <h1 className="text-xl font-bold text-gray-900 mb-4">
        {format(date, 'EEEE, MMMM d, yyyy')}
      </h1>
      
      <Tabs defaultValue="day" className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-hidden">
          <TabsContent value="day" className="h-full">
            {renderDayView()}
          </TabsContent>
          <TabsContent value="week" className="h-full">
            {renderWeekView()}
          </TabsContent>
          <TabsContent value="month" className="h-full">
            {renderMonthView()}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CalendarPage;