import { useState } from "react";
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

interface Activity {
  name: string;
  category: string;
}

const defaultActivities: Activity[] = [
  // Sports
  { name: "Golf", category: "Sports" },
  { name: "Basketball", category: "Sports" },
  { name: "Soccer", category: "Sports" },
  // Eating Out
  { name: "Sushi", category: "Eating Out" },
  { name: "Pizza", category: "Eating Out" },
  { name: "Tacos", category: "Eating Out" },
  // Drinks
  { name: "Dive Bar", category: "Drinks" },
  { name: "Cocktail Bar", category: "Drinks" },
  { name: "Beer Garden", category: "Drinks" },
  // Classes
  { name: "Pottery", category: "Classes" },
  { name: "Workout", category: "Classes" },
  { name: "Boxing", category: "Classes" },
  // Shows
  { name: "Comedy Show", category: "Shows" },
  { name: "Jazz Club", category: "Shows" },
  { name: "Broadway", category: "Shows" },
];

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>(defaultActivities);
  const [newActivity, setNewActivity] = useState("");
  const categories = Array.from(new Set(activities.map((a) => a.category)));

  const handleAddActivity = (category: string) => {
    if (newActivity.trim()) {
      setActivities([...activities, { name: newActivity.trim(), category }]);
      setNewActivity("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
        <p className="text-gray-500">Manage your favorite activities by category</p>
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
                  Add and manage your favorite {category.toLowerCase()} activities
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
                        if (e.key === "Enter") {
                          handleAddActivity(category);
                        }
                      }}
                    />
                    <Button onClick={() => handleAddActivity(category)}>
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {activities
                      .filter((activity) => activity.category === category)
                      .map((activity) => (
                        <div
                          key={activity.name}
                          className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm"
                        >
                          {activity.name}
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Activities;