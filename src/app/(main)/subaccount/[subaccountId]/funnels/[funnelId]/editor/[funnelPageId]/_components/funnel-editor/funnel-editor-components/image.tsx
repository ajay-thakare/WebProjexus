"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React, { useState } from "react";

type Props = {
  element: EditorElement;
};

const ImageComponent = (props: Props) => {
  const { dispatch, state } = useEditor();
  const [imageError, setImageError] = useState(false);

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: props.element },
    });
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element,
      },
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      style={props.element.styles}
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
      {!Array.isArray(props.element.content) &&
        (imageError ? (
          <div className="w-full h-32 flex items-center justify-center bg-muted text-muted-foreground">
            {props.element.content.alt || "Image not found"}
          </div>
        ) : (
          <img
            src={props.element.content.src}
            alt={props.element.content.alt || "Image"}
            style={{
              width: props.element.styles.width || "100%",
              height: props.element.styles.height || "auto",
              objectFit:
                (props.element.styles.backgroundSize as
                  | "cover"
                  | "contain"
                  | "fill"
                  | "none"
                  | "scale-down") || "cover",
            }}
            onError={handleImageError}
          />
        ))}
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

export default ImageComponent;
