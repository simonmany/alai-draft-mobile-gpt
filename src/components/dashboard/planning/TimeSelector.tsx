import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { times } from "./constants";

interface TimeSelectorProps {
  time: string;
  setTime: (time: string) => void;
  timeOpen: boolean;
  setTimeOpen: (open: boolean) => void;
  getNextAvailableSlot: () => string;
}

const TimeSelector = ({
  time,
  setTime,
  timeOpen,
  setTimeOpen,
  getNextAvailableSlot,
}: TimeSelectorProps) => {
  return (
    <Popover open={timeOpen} onOpenChange={setTimeOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={timeOpen}
          className="w-full justify-between"
        >
          {time === "next available slot" 
            ? `next available slot (${getNextAvailableSlot()})` 
            : time || "Select time..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search time..." />
          <CommandEmpty>No time found.</CommandEmpty>
          <CommandGroup>
            {times.map((t) => (
              <CommandItem
                key={t}
                value={t}
                onSelect={(currentValue) => {
                  setTime(currentValue);
                  setTimeOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    time === t ? "opacity-100" : "opacity-0"
                  )}
                />
                {t === "next available slot" 
                  ? `${t} (${getNextAvailableSlot()})` 
                  : t}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TimeSelector;