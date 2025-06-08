import { EditorBtns } from "@/lib/constants";
import { Contact2, Sparkles } from "lucide-react";
import React, { useState } from "react";

type Props = {};

const ContactForm1Placeholder = (props: Props) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleDragState = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleClick = () => {
    setIsClicked(true);

    setTimeout(() => setIsClicked(false), 1000);
  };

  return (
    <div
      draggable
      onClick={handleClick}
      onDragStart={(e) => {
        handleDragState(e, "contactForm1");
      }}
      className="group h-14 w-14 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 rounded-lg flex items-center justify-center border border-purple-200 dark:border-purple-700/50 cursor-pointer active:cursor-grabbing transition-all duration-200 hover:scale-105 hover:shadow-lg"
    >
      <div className="relative">
        <Contact2
          size={40}
          className="text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors"
        />
        {isClicked && (
          <Sparkles
            size={14}
            className="absolute -top-1 -right-1 text-purple-500 transition-opacity animate-ping"
          />
        )}
      </div>
    </div>
  );
};

export default ContactForm1Placeholder;
