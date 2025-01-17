import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import AlCharacter from "./AlCharacter";
import CalendarContactsScreen from "./CalendarContactsScreen";
import SocialLinksScreen from "./SocialLinksScreen";
import PhotosAccessScreen from "./PhotosAccessScreen";
import { useIsMobile } from "@/hooks/use-mobile";

interface DemographicsScreenProps {
  onComplete: () => void;
}

const ageRanges = [
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65+"
];

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Mandarin",
  "Hindi",
  "Arabic",
  "Portuguese",
  "Japanese",
  "Korean"
];

const relationshipStatuses = [
  "Single",
  "In a Relationship",
  "Married",
  "Divorced",
  "Widowed",
  "It's Complicated"
];

const genderOptions = [
  "Male",
  "Female",
  "Non-Binary"
];

const DemographicsScreen = ({ onComplete }: DemographicsScreenProps) => {
  const [isNodding, setIsNodding] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<
    "demographics" | "calendar" | "social" | "photos"
  >("demographics");
  const [formData, setFormData] = useState({
    age: "",
    location: "",
    languages: [] as string[],
    relationshipStatus: "",
    gender: "",
    occupation: "",
    dietaryRestrictions: ""
  });
  const isMobile = useIsMobile();

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsNodding(true);
    setTimeout(() => setIsNodding(false), 1000);
  };

  const handleContinue = () => {
    setCurrentScreen("calendar");
  };

  const handleCalendarComplete = () => {
    setCurrentScreen("social");
  };

  const handleSocialComplete = () => {
    setCurrentScreen("photos");
  };

  if (currentScreen === "photos") {
    return <PhotosAccessScreen onComplete={onComplete} />;
  }

  if (currentScreen === "social") {
    return <SocialLinksScreen onComplete={handleSocialComplete} />;
  }

  if (currentScreen === "calendar") {
    return <CalendarContactsScreen onComplete={handleCalendarComplete} />;
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
            Now let's get through the details...
          </h1>
        </motion.div>

        <div className="space-y-3 md:space-y-6">
          <div className="space-y-1 md:space-y-2">
            <label className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Age Range</label>
            <Select
              value={formData.age}
              onValueChange={(value) => handleInputChange('age', value)}
            >
              <SelectTrigger className={isMobile ? "h-8 text-sm" : ""}>
                <SelectValue placeholder="Select your age range" />
              </SelectTrigger>
              <SelectContent>
                {ageRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 md:space-y-2">
            <label className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Location (City, US)</label>
            <Input
              type="text"
              placeholder="Enter your city"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={isMobile ? "h-8 text-sm" : ""}
            />
          </div>

          <div className="space-y-1 md:space-y-2">
            <label className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Languages</label>
            <Select
              value={formData.languages[0] || ""}
              onValueChange={(value) => handleInputChange('languages', [value])}
            >
              <SelectTrigger className={isMobile ? "h-8 text-sm" : ""}>
                <SelectValue placeholder="Select languages you speak" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 md:space-y-2">
            <label className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Relationship Status</label>
            <Select
              value={formData.relationshipStatus}
              onValueChange={(value) => handleInputChange('relationshipStatus', value)}
            >
              <SelectTrigger className={isMobile ? "h-8 text-sm" : ""}>
                <SelectValue placeholder="Select your relationship status" />
              </SelectTrigger>
              <SelectContent>
                {relationshipStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 md:space-y-2">
            <label className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Gender</label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
            >
              <SelectTrigger className={isMobile ? "h-8 text-sm" : ""}>
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 md:space-y-2">
            <label className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Occupation</label>
            <Input
              type="text"
              placeholder="Enter your occupation"
              value={formData.occupation}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
              className={isMobile ? "h-8 text-sm" : ""}
            />
          </div>

          <div className="space-y-1 md:space-y-2">
            <label className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Dietary Restrictions</label>
            <Input
              type="text"
              placeholder="Any dietary restrictions?"
              value={formData.dietaryRestrictions}
              onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
              className={isMobile ? "h-8 text-sm" : ""}
            />
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!formData.age || !formData.location}
          size={isMobile ? "default" : "lg"}
          className="w-full mt-4"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default DemographicsScreen;