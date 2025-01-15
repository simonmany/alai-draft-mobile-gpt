import { useState } from "react";
import { Command } from "cmdk";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command as CommandPrimitive,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlanningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Array<{ id: number; name: string }>;
  contacts: Array<{ id: number; name: string }>;
}

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute} ${period}`;
});

const PlanningDialog = ({ isOpen, onClose, activities, contacts }: PlanningDialogProps) => {
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedContact, setSelectedContact] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleSubmit = () => {
    console.log("Planning:", { selectedActivity, selectedContact, selectedTime });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Let's Plan Something</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">I want to...</label>
            <CommandPrimitive className="border rounded-md">
              <CommandInput
                placeholder="Type an activity..."
                value={selectedActivity}
                onValueChange={setSelectedActivity}
              />
              <CommandEmpty>No activities found.</CommandEmpty>
              <CommandGroup className="max-h-40 overflow-y-auto">
                {activities.map((activity) => (
                  <CommandItem
                    key={activity.id}
                    value={activity.name}
                    onSelect={setSelectedActivity}
                  >
                    {activity.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandPrimitive>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">with...</label>
            <CommandPrimitive className="border rounded-md">
              <CommandInput
                placeholder="Type a contact..."
                value={selectedContact}
                onValueChange={setSelectedContact}
              />
              <CommandEmpty>No contacts found.</CommandEmpty>
              <CommandGroup className="max-h-40 overflow-y-auto">
                {contacts.map((contact) => (
                  <CommandItem
                    key={contact.id}
                    value={contact.name}
                    onSelect={setSelectedContact}
                  >
                    {contact.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandPrimitive>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">at...</label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanningDialog;