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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useCustomValuesUpdater } from "../../utils";

type Props = {};

interface RadioOption {
  id: string;
  label: string;
  value: string;
}

const RadioSettings = (props: Props) => {
  const { handleChangeCustomValues, state } = useCustomValuesUpdater();

  if (
    state.editor.selectedElement.type !== "radio" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  const currentContent = state.editor.selectedElement.content as any;
  const groupLabel = currentContent.groupLabel || "";
  const required = currentContent.required || false;
  const disabled = currentContent.disabled || false;
  const selectedValue = currentContent.selectedValue || "";
  const name = currentContent.name || "";
  const helperText = currentContent.helperText || "";
  const errorText = currentContent.errorText || "";
  const size = currentContent.size || "medium";
  const layout = currentContent.layout || "vertical";
  const options = currentContent.options || [];

  // Color properties
  const radioColor = currentContent.radioColor || "#3b82f6";
  const labelColor = currentContent.labelColor || "#374151";
  const groupLabelColor = currentContent.groupLabelColor || "#111827";
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

  const handleAddOption = () => {
    const newOption = {
      id: `option${Date.now()}`,
      label: `Option ${options.length + 1}`,
      value: `option${options.length + 1}`,
    };

    const event = {
      target: {
        id: "options",
        value: [...options, newOption],
      },
    } as any;
    handleChangeCustomValues(event);
  };

  const handleRemoveOption = (optionId: string) => {
    if (options.length <= 1) return;

    const newOptions = options.filter(
      (option: RadioOption) => option.id !== optionId
    );

    const event = {
      target: {
        id: "options",
        value: newOptions,
      },
    } as any;
    handleChangeCustomValues(event);

    // Clear selected value if it was the removed option
    const removedOption = options.find(
      (opt: RadioOption) => opt.id === optionId
    );
    if (removedOption && selectedValue === removedOption.value) {
      const clearEvent = {
        target: {
          id: "selectedValue",
          value: "",
        },
      } as any;
      handleChangeCustomValues(clearEvent);
    }
  };

  const handleOptionChange = (
    optionId: string,
    field: "label" | "value",
    value: string
  ) => {
    const newOptions = options.map((option: RadioOption) =>
      option.id === optionId ? { ...option, [field]: value } : option
    );

    const event = {
      target: {
        id: "options",
        value: newOptions,
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
              htmlFor="groupLabel"
              className="text-xs text-muted-foreground"
            >
              Group Label
            </Label>
            <Input
              id="groupLabel"
              value={groupLabel}
              onChange={handleChangeCustomValues}
              placeholder="Enter group label"
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
            <Label
              htmlFor="selectedValue"
              className="text-xs text-muted-foreground"
            >
              Default Selected Value
            </Label>
            <Select
              value={selectedValue || "none"}
              onValueChange={(value) =>
                handleSelectChange(
                  "selectedValue",
                  value === "none" ? "" : value
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select default option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None Selected</SelectItem>
                {options.map((option: RadioOption) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              Radio Button Size
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
                <SelectItem value="vertical">Vertical (stacked)</SelectItem>
                <SelectItem value="horizontal">Horizontal (inline)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Radio Options Management */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-muted-foreground">
            Radio Options
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddOption}
            className="h-8 w-8 p-0"
          >
            <Plus size={14} />
          </Button>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {options.map((option: RadioOption, index: number) => (
            <div
              key={option.id}
              className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">
                  Option {index + 1}
                </Label>
                {options.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveOption(option.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={12} />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground">Label</Label>
                  <Input
                    value={option.label}
                    onChange={(e) =>
                      handleOptionChange(option.id, "label", e.target.value)
                    }
                    placeholder={`Option ${index + 1}`}
                    className="text-sm h-8"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground">Value</Label>
                  <Input
                    value={option.value}
                    onChange={(e) =>
                      handleOptionChange(option.id, "value", e.target.value)
                    }
                    placeholder={`option${index + 1}`}
                    className="text-sm h-8"
                  />
                </div>
              </div>
            </div>
          ))}
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
              htmlFor="radioColor"
              className="text-xs text-muted-foreground"
            >
              Radio Color
            </Label>
            <Input
              id="radioColor"
              type="color"
              value={radioColor}
              onChange={handleChangeCustomValues}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="labelColor"
              className="text-xs text-muted-foreground"
            >
              Option Labels
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
              htmlFor="groupLabelColor"
              className="text-xs text-muted-foreground"
            >
              Group Label
            </Label>
            <Input
              id="groupLabelColor"
              type="color"
              value={groupLabelColor}
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
              placeholder="Additional information about this radio group"
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
              placeholder="Error message when no option is selected"
              className="min-h-[60px] resize-none"
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioSettings;
