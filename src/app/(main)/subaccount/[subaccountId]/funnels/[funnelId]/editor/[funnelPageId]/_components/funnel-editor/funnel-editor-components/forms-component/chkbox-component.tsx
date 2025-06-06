"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash, Check } from "lucide-react";
import React from "react";

type Props = {
  element: EditorElement;
};

const CheckboxComponent = (props: Props) => {
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

  const label = (props.element.content as any)?.label || "Checkbox Option";
  const required = (props.element.content as any)?.required || false;
  const disabled = (props.element.content as any)?.disabled || false;
  const checked = (props.element.content as any)?.checked || false;
  const name = (props.element.content as any)?.name || "";
  const value = (props.element.content as any)?.value || "";
  const helperText = (props.element.content as any)?.helperText || "";
  const errorText = (props.element.content as any)?.errorText || "";
  const size = (props.element.content as any)?.size || "medium";
  const layout = (props.element.content as any)?.layout || "horizontal";

  // Color properties
  const checkboxColor =
    (props.element.content as any)?.checkboxColor || "#3b82f6";
  const labelColor = (props.element.content as any)?.labelColor || "#374151";
  const borderColor = (props.element.content as any)?.borderColor || "#d1d5db";
  const focusColor = (props.element.content as any)?.focusColor || "#3b82f6";

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (state.editor.liveMode) {
      // In live mode, update the actual checked state
      dispatch({
        type: "UPDATE_ELEMENT",
        payload: {
          elementDetails: {
            ...props.element,
            content: {
              ...(props.element.content as any),
              checked: e.target.checked,
            },
          },
        },
      });
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return {
          checkbox: "w-4 h-4",
          label: "text-sm",
          icon: 12,
        };
      case "large":
        return {
          checkbox: "w-6 h-6",
          label: "text-lg",
          icon: 16,
        };
      default: // medium
        return {
          checkbox: "w-5 h-5",
          label: "text-base",
          icon: 14,
        };
    }
  };

  const sizeClasses = getSizeClasses();

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
        {/* Checkbox with Label */}
        <div
          className={clsx(
            "flex items-start gap-3 transition-all duration-200",
            {
              "flex-col space-y-2": layout === "vertical",
              "items-center": layout === "horizontal",
            }
          )}
        >
          <div className="relative flex items-center">
            <input
              id={props.element.id}
              name={name || props.element.id}
              type="checkbox"
              checked={checked}
              required={required}
              disabled={disabled || !state.editor.liveMode}
              value={value}
              onChange={handleCheckboxChange}
              className="sr-only"
            />

            {/* Custom Checkbox */}
            <label
              htmlFor={props.element.id}
              className={clsx(
                "relative cursor-pointer rounded transition-all duration-200",
                sizeClasses.checkbox,
                {
                  "cursor-not-allowed opacity-60":
                    disabled || !state.editor.liveMode,
                }
              )}
              style={{
                backgroundColor: checked ? checkboxColor : "transparent",
                borderWidth: "2px",
                borderStyle: "solid",
                borderColor: checked ? checkboxColor : borderColor,
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 2px ${focusColor}25`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {checked && (
                <Check
                  size={sizeClasses.icon}
                  className="absolute inset-0 m-auto text-white"
                  style={{ color: "white" }}
                />
              )}
            </label>
          </div>

          {/* Label Text */}
          <label
            htmlFor={props.element.id}
            className={clsx(
              "cursor-pointer font-medium transition-colors",
              sizeClasses.label,
              {
                "cursor-not-allowed opacity-60":
                  disabled || !state.editor.liveMode,
              }
            )}
            style={{ color: labelColor }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>

        {/* Helper Text */}
        {helperText && !errorText && (
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-8">
            {helperText}
          </p>
        )}

        {/* Error Text */}
        {errorText && <p className="text-xs text-red-500 ml-8">{errorText}</p>}
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

export default CheckboxComponent;
