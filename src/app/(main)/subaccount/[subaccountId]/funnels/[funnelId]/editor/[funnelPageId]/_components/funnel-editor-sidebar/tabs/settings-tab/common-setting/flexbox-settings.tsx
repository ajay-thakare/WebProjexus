"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlignHorizontalSpaceBetween,
  AlignHorizontalSpaceAround,
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyEndIcon,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
} from "lucide-react";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { useStylesUpdater } from "../utils";

type Props = {};

const FlexboxSettings = (props: Props) => {
  const { handleOnChanges, state } = useStylesUpdater();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label className="text-muted-foreground">Justify Content</Label>
        <Tabs
          onValueChange={(e) =>
            handleOnChanges({
              target: {
                id: "justifyContent",
                value: e,
              },
            })
          }
          value={state.editor.selectedElement.styles.justifyContent}
        >
          <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
            <TabsTrigger
              value="space-between"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <AlignHorizontalSpaceBetween size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="space-evenly"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <AlignHorizontalSpaceAround size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="center"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <AlignHorizontalJustifyCenterIcon size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="start"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted "
            >
              <AlignHorizontalJustifyStart size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="end"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted "
            >
              <AlignHorizontalJustifyEndIcon size={18} />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>
        <Label className="text-muted-foreground">Align Items</Label>
        <Tabs
          onValueChange={(e) =>
            handleOnChanges({
              target: {
                id: "alignItems",
                value: e,
              },
            })
          }
          value={state.editor.selectedElement.styles.alignItems}
        >
          <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
            <TabsTrigger
              value="center"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <AlignVerticalJustifyCenter size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="normal"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted "
            >
              <AlignVerticalJustifyStart size={18} />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex items-center gap-2">
        <Input
          className="h-4 w-4"
          placeholder="px"
          type="checkbox"
          id="display"
          onChange={(va) => {
            handleOnChanges({
              target: {
                id: "display",
                value: va.target.checked ? "flex" : "block",
              },
            });
          }}
        />
        <Label className="text-muted-foreground">Flex</Label>
      </div>
      <div>
        <Label className="text-muted-foreground"> Direction</Label>
        <Input
          placeholder="px"
          id="flexDirection"
          onChange={handleOnChanges}
          value={state.editor.selectedElement.styles.flexDirection}
        />
      </div>
    </div>
  );
};

export default FlexboxSettings;
