import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, PlusCircle, MapPin, User, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Goals = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newGoal, setNewGoal] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [goals, setGoals] = useState([
    { id: 1, name: "Meet new friends", progress: 60, status: "3 new connections" },
    { id: 2, name: "Join a sports club", progress: 30, status: "Research phase" },
  ]);

  const [activities, setActivities] = useState([
    "Basketball",
    "Photography",
    "Cooking",
    "Hiking",
  ]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast({
          variant: "destructive",
          title: "Error signing out",
          description: "Please try again.",
        });
        return;
      }

      // Only navigate after successful sign out
      navigate("/auth", { replace: true });
      
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again.",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setGoals(prev => [...prev, {
        id: prev.length + 1,
        name: newGoal,
        progress: 0,
        status: "Just started"
      }]);
      setNewGoal("");
      toast({
        title: "Goal added",
        description: "Your new goal has been added successfully.",
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <Button
          variant="ghost"
          className="text-gray-600 hover:text-gray-900"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {isSigningOut ? "Signing out..." : "Sign Out"}
        </Button>
      </div>

      {/* Profile Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-2 border-assistant-muted">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                <User className="h-12 w-12 text-assistant-muted" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-xl font-semibold">John Doe</h2>
              <p className="text-gray-600 flex items-center justify-center md:justify-start">
                <MapPin className="h-4 w-4 mr-1" />
                San Francisco, CA
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddGoal();
                }
              }}
            />
            <Button onClick={handleAddGoal}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{goal.name}</span>
                  <span className="text-gray-900 font-medium">{goal.status}</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activities Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Your Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {activities.map((activity) => (
              <div
                key={activity}
                className="bg-assistant-muted text-assistant-primary px-3 py-1 rounded-full text-sm"
              >
                {activity}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Goals;