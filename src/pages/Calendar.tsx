import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { addHours, format, startOfToday, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

const CalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());

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

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="day" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>

        {/* Day View */}
        <TabsContent value="day">
          <ScrollArea className="h-[calc(100vh-200px)] w-full">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-[100px_1fr] gap-4">
                {hours.map((hour) => (
                  <div key={hour} className="group relative min-h-[60px]">
                    <div className="sticky left-0 text-sm text-gray-500">{hour}</div>
                    <div className="absolute inset-y-0 left-[100px] right-0 border-t border-gray-200 group-first:border-t-0"></div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Week View */}
        <TabsContent value="week">
          <ScrollArea className="h-[calc(100vh-200px)] w-full">
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
                  <>
                    <div key={hour} className="text-sm text-gray-500">
                      {hour}
                    </div>
                    {weekDays.map((day) => (
                      <div
                        key={`${day}-${hour}`}
                        className="border-t border-gray-200 min-h-[60px]"
                      ></div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Month View */}
        <TabsContent value="month">
          <div className="rounded-md border">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalendarPage;