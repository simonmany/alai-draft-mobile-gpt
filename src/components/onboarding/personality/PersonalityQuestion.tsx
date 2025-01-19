import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AlCharacter from "../AlCharacter";

interface Question {
  id: string;
  title: string;
  description: string;
  options: string[];
  field: string;
}

interface PersonalityQuestionProps {
  question: Question;
  selectedAnswer?: string;
  notes: string;
  isNodding: boolean;
  onOptionSelect: (option: string) => void;
  onNoteChange: (note: string) => void;
  onContinue: () => void;
  isLastQuestion: boolean;
}

const PersonalityQuestion = ({
  question,
  selectedAnswer,
  notes,
  isNodding,
  onOptionSelect,
  onNoteChange,
  onContinue,
  isLastQuestion,
}: PersonalityQuestionProps) => {
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
              onClick={() => onOptionSelect(option)}
              className={`p-4 rounded-lg text-sm transition-colors ${
                selectedAnswer === option
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
          value={notes}
          onChange={(e) => onNoteChange(e.target.value)}
          className="mt-4"
        />
      </div>

      <Button
        onClick={onContinue}
        disabled={!selectedAnswer}
        size="lg"
        className="w-full mt-8"
      >
        {isLastQuestion ? "Finish!" : "Continue"}
      </Button>
    </div>
  );
};

export default PersonalityQuestion;