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

const CheckboxSettings = (props: Props) => {
  const { handleChangeCustomValues, state } = useCustomValuesUpdater();

  if (
    state.editor.selectedElement.type !== "checkbox" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  const currentContent = state.editor.selectedElement.content as any;
  const label = currentContent.label || "";
  const required = currentContent.required || false;
  const disabled = currentContent.disabled || false;
  const checked = currentContent.checked || false;
  const name = currentContent.name || "";
  const value = currentContent.value || "";
  const helperText = currentContent.helperText || "";
  const errorText = currentContent.errorText || "";
  const size = currentContent.size || "medium";
  const layout = currentContent.layout || "horizontal";

  // Color properties
  const checkboxColor = currentContent.checkboxColor || "#3b82f6";
  const labelColor = currentContent.labelColor || "#374151";
  const borderColor = currentContent.borderColor || "#d1d5db";
  const focusColor = currentContent.focusColor || "#3b82f6";

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
            <Label htmlFor="label" className="text-xs text-muted-foreground">
              Label Text
            </Label>
            <Input
              id="label"
              value={label}
              onChange={handleChangeCustomValues}
              placeholder="Enter checkbox label"
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="value" className="text-xs text-muted-foreground">
              Value (when checked)
            </Label>
            <Input
              id="value"
              value={value}
              onChange={handleChangeCustomValues}
              placeholder="checkbox_value"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="checked" className="text-xs text-muted-foreground">
              Default Checked State
            </Label>
            <Switch
              id="checked"
              checked={checked}
              onCheckedChange={(checked) =>
                handleSwitchChange("checked", checked)
              }
            />
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Appearance
        </Label>

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="size" className="text-xs text-muted-foreground">
              Checkbox Size
            </Label>
            <Select
              value={size}
              onValueChange={(value) => handleSelectChange("size", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="layout" className="text-xs text-muted-foreground">
              Layout Direction
            </Label>
            <Select
              value={layout}
              onValueChange={(value) => handleSelectChange("layout", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="horizontal">
                  Horizontal (checkbox + label)
                </SelectItem>
                <SelectItem value="vertical">
                  Vertical (checkbox above label)
                </SelectItem>
              </SelectContent>
            </Select>
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
              htmlFor="checkboxColor"
              className="text-xs text-muted-foreground"
            >
              Checkbox Color
            </Label>
            <Input
              id="checkboxColor"
              type="color"
              value={checkboxColor}
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
              htmlFor="borderColor"
              className="text-xs text-muted-foreground"
            >
              Border Color
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
              htmlFor="focusColor"
              className="text-xs text-muted-foreground"
            >
              Focus Color
            </Label>
            <Input
              id="focusColor"
              type="color"
              value={focusColor}
              onChange={handleChangeCustomValues}
              className="h-10 w-full"
            />
          </div>
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
              placeholder="Additional information about this checkbox"
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
              placeholder="Error message when validation fails"
              className="min-h-[60px] resize-none"
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckboxSettings;
