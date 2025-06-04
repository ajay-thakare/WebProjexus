"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash, Move } from "lucide-react";
import React from "react";

type Props = {
  element: EditorElement;
};

const SpacerComponent = (props: Props) => {
  const { dispatch, state } = useEditor();

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: props.element },
    });
  };

  // Convert style properties to React's camelCase format
  const convertStyles = (styles: React.CSSProperties) => {
    return Object.keys(styles).reduce((acc, key) => {
      const camelCaseKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      return { ...acc, [camelCaseKey]: styles[key as keyof typeof styles] };
    }, {} as React.CSSProperties);
  };

  const styles = convertStyles(props.element.styles);

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element,
      },
    });
  };

  const spacerHeight = (props.element.content as any)?.spacerHeight || 50;
  const spacerWidth = (props.element.content as any)?.spacerWidth || "100%";
  const spacerBackgroundColor =
    (props.element.content as any)?.spacerBackgroundColor || "transparent";

  return (
    <div
      style={styles}
      className={clsx("p-[2px] w-full m-[5px] relative transition-all", {
        "!border-blue-500":
          state.editor.selectedElement.id === props.element.id,
        "!border-solid": state.editor.selectedElement.id === props.element.id,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      onClick={handleOnClickBody}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
            {state.editor.selectedElement.name}
          </Badge>
        )}

      <div
        className={clsx("relative transition-all", {
          "border border-dashed border-gray-300 dark:border-gray-600":
            !state.editor.liveMode,
          "min-h-[20px]": !state.editor.liveMode, // Minimum height in edit mode for visibility
        })}
        style={{
          height: `${spacerHeight}px`,
          width: spacerWidth,
          backgroundColor: spacerBackgroundColor,
        }}
      >
        {/* Show spacer info in edit mode */}
        {state.editor.selectedElement.id === props.element.id &&
          !state.editor.liveMode && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
              <div className="flex items-center gap-2 text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-sm">
                <Move size={12} />
                <span>
                  {spacerHeight}px × {spacerWidth}
                </span>
              </div>
            </div>
          )}

        {/* Invisible spacer in live mode */}
        {state.editor.liveMode && (
          <div
            style={{
              height: `${spacerHeight}px`,
              width: spacerWidth,
              backgroundColor: spacerBackgroundColor,
            }}
          />
        )}
      </div>

      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};

export default SpacerComponent;
