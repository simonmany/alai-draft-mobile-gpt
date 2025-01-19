import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

interface PersonalityData {
  social_energy: string;
  social_energy_notes: string;
  social_style: string;
  social_style_notes: string;
  planning_style: string;
  planning_style_notes: string;
}

export const questions = [
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

export const usePersonalityAssessment = (onComplete: (data: PersonalityData) => Promise<void>) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isNodding, setIsNodding] = useState(false);
  const [answers, setAnswers] = useState<Partial<PersonalityData>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
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

        const personalityJson: { [key: string]: Json } = {
          social_energy: personalityData.social_energy,
          social_energy_notes: personalityData.social_energy_notes,
          social_style: personalityData.social_style,
          social_style_notes: personalityData.social_style_notes,
          planning_style: personalityData.planning_style,
          planning_style_notes: personalityData.planning_style_notes
        };

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

  return {
    currentQuestion,
    isNodding,
    answers,
    notes,
    handleOptionSelect,
    handleNoteChange,
    handleContinue,
  };
};