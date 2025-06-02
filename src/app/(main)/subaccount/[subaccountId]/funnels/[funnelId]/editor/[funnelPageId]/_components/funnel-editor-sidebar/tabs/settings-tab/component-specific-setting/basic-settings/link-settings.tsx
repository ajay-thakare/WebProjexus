"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { useCustomValuesUpdater } from "../../utils";

type Props = {};

const LinkSettings = (props: Props) => {
  const { handleChangeCustomValues, state } = useCustomValuesUpdater();

  if (
    state.editor.selectedElement.type !== "link" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground">Link Path</p>
      <Input
        id="href"
        placeholder="https://domain.example.com/pathname"
        onChange={handleChangeCustomValues}
        value={state.editor.selectedElement.content.href || ""}
      />
    </div>
  );
};

export default LinkSettings;
