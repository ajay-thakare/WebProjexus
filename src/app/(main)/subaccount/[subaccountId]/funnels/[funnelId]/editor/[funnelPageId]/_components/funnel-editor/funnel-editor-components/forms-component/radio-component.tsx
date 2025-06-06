"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash, Circle, Plus, X } from "lucide-react";
import React from "react";

type Props = {
  element: EditorElement;
};

interface RadioOption {
  id: string;
  label: string;
  value: string;
}

const RadioComponent = (props: Props) => {
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

  const groupLabel =
    (props.element.content as any)?.groupLabel || "Radio Group";
  const required = (props.element.content as any)?.required || false;
  const disabled = (props.element.content as any)?.disabled || false;
  const selectedValue = (props.element.content as any)?.selectedValue || "";
  const name = (props.element.content as any)?.name || "";
  const helperText = (props.element.content as any)?.helperText || "";
  const errorText = (props.element.content as any)?.errorText || "";
  const size = (props.element.content as any)?.size || "medium";
  const layout = (props.element.content as any)?.layout || "vertical";
  const options = (props.element.content as any)?.options || [
    { id: "option1", label: "Option 1", value: "option1" },
    { id: "option2", label: "Option 2", value: "option2" },
  ];

  // Color properties
  const radioColor = (props.element.content as any)?.radioColor || "#3b82f6";
  const labelColor = (props.element.content as any)?.labelColor || "#374151";
  const groupLabelColor =
    (props.element.content as any)?.groupLabelColor || "#111827";
  const borderColor = (props.element.content as any)?.borderColor || "#d1d5db";
  const focusColor = (props.element.content as any)?.focusColor || "#3b82f6";

  const handleRadioChange = (value: string) => {
    if (state.editor.liveMode) {
      // In live mode, update the selected value
      dispatch({
        type: "UPDATE_ELEMENT",
        payload: {
          elementDetails: {
            ...props.element,
            content: {
              ...(props.element.content as any),
              selectedValue: value,
            },
          },
        },
      });
    }
  };

  const handleAddOption = () => {
    const newOption = {
      id: `option${Date.now()}`,
      label: `Option ${options.length + 1}`,
      value: `option${options.length + 1}`,
    };

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...props.element,
          content: {
            ...(props.element.content as any),
            options: [...options, newOption],
          },
        },
      },
    });
  };

  const handleRemoveOption = (optionId: string) => {
    if (options.length <= 1) return; // Don't allow removing the last option

    const newOptions = options.filter(
      (option: RadioOption) => option.id !== optionId
    );

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...props.element,
          content: {
            ...(props.element.content as any),
            options: newOptions,
            // Clear selected value if it was the removed option
            selectedValue: newOptions.find(
              (opt: RadioOption) => opt.value === selectedValue
            )
              ? selectedValue
              : "",
          },
        },
      },
    });
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return {
          radio: "w-4 h-4",
          label: "text-sm",
          groupLabel: "text-base",
          dot: "w-2 h-2",
        };
      case "large":
        return {
          radio: "w-6 h-6",
          label: "text-lg",
          groupLabel: "text-xl",
          dot: "w-3 h-3",
        };
      default: // medium
        return {
          radio: "w-5 h-5",
          label: "text-base",
          groupLabel: "text-lg",
          dot: "w-2.5 h-2.5",
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

      <div className="w-full space-y-3">
        {/* Group Label */}
        {groupLabel && (
          <div className="flex items-center justify-between">
            <label
              className={clsx(
                "font-semibold transition-colors",
                sizeClasses.groupLabel
              )}
              style={{ color: groupLabelColor }}
            >
              {groupLabel}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {state.editor.selectedElement.id === props.element.id &&
              !state.editor.liveMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddOption();
                  }}
                  className="flex items-center justify-center w-6 h-6 text-green-500 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                >
                  <Plus size={14} />
                </button>
              )}
          </div>
        )}

        {/* Radio Options */}
        <div
          className={clsx("space-y-2", {
            "flex flex-wrap gap-4": layout === "horizontal",
          })}
        >
          {options.map((option: RadioOption) => (
            <div
              key={option.id}
              className={clsx(
                "flex items-center gap-3 transition-all duration-200 group",
                {
                  "flex-col space-y-1":
                    layout === "vertical" && size === "large",
                }
              )}
            >
              <div className="relative flex items-center">
                <input
                  id={`${props.element.id}-${option.id}`}
                  name={name || props.element.id}
                  type="radio"
                  value={option.value}
                  checked={selectedValue === option.value}
                  required={required}
                  disabled={disabled || !state.editor.liveMode}
                  onChange={() => handleRadioChange(option.value)}
                  className="sr-only"
                />

                {/* Custom Radio Button */}
                <label
                  htmlFor={`${props.element.id}-${option.id}`}
                  className={clsx(
                    "relative cursor-pointer rounded-full border-2 transition-all duration-200 flex items-center justify-center",
                    sizeClasses.radio,
                    {
                      "cursor-not-allowed opacity-60":
                        disabled || !state.editor.liveMode,
                    }
                  )}
                  style={{
                    backgroundColor:
                      selectedValue === option.value
                        ? radioColor
                        : "transparent",
                    borderColor:
                      selectedValue === option.value ? radioColor : borderColor,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${focusColor}25`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {selectedValue === option.value && (
                    <div
                      className={clsx("rounded-full", sizeClasses.dot)}
                      style={{ backgroundColor: "white" }}
                    />
                  )}
                </label>
              </div>

              {/* Option Label */}
              <div className="flex items-center justify-between flex-1">
                <label
                  htmlFor={`${props.element.id}-${option.id}`}
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
                  {option.label}
                </label>

                {state.editor.selectedElement.id === props.element.id &&
                  !state.editor.liveMode &&
                  options.length > 1 && (
                    <X
                      size={14}
                      className="text-red-400 hover:text-red-600 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveOption(option.id);
                      }}
                    />
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* Helper Text */}
        {helperText && !errorText && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}

        {/* Error Text */}
        {errorText && <p className="text-xs text-red-500">{errorText}</p>}
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

export default RadioComponent;
