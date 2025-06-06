import { EditorBtns } from "@/lib/constants";
import { Sparkles } from "lucide-react";
import React, { useState } from "react";

type Props = {};

const SocialIconsPlaceholder = (props: Props) => {
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
        handleDragState(e, "socialIcons");
      }}
      className="group h-14 w-14 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 rounded-lg flex items-center justify-center border border-blue-200 dark:border-blue-700/50 cursor-pointer active:cursor-grabbing transition-all duration-200 hover:scale-105 hover:shadow-lg"
    >
      <div className="relative">
        <img
          src="/tool/social-media.gif"
          alt="Input Icon"
          className="w-10 h-10 object-contain transition-all duration-200 opacity-70 group-hover:opacity-90"
          onError={(e) => {
            console.error("Image failed to load");
            e.currentTarget.style.display = "none";
          }}
        />
        {isClicked && (
          <Sparkles
            size={14}
            className="absolute -top-1 -right-1 text-blue-500 transition-opacity animate-ping"
          />
        )}
      </div>
    </div>
  );
};

export default SocialIconsPlaceholder;
