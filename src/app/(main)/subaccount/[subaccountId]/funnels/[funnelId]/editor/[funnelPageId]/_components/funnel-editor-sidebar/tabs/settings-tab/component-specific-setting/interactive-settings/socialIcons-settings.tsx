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
import { useEditor } from "@/providers/editor/editor-provider";
import {
  Plus,
  Trash2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Globe,
} from "lucide-react";

type Props = {};

const SocialIconsSettings = (props: Props) => {
  const { dispatch, state } = useEditor();

  if (
    state.editor.selectedElement.type !== "socialIcons" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  const element = state.editor.selectedElement;
  const content = element.content as any;

  // Default values
  const socialLinks = content.socialLinks || [
    {
      id: "1",
      platform: "facebook",
      url: "https://facebook.com",
      label: "Facebook",
    },
    {
      id: "2",
      platform: "twitter",
      url: "https://twitter.com",
      label: "Twitter",
    },
    {
      id: "3",
      platform: "instagram",
      url: "https://instagram.com",
      label: "Instagram",
    },
  ];
  const iconSize = content.iconSize || 24;
  const iconSpacing = content.iconSpacing || 16;
  const layout = content.layout || "horizontal";
  const style = content.style || "filled";
  const borderRadius = content.borderRadius || 8;
  const showLabels = content.showLabels || false;
  const openInNewTab = content.openInNewTab !== false;
  const hoverEffect = content.hoverEffect || "scale";
  const alignment = content.alignment || "center";

  // Color settings
  const customColors = content.customColors || false;
  const iconColor = content.iconColor || "#ffffff";
  const backgroundColor = content.backgroundColor || "#3b82f6";
  const hoverColor = content.hoverColor || "#2563eb";
  const labelColor = content.labelColor || "#374151";

  const handleInputChange = (field: string, value: any) => {
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

  const handleSocialLinkChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };

    handleInputChange("socialLinks", updatedLinks);
  };

  const addSocialLink = () => {
    const newLink = {
      id: Date.now().toString(),
      platform: "facebook",
      url: "",
      label: "New Platform",
    };

    handleInputChange("socialLinks", [...socialLinks, newLink]);
  };

  const removeSocialLink = (index: number) => {
    const updatedLinks = socialLinks.filter((_: any, i: number) => i !== index);
    handleInputChange("socialLinks", updatedLinks);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook size={16} />;
      case "twitter":
        return <Twitter size={16} />;
      case "instagram":
        return <Instagram size={16} />;
      case "linkedin":
        return <Linkedin size={16} />;
      case "youtube":
        return <Youtube size={16} />;
      case "github":
        return <Github size={16} />;
      default:
        return <Globe size={16} />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Social Links Management */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-muted-foreground">
            Social Links
          </Label>
          <Button
            onClick={addSocialLink}
            size="sm"
            variant="outline"
            className="h-8 px-2"
          >
            <Plus size={14} className="mr-1" />
            Add
          </Button>
        </div>

        <div className="space-y-3">
          {socialLinks.map((link: any, index: number) => (
            <div
              key={link.id}
              className="p-3 border border-gray-100 dark:border-gray-800 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSocialIcon(link.platform)}
                  <span className="text-sm font-medium">{link.platform}</span>
                </div>
                <Button
                  onClick={() => removeSocialLink(index)}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={12} />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground">
                    Platform
                  </Label>
                  <Select
                    value={link.platform}
                    onValueChange={(value) =>
                      handleSocialLinkChange(index, "platform", value)
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="github">GitHub</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="discord">Discord</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground">Label</Label>
                  <Input
                    value={link.label}
                    onChange={(e) =>
                      handleSocialLinkChange(index, "label", e.target.value)
                    }
                    placeholder="Platform name"
                    className="h-8"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">URL</Label>
                <Input
                  value={link.url}
                  onChange={(e) =>
                    handleSocialLinkChange(index, "url", e.target.value)
                  }
                  placeholder="https://..."
                  className="h-8"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layout Settings */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Layout & Appearance
        </Label>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">Layout</Label>
            <Select
              value={layout}
              onValueChange={(value) => handleInputChange("layout", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="horizontal">Horizontal</SelectItem>
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">Alignment</Label>
            <Select
              value={alignment}
              onValueChange={(value) => handleInputChange("alignment", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">Style</Label>
            <Select
              value={style}
              onValueChange={(value) => handleInputChange("style", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="filled">Filled</SelectItem>
                <SelectItem value="outlined">Outlined</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Hover Effect
            </Label>
            <Select
              value={hoverEffect}
              onValueChange={(value) => handleInputChange("hoverEffect", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="scale">Scale</SelectItem>
                <SelectItem value="bounce">Bounce</SelectItem>
                <SelectItem value="fade">Fade</SelectItem>
                <SelectItem value="slide">Slide Up</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Size & Spacing */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Size & Spacing
        </Label>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Icon Size: {iconSize}px
            </Label>
            <Input
              type="range"
              min="16"
              max="64"
              value={iconSize}
              onChange={(e) =>
                handleInputChange("iconSize", parseInt(e.target.value))
              }
              className="h-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Spacing: {iconSpacing}px
            </Label>
            <Input
              type="range"
              min="4"
              max="32"
              value={iconSpacing}
              onChange={(e) =>
                handleInputChange("iconSpacing", parseInt(e.target.value))
              }
              className="h-2"
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
                handleInputChange("borderRadius", parseInt(e.target.value))
              }
              className="h-2"
            />
          </div>
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Display Options
        </Label>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Show Labels</Label>
            <Switch
              checked={showLabels}
              onCheckedChange={(checked) =>
                handleInputChange("showLabels", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Open in New Tab
            </Label>
            <Switch
              checked={openInNewTab}
              onCheckedChange={(checked) =>
                handleInputChange("openInNewTab", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Custom Colors
            </Label>
            <Switch
              checked={customColors}
              onCheckedChange={(checked) =>
                handleInputChange("customColors", checked)
              }
            />
          </div>
        </div>
      </div>

      {/* Color Customization */}
      {customColors && (
        <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <Label className="text-sm font-semibold text-muted-foreground">
            Color Customization
          </Label>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">
                Icon Color
              </Label>
              <Input
                type="color"
                value={iconColor}
                onChange={(e) => handleInputChange("iconColor", e.target.value)}
                className="h-10 w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">
                Background
              </Label>
              <Input
                type="color"
                value={backgroundColor}
                onChange={(e) =>
                  handleInputChange("backgroundColor", e.target.value)
                }
                className="h-10 w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">
                Hover Color
              </Label>
              <Input
                type="color"
                value={hoverColor}
                onChange={(e) =>
                  handleInputChange("hoverColor", e.target.value)
                }
                className="h-10 w-full"
              />
            </div>

            {showLabels && (
              <div className="flex flex-col gap-2">
                <Label className="text-xs text-muted-foreground">
                  Label Color
                </Label>
                <Input
                  type="color"
                  value={labelColor}
                  onChange={(e) =>
                    handleInputChange("labelColor", e.target.value)
                  }
                  className="h-10 w-full"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Usage Tips */}
      <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <p className="font-medium mb-1">Social Icons Tips:</p>
        <ul className="space-y-1 text-xs">
          <li>
            • <strong>Platform Auto-Detection:</strong> Icons change based on
            platform selection
          </li>
          <li>
            • <strong>URL Validation:</strong> Ensure URLs start with https://
            for security
          </li>
          <li>
            • <strong>Mobile Responsive:</strong> Icons automatically adapt to
            screen size
          </li>
          <li>
            • <strong>Accessibility:</strong> Labels improve screen reader
            support
          </li>
          <li>
            • <strong>Performance:</strong> Icons are optimized for fast loading
          </li>
          <li>
            • <strong>SEO Friendly:</strong> Proper link attributes for social
            sharing
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SocialIconsSettings;
