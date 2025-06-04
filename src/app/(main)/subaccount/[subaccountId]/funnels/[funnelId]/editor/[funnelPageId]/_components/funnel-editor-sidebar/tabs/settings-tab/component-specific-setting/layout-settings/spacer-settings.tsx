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
import { Button } from "@/components/ui/button";
import { useCustomValuesUpdater } from "../../utils";

type Props = {};

const SpacerSettings = (props: Props) => {
  const { handleChangeCustomValues, state } = useCustomValuesUpdater();

  if (
    state.editor.selectedElement.type !== "spacer" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  const handleSelectChange = (field: string, value: string) => {
    const event = {
      target: {
        id: field,
        value: value,
      },
    } as any; // Use 'any' instead of specific type casting
    handleChangeCustomValues(event);
  };

  const handlePresetHeight = (height: number) => {
    const event = {
      target: {
        id: "spacerHeight",
        value: height.toString(), // Convert number to string
      },
    } as any; // Use 'any' instead of specific type casting
    handleChangeCustomValues(event);
  };

  const currentHeight =
    (state.editor.selectedElement.content as any).spacerHeight || 50;
  const currentWidth =
    (state.editor.selectedElement.content as any).spacerWidth || "100%";
  const currentBackgroundColor =
    (state.editor.selectedElement.content as any).spacerBackgroundColor ||
    "transparent";

  return (
    <div className="flex flex-col gap-4">
      {/* Height Settings */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="spacerHeight" className="text-muted-foreground">
          Height (px)
        </Label>
        <Input
          id="spacerHeight"
          type="number"
          min="1"
          max="500"
          placeholder="50"
          onChange={handleChangeCustomValues}
          value={currentHeight}
        />
      </div>

      {/* Quick Height Presets */}
      <div className="flex flex-col gap-2">
        <Label className="text-muted-foreground text-sm">Quick Heights</Label>
        <div className="grid grid-cols-4 gap-2">
          {[20, 50, 100, 150].map((height) => (
            <Button
              key={height}
              type="button"
              variant={currentHeight === height ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresetHeight(height)}
              className="text-xs"
            >
              {height}px
            </Button>
          ))}
        </div>
      </div>

      {/* Width Settings */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="spacerWidth" className="text-muted-foreground">
          Width
        </Label>
        <Select
          value={currentWidth}
          onValueChange={(value) => handleSelectChange("spacerWidth", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select width" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100%">Full Width (100%)</SelectItem>
            <SelectItem value="75%">Three Quarters (75%)</SelectItem>
            <SelectItem value="50%">Half Width (50%)</SelectItem>
            <SelectItem value="25%">Quarter Width (25%)</SelectItem>
            <SelectItem value="auto">Auto</SelectItem>
            <SelectItem value="200px">200px</SelectItem>
            <SelectItem value="300px">300px</SelectItem>
            <SelectItem value="400px">400px</SelectItem>
            <SelectItem value="500px">500px</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom Width Input */}
      {![
        "100%",
        "75%",
        "50%",
        "25%",
        "auto",
        "200px",
        "300px",
        "400px",
        "500px",
      ].includes(currentWidth) && (
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="customWidth"
            className="text-muted-foreground text-sm"
          >
            Custom Width
          </Label>
          <Input
            id="spacerWidth"
            placeholder="e.g., 300px, 50%, 20rem"
            onChange={handleChangeCustomValues}
            value={currentWidth}
          />
        </div>
      )}

      {/* Background Color */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="spacerBackgroundColor"
          className="text-muted-foreground"
        >
          Background Color
        </Label>
        <div className="flex gap-2">
          <Input
            id="spacerBackgroundColor"
            type="color"
            onChange={handleChangeCustomValues}
            value={
              currentBackgroundColor === "transparent"
                ? "#ffffff"
                : currentBackgroundColor
            }
            className="w-16 h-10 p-1"
            disabled={currentBackgroundColor === "transparent"}
          />
          <Button
            type="button"
            variant={
              currentBackgroundColor === "transparent" ? "default" : "outline"
            }
            size="sm"
            onClick={() =>
              handleSelectChange("spacerBackgroundColor", "transparent")
            }
            className="flex-1"
          >
            Transparent
          </Button>
        </div>
      </div>

      {/* Spacer Info */}
      <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <p className="font-medium mb-1">Spacer Usage:</p>
        <ul className="space-y-1 text-xs">
          <li>• Use spacers to add vertical spacing between elements</li>
          <li>• Transparent background creates invisible spacing</li>
          <li>• Colored background can act as a visual separator</li>
          <li>
            • Current size:{" "}
            <span className="font-mono">
              {currentHeight}px × {currentWidth}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SpacerSettings;
