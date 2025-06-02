"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { useCustomValuesUpdater } from "../../utils";

type Props = {};

const VideoSettings = (props: Props) => {
  const { handleChangeCustomValues, state } = useCustomValuesUpdater();

  if (
    state.editor.selectedElement.type !== "video" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground">Video Source</p>
      <Input
        id="src"
        placeholder="https://example.com/video.mp4"
        onChange={handleChangeCustomValues}
        value={state.editor.selectedElement.content.src || ""}
      />
    </div>
  );
};

export default VideoSettings;
