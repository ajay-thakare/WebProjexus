"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomValuesUpdater } from "../../utils";

type Props = {};

const SpacerSettings = (props: Props) => {
  const { handleChangeCustomValues, state, dispatch } =
    useCustomValuesUpdater();

  if (
    state.editor.selectedElement.type !== "spacer" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  // Type assertion for content
  const content = state.editor.selectedElement.content as {
    spacerHeight?: number;
    spacerWidth?: string;
    spacerBackgroundColor?: string;
  };

  // Direct dispatch for width changes to ensure proper formatting
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Directly dispatch the update with properly formatted width
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          content: {
            ...state.editor.selectedElement.content,
            spacerWidth: `${value}px`,
          },
        },
      },
    });
  };

  // Extract numeric value from width string for the input
  const getNumericWidth = () => {
    if (!content.spacerWidth) return 100; // Default width value
    const match = content.spacerWidth.match(/^(\d+)/);
    return match ? parseInt(match[1]) : 100;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="spacerHeight" className="text-muted-foreground">
          Spacer Height (px)
        </Label>
        <Input
          id="spacerHeight"
          type="number"
          min="1"
          max="500"
          placeholder="24"
          onChange={handleChangeCustomValues}
          value={content.spacerHeight || 24}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="spacerWidth" className="text-muted-foreground">
          Spacer Width (px)
        </Label>
        <Input
          id="spacerWidth"
          type="number"
          min="1"
          max="500"
          placeholder="100"
          onChange={handleWidthChange} // Use direct dispatch handler
          value={getNumericWidth()} // Use extracted numeric value
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="spacerBackgroundColor"
          className="text-muted-foreground"
        >
          Spacer Background Color
        </Label>
        <Input
          id="spacerBackgroundColor"
          type="color"
          placeholder="#e5e7eb"
          onChange={handleChangeCustomValues}
          value={content.spacerBackgroundColor || "#e5e7eb"}
        />
      </div>
    </div>
  );
};

export default SpacerSettings;
