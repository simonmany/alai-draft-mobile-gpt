import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OnboardingSplash from "@/components/onboarding/OnboardingSplash";

const Contacts = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    return localStorage.getItem("hasSeenContactsOnboarding") === "true";
  });

  useEffect(() => {
    if (hasSeenOnboarding) {
      setShowOnboarding(false);
    }
  }, [hasSeenOnboarding]);

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenContactsOnboarding", "true");
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
  };

  if (showOnboarding) {
    return <OnboardingSplash onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your contacts will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;