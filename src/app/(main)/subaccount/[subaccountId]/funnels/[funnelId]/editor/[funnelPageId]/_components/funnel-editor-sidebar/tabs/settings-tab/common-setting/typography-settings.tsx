"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStylesUpdater } from "../utils";

type Props = {};

const TypographySettings = (props: Props) => {
  const { handleOnChanges, state } = useStylesUpdater();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Text Align</p>
        <Tabs
          onValueChange={(e) =>
            handleOnChanges({
              target: {
                id: "textAlign",
                value: e,
              },
            })
          }
          value={state.editor.selectedElement.styles.textAlign}
        >
          <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
            <TabsTrigger
              value="left"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <AlignLeft size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="right"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <AlignRight size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="center"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <AlignCenter size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="justify"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted "
            >
              <AlignJustify size={18} />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Font Family</p>
        <Input
          id="DM Sans"
          onChange={handleOnChanges}
          value={state.editor.selectedElement.styles.fontFamily || ""}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Color</p>
        <Input
          id="color"
          onChange={handleOnChanges}
          value={state.editor.selectedElement.styles.color || ""}
        />
      </div>
      <div className="flex gap-4">
        <div>
          <Label className="text-muted-foreground">Weight</Label>
          <Select
            onValueChange={(e) =>
              handleOnChanges({
                target: {
                  id: "font-weight",
                  value: e,
                },
              })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a weight" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Font Weights</SelectLabel>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="normal">Regular</SelectItem>
                <SelectItem value="lighter">Light</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-muted-foreground">Size</Label>
          <Input
            placeholder="px"
            id="fontSize"
            onChange={handleOnChanges}
            value={state.editor.selectedElement.styles.fontSize || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default TypographySettings;
