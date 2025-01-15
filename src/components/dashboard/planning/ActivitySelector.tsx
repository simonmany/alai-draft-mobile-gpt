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
import { activities } from "./constants";

interface ActivitySelectorProps {
  activity: string;
  setActivity: (activity: string) => void;
  activityOpen: boolean;
  setActivityOpen: (open: boolean) => void;
}

const ActivitySelector = ({
  activity,
  setActivity,
  activityOpen,
  setActivityOpen,
}: ActivitySelectorProps) => {
  return (
    <Popover open={activityOpen} onOpenChange={setActivityOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={activityOpen}
          className="w-full justify-between"
        >
          {activity ? activity : "Select activity..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search activities..." />
          <CommandEmpty>No activity found.</CommandEmpty>
          <CommandGroup>
            {activities.map((act) => (
              <CommandItem
                key={act}
                value={act}
                onSelect={(currentValue) => {
                  setActivity(currentValue);
                  setActivityOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    activity === act ? "opacity-100" : "opacity-0"
                  )}
                />
                {act}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ActivitySelector;