import { useState } from "react";
import InterestsSelection from "../InterestsSelection";
import { usePersonalityAssessment, questions } from "./usePersonalityAssessment";
import PersonalityQuestion from "./PersonalityQuestion";

interface PersonalityData {
  social_energy: string;
  social_energy_notes: string;
  social_style: string;
  social_style_notes: string;
  planning_style: string;
  planning_style_notes: string;
}

interface PersonalityAssessmentProps {
  onComplete: (data: PersonalityData) => Promise<void>;
}

const PersonalityAssessment = ({ onComplete }: PersonalityAssessmentProps) => {
  const [showInterests, setShowInterests] = useState(false);
  const {
    currentQuestion,
    isNodding,
    answers,
    notes,
    handleOptionSelect,
    handleNoteChange,
    handleContinue,
  } = usePersonalityAssessment(async (data: PersonalityData) => {
    await onComplete(data);
    setShowInterests(true);
  });

  if (showInterests) {
    return <InterestsSelection onComplete={() => onComplete(answers as PersonalityData)} />;
  }

  const question = questions[currentQuestion];
  const noteField = `${question.field}_notes` as string;

  return (
    <PersonalityQuestion
      question={question}
      selectedAnswer={answers[question.field as keyof typeof answers]}
      notes={notes[noteField] || ""}
      isNodding={isNodding}
      onOptionSelect={handleOptionSelect}
      onNoteChange={handleNoteChange}
      onContinue={handleContinue}
      isLastQuestion={currentQuestion === questions.length - 1}
    />
  );
};

export default PersonalityAssessment;