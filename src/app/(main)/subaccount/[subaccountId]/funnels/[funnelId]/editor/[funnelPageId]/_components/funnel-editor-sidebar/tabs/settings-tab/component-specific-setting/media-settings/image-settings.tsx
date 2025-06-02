"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { useCustomValuesUpdater } from "../../utils";

type Props = {};

const ImageSettings = (props: Props) => {
  const { handleChangeCustomValues, state } = useCustomValuesUpdater();

  if (
    state.editor.selectedElement.type !== "image" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Image Source</p>
        <Input
          id="src"
          placeholder="https://example.com/image.jpg"
          onChange={handleChangeCustomValues}
          value={state.editor.selectedElement.content.src || ""}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Alt Text</p>
        <Input
          id="alt"
          placeholder="Image description"
          onChange={handleChangeCustomValues}
          value={state.editor.selectedElement.content.alt || ""}
        />
      </div>
    </div>
  );
};

export default ImageSettings;
