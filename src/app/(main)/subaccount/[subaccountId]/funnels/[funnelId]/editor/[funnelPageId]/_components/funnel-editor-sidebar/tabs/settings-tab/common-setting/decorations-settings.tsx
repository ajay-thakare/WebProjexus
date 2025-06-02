"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronsLeftRightIcon,
  LucideImageDown,
  AlignVerticalJustifyCenter,
} from "lucide-react";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useStylesUpdater } from "../utils";

type Props = {};

const DecorationsSettings = (props: Props) => {
  const { handleOnChanges, state } = useStylesUpdater();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label className="text-muted-foreground">Opacity</Label>
        <div className="flex items-center justify-end">
          <small className="p-2">
            {typeof state.editor.selectedElement.styles?.opacity === "number"
              ? state.editor.selectedElement.styles?.opacity
              : parseFloat(
                  (state.editor.selectedElement.styles?.opacity || "0").replace(
                    "%",
                    ""
                  )
                ) || 0}
            %
          </small>
        </div>
        <Slider
          onValueChange={(e) => {
            handleOnChanges({
              target: {
                id: "opacity",
                value: `${e[0]}%`,
              },
            });
          }}
          defaultValue={[
            typeof state.editor.selectedElement.styles?.opacity === "number"
              ? state.editor.selectedElement.styles?.opacity
              : parseFloat(
                  (state.editor.selectedElement.styles?.opacity || "0").replace(
                    "%",
                    ""
                  )
                ) || 0,
          ]}
          max={100}
          step={1}
        />
      </div>
      <div>
        <Label className="text-muted-foreground">Border Radius</Label>
        <div className="flex items-center justify-end">
          <small className="">
            {typeof state.editor.selectedElement.styles?.borderRadius ===
            "number"
              ? state.editor.selectedElement.styles?.borderRadius
              : parseFloat(
                  (
                    state.editor.selectedElement.styles?.borderRadius || "0"
                  ).replace("px", "")
                ) || 0}
            px
          </small>
        </div>
        <Slider
          onValueChange={(e) => {
            handleOnChanges({
              target: {
                id: "borderRadius",
                value: `${e[0]}px`,
              },
            });
          }}
          defaultValue={[
            typeof state.editor.selectedElement.styles?.borderRadius ===
            "number"
              ? state.editor.selectedElement.styles?.borderRadius
              : parseFloat(
                  (
                    state.editor.selectedElement.styles?.borderRadius || "0"
                  ).replace("%", "")
                ) || 0,
          ]}
          max={100}
          step={1}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-muted-foreground">Background Color</Label>
        <div className="flex  border-[1px] rounded-md overflow-clip">
          <div
            className="w-12 "
            style={{
              backgroundColor:
                state.editor.selectedElement.styles.backgroundColor,
            }}
          />
          <Input
            placeholder="#HFI245"
            className="!border-y-0 rounded-none !border-r-0 mr-2"
            id="backgroundColor"
            onChange={handleOnChanges}
            value={state.editor.selectedElement.styles.backgroundColor || ""}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-muted-foreground">Background Image</Label>
        <div className="flex  border-[1px] rounded-md overflow-clip">
          <div
            className="w-12 "
            style={{
              backgroundImage:
                state.editor.selectedElement.styles.backgroundImage,
            }}
          />
          <Input
            placeholder="url()"
            className="!border-y-0 rounded-none !border-r-0 mr-2"
            id="backgroundImage"
            onChange={handleOnChanges}
            value={state.editor.selectedElement.styles.backgroundImage || ""}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-muted-foreground">Image Position</Label>
        <Tabs
          onValueChange={(e) =>
            handleOnChanges({
              target: {
                id: "backgroundSize",
                value: e,
              },
            })
          }
          value={state.editor.selectedElement.styles.backgroundSize?.toString()}
        >
          <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
            <TabsTrigger
              value="cover"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <ChevronsLeftRightIcon size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="contain"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <AlignVerticalJustifyCenter size={22} />
            </TabsTrigger>
            <TabsTrigger
              value="auto"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <LucideImageDown size={18} />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default DecorationsSettings;
