import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check } from "lucide-react";
import AlCharacter from "./AlCharacter";
import { supabase } from "@/integrations/supabase/client";

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

  const handleSelectInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
    setIsNodding(true);
    setTimeout(() => setIsNodding(false), 1000);
  };

  const handleContinue = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ interests: selectedInterests })
      .eq('id', (await supabase.auth.getUser()).data.user?.id);

    if (error) {
      console.error('Error saving interests:', error);
    } else {
      onComplete();
    }
  };

  const filteredInterests = commonInterests.filter(interest =>
    interest.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-assistant-background p-4">
      <div className="w-full max-w-2xl space-y-8">
        <AlCharacter isNodding={isNodding} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold text-assistant-primary">What do you enjoy?</h1>
          <p className="text-gray-600">Select or type your interests and hobbies</p>
        </motion.div>

        <div className="space-y-4">
          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              placeholder="Type or search interests..." 
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No interests found.</CommandEmpty>
              <CommandGroup>
                {filteredInterests.map((interest) => (
                  <CommandItem
                    key={interest}
                    value={interest}
                    onSelect={() => handleSelectInterest(interest)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                        selectedInterests.includes(interest) ? 'bg-assistant-primary border-assistant-primary' : 'border-gray-300'
                      }`}>
                        {selectedInterests.includes(interest) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span>{interest}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>

          <div className="flex flex-wrap gap-2 mt-4">
            {selectedInterests.map((interest) => (
              <div
                key={interest}
                className="bg-assistant-muted text-assistant-primary px-3 py-1 rounded-full text-sm"
              >
                {interest}
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={selectedInterests.length === 0}
          size="lg"
          className="w-full mt-8"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default InterestsSelection;