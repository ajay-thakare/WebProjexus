"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React from "react";

type Props = {
  element: EditorElement;
};

const TextareaComponent = (props: Props) => {
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

  const placeholder =
    (props.element.content as any)?.placeholder || "Enter your message...";
  const label = (props.element.content as any)?.label || "";
  const required = (props.element.content as any)?.required || false;
  const disabled = (props.element.content as any)?.disabled || false;
  const value = (props.element.content as any)?.value || "";
  const name = (props.element.content as any)?.name || "";
  const rows = (props.element.content as any)?.rows || 4;
  const maxLength = (props.element.content as any)?.maxLength;
  const minLength = (props.element.content as any)?.minLength;
  const helperText = (props.element.content as any)?.helperText || "";
  const errorText = (props.element.content as any)?.errorText || "";
  const resize = (props.element.content as any)?.resize || "vertical";

  // Color properties
  const backgroundColor =
    (props.element.content as any)?.backgroundColor || "#ffffff";
  const textColor = (props.element.content as any)?.textColor || "#111827";
  const borderColor = (props.element.content as any)?.borderColor || "#d1d5db";
  const focusBorderColor =
    (props.element.content as any)?.focusBorderColor || "#3b82f6";
  const labelColor = (props.element.content as any)?.labelColor || "#374151";
  const placeholderColor =
    (props.element.content as any)?.placeholderColor || "#9ca3af";

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (state.editor.liveMode) {
      // In live mode, update the actual value
      dispatch({
        type: "UPDATE_ELEMENT",
        payload: {
          elementDetails: {
            ...props.element,
            content: {
              ...(props.element.content as any),
              value: e.target.value,
            },
          },
        },
      });
    }
  };

  const getResizeClass = () => {
    switch (resize) {
      case "none":
        return "resize-none";
      case "horizontal":
        return "resize-x";
      case "vertical":
        return "resize-y";
      case "both":
        return "resize";
      default:
        return "resize-y";
    }
  };

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

      <div className="w-full space-y-2">
        {/* Label */}
        {label && (
          <label
            className="block text-sm font-medium transition-colors"
            htmlFor={props.element.id}
            style={{ color: labelColor }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Textarea Field */}
        <textarea
          id={props.element.id}
          name={name || props.element.id}
          placeholder={placeholder}
          value={value}
          required={required}
          disabled={disabled || !state.editor.liveMode}
          minLength={minLength}
          maxLength={maxLength}
          rows={rows}
          onChange={handleTextareaChange}
          className={clsx(
            "w-full px-3 py-2 rounded-md shadow-sm transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-opacity-50",
            getResizeClass(),
            {
              "cursor-not-allowed opacity-60":
                disabled || !state.editor.liveMode,
            }
          )}
          style={
            {
              backgroundColor: backgroundColor,
              color: textColor,
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: errorText ? "#ef4444" : borderColor,
              "--placeholder-color": placeholderColor,
            } as React.CSSProperties & { "--placeholder-color": string }
          }
          onFocus={(e) => {
            if (!errorText) {
              e.target.style.borderColor = focusBorderColor;
              e.target.style.boxShadow = `0 0 0 2px ${focusBorderColor}25`;
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errorText ? "#ef4444" : borderColor;
            e.target.style.boxShadow = "none";
          }}
        />

        {/* Add custom CSS for placeholder color */}
        <style jsx>{`
          textarea::placeholder {
            color: ${placeholderColor} !important;
            opacity: 1;
          }
          textarea::-webkit-input-placeholder {
            color: ${placeholderColor} !important;
          }
          textarea::-moz-placeholder {
            color: ${placeholderColor} !important;
            opacity: 1;
          }
          textarea:-ms-input-placeholder {
            color: ${placeholderColor} !important;
          }
        `}</style>

        {/* Helper Text */}
        {helperText && !errorText && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}

        {/* Error Text */}
        {errorText && <p className="text-xs text-red-500">{errorText}</p>}

        {/* Character Count */}
        {maxLength && (
          <p className="text-xs text-gray-400 text-right">
            {value.length}/{maxLength}
          </p>
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

export default TextareaComponent;
