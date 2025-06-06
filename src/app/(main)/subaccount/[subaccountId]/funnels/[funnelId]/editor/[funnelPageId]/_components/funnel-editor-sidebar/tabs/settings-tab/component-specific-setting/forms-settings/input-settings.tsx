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
import { useCustomValuesUpdater } from "../../utils";

type Props = {};

const InputSettings = (props: Props) => {
  const { handleChangeCustomValues, state } = useCustomValuesUpdater();

  if (
    state.editor.selectedElement.type !== "input" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  const currentContent = state.editor.selectedElement.content as any;
  const inputType = currentContent.inputType || "text";
  const placeholder = currentContent.placeholder || "";
  const label = currentContent.label || "";
  const required = currentContent.required || false;
  const disabled = currentContent.disabled || false;
  const value = currentContent.value || "";
  const name = currentContent.name || "";
  const minLength = currentContent.minLength || "";
  const maxLength = currentContent.maxLength || "";
  const pattern = currentContent.pattern || "";
  const helperText = currentContent.helperText || "";
  const errorText = currentContent.errorText || "";

  // Color properties
  const backgroundColor = currentContent.backgroundColor || "#ffffff";
  const textColor = currentContent.textColor || "#111827";
  const borderColor = currentContent.borderColor || "#d1d5db";
  const focusBorderColor = currentContent.focusBorderColor || "#3b82f6";
  const labelColor = currentContent.labelColor || "#374151";
  const placeholderColor = currentContent.placeholderColor || "#9ca3af";

  const handleSelectChange = (field: string, value: string) => {
    const event = {
      target: {
        id: field,
        value: value,
      },
    } as any;
    handleChangeCustomValues(event);
  };

  const handleSwitchChange = (field: string, checked: boolean) => {
    const event = {
      target: {
        id: field,
        value: checked,
      },
    } as any;
    handleChangeCustomValues(event);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Basic Settings */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Basic Settings
        </Label>

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="inputType"
              className="text-xs text-muted-foreground"
            >
              Input Type
            </Label>
            <Select
              value={inputType}
              onValueChange={(value) => handleSelectChange("inputType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select input type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="password">Password</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="tel">Phone</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="time">Time</SelectItem>
                <SelectItem value="datetime-local">Date & Time</SelectItem>
                <SelectItem value="search">Search</SelectItem>
                <SelectItem value="file">File Upload</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="label" className="text-xs text-muted-foreground">
              Label
            </Label>
            <Input
              id="label"
              value={label}
              onChange={handleChangeCustomValues}
              placeholder="Enter label text"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="placeholder"
              className="text-xs text-muted-foreground"
            >
              Placeholder
            </Label>
            <Input
              id="placeholder"
              value={placeholder}
              onChange={handleChangeCustomValues}
              placeholder="Enter placeholder text"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-xs text-muted-foreground">
              Field Name (for forms)
            </Label>
            <Input
              id="name"
              value={name}
              onChange={handleChangeCustomValues}
              placeholder="field_name"
            />
          </div>
        </div>
      </div>

      {/* Validation Settings */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Validation
        </Label>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="required" className="text-xs text-muted-foreground">
              Required Field
            </Label>
            <Switch
              id="required"
              checked={required}
              onCheckedChange={(checked) =>
                handleSwitchChange("required", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="disabled" className="text-xs text-muted-foreground">
              Disabled
            </Label>
            <Switch
              id="disabled"
              checked={disabled}
              onCheckedChange={(checked) =>
                handleSwitchChange("disabled", checked)
              }
            />
          </div>

          {(inputType === "text" ||
            inputType === "password" ||
            inputType === "email") && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="minLength"
                    className="text-xs text-muted-foreground"
                  >
                    Min Length
                  </Label>
                  <Input
                    id="minLength"
                    type="number"
                    min="0"
                    value={minLength}
                    onChange={handleChangeCustomValues}
                    placeholder="0"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="maxLength"
                    className="text-xs text-muted-foreground"
                  >
                    Max Length
                  </Label>
                  <Input
                    id="maxLength"
                    type="number"
                    min="1"
                    value={maxLength}
                    onChange={handleChangeCustomValues}
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="pattern"
                  className="text-xs text-muted-foreground"
                >
                  Validation Pattern (Regex)
                </Label>
                <Input
                  id="pattern"
                  value={pattern}
                  onChange={handleChangeCustomValues}
                  placeholder="[A-Za-z0-9]+"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Help & Error Messages */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Messages
        </Label>

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="helperText"
              className="text-xs text-muted-foreground"
            >
              Helper Text
            </Label>
            <Textarea
              id="helperText"
              value={helperText}
              onChange={handleChangeCustomValues}
              placeholder="Additional information to help users"
              className="min-h-[60px] resize-none"
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="errorText"
              className="text-xs text-muted-foreground"
            >
              Error Message
            </Label>
            <Textarea
              id="errorText"
              value={errorText}
              onChange={handleChangeCustomValues}
              placeholder="Error message to show when validation fails"
              className="min-h-[60px] resize-none"
              rows={2}
            />
          </div>
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
              onChange={handleChangeCustomValues}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="textColor"
              className="text-xs text-muted-foreground"
            >
              Text Color
            </Label>
            <Input
              id="textColor"
              type="color"
              value={textColor}
              onChange={handleChangeCustomValues}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="borderColor"
              className="text-xs text-muted-foreground"
            >
              Border
            </Label>
            <Input
              id="borderColor"
              type="color"
              value={borderColor}
              onChange={handleChangeCustomValues}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="focusBorderColor"
              className="text-xs text-muted-foreground"
            >
              Focus Border
            </Label>
            <Input
              id="focusBorderColor"
              type="color"
              value={focusBorderColor}
              onChange={handleChangeCustomValues}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="labelColor"
              className="text-xs text-muted-foreground"
            >
              Label Color
            </Label>
            <Input
              id="labelColor"
              type="color"
              value={labelColor}
              onChange={handleChangeCustomValues}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="placeholderColor"
              className="text-xs text-muted-foreground"
            >
              Placeholder
            </Label>
            <Input
              id="placeholderColor"
              type="color"
              value={placeholderColor}
              onChange={handleChangeCustomValues}
              className="h-10 w-full"
            />
          </div>
        </div>
      </div>

      {/* Default Value */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Default Value
        </Label>

        <div className="flex flex-col gap-2">
          <Label htmlFor="value" className="text-xs text-muted-foreground">
            Initial Value
          </Label>
          <Input
            id="value"
            type={inputType === "number" ? "number" : "text"}
            value={value}
            onChange={handleChangeCustomValues}
            placeholder="Default value"
          />
        </div>
      </div>
    </div>
  );
};

export default InputSettings;
