"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash, ChevronDown, Plus, X } from "lucide-react";
import React from "react";

type Props = {
  element: EditorElement;
};

interface SelectOption {
  id: string;
  label: string;
  value: string;
}

const SelectComponent = (props: Props) => {
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

  const label = (props.element.content as any)?.label || "Select Option";
  const placeholder =
    (props.element.content as any)?.placeholder || "Choose an option...";
  const required = (props.element.content as any)?.required || false;
  const disabled = (props.element.content as any)?.disabled || false;
  const selectedValue = (props.element.content as any)?.selectedValue || "";
  const name = (props.element.content as any)?.name || "";
  const helperText = (props.element.content as any)?.helperText || "";
  const errorText = (props.element.content as any)?.errorText || "";
  const multiple = (props.element.content as any)?.multiple || false;
  const size = (props.element.content as any)?.size || "medium";
  const options = (props.element.content as any)?.options || [
    { id: "option1", label: "Option 1", value: "option1" },
    { id: "option2", label: "Option 2", value: "option2" },
  ];

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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (state.editor.liveMode) {
      const value = multiple
        ? Array.from(e.target.selectedOptions, (option) => option.value)
        : e.target.value;

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
      (option: SelectOption) => option.id !== optionId
    );
    const removedOption = options.find(
      (opt: SelectOption) => opt.id === optionId
    );

    // Clear selected value if it was the removed option
    let newSelectedValue = selectedValue;
    if (multiple && Array.isArray(selectedValue)) {
      newSelectedValue = selectedValue.filter(
        (val: string) => val !== removedOption?.value
      );
    } else if (selectedValue === removedOption?.value) {
      newSelectedValue = "";
    }

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...props.element,
          content: {
            ...(props.element.content as any),
            options: newOptions,
            selectedValue: newSelectedValue,
          },
        },
      },
    });
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return {
          select: "text-sm py-1.5 px-2",
          label: "text-sm",
        };
      case "large":
        return {
          select: "text-lg py-3 px-4",
          label: "text-lg",
        };
      default: // medium
        return {
          select: "text-base py-2 px-3",
          label: "text-base",
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const getSelectedLabel = () => {
    if (!selectedValue) return "";

    if (multiple && Array.isArray(selectedValue)) {
      const selectedOptions = options.filter((opt: SelectOption) =>
        selectedValue.includes(opt.value)
      );
      return selectedOptions.map((opt: SelectOption) => opt.label).join(", ");
    } else {
      const selectedOption = options.find(
        (opt: SelectOption) => opt.value === selectedValue
      );
      return selectedOption?.label || "";
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
          <div className="flex items-center justify-between">
            <label
              className={clsx(
                "font-medium transition-colors",
                sizeClasses.label
              )}
              htmlFor={props.element.id}
              style={{ color: labelColor }}
            >
              {label}
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

        {/* Select Field */}
        <div className="relative">
          <select
            id={props.element.id}
            name={name || props.element.id}
            value={multiple ? undefined : selectedValue}
            multiple={multiple}
            required={required}
            disabled={disabled || !state.editor.liveMode}
            onChange={handleSelectChange}
            className={clsx(
              "w-full rounded-md shadow-sm transition-all duration-200 appearance-none",
              "focus:outline-none focus:ring-2 focus:ring-opacity-50 pr-10",
              sizeClasses.select,
              {
                "cursor-not-allowed opacity-60":
                  disabled || !state.editor.liveMode,
              }
            )}
            style={{
              backgroundColor: backgroundColor,
              color: textColor,
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: errorText ? "#ef4444" : borderColor,
            }}
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
          >
            {!multiple && (
              <option value="" disabled style={{ color: placeholderColor }}>
                {placeholder}
              </option>
            )}
            {options.map((option: SelectOption) => (
              <option
                key={option.id}
                value={option.value}
                style={{ color: textColor }}
              >
                {option.label}
                {state.editor.selectedElement.id === props.element.id &&
                  !state.editor.liveMode &&
                  options.length > 1 &&
                  " ✕"}
              </option>
            ))}
          </select>

          {/* Custom Dropdown Arrow */}
          {!multiple && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown
                size={16}
                className="text-gray-400"
                style={{ color: placeholderColor }}
              />
            </div>
          )}
        </div>

        {/* Show selected values for edit mode */}
        {!state.editor.liveMode && selectedValue && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <strong>Selected:</strong> {getSelectedLabel() || "None"}
          </div>
        )}

        {/* Helper Text */}
        {helperText && !errorText && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}

        {/* Error Text */}
        {errorText && <p className="text-xs text-red-500">{errorText}</p>}

        {/* Edit Mode: Option Management */}
        {state.editor.selectedElement.id === props.element.id &&
          !state.editor.liveMode && (
            <div className="mt-3 space-y-1 text-xs bg-gray-50 p-2 rounded">
              <p className="font-medium text-gray-700">Options:</p>
              {options.map((option: SelectOption, index: number) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-600">
                    {index + 1}. {option.label} ({option.value})
                  </span>
                  {options.length > 1 && (
                    <X
                      size={12}
                      className="text-red-400 hover:text-red-600 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveOption(option.id);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
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

export default SelectComponent;
