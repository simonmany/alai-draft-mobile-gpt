import { useState } from "react";
import InterestsSelection from "../InterestsSelection";
import { usePersonalityAssessment, questions } from "./usePersonalityAssessment";
import PersonalityQuestion from "./PersonalityQuestion";

interface PersonalityAssessmentProps {
  onComplete: (data: any) => Promise<void>;
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
  } = usePersonalityAssessment(async (data) => {
    await onComplete(data);
    setShowInterests(true);
  });

  if (showInterests) {
    return <InterestsSelection onComplete={onComplete} />;
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