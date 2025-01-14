import { MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-8 md:right-8">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-[320px] h-[480px] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Chat</h3>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 p-4">
            <p className="text-gray-500 text-center mt-4">Chat coming soon...</p>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-12 w-12 rounded-full bg-assistant-primary hover:bg-assistant-primary/90"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
};

export default ChatBubble;