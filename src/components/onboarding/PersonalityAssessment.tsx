import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import AlCharacter from "./AlCharacter";

interface Question {
  id: string;
  title: string;
  description: string;
  options: string[];
  field: "social_energy" | "social_style" | "planning_style";
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

const PersonalityAssessment = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isNodding, setIsNodding] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

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
    setNotes(prev => ({ ...prev, [question.field + "_notes"]: note }));
  };

  const handleContinue = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Navigate directly to activities screen after last question
      navigate("/activities");
    }
  };

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
          value={notes[question.field + "_notes"] || ""}
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
        Continue
      </Button>
    </div>
  );
};

export default PersonalityAssessment;