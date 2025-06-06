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
import { Button } from "@/components/ui/button";
import { useEditor } from "@/providers/editor/editor-provider";
import {
  MousePointer,
  Clock,
  Eye,
  Settings,
  Palette,
  Layout,
  Zap,
  Info,
} from "lucide-react";

type Props = {};

const PopupSettings = (props: Props) => {
  const { dispatch, state } = useEditor();

  if (
    state.editor.selectedElement.type !== "popup" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  const element = state.editor.selectedElement;
  const content = element.content as any;

  // Default values
  const triggerType = content.triggerType || "click";
  const triggerText = content.triggerText || "Open Popup";
  const popupTitle = content.popupTitle || "Popup Title";
  const popupContent =
    content.popupContent ||
    "This is popup content. You can add any text, images, or HTML here.";
  const popupSize = content.popupSize || "medium";
  const position = content.position || "center";
  const animation = content.animation || "fadeIn";
  const overlay = content.overlay !== false;
  const closeOnOverlay = content.closeOnOverlay !== false;
  const closeOnEscape = content.closeOnEscape !== false;
  const showCloseButton = content.showCloseButton !== false;
  const autoClose = content.autoClose || false;
  const autoCloseDelay = content.autoCloseDelay || 5000;

  // Trigger settings
  const scrollTrigger = content.scrollTrigger || false;
  const scrollPercentage = content.scrollPercentage || 50;
  const timeTrigger = content.timeTrigger || false;
  const timeDelay = content.timeDelay || 3000;
  const exitIntentTrigger = content.exitIntentTrigger || false;

  // Style settings
  const backgroundColor = content.backgroundColor || "#ffffff";
  const textColor = content.textColor || "#111827";
  const overlayColor = content.overlayColor || "rgba(0, 0, 0, 0.5)";
  const borderRadius = content.borderRadius || 8;
  const padding = content.padding || 24;
  const maxWidth = content.maxWidth || 600;
  const maxHeight = content.maxHeight || 400;

  // Button styles
  const triggerButtonStyle = content.triggerButtonStyle || "primary";
  const triggerButtonColor = content.triggerButtonColor || "#3b82f6";
  const triggerButtonTextColor = content.triggerButtonTextColor || "#ffffff";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...element,
          content: {
            ...content,
            [e.target.id]: e.target.value,
          },
        },
      },
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...element,
          content: {
            ...content,
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
          content: {
            ...content,
            [field]: checked,
          },
        },
      },
    });
  };

  const handleNumberChange = (field: string, value: number) => {
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...element,
          content: {
            ...content,
            [field]: value,
          },
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Trigger Settings */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center gap-2">
          <MousePointer size={16} className="text-muted-foreground" />
          <Label className="text-sm font-semibold text-muted-foreground">
            Trigger Settings
          </Label>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="triggerType"
              className="text-xs text-muted-foreground"
            >
              Primary Trigger
            </Label>
            <Select
              value={triggerType}
              onValueChange={(value) =>
                handleSelectChange("triggerType", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trigger type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="click">Click Button</SelectItem>
                <SelectItem value="hover">Hover Button</SelectItem>
                <SelectItem value="auto">Auto (Page Load)</SelectItem>
                <SelectItem value="scroll">Scroll Trigger</SelectItem>
                <SelectItem value="time">Time Delay</SelectItem>
                <SelectItem value="exit">Exit Intent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(triggerType === "click" || triggerType === "hover") && (
            <>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="triggerText"
                  className="text-xs text-muted-foreground"
                >
                  Button Text
                </Label>
                <Input
                  id="triggerText"
                  value={triggerText}
                  onChange={handleInputChange}
                  placeholder="Open Popup"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="triggerButtonStyle"
                  className="text-xs text-muted-foreground"
                >
                  Button Style
                </Label>
                <Select
                  value={triggerButtonStyle}
                  onValueChange={(value) =>
                    handleSelectChange("triggerButtonStyle", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="triggerButtonColor"
                    className="text-xs text-muted-foreground"
                  >
                    Button Color
                  </Label>
                  <Input
                    id="triggerButtonColor"
                    type="color"
                    value={triggerButtonColor}
                    onChange={handleInputChange}
                    className="h-10 w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="triggerButtonTextColor"
                    className="text-xs text-muted-foreground"
                  >
                    Text Color
                  </Label>
                  <Input
                    id="triggerButtonTextColor"
                    type="color"
                    value={triggerButtonTextColor}
                    onChange={handleInputChange}
                    className="h-10 w-full"
                  />
                </div>
              </div>
            </>
          )}

          {/* Additional Triggers */}
          <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Label className="text-xs text-muted-foreground font-medium">
              Additional Triggers
            </Label>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye size={14} />
                <Label className="text-xs text-muted-foreground">
                  Scroll Trigger
                </Label>
              </div>
              <Switch
                checked={scrollTrigger}
                onCheckedChange={(checked) =>
                  handleSwitchChange("scrollTrigger", checked)
                }
              />
            </div>

            {scrollTrigger && (
              <div className="flex flex-col gap-2 ml-6">
                <Label className="text-xs text-muted-foreground">
                  Scroll Percentage: {scrollPercentage}%
                </Label>
                <Input
                  type="range"
                  min="10"
                  max="90"
                  value={scrollPercentage}
                  onChange={(e) =>
                    handleNumberChange(
                      "scrollPercentage",
                      parseInt(e.target.value)
                    )
                  }
                  className="h-2"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <Label className="text-xs text-muted-foreground">
                  Time Trigger
                </Label>
              </div>
              <Switch
                checked={timeTrigger}
                onCheckedChange={(checked) =>
                  handleSwitchChange("timeTrigger", checked)
                }
              />
            </div>

            {timeTrigger && (
              <div className="flex flex-col gap-2 ml-6">
                <Label className="text-xs text-muted-foreground">
                  Delay: {timeDelay / 1000}s
                </Label>
                <Input
                  type="range"
                  min="1000"
                  max="30000"
                  step="1000"
                  value={timeDelay}
                  onChange={(e) =>
                    handleNumberChange("timeDelay", parseInt(e.target.value))
                  }
                  className="h-2"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={14} />
                <Label className="text-xs text-muted-foreground">
                  Exit Intent
                </Label>
              </div>
              <Switch
                checked={exitIntentTrigger}
                onCheckedChange={(checked) =>
                  handleSwitchChange("exitIntentTrigger", checked)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Settings */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center gap-2">
          <Layout size={16} className="text-muted-foreground" />
          <Label className="text-sm font-semibold text-muted-foreground">
            Content Settings
          </Label>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="popupTitle"
              className="text-xs text-muted-foreground"
            >
              Popup Title
            </Label>
            <Input
              id="popupTitle"
              value={popupTitle}
              onChange={handleInputChange}
              placeholder="Popup Title"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="popupContent"
              className="text-xs text-muted-foreground"
            >
              Popup Content
            </Label>
            <Textarea
              id="popupContent"
              value={popupContent}
              onChange={handleInputChange}
              placeholder="Enter your popup content here..."
              className="min-h-[100px] resize-vertical"
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Layout Settings */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center gap-2">
          <Settings size={16} className="text-muted-foreground" />
          <Label className="text-sm font-semibold text-muted-foreground">
            Layout & Behavior
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="popupSize"
              className="text-xs text-muted-foreground"
            >
              Popup Size
            </Label>
            <Select
              value={popupSize}
              onValueChange={(value) => handleSelectChange("popupSize", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (400px)</SelectItem>
                <SelectItem value="medium">Medium (600px)</SelectItem>
                <SelectItem value="large">Large (800px)</SelectItem>
                <SelectItem value="fullscreen">Fullscreen</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="position" className="text-xs text-muted-foreground">
              Position
            </Label>
            <Select
              value={position}
              onValueChange={(value) => handleSelectChange("position", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="top-left">Top Left</SelectItem>
                <SelectItem value="top-right">Top Right</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="animation"
              className="text-xs text-muted-foreground"
            >
              Animation
            </Label>
            <Select
              value={animation}
              onValueChange={(value) => handleSelectChange("animation", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fadeIn">Fade In</SelectItem>
                <SelectItem value="slideUp">Slide Up</SelectItem>
                <SelectItem value="slideDown">Slide Down</SelectItem>
                <SelectItem value="slideLeft">Slide Left</SelectItem>
                <SelectItem value="slideRight">Slide Right</SelectItem>
                <SelectItem value="zoomIn">Zoom In</SelectItem>
                <SelectItem value="bounce">Bounce</SelectItem>
                <SelectItem value="flip">Flip</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {popupSize === "custom" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">
                Max Width: {maxWidth}px
              </Label>
              <Input
                type="range"
                min="300"
                max="1200"
                value={maxWidth}
                onChange={(e) =>
                  handleNumberChange("maxWidth", parseInt(e.target.value))
                }
                className="h-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">
                Max Height: {maxHeight}px
              </Label>
              <Input
                type="range"
                min="200"
                max="800"
                value={maxHeight}
                onChange={(e) =>
                  handleNumberChange("maxHeight", parseInt(e.target.value))
                }
                className="h-2"
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Show Overlay
            </Label>
            <Switch
              checked={overlay}
              onCheckedChange={(checked) =>
                handleSwitchChange("overlay", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Close on Overlay Click
            </Label>
            <Switch
              checked={closeOnOverlay}
              onCheckedChange={(checked) =>
                handleSwitchChange("closeOnOverlay", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Close on Escape Key
            </Label>
            <Switch
              checked={closeOnEscape}
              onCheckedChange={(checked) =>
                handleSwitchChange("closeOnEscape", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Show Close Button
            </Label>
            <Switch
              checked={showCloseButton}
              onCheckedChange={(checked) =>
                handleSwitchChange("showCloseButton", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Auto Close</Label>
            <Switch
              checked={autoClose}
              onCheckedChange={(checked) =>
                handleSwitchChange("autoClose", checked)
              }
            />
          </div>

          {autoClose && (
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">
                Auto Close Delay: {autoCloseDelay / 1000}s
              </Label>
              <Input
                type="range"
                min="1000"
                max="15000"
                step="1000"
                value={autoCloseDelay}
                onChange={(e) =>
                  handleNumberChange("autoCloseDelay", parseInt(e.target.value))
                }
                className="h-2"
              />
            </div>
          )}
        </div>
      </div>

      {/* Style Settings */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-muted-foreground" />
          <Label className="text-sm font-semibold text-muted-foreground">
            Style Settings
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="backgroundColor"
              className="text-xs text-muted-foreground"
            >
              Background Color
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
              htmlFor="textColor"
              className="text-xs text-muted-foreground"
            >
              Text Color
            </Label>
            <Input
              id="textColor"
              type="color"
              value={textColor}
              onChange={handleInputChange}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="overlayColor"
              className="text-xs text-muted-foreground"
            >
              Overlay Color
            </Label>
            <Input
              id="overlayColor"
              value={overlayColor}
              onChange={handleInputChange}
              placeholder="rgba(0, 0, 0, 0.5)"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Border Radius: {borderRadius}px
            </Label>
            <Input
              type="range"
              min="0"
              max="32"
              value={borderRadius}
              onChange={(e) =>
                handleNumberChange("borderRadius", parseInt(e.target.value))
              }
              className="h-2"
            />
          </div>

          <div className="flex flex-col gap-2 col-span-2">
            <Label className="text-xs text-muted-foreground">
              Padding: {padding}px
            </Label>
            <Input
              type="range"
              min="8"
              max="48"
              value={padding}
              onChange={(e) =>
                handleNumberChange("padding", parseInt(e.target.value))
              }
              className="h-2"
            />
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <Info size={16} className="mt-0.5 flex-shrink-0 text-blue-600" />
          <div>
            <p className="font-medium mb-1 text-blue-900 dark:text-blue-100">
              Popup Best Practices:
            </p>
            <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
              <li>• Use exit intent for promotional popups</li>
              <li>• Keep content concise and valuable</li>
              <li>• Test popup timing for best user experience</li>
              <li>• Ensure mobile responsiveness</li>
              <li>• Provide clear close options</li>
              <li>• Consider accessibility with keyboard navigation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupSettings;
