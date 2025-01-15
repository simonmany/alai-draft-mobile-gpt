import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const activities = [
  "have coffee",
  "go for a walk",
  "have lunch",
  "exercise",
  "meet",
  "catch up",
];

const times = [
  "morning",
  "afternoon",
  "evening",
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
  const { toast } = useToast();

  const handlePlan = () => {
    if (activity && person && time) {
      toast({
        title: "Plan Created!",
        description: `You're going to ${activity} with ${person} ${time}.`,
      });
      setOpen(false);
      // Reset selections
      setActivity("");
      setPerson("");
      setTime("");
    }
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-2 text-lg">
            <span>I want to</span>
            <Select value={activity} onValueChange={setActivity}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select activity" />
              </SelectTrigger>
              <SelectContent>
                {activities.map((act) => (
                  <SelectItem key={act} value={act}>
                    {act}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>with</span>
            <Select value={person} onValueChange={setPerson}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select person" />
              </SelectTrigger>
              <SelectContent>
                {people.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 text-lg">
            <span>at</span>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {times.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handlePlan}
            disabled={!activity || !person || !time}
            className="w-full mt-4"
          >
            Create Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanningDialog;