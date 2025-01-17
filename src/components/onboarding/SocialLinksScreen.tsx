import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import AlCharacter from "./AlCharacter";

interface SocialLinksScreenProps {
  onComplete: () => void;
}

const SocialLinksScreen = ({ onComplete }: SocialLinksScreenProps) => {
  const socialPlatforms = [
    { name: "Facebook", color: "bg-blue-600" },
    { name: "Instagram", color: "bg-pink-600" },
    { name: "Snapchat", color: "bg-yellow-400" },
    { name: "TikTok", color: "bg-black" }
  ];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-assistant-background p-4">
      <div className="w-full max-w-2xl space-y-8">
        <AlCharacter isNodding={false} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold text-assistant-primary">Connect your social media</h1>
          <p className="text-gray-600">Link your accounts to share moments and memories</p>
        </motion.div>

        <div className="space-y-4">
          {socialPlatforms.map((platform) => (
            <Button
              key={platform.name}
              onClick={() => {}}
              size="lg"
              className={`w-full text-white ${platform.color}`}
            >
              Connect {platform.name}
            </Button>
          ))}

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

export default SocialLinksScreen;