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
import {
  MousePointer,
  MessageSquare,
  Palette,
  Settings,
  Info,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

type Props = {};

const TooltipSettings = (props: Props) => {
  const { dispatch, state } = useEditor();

  if (
    state.editor.selectedElement.type !== "tooltip" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  const element = state.editor.selectedElement;
  const content = element.content as any;

  // Default values
  const triggerText = content.triggerText || "Hover me";
  const tooltipContent =
    content.tooltipContent || "This is a helpful tooltip with information.";
  const triggerType = content.triggerTypee || "hover";
  const position = content.positionn || "top";
  const theme = content.theme || "dark";
  const size = content.size || "medium";
  const animation = content.animationn || "fade";
  const arrow = content.arrow !== false;
  const delay = content.delay || 0;
  const hideDelay = content.hideDelay || 0;
  const maxWidth = content.maxWidth || 200;
  const offset = content.offset || 8;
  const followCursor = content.followCursor || false;
  const interactive = content.interactive || false;
  const multiline = content.multiline || false;

  // Custom styling
  const customStyle = content.customStyle || false;
  const backgroundColor = content.backgroundColor || "#1f2937";
  const textColor = content.textColor || "#ffffff";
  const borderColor = content.borderColor || "#374151";
  const borderRadius = content.borderRadius || 6;
  const fontSize = content.fontSize || 14;
  const padding = content.padding || 8;

  // Trigger element styling
  const triggerStyle = content.triggerStyle || "button";
  const triggerButtonColor = content.triggerButtonColor || "#3b82f6";
  const triggerButtonTextColor = content.triggerButtonTextColor || "#ffffff";
  const triggerUnderline = content.triggerUnderline || false;

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

  const getPositionIcon = (pos: string) => {
    switch (pos) {
      case "top":
        return <ArrowUp size={14} />;
      case "bottom":
        return <ArrowDown size={14} />;
      case "left":
        return <ArrowLeft size={14} />;
      case "right":
        return <ArrowRight size={14} />;
      default:
        return <ArrowUp size={14} />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Trigger Settings */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center gap-2">
          <MousePointer size={16} className="text-muted-foreground" />
          <Label className="text-sm font-semibold text-muted-foreground">
            Trigger Element
          </Label>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="triggerText"
              className="text-xs text-muted-foreground"
            >
              Trigger Text
            </Label>
            <Input
              id="triggerText"
              value={triggerText}
              onChange={handleInputChange}
              placeholder="Hover me"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="triggerType"
                className="text-xs text-muted-foreground"
              >
                Trigger Type
              </Label>
              <Select
                value={triggerType}
                onValueChange={(value) =>
                  handleSelectChange("triggerType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hover">Hover</SelectItem>
                  <SelectItem value="click">Click</SelectItem>
                  <SelectItem value="focus">Focus</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="triggerStyle"
                className="text-xs text-muted-foreground"
              >
                Trigger Style
              </Label>
              <Select
                value={triggerStyle}
                onValueChange={(value) =>
                  handleSelectChange("triggerStyle", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="button">Button</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="icon">Icon</SelectItem>
                  <SelectItem value="badge">Badge</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {triggerStyle === "button" && (
            <div className="grid grid-cols-2 gap-3">
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
          )}

          {(triggerStyle === "text" || triggerStyle === "link") && (
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Show Underline
              </Label>
              <Switch
                checked={triggerUnderline}
                onCheckedChange={(checked) =>
                  handleSwitchChange("triggerUnderline", checked)
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Tooltip Content */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-muted-foreground" />
          <Label className="text-sm font-semibold text-muted-foreground">
            Tooltip Content
          </Label>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="tooltipContent"
              className="text-xs text-muted-foreground"
            >
              Tooltip Text
            </Label>
            <Textarea
              id="tooltipContent"
              value={tooltipContent}
              onChange={handleInputChange}
              placeholder="Enter tooltip content..."
              className="min-h-[80px] resize-vertical"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Allow Multiline
            </Label>
            <Switch
              checked={multiline}
              onCheckedChange={(checked) =>
                handleSwitchChange("multiline", checked)
              }
            />
          </div>
        </div>
      </div>

      {/* Position & Behavior */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center gap-2">
          <Settings size={16} className="text-muted-foreground" />
          <Label className="text-sm font-semibold text-muted-foreground">
            Position & Behavior
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-3">
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
                <SelectItem value="top">
                  <div className="flex items-center gap-2">
                    <ArrowUp size={14} />
                    Top
                  </div>
                </SelectItem>
                <SelectItem value="bottom">
                  <div className="flex items-center gap-2">
                    <ArrowDown size={14} />
                    Bottom
                  </div>
                </SelectItem>
                <SelectItem value="left">
                  <div className="flex items-center gap-2">
                    <ArrowLeft size={14} />
                    Left
                  </div>
                </SelectItem>
                <SelectItem value="right">
                  <div className="flex items-center gap-2">
                    <ArrowRight size={14} />
                    Right
                  </div>
                </SelectItem>
                <SelectItem value="top-start">Top Start</SelectItem>
                <SelectItem value="top-end">Top End</SelectItem>
                <SelectItem value="bottom-start">Bottom Start</SelectItem>
                <SelectItem value="bottom-end">Bottom End</SelectItem>
                <SelectItem value="left-start">Left Start</SelectItem>
                <SelectItem value="left-end">Left End</SelectItem>
                <SelectItem value="right-start">Right Start</SelectItem>
                <SelectItem value="right-end">Right End</SelectItem>
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
                <SelectItem value="fade">Fade</SelectItem>
                <SelectItem value="scale">Scale</SelectItem>
                <SelectItem value="shift">Shift</SelectItem>
                <SelectItem value="perspective">Perspective</SelectItem>
                <SelectItem value="slide">Slide</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="size" className="text-xs text-muted-foreground">
              Size
            </Label>
            <Select
              value={size}
              onValueChange={(value) => handleSelectChange("size", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="theme" className="text-xs text-muted-foreground">
              Theme
            </Label>
            <Select
              value={theme}
              onValueChange={(value) => handleSelectChange("theme", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Show Arrow</Label>
            <Switch
              checked={arrow}
              onCheckedChange={(checked) =>
                handleSwitchChange("arrow", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Follow Cursor
            </Label>
            <Switch
              checked={followCursor}
              onCheckedChange={(checked) =>
                handleSwitchChange("followCursor", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Interactive Content
            </Label>
            <Switch
              checked={interactive}
              onCheckedChange={(checked) =>
                handleSwitchChange("interactive", checked)
              }
            />
          </div>
        </div>
      </div>

      {/* Timing Settings */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Timing Settings
        </Label>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Show Delay: {delay}ms
            </Label>
            <Input
              type="range"
              min="0"
              max="2000"
              step="100"
              value={delay}
              onChange={(e) =>
                handleNumberChange("delay", parseInt(e.target.value))
              }
              className="h-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Hide Delay: {hideDelay}ms
            </Label>
            <Input
              type="range"
              min="0"
              max="2000"
              step="100"
              value={hideDelay}
              onChange={(e) =>
                handleNumberChange("hideDelay", parseInt(e.target.value))
              }
              className="h-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Max Width: {maxWidth}px
            </Label>
            <Input
              type="range"
              min="100"
              max="400"
              value={maxWidth}
              onChange={(e) =>
                handleNumberChange("maxWidth", parseInt(e.target.value))
              }
              className="h-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Offset: {offset}px
            </Label>
            <Input
              type="range"
              min="0"
              max="20"
              value={offset}
              onChange={(e) =>
                handleNumberChange("offset", parseInt(e.target.value))
              }
              className="h-2"
            />
          </div>
        </div>
      </div>

      {/* Custom Styling */}
      {theme === "custom" && (
        <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-muted-foreground" />
            <Label className="text-sm font-semibold text-muted-foreground">
              Custom Styling
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
              <Label className="text-xs text-muted-foreground">
                Border Radius: {borderRadius}px
              </Label>
              <Input
                type="range"
                min="0"
                max="16"
                value={borderRadius}
                onChange={(e) =>
                  handleNumberChange("borderRadius", parseInt(e.target.value))
                }
                className="h-2"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">
                Font Size: {fontSize}px
              </Label>
              <Input
                type="range"
                min="10"
                max="20"
                value={fontSize}
                onChange={(e) =>
                  handleNumberChange("fontSize", parseInt(e.target.value))
                }
                className="h-2"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">
                Padding: {padding}px
              </Label>
              <Input
                type="range"
                min="4"
                max="20"
                value={padding}
                onChange={(e) =>
                  handleNumberChange("padding", parseInt(e.target.value))
                }
                className="h-2"
              />
            </div>
          </div>
        </div>
      )}

      {/* Usage Tips */}
      <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <Info size={16} className="mt-0.5 flex-shrink-0 text-blue-600" />
          <div>
            <p className="font-medium mb-1 text-blue-900 dark:text-blue-100">
              Tooltip Best Practices:
            </p>
            <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
              <li>• Keep content concise and helpful</li>
              <li>• Use consistent positioning across your site</li>
              <li>• Consider touch devices - click triggers work better</li>
              <li>• Ensure sufficient color contrast for accessibility</li>
              <li>• Test tooltip visibility on different backgrounds</li>
              <li>• Use interactive tooltips for complex content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TooltipSettings;
