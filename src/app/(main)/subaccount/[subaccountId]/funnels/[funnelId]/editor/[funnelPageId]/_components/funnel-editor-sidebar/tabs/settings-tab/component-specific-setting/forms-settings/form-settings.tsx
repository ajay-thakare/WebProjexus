"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEditor } from "@/providers/editor/editor-provider";

type Props = {};

const FormSettings = (props: Props) => {
  const { dispatch, state } = useEditor();

  if (
    state.editor.selectedElement.type !== "form" ||
    !Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  // Since form content is an array, we use formProps for form configuration
  const element = state.editor.selectedElement;
  const formProps = element.formProps || {};

  const formTitle = formProps.formTitle || "Contact Form";
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

  // Color properties
  const backgroundColor = formProps.backgroundColor || "#ffffff";
  const borderColor = formProps.borderColor || "#e5e7eb";
  const titleColor = formProps.titleColor || "#111827";
  const descriptionColor = formProps.descriptionColor || "#6b7280";
  const submitButtonColor = formProps.submitButtonColor || "#3b82f6";
  const submitButtonTextColor = formProps.submitButtonTextColor || "#ffffff";
  const resetButtonColor = formProps.resetButtonColor || "#6b7280";
  const resetButtonTextColor = formProps.resetButtonTextColor || "#ffffff";

  const handleSelectChange = (field: string, value: string) => {
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...element,
          formProps: {
            ...formProps,
            [field]: value,
          },
        },
      },
    });
  };

  const handleSwitchChange = (field: string, checked: boolean) => {
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...element,
          formProps: {
            ...formProps,
            [field]: checked,
          },
        },
      },
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...element,
          formProps: {
            ...formProps,
            [e.target.id]: e.target.value,
          },
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Form Header */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Form Header
        </Label>

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="formTitle"
              className="text-xs text-muted-foreground"
            >
              Form Title
            </Label>
            <Input
              id="formTitle"
              value={formTitle}
              onChange={handleInputChange}
              placeholder="Contact Form"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="formDescription"
              className="text-xs text-muted-foreground"
            >
              Form Description
            </Label>
            <Textarea
              id="formDescription"
              value={formDescription}
              onChange={handleInputChange}
              placeholder="Please fill out this form to get in touch with us"
              className="min-h-[60px] resize-none"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Form Configuration */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Form Configuration
        </Label>

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="action" className="text-xs text-muted-foreground">
              Form Action (URL)
            </Label>
            <Input
              id="action"
              value={action}
              onChange={handleInputChange}
              placeholder="/api/contact"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="method" className="text-xs text-muted-foreground">
              HTTP Method
            </Label>
            <Select
              value={method}
              onValueChange={(value) => handleSelectChange("method", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="enctype" className="text-xs text-muted-foreground">
              Encoding Type
            </Label>
            <Select
              value={enctype}
              onValueChange={(value) => handleSelectChange("enctype", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select encoding" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="application/x-www-form-urlencoded">
                  URL Encoded
                </SelectItem>
                <SelectItem value="multipart/form-data">
                  Multipart (File Uploads)
                </SelectItem>
                <SelectItem value="text/plain">Plain Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="target" className="text-xs text-muted-foreground">
              Target Window
            </Label>
            <Select
              value={target}
              onValueChange={(value) => handleSelectChange("target", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_self">Same Window</SelectItem>
                <SelectItem value="_blank">New Window</SelectItem>
                <SelectItem value="_parent">Parent Frame</SelectItem>
                <SelectItem value="_top">Top Frame</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor="novalidate"
              className="text-xs text-muted-foreground"
            >
              Disable HTML5 Validation
            </Label>
            <Switch
              id="novalidate"
              checked={novalidate}
              onCheckedChange={(checked) =>
                handleSwitchChange("novalidate", checked)
              }
            />
          </div>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Form Buttons
        </Label>

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="submitButtonText"
              className="text-xs text-muted-foreground"
            >
              Submit Button Text
            </Label>
            <Input
              id="submitButtonText"
              value={submitButtonText}
              onChange={handleInputChange}
              placeholder="Submit"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor="showResetButton"
              className="text-xs text-muted-foreground"
            >
              Show Reset Button
            </Label>
            <Switch
              id="showResetButton"
              checked={showResetButton}
              onCheckedChange={(checked) =>
                handleSwitchChange("showResetButton", checked)
              }
            />
          </div>

          {showResetButton && (
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="resetButtonText"
                className="text-xs text-muted-foreground"
              >
                Reset Button Text
              </Label>
              <Input
                id="resetButtonText"
                value={resetButtonText}
                onChange={handleInputChange}
                placeholder="Reset"
              />
            </div>
          )}
        </div>
      </div>

      {/* Color Customization */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Color Customization
        </Label>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="backgroundColor"
              className="text-xs text-muted-foreground"
            >
              Background
            </Label>
            <Input
              id="backgroundColor"
              type="color"
              value={backgroundColor}
              onChange={handleInputChange}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="borderColor"
              className="text-xs text-muted-foreground"
            >
              Border Color
            </Label>
            <Input
              id="borderColor"
              type="color"
              value={borderColor}
              onChange={handleInputChange}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="titleColor"
              className="text-xs text-muted-foreground"
            >
              Title Color
            </Label>
            <Input
              id="titleColor"
              type="color"
              value={titleColor}
              onChange={handleInputChange}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="descriptionColor"
              className="text-xs text-muted-foreground"
            >
              Description
            </Label>
            <Input
              id="descriptionColor"
              type="color"
              value={descriptionColor}
              onChange={handleInputChange}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="submitButtonColor"
              className="text-xs text-muted-foreground"
            >
              Submit Button
            </Label>
            <Input
              id="submitButtonColor"
              type="color"
              value={submitButtonColor}
              onChange={handleInputChange}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="submitButtonTextColor"
              className="text-xs text-muted-foreground"
            >
              Submit Text
            </Label>
            <Input
              id="submitButtonTextColor"
              type="color"
              value={submitButtonTextColor}
              onChange={handleInputChange}
              className="h-10 w-full"
            />
          </div>

          {showResetButton && (
            <>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="resetButtonColor"
                  className="text-xs text-muted-foreground"
                >
                  Reset Button
                </Label>
                <Input
                  id="resetButtonColor"
                  type="color"
                  value={resetButtonColor}
                  onChange={handleInputChange}
                  className="h-10 w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="resetButtonTextColor"
                  className="text-xs text-muted-foreground"
                >
                  Reset Text
                </Label>
                <Input
                  id="resetButtonTextColor"
                  type="color"
                  value={resetButtonTextColor}
                  onChange={handleInputChange}
                  className="h-10 w-full"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Form Messages */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Form Messages
        </Label>

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="successMessage"
              className="text-xs text-muted-foreground"
            >
              Success Message
            </Label>
            <Textarea
              id="successMessage"
              value={successMessage}
              onChange={handleInputChange}
              placeholder="Form submitted successfully!"
              className="min-h-[60px] resize-none"
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="errorMessage"
              className="text-xs text-muted-foreground"
            >
              Error Message
            </Label>
            <Textarea
              id="errorMessage"
              value={errorMessage}
              onChange={handleInputChange}
              placeholder="Please fix the errors and try again."
              className="min-h-[60px] resize-none"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Form Usage Info */}
      <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <p className="font-medium mb-1">Form Container Usage:</p>
        <ul className="space-y-1 text-xs">
          <li>
            • <strong>Drop Zone:</strong> Drag form elements (inputs, textareas,
            etc.) into the form
          </li>
          <li>
            • <strong>Form Action:</strong> Set URL endpoint for form submission
          </li>
          <li>
            • <strong>Method:</strong> Use POST for data submission, GET for
            searches
          </li>
          <li>
            • <strong>Encoding:</strong> Use multipart/form-data for file
            uploads
          </li>
          <li>
            • <strong>Validation:</strong> Enable HTML5 validation for
            client-side checks
          </li>
          <li>
            • <strong>Accessibility:</strong> Proper form structure improves
            screen reader support
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FormSettings;
