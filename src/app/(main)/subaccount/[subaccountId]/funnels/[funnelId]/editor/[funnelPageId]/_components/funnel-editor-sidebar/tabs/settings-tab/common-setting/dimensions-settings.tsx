"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStylesUpdater } from "../utils";

type Props = {};

const DimensionsSettings = (props: Props) => {
  const { handleOnChanges, state } = useStylesUpdater();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 flex-col">
          <div className="flex gap-4">
            <div>
              <Label className="text-muted-foreground">Height</Label>
              <Input
                id="height"
                placeholder="px"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.height || ""}
              />
            </div>
            <div>
              <Label className="text-muted-foreground">Width</Label>
              <Input
                placeholder="px"
                id="width"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.width || ""}
              />
            </div>
          </div>
        </div>
        <p>Margin px</p>
        <div className="flex gap-4 flex-col">
          <div className="flex gap-4">
            <div>
              <Label className="text-muted-foreground">Top</Label>
              <Input
                id="marginTop"
                placeholder="px"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.marginTop || ""}
              />
            </div>
            <div>
              <Label className="text-muted-foreground">Bottom</Label>
              <Input
                placeholder="px"
                id="marginBottom"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.marginBottom || ""}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <Label className="text-muted-foreground">Left</Label>
              <Input
                placeholder="px"
                id="marginLeft"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.marginLeft || ""}
              />
            </div>
            <div>
              <Label className="text-muted-foreground">Right</Label>
              <Input
                placeholder="px"
                id="marginRight"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.marginRight || ""}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p>Padding px</p>
        <div className="flex gap-4 flex-col">
          <div className="flex gap-4">
            <div>
              <Label className="text-muted-foreground">Top</Label>
              <Input
                placeholder="px"
                id="paddingTop"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.paddingTop || ""}
              />
            </div>
            <div>
              <Label className="text-muted-foreground">Bottom</Label>
              <Input
                placeholder="px"
                id="paddingBottom"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.paddingBottom || ""}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <Label className="text-muted-foreground">Left</Label>
              <Input
                placeholder="px"
                id="paddingLeft"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.paddingLeft || ""}
              />
            </div>
            <div>
              <Label className="text-muted-foreground">Right</Label>
              <Input
                placeholder="px"
                id="paddingRight"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.paddingRight || ""}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DimensionsSettings;
