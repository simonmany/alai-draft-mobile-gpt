import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AlCharacter from "./AlCharacter";
import InterestsSelection from "./InterestsSelection";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

interface PersonalityData {
  social_energy: string;
  social_energy_notes: string;
  social_style: string;
  social_style_notes: string;
  planning_style: string;
  planning_style_notes: string;
}

interface Question {
  id: string;
  title: string;
  description: string;
  options: string[];
  field: keyof Omit<PersonalityData, "social_energy_notes" | "social_style_notes" | "planning_style_notes">;
}

interface PersonalityAssessmentProps {
  onComplete: (data: PersonalityData) => Promise<void>;
}

const questions: Question[] = [
  {
    id: "introvert-extrovert",
    title: "Do you consider yourself an introvert or an extrovert?",
    description: "Select where you fall on the spectrum",
    options: [
      "Strongly Introverted",
      "Somewhat Introverted",
      "Balanced",
      "Somewhat Extroverted",
      "Strongly Extroverted"
    ],
    field: "social_energy"
  },
  {
    id: "quiet-talkative",
    title: "Are you quiet or talkative in social settings?",
    description: "Select your typical social style",
    options: [
      "Very Quiet",
      "Somewhat Quiet",
      "Balanced",
      "Somewhat Talkative",
      "Very Talkative"
    ],
    field: "social_style"
  },
  {
    id: "planning-spontaneous",
    title: "Do you prefer planning ahead or being spontaneous?",
    description: "Select your planning style",
    options: [
      "Always Plan Ahead",
      "Usually Plan Ahead",
      "Balanced",
      "Usually Spontaneous",
      "Always Spontaneous"
    ],
    field: "planning_style"
  }
];

const PersonalityAssessment = ({ onComplete }: PersonalityAssessmentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isNodding, setIsNodding] = useState(false);
  const [answers, setAnswers] = useState<Partial<PersonalityData>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showInterests, setShowInterests] = useState(false);
  const { toast } = useToast();

  const handleOptionSelect = (option: string) => {
    const question = questions[currentQuestion];
    setAnswers(prev => ({ ...prev, [question.field]: option }));
    setIsNodding(true);
    
    setTimeout(() => {
      setIsNodding(false);
    }, 2000);
  };

  const handleNoteChange = (note: string) => {
    const question = questions[currentQuestion];
    const noteField = `${question.field}_notes` as keyof PersonalityData;
    setNotes(prev => ({ ...prev, [noteField]: note }));
  };

  const handleContinue = async () => {
    try {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Error",
            description: "No user found. Please try logging in again.",
            variant: "destructive",
          });
          return;
        }

        const personalityData: PersonalityData = {
          social_energy: answers.social_energy || '',
          social_energy_notes: notes.social_energy_notes || '',
          social_style: answers.social_style || '',
          social_style_notes: notes.social_style_notes || '',
          planning_style: answers.planning_style || '',
          planning_style_notes: notes.planning_style_notes || ''
        };

        // Convert personalityData to a format that matches the Json type
        const personalityJson: { [key: string]: Json } = {
          social_energy: personalityData.social_energy,
          social_energy_notes: personalityData.social_energy_notes,
          social_style: personalityData.social_style,
          social_style_notes: personalityData.social_style_notes,
          planning_style: personalityData.planning_style,
          planning_style_notes: personalityData.planning_style_notes
        };

        // Save to personality_assessment table
        const { error: assessmentError } = await supabase
          .from('personality_assessment')
          .insert([{
            user_id: user.id,
            ...personalityData
          }]);

        if (assessmentError) {
          console.error('Error saving personality assessment:', assessmentError);
          toast({
            title: "Error",
            description: "Failed to save personality assessment. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Update profiles table with the properly typed JSON
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            personality_traits: personalityJson,
            onboarding_step: 4
          })
          .eq('id', user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          toast({
            title: "Error",
            description: "Failed to update profile. Please try again.",
            variant: "destructive",
          });
          return;
        }

        await onComplete(personalityData);
        setShowInterests(true);
      }
    } catch (error) {
      console.error('Error in handleContinue:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInterestsComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "No user found. Please try logging in again.",
          variant: "destructive",
        });
        return;
      }

      // Only set onboarding_completed to true after interests are selected
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          onboarding_step: 5
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error completing onboarding:', profileError);
        toast({
          title: "Error",
          description: "Failed to complete onboarding. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Redirect to home or show completion screen
      window.location.href = '/';
    } catch (error) {
      console.error('Error completing interests:', error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (showInterests) {
    return <InterestsSelection onComplete={handleInterestsComplete} />;
  }

  const question = questions[currentQuestion];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-assistant-background p-4">
      <AlCharacter isNodding={isNodding} />
      
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-assistant-primary">{question.title}</h1>
        <p className="text-gray-600">{question.description}</p>
      </motion.div>

      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={`p-4 rounded-lg text-sm transition-colors ${
                answers[question.field] === option
                  ? "bg-assistant-primary text-white"
                  : "bg-white hover:bg-assistant-muted"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <Textarea
          placeholder="Say More? (Optional)"
          value={notes[`${question.field}_notes`] || ""}
          onChange={(e) => handleNoteChange(e.target.value)}
          className="mt-4"
        />
      </div>

      <Button
        onClick={handleContinue}
        disabled={!answers[question.field]}
        size="lg"
        className="w-full mt-8"
      >
        {currentQuestion < questions.length - 1 ? "Continue" : "Finish!"}
      </Button>
    </div>
  );
};

export default PersonalityAssessment;