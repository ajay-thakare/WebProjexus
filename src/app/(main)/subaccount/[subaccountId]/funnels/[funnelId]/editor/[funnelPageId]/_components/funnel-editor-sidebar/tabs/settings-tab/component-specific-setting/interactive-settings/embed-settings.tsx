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
import { AlertTriangle, Code2, FileCode, Globe, Video } from "lucide-react";

type Props = {};

const EmbedSettings = (props: Props) => {
  const { dispatch, state } = useEditor();

  if (
    state.editor.selectedElement.type !== "embed" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  const element = state.editor.selectedElement;
  const content = element.content as any;

  // Default values
  const embedType = content.embedType || "custom";
  const embedCode = content.embedCode || "";
  const iframeSrc = content.iframeSrc || "";
  const allowFullscreen = content.allowFullscreen || false;
  const sandbox = content.sandbox || "";
  const width = content.width || "100%";
  const height = content.height || "400px";
  const loading = content.loading || "lazy";
  const allowScripts = content.allowScripts || false;
  const showPreview = content.showPreview !== false;

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

  return (
    <div className="flex flex-col gap-6">
      {/* Embed Type Selection */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Embed Type
        </Label>

        <div className="flex flex-col gap-2">
          <Label htmlFor="embedType" className="text-xs text-muted-foreground">
            Content Type
          </Label>
          <Select
            value={embedType}
            onValueChange={(value) => handleSelectChange("embedType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select embed type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">
                <div className="flex items-center gap-2">
                  <Code2 size={16} />
                  Custom HTML/CSS/JS
                </div>
              </SelectItem>
              <SelectItem value="iframe">
                <div className="flex items-center gap-2">
                  <Globe size={16} />
                  Iframe (External Content)
                </div>
              </SelectItem>
              <SelectItem value="youtube">
                <div className="flex items-center gap-2">
                  <Video size={16} />
                  YouTube Video
                </div>
              </SelectItem>
              <SelectItem value="script">
                <div className="flex items-center gap-2">
                  <FileCode size={16} />
                  External Script
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Configuration */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Content Configuration
        </Label>

        {embedType === "custom" && (
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="embedCode"
              className="text-xs text-muted-foreground"
            >
              HTML/CSS/JavaScript Code
            </Label>
            <Textarea
              id="embedCode"
              value={embedCode}
              onChange={handleInputChange}
              placeholder={`<div style="padding: 20px; background: #f0f0f0;">
  <h3>Custom HTML Content</h3>
  <p>You can add any HTML, CSS, and JavaScript here.</p>
  <script>
    console.log('Custom embed loaded!');
  </script>
</div>`}
              className="min-h-[120px] resize-vertical font-mono text-sm"
              rows={6}
            />
          </div>
        )}

        {(embedType === "iframe" || embedType === "youtube") && (
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="iframeSrc"
              className="text-xs text-muted-foreground"
            >
              {embedType === "youtube"
                ? "YouTube URL or Embed URL"
                : "Iframe Source URL"}
            </Label>
            <Input
              id="iframeSrc"
              value={iframeSrc}
              onChange={handleInputChange}
              placeholder={
                embedType === "youtube"
                  ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ or embed URL"
                  : "https://example.com"
              }
            />
          </div>
        )}

        {embedType === "script" && (
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="embedCode"
              className="text-xs text-muted-foreground"
            >
              Script Code or External Script URL
            </Label>
            <Textarea
              id="embedCode"
              value={embedCode}
              onChange={handleInputChange}
              placeholder={`<!-- External script -->
<script src="https://example.com/widget.js"></script>

<!-- Or inline script -->
<script>
  // Your JavaScript code here
  console.log('Script loaded!');
</script>`}
              className="min-h-[80px] resize-vertical font-mono text-sm"
              rows={4}
            />
          </div>
        )}
      </div>

      {/* Dimensions */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Dimensions
        </Label>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="width" className="text-xs text-muted-foreground">
              Width
            </Label>
            <Input
              id="width"
              value={width}
              onChange={handleInputChange}
              placeholder="100%"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="height" className="text-xs text-muted-foreground">
              Height
            </Label>
            <Input
              id="height"
              value={height}
              onChange={handleInputChange}
              placeholder="400px"
            />
          </div>
        </div>
      </div>

      {/* Security & Performance Settings */}
      {(embedType === "iframe" || embedType === "youtube") && (
        <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <Label className="text-sm font-semibold text-muted-foreground">
            Security & Performance
          </Label>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="allowFullscreen"
                className="text-xs text-muted-foreground"
              >
                Allow Fullscreen
              </Label>
              <Switch
                id="allowFullscreen"
                checked={allowFullscreen}
                onCheckedChange={(checked) =>
                  handleSwitchChange("allowFullscreen", checked)
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="loading"
                className="text-xs text-muted-foreground"
              >
                Loading Strategy
              </Label>
              <Select
                value={loading}
                onValueChange={(value) => handleSelectChange("loading", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select loading strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lazy">Lazy (Load when visible)</SelectItem>
                  <SelectItem value="eager">
                    Eager (Load immediately)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="sandbox"
                className="text-xs text-muted-foreground"
              >
                Sandbox Restrictions (Optional)
              </Label>
              <Input
                id="sandbox"
                value={sandbox}
                onChange={handleInputChange}
                placeholder="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>
      )}

      {/* Custom Code Security Warning */}
      {(embedType === "custom" || embedType === "script") && (
        <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <Label className="text-sm font-semibold text-muted-foreground">
            Security Options
          </Label>

          <div className="flex items-center justify-between">
            <Label
              htmlFor="allowScripts"
              className="text-xs text-muted-foreground"
            >
              Allow JavaScript Execution
            </Label>
            <Switch
              id="allowScripts"
              checked={allowScripts}
              onCheckedChange={(checked) =>
                handleSwitchChange("allowScripts", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor="showPreview"
              className="text-xs text-muted-foreground"
            >
              Show Preview in Editor
            </Label>
            <Switch
              id="showPreview"
              checked={showPreview}
              onCheckedChange={(checked) =>
                handleSwitchChange("showPreview", checked)
              }
            />
          </div>
        </div>
      )}

      {/* Security Warning */}
      <div className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Security Notice:</p>
            <ul className="space-y-1 text-xs">
              <li>• Only embed content from trusted sources</li>
              <li>• Custom JavaScript code can access your page content</li>
              <li>• Use sandbox restrictions for untrusted iframes</li>
              <li>• Test embedded content thoroughly before publishing</li>
              <li>• Consider content security policies for production</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <p className="font-medium mb-1">Common Use Cases:</p>
        <ul className="space-y-1 text-xs">
          <li>
            • <strong>YouTube Videos:</strong> Paste YouTube URL for automatic
            embed
          </li>
          <li>
            • <strong>Maps:</strong> Embed Google Maps or other mapping services
          </li>
          <li>
            • <strong>Forms:</strong> Third-party form services (Typeform,
            Google Forms)
          </li>
          <li>
            • <strong>Widgets:</strong> Social media feeds, weather widgets,
            calendars
          </li>
          <li>
            • <strong>Analytics:</strong> Tracking codes, chat widgets
          </li>
          <li>
            • <strong>Custom HTML:</strong> Advanced layouts, animations,
            interactive content
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmbedSettings;
