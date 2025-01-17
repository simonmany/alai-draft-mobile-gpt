import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import AlCharacter from "./AlCharacter";

interface PhotosAccessScreenProps {
  onComplete: () => void;
}

const PhotosAccessScreen = ({ onComplete }: PhotosAccessScreenProps) => {
  const handleComplete = () => {
    // Simply navigate to the home screen
    window.location.href = '/';
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-assistant-background p-4">
      <div className="w-full max-w-2xl space-y-8">
        <AlCharacter isNodding={false} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold text-assistant-primary">Access your photos</h1>
          <p className="text-gray-600">Let me help you organize and share your memories</p>
        </motion.div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <Image className="h-16 w-16 mx-auto mb-4 text-assistant-primary" />
            <p className="text-gray-600">
              Allow access to your photos to help create and share memories with your loved ones
            </p>
          </div>

          <Button
            onClick={handleComplete}
            size="lg"
            className="w-full"
            variant="outline"
          >
            Allow Photos Access
          </Button>

          <Button
            onClick={handleComplete}
            size="lg"
            className="w-full"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotosAccessScreen;