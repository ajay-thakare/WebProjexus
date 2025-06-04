"use client";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React, { useCallback, useMemo } from "react";

type Props = {
  element: EditorElement;
};

interface SpacerContent {
  spacerHeight?: number;
  spacerWidth?: string;
  spacerBackgroundColor?: string;
}

const SpacerComponent = ({ element }: Props) => {
  const { dispatch, state } = useEditor();

  // Early return for invalid content structure
  if (Array.isArray(element.content)) {
    return (
      <div className="p-4 border-2 border-red-300 bg-red-50 text-red-600 rounded">
        <p>Spacer component error: Invalid content structure</p>
      </div>
    );
  }

  const content = element.content as SpacerContent;
  const height = content.spacerHeight || 50;
  // Ensure width is always treated as a string
  const width = content.spacerWidth || "100%";
  const backgroundColor = content.spacerBackgroundColor || "transparent";

  const isSelected = state.editor.selectedElement.id === element.id;
  const isLiveMode = state.editor.liveMode;

  // Memoized styles conversion
  const styles = useMemo(() => {
    // Log the width value to help with debugging
    console.log("Spacer width:", width);

    return {
      height: `${height}px`,
      // Always use the width directly as a string
      width: width,
      backgroundColor,
      ...Object.keys(element.styles).reduce((acc, key) => {
        const camelCaseKey = key.replace(/-([a-z])/g, (g) =>
          g[1].toUpperCase()
        );
        return { ...acc, [camelCaseKey]: (element.styles as any)[key] };
      }, {} as React.CSSProperties),
    };
  }, [element.styles, height, width, backgroundColor]);

  // Memoized event handlers
  const handleDeleteElement = useCallback(() => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element },
    });
  }, [dispatch, element]);

  const handleOnClickBody = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch({
        type: "CHANGE_CLICKED_ELEMENT",
        payload: { elementDetails: element },
      });
    },
    [dispatch, element]
  );

  const containerClasses = clsx(
    "p-[2px] w-full m-[5px] relative transition-all",
    {
      "!border-blue-500 !border-solid": isSelected,
      "border-dashed border-[1px] border-slate-300": !isLiveMode,
    }
  );

  return (
    <div
      style={styles}
      className={containerClasses}
      onClick={handleOnClickBody}
    >
      {/* Selected element badge */}
      {isSelected && !isLiveMode && (
        <div className="absolute -top-[23px] -left-[1px] bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-none rounded-t-lg">
          {state.editor.selectedElement.name}
        </div>
      )}

      {/* Delete button for selected element */}
      {isSelected && !isLiveMode && (
        <div
          className="absolute -top-[23px] -right-[1px] bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-none rounded-t-lg cursor-pointer"
          onClick={handleDeleteElement}
        >
          <Trash className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

export default SpacerComponent;
