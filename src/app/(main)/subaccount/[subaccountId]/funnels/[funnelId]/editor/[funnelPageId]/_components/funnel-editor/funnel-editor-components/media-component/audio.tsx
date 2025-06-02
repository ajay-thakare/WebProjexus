"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns } from "@/lib/constants";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash, Volume2 } from "lucide-react";
import React from "react";

type Props = {
  element: EditorElement;
};

const AudioComponent = ({ element }: Props) => {
  const { dispatch, state } = useEditor();
  const { styles, content, id, name } = element;

  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleDeleteElement = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const isSelected = state.editor.selectedElement.id === id;
  const isLiveMode = state.editor.liveMode;

  // Check if content is not an array (audio content should be an object)
  if (Array.isArray(content)) {
    return (
      <div className="p-4 border-2 border-red-300 bg-red-50 text-red-600 rounded">
        <p>Audio component error: Invalid content structure</p>
      </div>
    );
  }

  // Get audio properties with defaults
  const audioSrc = content.src || "";
  const showControls = !!content.controls;
  const autoPlay = !!content.autoplay;
  const loop = !!content.loop;
  const muted = !!content.muted;

  return (
    <div
      style={styles}
      draggable={!isLiveMode}
      onDragStart={(e) => handleDragStart(e, "audio")}
      onClick={handleOnClick}
      className={clsx(
        "relative w-full transition-all duration-200 cursor-pointer group",
        "min-h-[60px] flex items-center justify-center",
        {
          "border-2 border-blue-500 border-solid": isSelected && !isLiveMode,
          "border border-dashed border-slate-300": !isLiveMode && !isSelected,
          "hover:border-blue-300": !isLiveMode && !isSelected,
        }
      )}
    >
      {/* Selected Element Badge */}
      {isSelected && !isLiveMode && (
        <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg bg-blue-500">
          {name}
        </Badge>
      )}

      {/* Audio Content */}
      <div className="w-full p-2">
        {audioSrc ? (
          <audio
            controls={showControls}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            className="w-full h-10"
            style={{
              width: "100%",
              height: "40px",
              outline: "none",
            }}
            preload="metadata"
          >
            <source src={audioSrc} type="audio/mpeg" />
            <source src={audioSrc} type="audio/wav" />
            <source src={audioSrc} type="audio/ogg" />
            Your browser does not support the audio element.
          </audio>
        ) : (
          // Placeholder when no audio source
          <div className="w-full h-10 bg-gray-100 border border-gray-300 rounded flex items-center justify-center gap-2 text-gray-500">
            <Volume2 size={16} />
            <span className="text-sm">No audio source</span>
          </div>
        )}
      </div>

      {/* Delete Button */}
      {isSelected && !isLiveMode && (
        <div className="absolute bg-red-500 hover:bg-red-600 px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg text-white transition-colors">
          <Trash
            className="cursor-pointer"
            size={16}
            onClick={handleDeleteElement}
          />
        </div>
      )}

      {/* Hover indicator for non-live mode */}
      {!isLiveMode && !isSelected && (
        <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none" />
      )}
    </div>
  );
};

export default AudioComponent;
