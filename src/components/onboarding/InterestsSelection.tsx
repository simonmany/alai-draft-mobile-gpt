import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check } from "lucide-react";
import AlCharacter from "./AlCharacter";
import DemographicsScreen from "./DemographicsScreen";
import { useIsMobile } from "@/hooks/use-mobile";

const commonInterests = [
  "Playing basketball",
  "Working out",
  "Going to concerts",
  "Reading",
  "Cooking",
  "Traveling",
  "Photography",
  "Hiking",
  "Gaming",
  "Painting",
  "Dancing",
  "Yoga",
  "Swimming",
  "Gardening",
  "Writing",
  "Playing music",
  "Meditation",
  "Cycling",
  "Rock climbing",
  "Volunteering"
];

interface InterestsSelectionProps {
  onComplete: () => void;
}

const InterestsSelection = ({ onComplete }: InterestsSelectionProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isNodding, setIsNodding] = useState(false);
  const [search, setSearch] = useState("");
  const [showDemographics, setShowDemographics] = useState(false);
  const isMobile = useIsMobile();

  const handleSelectInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
    setIsNodding(true);
    setTimeout(() => setIsNodding(false), 1000);
  };

  const handleContinue = () => {
    setShowDemographics(true);
  };

  const filteredInterests = commonInterests.filter(interest =>
    interest.toLowerCase().includes(search.toLowerCase())
  );

  if (showDemographics) {
    return <DemographicsScreen onComplete={onComplete} />;
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-assistant-background p-2 md:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl space-y-4 md:space-y-8">
        <div className={isMobile ? "scale-75 -mb-4" : ""}>
          <AlCharacter isNodding={isNodding} />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 md:space-y-4"
        >
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-assistant-primary`}>
            What do you enjoy?
          </h1>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
            Select or type your interests and hobbies
          </p>
        </motion.div>

        <div className="space-y-2 md:space-y-4">
          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              placeholder="Type or search interests..." 
              value={search}
              onValueChange={setSearch}
              className={isMobile ? "h-9" : ""}
            />
            <CommandList className={isMobile ? "max-h-[30vh]" : "max-h-[40vh]"}>
              <CommandEmpty>No interests found.</CommandEmpty>
              <CommandGroup>
                {filteredInterests.map((interest) => (
                  <CommandItem
                    key={interest}
                    value={interest}
                    onSelect={() => handleSelectInterest(interest)}
                    className={`cursor-pointer ${isMobile ? 'py-1.5' : 'py-2'}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                        selectedInterests.includes(interest) ? 'bg-assistant-primary border-assistant-primary' : 'border-gray-300'
                      }`}>
                        {selectedInterests.includes(interest) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className={isMobile ? "text-sm" : ""}>{interest}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>

          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {selectedInterests.map((interest) => (
              <div
                key={interest}
                className={`bg-assistant-muted text-assistant-primary px-2 md:px-3 py-0.5 md:py-1 rounded-full ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}
              >
                {interest}
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={selectedInterests.length === 0}
          size={isMobile ? "default" : "lg"}
          className="w-full mt-4"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default InterestsSelection;