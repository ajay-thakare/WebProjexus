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

const IconSettings = (props: Props) => {
  const { handleChangeCustomValues, state } = useCustomValuesUpdater();

  if (
    state.editor.selectedElement.type !== "icon" ||
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

  const iconOptions = [
    { value: "star", label: "Star" },
    { value: "heart", label: "Heart" },
    { value: "home", label: "Home" },
    { value: "user", label: "User" },
    { value: "mail", label: "Mail" },
    { value: "phone", label: "Phone" },
    { value: "search", label: "Search" },
    { value: "settings", label: "Settings" },
    { value: "calendar", label: "Calendar" },
    { value: "clock", label: "Clock" },
    { value: "camera", label: "Camera" },
    { value: "music", label: "Music" },
    { value: "video", label: "Video" },
    { value: "file", label: "File" },
    { value: "folder", label: "Folder" },
    { value: "download", label: "Download" },
    { value: "upload", label: "Upload" },
    { value: "edit", label: "Edit" },
    { value: "delete", label: "Delete" },
    { value: "plus", label: "Plus" },
    { value: "minus", label: "Minus" },
    { value: "check", label: "Check" },
    { value: "x", label: "X" },
    { value: "arrow-left", label: "Arrow Left" },
    { value: "arrow-right", label: "Arrow Right" },
    { value: "arrow-up", label: "Arrow Up" },
    { value: "arrow-down", label: "Arrow Down" },
    { value: "chevron-left", label: "Chevron Left" },
    { value: "chevron-right", label: "Chevron Right" },
    { value: "chevron-up", label: "Chevron Up" },
    { value: "chevron-down", label: "Chevron Down" },
    { value: "eye", label: "Eye" },
    { value: "eye-off", label: "Eye Off" },
    { value: "lock", label: "Lock" },
    { value: "unlock", label: "Unlock" },
    { value: "share", label: "Share" },
    { value: "copy", label: "Copy" },
    { value: "save", label: "Save" },
    { value: "maximize", label: "Maximize" },
    { value: "minimize", label: "Minimize" },
    { value: "volume", label: "Volume" },
    { value: "volume-x", label: "Volume X" },
    { value: "play", label: "Play" },
    { value: "pause", label: "Pause" },
    { value: "skip-back", label: "Skip Back" },
    { value: "skip-forward", label: "Skip Forward" },
    { value: "shuffle", label: "Shuffle" },
    { value: "repeat", label: "Repeat" },
    { value: "message-circle", label: "Message Circle" },
    { value: "bell", label: "Bell" },
    { value: "shield", label: "Shield" },
    { value: "globe", label: "Globe" },
    { value: "wifi", label: "Wifi" },
    { value: "battery", label: "Battery" },
    { value: "bluetooth", label: "Bluetooth" },
    { value: "headphones", label: "Headphones" },
    { value: "mic", label: "Mic" },
    { value: "speaker", label: "Speaker" },
    { value: "zap", label: "Zap" },
    { value: "sun", label: "Sun" },
    { value: "moon", label: "Moon" },
    { value: "cloud", label: "Cloud" },
    { value: "cloud-rain", label: "Cloud Rain" },
    { value: "map-pin", label: "Map Pin" },
    { value: "navigation", label: "Navigation" },
    { value: "compass", label: "Compass" },
    { value: "flag", label: "Flag" },
    { value: "gift", label: "Gift" },
    { value: "award", label: "Award" },
    { value: "trophy", label: "Trophy" },
    { value: "target", label: "Target" },
    { value: "bookmark", label: "Bookmark" },
    { value: "tag", label: "Tag" },
    { value: "filter", label: "Filter" },
    { value: "grid", label: "Grid" },
    { value: "list", label: "List" },
    { value: "layout", label: "Layout" },
    { value: "sidebar", label: "Sidebar" },
    { value: "menu", label: "Menu" },
    { value: "more-horizontal", label: "More Horizontal" },
    { value: "more-vertical", label: "More Vertical" },
    { value: "info", label: "Info" },
    { value: "alert-circle", label: "Alert Circle" },
    { value: "alert-triangle", label: "Alert Triangle" },
    { value: "check-circle", label: "Check Circle" },
    { value: "x-circle", label: "X Circle" },
    { value: "help-circle", label: "Help Circle" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="iconName" className="text-muted-foreground">
          Icon
        </Label>
        <Select
          value={state.editor.selectedElement.content.iconName || "star"}
          onValueChange={(value) => handleSelectChange("iconName", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an icon" />
          </SelectTrigger>
          <SelectContent className="max-h-48">
            {iconOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="iconSize" className="text-muted-foreground">
          Icon Size (px)
        </Label>
        <Input
          id="iconSize"
          type="number"
          min="12"
          max="128"
          placeholder="24"
          onChange={handleChangeCustomValues}
          value={state.editor.selectedElement.content.iconSize || 24}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="iconColor" className="text-muted-foreground">
          Icon Color
        </Label>
        <Input
          id="iconColor"
          type="color"
          placeholder="#6366f1"
          onChange={handleChangeCustomValues}
          value={state.editor.selectedElement.content.iconColor || "#6366f1"}
        />
      </div>
    </div>
  );
};

export default IconSettings;
