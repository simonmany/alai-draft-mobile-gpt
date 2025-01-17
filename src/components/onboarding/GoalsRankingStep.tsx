import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useIsMobile } from "@/hooks/use-mobile";

interface GoalsRankingStepProps {
  selectedGoals: string[];
  onComplete: () => void;
}

const GoalsRankingStep = ({ selectedGoals, onComplete }: GoalsRankingStepProps) => {
  const [orderedGoals, setOrderedGoals] = React.useState(selectedGoals);
  const isMobile = useIsMobile();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(orderedGoals);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedGoals(items);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-assistant-background p-2 md:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl space-y-4 md:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 md:space-y-4"
        >
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-assistant-primary`}>
            Prioritize Your Goals
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Drag and drop to order your goals from most to least important
          </p>
        </motion.div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="goals">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2 md:space-y-4"
              >
                {orderedGoals.map((goal, index) => (
                  <Draggable key={goal} draggableId={goal} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-2 md:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-400 text-sm md:text-base">{index + 1}</span>
                          <span className="text-gray-900 text-sm md:text-base">{goal}</span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <Button 
            onClick={onComplete} 
            size={isMobile ? "default" : "lg"}
            className="mt-4"
          >
            Continue
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default GoalsRankingStep;