"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEditor } from "@/providers/editor/editor-provider";

const AudioSettings = () => {
  const { state, dispatch } = useEditor();

  // Type guard to ensure we have the right element type
  if (
    !state.editor.selectedElement ||
    state.editor.selectedElement.type !== "audio" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  const element = state.editor.selectedElement;
  const content = element.content as {
    src?: string;
    controls?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...element,
          content: {
            ...content,
            [key]: value,
          },
        },
      },
    });
  };

  return (
    <div className="space-y-6 p-4">
      {/* Audio Source */}
      <div className="space-y-2">
        <Label htmlFor="audio-src" className="text-sm font-medium">
          Audio Source URL
        </Label>
        <Input
          id="audio-src"
          type="url"
          placeholder="https://example.com/audio.mp3"
          value={!Array.isArray(content) ? content.src || "" : ""}
          onChange={(e) =>
            !Array.isArray(content) && handleInputChange("src", e.target.value)
          }
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Supported formats: MP3, WAV, OGG, AAC, M4A
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">Show Controls</Label>
          <p className="text-xs text-muted-foreground">
            Display play/pause and volume controls
          </p>
        </div>
        <Switch
          checked={!!content.controls}
          onCheckedChange={(checked) => handleInputChange("controls", checked)}
        />
      </div>

      {/* Autoplay */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">Autoplay</Label>
          <p className="text-xs text-muted-foreground">
            Start playing automatically (may be blocked by browsers)
          </p>
        </div>
        <Switch
          checked={!!content.autoplay}
          onCheckedChange={(checked) => handleInputChange("autoplay", checked)}
        />
      </div>

      {/* Loop */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">Loop</Label>
          <p className="text-xs text-muted-foreground">
            Repeat audio when it ends
          </p>
        </div>
        <Switch
          checked={!!content.loop}
          onCheckedChange={(checked) => handleInputChange("loop", checked)}
        />
      </div>

      {/* Muted */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">Muted</Label>
          <p className="text-xs text-muted-foreground">
            Start with audio muted
          </p>
        </div>
        <Switch
          checked={!!content.muted}
          onCheckedChange={(checked) => handleInputChange("muted", checked)}
        />
      </div>

      {/* Test Audio */}
      {content.src && (
        <div className="space-y-2 pt-4 border-t">
          <Label className="text-sm font-medium">Preview</Label>
          <audio
            controls
            className="w-full"
            style={{ height: "40px" }}
            key={content.src} // Force re-render when src changes
          >
            <source src={content.src} type="audio/mpeg" />
            <source src={content.src} type="audio/wav" />
            <source src={content.src} type="audio/ogg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioSettings;
