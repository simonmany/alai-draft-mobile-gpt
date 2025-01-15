import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import ActivitySelector from "./planning/ActivitySelector";
import ContactSelector from "./planning/ContactSelector";
import TimeSelector from "./planning/TimeSelector";
import { activities, contacts, times } from "./planning/constants";

interface PlanningDialogProps {
  initialPerson?: string;
  initialTime?: string;
  trigger?: React.ReactNode;
}

const PlanningDialog = ({ 
  initialPerson = "", 
  initialTime = "", 
  trigger 
}: PlanningDialogProps) => {
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
      const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
      const randomTime = times[Math.floor(Math.random() * times.length)];
      
      setActivity(randomActivity);
      setPerson(randomContact.name);
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
          <DialogDescription>Create a new plan with your friends</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-6 pt-4">
          <div className="flex flex-col space-y-4 text-lg">
            <span>I want to</span>
            <ActivitySelector
              activity={activity}
              setActivity={setActivity}
              activityOpen={activityOpen}
              setActivityOpen={setActivityOpen}
            />

            <span>with</span>
            <ContactSelector
              person={person}
              setPerson={setPerson}
              personOpen={personOpen}
              setPersonOpen={setPersonOpen}
            />

            <span>at</span>
            <TimeSelector
              time={time}
              setTime={setTime}
              timeOpen={timeOpen}
              setTimeOpen={setTimeOpen}
              getNextAvailableSlot={getNextAvailableSlot}
            />
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