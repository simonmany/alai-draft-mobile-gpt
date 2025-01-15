import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Plus, Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const activities = [
  "have coffee",
  "go for a walk",
  "have lunch",
  "exercise",
  "meet",
  "catch up",
];

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

const times = [
  "next available slot",
  ...generateTimeSlots(),
  "tomorrow",
  "this weekend",
  "next week",
];

const people = [
  "Sarah Johnson",
  "Mike Peters",
  "David Chen",
  "Emma Wilson",
  "Alex Thompson",
];

interface PlanningDialogProps {
  initialPerson?: string;
  initialTime?: string;
  trigger?: React.ReactNode;
}

const PlanningDialog = ({ initialPerson = "", initialTime = "", trigger }: PlanningDialogProps) => {
  const [activity, setActivity] = useState<string>("");
  const [person, setPerson] = useState<string>(initialPerson);
  const [time, setTime] = useState<string>(initialTime);
  const [open, setOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [personOpen, setPersonOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const { toast } = useToast();

  const getNextAvailableSlot = () => {
    return "2:30 PM"; // This would normally be calculated based on actual schedule
  };

  const handleSurpriseMe = () => {
    if (!activity || !person || !time) {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      const randomPerson = people[Math.floor(Math.random() * people.length)];
      const randomTime = times[Math.floor(Math.random() * times.length)];
      
      setActivity(randomActivity);
      setPerson(randomPerson);
      setTime(randomTime);
    } else {
      handlePlan();
    }
  };

  const handlePlan = () => {
    const displayTime = time === "next available slot" ? getNextAvailableSlot() : time;
    
    toast({
      title: "Plan Created!",
      description: `You're going to ${activity} with ${person} ${displayTime}.`,
    });
    setOpen(false);
    // Reset selections
    setActivity("");
    setPerson("");
    setTime("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="bg-assistant-primary hover:bg-assistant-primary/90 text-white text-lg py-6 w-full">
            <Plus className="mr-2" />
            Let's Plan Something!
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Plan Something</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-6 pt-4">
          <div className="flex flex-col space-y-4 text-lg">
            <span>I want to</span>
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
              <PopoverContent className="w-full p-0">
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

            <span>with</span>
            <Popover open={personOpen} onOpenChange={setPersonOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={personOpen}
                  className="w-full justify-between"
                >
                  {person ? person : "Select person..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search people..." />
                  <CommandEmpty>No person found.</CommandEmpty>
                  <CommandGroup>
                    {people.map((p) => (
                      <CommandItem
                        key={p}
                        value={p}
                        onSelect={(currentValue) => {
                          setPerson(currentValue);
                          setPersonOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            person === p ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {p}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <span>at</span>
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
              <PopoverContent className="w-full p-0">
                <Command>
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
          </div>
          <Button 
            onClick={handleSurpriseMe}
            className="w-full mt-4"
          >
            {(!activity || !person || !time) ? "Surprise Me!" : "Create Plan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanningDialog;