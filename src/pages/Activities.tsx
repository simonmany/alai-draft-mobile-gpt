import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { activities } from "@/data/dashboardData";

const Activities = () => {
  const navigate = useNavigate();
  const [newActivity, setNewActivity] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const categories = [
    "Sports",
    "Eating Out",
    "Drinks",
    "Classes",
    "Shows"
  ];

  const categorizedActivities = activities.reduce((acc, activity) => {
    const category = getActivityCategory(activity.name);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(activity.name);
    return acc;
  }, {} as Record<string, string[]>);

  const getActivityCategory = (activity: string): string => {
    if (["Golf", "Basketball", "Soccer"].includes(activity)) return "Sports";
    if (["Sushi", "Pizza", "Tacos"].includes(activity)) return "Eating Out";
    if (["Dive Bar", "Cocktail Bar", "Beer Garden"].includes(activity)) return "Drinks";
    if (["Pottery", "Workout", "Boxing"].includes(activity)) return "Classes";
    if (["Comedy Show", "Jazz Club", "Broadway"].includes(activity)) return "Shows";
    return "Other";
  };

  const handleActivitySelect = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleContinue = () => {
    navigate("/");
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">What do you like to do?</h1>
          <p className="text-gray-500 mt-2">Select activities you enjoy or add your own</p>
        </div>

        <Tabs defaultValue={categories[0]} className="space-y-4">
          <TabsList className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="px-4">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <Card>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                  <CardDescription>
                    Select your favorite {category.toLowerCase()} activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder={`Add new ${category.toLowerCase()} activity...`}
                        value={newActivity}
                        onChange={(e) => setNewActivity(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newActivity.trim()) {
                            setSelectedActivities(prev => [...prev, newActivity.trim()]);
                            setNewActivity("");
                          }
                        }}
                      />
                      <Button 
                        onClick={() => {
                          if (newActivity.trim()) {
                            setSelectedActivities(prev => [...prev, newActivity.trim()]);
                            setNewActivity("");
                          }
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {categorizedActivities[category]?.map((activity) => (
                        <button
                          key={activity}
                          onClick={() => handleActivitySelect(activity)}
                          className={`rounded-lg border p-3 text-left transition-colors ${
                            selectedActivities.includes(activity)
                              ? "border-assistant-primary bg-assistant-muted"
                              : "border-gray-200 hover:border-assistant-primary hover:bg-assistant-muted/50"
                          }`}
                        >
                          {activity}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end">
          <Button 
            onClick={handleContinue}
            className="px-8"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Activities;