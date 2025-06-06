"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash, Plus, Send } from "lucide-react";
import React from "react";
import Recursive from "../recursive";

type Props = {
  element: EditorElement;
};

const FormComponent = (props: Props) => {
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

  // Form properties from formProps
  const formProps = props.element.formProps || {};
  const formTitle = formProps.formTitle || "Form";
  const formDescription = formProps.formDescription || "";
  const action = formProps.action || "";
  const method = formProps.method || "POST";
  const enctype = formProps.enctype || "application/x-www-form-urlencoded";
  const target = formProps.target || "_self";
  const submitButtonText = formProps.submitButtonText || "Submit";
  const resetButtonText = formProps.resetButtonText || "Reset";
  const showResetButton = formProps.showResetButton || false;
  const successMessage =
    formProps.successMessage || "Form submitted successfully!";
  const errorMessage =
    formProps.errorMessage || "Please fix the errors and try again.";
  const novalidate = formProps.novalidate || false;

  // Color properties from formProps
  const backgroundColor = formProps.backgroundColor || "#ffffff";
  const borderColor = formProps.borderColor || "#e5e7eb";
  const titleColor = formProps.titleColor || "#111827";
  const descriptionColor = formProps.descriptionColor || "#6b7280";
  const submitButtonColor = formProps.submitButtonColor || "#3b82f6";
  const submitButtonTextColor = formProps.submitButtonTextColor || "#ffffff";
  const resetButtonColor = formProps.resetButtonColor || "#6b7280";
  const resetButtonTextColor = formProps.resetButtonTextColor || "#ffffff";

  // Get form elements (children)
  const formElements = Array.isArray(props.element.content)
    ? props.element.content
    : [];

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!state.editor.liveMode) {
      e.preventDefault();
      return;
    }

    if (!action) {
      e.preventDefault();
      // Handle form submission locally or show success message
      console.log("Form submitted (no action specified)");
      return;
    }

    // In live mode with action, allow normal form submission
  };

  const handleFormReset = (e: React.FormEvent<HTMLFormElement>) => {
    if (!state.editor.liveMode) {
      e.preventDefault();
      return;
    }
  };

  // Handle drag and drop functionality for form elements
  const handleOnDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    const componentType = e.dataTransfer.getData("componentType");

    if (!componentType) return;

    // Generate unique ID for the new element
    const newElementId = `${componentType}-${Date.now()}`;

    // Create new form element
    const createElement = (type: string) => {
      const baseElement = {
        id: newElementId,
        name: type.charAt(0).toUpperCase() + type.slice(1),
        styles: {
          margin: "10px 0",
          width: "100%",
        },
        type: type as any,
      };

      switch (type) {
        case "input":
          return {
            ...baseElement,
            content: {
              inputType: "text",
              placeholder: "Enter text...",
              label: "Input Label",
              required: false,
              disabled: false,
              value: "",
              name: "",
              backgroundColor: "#ffffff",
              textColor: "#111827",
              borderColor: "#d1d5db",
              focusBorderColor: "#3b82f6",
              labelColor: "#374151",
              placeholderColor: "#9ca3af",
            },
          };
        case "textarea":
          return {
            ...baseElement,
            content: {
              placeholder: "Enter your message...",
              label: "Message",
              required: false,
              disabled: false,
              value: "",
              name: "",
              rows: 4,
              backgroundColor: "#ffffff",
              textColor: "#111827",
              borderColor: "#d1d5db",
              focusBorderColor: "#3b82f6",
              labelColor: "#374151",
              placeholderColor: "#9ca3af",
            },
          };
        case "checkbox":
          return {
            ...baseElement,
            content: {
              label: "Checkbox Option",
              required: false,
              disabled: false,
              checked: false,
              name: "",
              value: "",
              checkboxColor: "#3b82f6",
              labelColor: "#374151",
              borderColor: "#d1d5db",
              focusColor: "#3b82f6",
            },
          };
        case "radio":
          return {
            ...baseElement,
            content: {
              groupLabel: "Radio Group",
              required: false,
              disabled: false,
              selectedValue: "",
              name: "",
              options: [
                { id: "option1", label: "Option 1", value: "option1" },
                { id: "option2", label: "Option 2", value: "option2" },
              ],
              radioColor: "#3b82f6",
              labelColor: "#374151",
              groupLabelColor: "#111827",
              borderColor: "#d1d5db",
              focusColor: "#3b82f6",
            },
          };
        case "select":
          return {
            ...baseElement,
            content: {
              label: "Select Option",
              placeholder: "Choose an option...",
              required: false,
              disabled: false,
              selectedValue: "",
              name: "",
              options: [
                { id: "option1", label: "Option 1", value: "option1" },
                { id: "option2", label: "Option 2", value: "option2" },
              ],
              backgroundColor: "#ffffff",
              textColor: "#111827",
              borderColor: "#d1d5db",
              focusBorderColor: "#3b82f6",
              labelColor: "#374151",
              placeholderColor: "#9ca3af",
            },
          };
        case "button":
          return {
            ...baseElement,
            content: {
              innerText: "Submit",
              buttonType: "submit",
              backgroundColor: "#3b82f6",
              textColor: "#ffffff",
              borderColor: "#3b82f6",
              hoverBackgroundColor: "#2563eb",
            },
            styles: {
              ...baseElement.styles,
              width: "auto",
            },
          };
        default:
          return null;
      }
    };

    const newElement = createElement(componentType);

    if (newElement) {
      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: props.element.id,
          elementDetails: newElement,
        },
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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

      <form
        action={action}
        method={method}
        encType={enctype}
        target={target}
        noValidate={novalidate}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        className="w-full p-6 rounded-lg shadow-sm"
        style={{
          backgroundColor: backgroundColor,
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: borderColor,
        }}
      >
        {/* Form Header */}
        {(formTitle || formDescription) && (
          <div className="mb-6 space-y-2">
            {formTitle && (
              <h2 className="text-2xl font-bold" style={{ color: titleColor }}>
                {formTitle}
              </h2>
            )}
            {formDescription && (
              <p className="text-sm" style={{ color: descriptionColor }}>
                {formDescription}
              </p>
            )}
          </div>
        )}

        {/* Form Elements Drop Zone */}
        <div
          className={clsx("min-h-[200px] space-y-4 relative", {
            "border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-lg p-4":
              !state.editor.liveMode && formElements.length === 0,
          })}
          onDrop={handleOnDrop}
          onDragOver={handleDragOver}
        >
          {formElements.length > 0
            ? formElements.map((element: EditorElement) => (
                <Recursive key={element.id} element={element} />
              ))
            : !state.editor.liveMode && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                  <div className="text-center">
                    <Plus size={32} className="mx-auto mb-2" />
                    <p className="text-sm font-medium">
                      Drop Form Elements Here
                    </p>
                    <p className="text-xs">
                      Drag inputs, textareas, checkboxes, etc.
                    </p>
                  </div>
                </div>
              )}
        </div>

        {/* Form Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={!state.editor.liveMode}
            className="px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
            style={{
              backgroundColor: submitButtonColor,
              color: submitButtonTextColor,
            }}
          >
            <Send size={16} />
            {submitButtonText}
          </button>

          {showResetButton && (
            <button
              type="reset"
              disabled={!state.editor.liveMode}
              className="px-6 py-2 rounded-md font-medium transition-colors"
              style={{
                backgroundColor: resetButtonColor,
                color: resetButtonTextColor,
              }}
            >
              {resetButtonText}
            </button>
          )}
        </div>

        {/* Form Status Messages (for preview) */}
        {!state.editor.liveMode && (
          <div className="mt-4 space-y-2 text-xs text-gray-500">
            <p>
              <strong>Success Message:</strong> {successMessage}
            </p>
            <p>
              <strong>Error Message:</strong> {errorMessage}
            </p>
          </div>
        )}
      </form>

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

export default FormComponent;
