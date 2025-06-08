import { EditorBtns } from "@/lib/constants";
import { Quote, Sparkles } from "lucide-react";
import React, { useState } from "react";

type Props = {};

const TestimonialPlaceholder = (props: Props) => {
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
        handleDragState(e, "testimonial");
      }}
      className="group h-14 w-14 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 rounded-lg flex items-center justify-center border border-purple-200 dark:border-purple-700/50 cursor-pointer active:cursor-grabbing transition-all duration-200 hover:scale-105 hover:shadow-lg"
    >
      <div className="relative">
        <img
          src="/tool/happy.gif"
          alt="Testimonial Icon"
          className="w-10 h-10 object-contain transition-all duration-200 opacity-70 group-hover:opacity-90"
          onError={(e) => {
            console.error("Testimonial image failed to load");
            e.currentTarget.style.display = "none";

            const fallbackIcon = document.createElement("div");
            fallbackIcon.innerHTML =
              '<svg class="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 24 24"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>';
            fallbackIcon.className = "flex items-center justify-center";
            e.currentTarget.parentNode?.appendChild(fallbackIcon);
          }}
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

export default TestimonialPlaceholder;
