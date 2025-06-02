"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash, ExternalLink } from "lucide-react";
import React from "react";

type Props = {
  element: EditorElement;
};

const ButtonComponent = (props: Props) => {
  const { dispatch, state } = useEditor();

  const handleDelete = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: props.element },
    });
  };

  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element,
      },
    });
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Only handle clicks in live mode
    if (!state.editor.liveMode) return;

    const content = props.element.content;
    if (!Array.isArray(content) && content.href) {
      const target = content.target || "_self";

      // Handle different actions
      switch (content.action) {
        case "scroll":
          // Scroll to element with ID matching href
          const targetElement = document.querySelector(content.href);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }
          break;
        case "download":
          // Trigger download
          const link = document.createElement("a");
          link.href = content.href;
          link.download = "";
          link.click();
          break;
        case "popup":
          // Open popup (you can customize this)
          alert("Popup functionality - customize as needed");
          break;
        case "submit":
          // Handle form submission
          const form = document.querySelector("form");
          if (form) {
            form.submit();
          }
          break;
        default:
          // Default link behavior
          if (target === "_blank") {
            window.open(content.href, "_blank");
          } else {
            window.location.href = content.href;
          }
      }
    }
  };

  const content = props.element.content;
  const buttonText = !Array.isArray(content)
    ? content.innerText || "Button"
    : "Button";
  const hasLink = !Array.isArray(content) && content.href;

  return (
    <div
      className={clsx("p-[2px] w-fit m-[5px] relative", {
        "!border-blue-500":
          state.editor.selectedElement.id === props.element.id &&
          !state.editor.liveMode,
        "!border-solid":
          state.editor.selectedElement.id === props.element.id &&
          !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      onClick={handleOnClick}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <>
            <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
              {props.element.name}
            </Badge>
            <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[23px] -right-[1px] rounded-none rounded-t-lg !text-white">
              <Trash
                className="cursor-pointer"
                size={16}
                onClick={handleDelete}
              />
            </div>
          </>
        )}

      <button
        style={{
          ...props.element.styles,
          // Ensure button looks clickable
          cursor: state.editor.liveMode ? "pointer" : "default",
          // Add some default hover effects if not in live mode
          transition: "all 0.2s ease-in-out",
        }}
        className={clsx(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
          {
            "hover:opacity-90 hover:scale-105": state.editor.liveMode,
            "ring-2 ring-blue-500 ring-offset-2":
              state.editor.selectedElement.id === props.element.id &&
              !state.editor.liveMode,
          }
        )}
        onClick={handleButtonClick}
        disabled={!state.editor.liveMode}
        type="button"
      >
        {buttonText}
        {hasLink && state.editor.liveMode && (
          <ExternalLink size={14} className="opacity-70" />
        )}
      </button>

      {/* Show link indicator in edit mode */}
      {hasLink && !state.editor.liveMode && (
        <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground bg-background px-2 py-1 rounded border">
          🔗 {!Array.isArray(content) ? content.href : ""}
        </div>
      )}
    </div>
  );
};

export default ButtonComponent;
