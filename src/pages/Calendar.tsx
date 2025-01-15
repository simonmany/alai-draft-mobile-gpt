import { useState } from "react";
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
    <div className="container mx-auto p-4 space-y-8">
      {/* Day View */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Day View</h2>
        <ScrollArea className="w-full border rounded-lg p-4">
          <div className="min-w-[1200px]">
            <div className="flex">
              {hours.map((hour, index) => (
                <div key={hour} className="flex-1 relative group">
                  <div className="text-sm text-gray-500 absolute -top-6 left-0">{hour}</div>
                  <div className="h-20 border-l border-gray-200">
                    {index === 0 && (
                      <div className="absolute top-0 left-0 w-full h-full bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
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
      </div>

      {/* Month View */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Month View</h2>
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;