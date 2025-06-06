"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React from "react";

type Props = {
  element: EditorElement;
};

const InputComponent = (props: Props) => {
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

  const inputType = (props.element.content as any)?.inputType || "text";
  const placeholder =
    (props.element.content as any)?.placeholder || "Enter text...";
  const label = (props.element.content as any)?.label || "";
  const required = (props.element.content as any)?.required || false;
  const disabled = (props.element.content as any)?.disabled || false;
  const value = (props.element.content as any)?.value || "";
  const name = (props.element.content as any)?.name || "";
  const minLength = (props.element.content as any)?.minLength;
  const maxLength = (props.element.content as any)?.maxLength;
  const pattern = (props.element.content as any)?.pattern || "";
  const helperText = (props.element.content as any)?.helperText || "";
  const errorText = (props.element.content as any)?.errorText || "";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        {/* Input Field */}
        <input
          id={props.element.id}
          name={name || props.element.id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          required={required}
          disabled={disabled || !state.editor.liveMode}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          onChange={handleInputChange}
          className={clsx(
            "w-full px-3 py-2 rounded-md shadow-sm transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-opacity-50",
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
          input::placeholder {
            color: ${placeholderColor} !important;
            opacity: 1;
          }
          input::-webkit-input-placeholder {
            color: ${placeholderColor} !important;
          }
          input::-moz-placeholder {
            color: ${placeholderColor} !important;
            opacity: 1;
          }
          input:-ms-input-placeholder {
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

        {/* Character Count (for text inputs with maxLength) */}
        {maxLength && (inputType === "text" || inputType === "password") && (
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

export default InputComponent;
