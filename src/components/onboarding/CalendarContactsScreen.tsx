import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Users } from "lucide-react";
import AlCharacter from "./AlCharacter";

interface CalendarContactsScreenProps {
  onComplete: () => void;
}

const CalendarContactsScreen = ({ onComplete }: CalendarContactsScreenProps) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-assistant-background p-4">
      <div className="w-full max-w-2xl space-y-8">
        <AlCharacter isNodding={false} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold text-assistant-primary">Let's connect your calendar and contacts</h1>
          <p className="text-gray-600">This helps me understand your schedule and relationships better</p>
        </motion.div>

        <div className="space-y-6">
          <Button
            onClick={onComplete}
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <Calendar className="h-5 w-5" />
            Connect Calendar
          </Button>

          <Button
            onClick={onComplete}
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <Users className="h-5 w-5" />
            Connect Contacts
          </Button>

          <Button
            onClick={onComplete}
            size="lg"
            className="w-full mt-8"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarContactsScreen;