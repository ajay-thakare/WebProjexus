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
import { useCustomValuesUpdater } from "../../utils";

type Props = {};

const DividerSettings = (props: Props) => {
  const { handleChangeCustomValues, state } = useCustomValuesUpdater();

  if (
    state.editor.selectedElement.type !== "divider" ||
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
    } as React.ChangeEvent<HTMLInputElement>;
    handleChangeCustomValues(event);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="dividerStyle" className="text-muted-foreground">
          Divider Style
        </Label>
        <Select
          value={state.editor.selectedElement.content.dividerStyle || "solid"}
          onValueChange={(value) => handleSelectChange("dividerStyle", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
            <SelectItem value="thick">Thick</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="dividerColor" className="text-muted-foreground">
          Divider Color
        </Label>
        <Input
          id="dividerColor"
          type="color"
          placeholder="#d1d5db"
          onChange={handleChangeCustomValues}
          value={state.editor.selectedElement.content.dividerColor || "#d1d5db"}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="dividerThickness" className="text-muted-foreground">
          Thickness (px)
        </Label>
        <Input
          id="dividerThickness"
          type="number"
          min="1"
          max="10"
          placeholder="1"
          onChange={handleChangeCustomValues}
          value={state.editor.selectedElement.content.dividerThickness || 1}
        />
      </div>
    </div>
  );
};

export default DividerSettings;
