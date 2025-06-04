"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEditor } from "@/providers/editor/editor-provider";

// Import component-specific settings
import ButtonSettings from "./component-specific-setting/basic-settings/button-settings";
import LinkSettings from "./component-specific-setting/basic-settings/link-settings";
import ImageSettings from "./component-specific-setting/media-settings/image-settings";
import VideoSettings from "./component-specific-setting/media-settings/video-settings";
import CountdownSettings from "./component-specific-setting/interactive-settings/countdown-settings";

// Import common settings
import TypographySettings from "./common-setting/typography-settings";
import DimensionsSettings from "./common-setting/dimensions-settings";
import DecorationsSettings from "./common-setting/decorations-settings";
import FlexboxSettings from "./common-setting/flexbox-settings";
import AudioSettings from "./component-specific-setting/media-settings/audio-settings";
import DividerSettings from "./component-specific-setting/basic-settings/divider-settings";
import ListSettings from "./component-specific-setting/basic-settings/list-settings";
import IconSettings from "./component-specific-setting/basic-settings/icon-settings";
import ThreeColumnSettings from "./component-specific-setting/layout-settings/three-columns-settings";

type Props = {};

const SettingsTab = (props: Props) => {
  const { state } = useEditor();

  // If no element is selected, show a message
  if (!state.editor.selectedElement) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-muted-foreground">Select an element to edit</p>
      </div>
    );
  }

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["Typography", "Dimensions", "Decorations", "Flexbox"]}
    >
      <AccordionItem value="Custom" className="px-6 py-0">
        <AccordionTrigger className="!no-underline">Custom</AccordionTrigger>
        <AccordionContent>
          {/* Render component-specific settings based on element type */}
          {state.editor.selectedElement.type === "button" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <ButtonSettings />
            )}

          {state.editor.selectedElement.type === "link" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <LinkSettings />
            )}

          {state.editor.selectedElement.type === "image" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <ImageSettings />
            )}

          {state.editor.selectedElement.type === "video" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <VideoSettings />
            )}

          {state.editor.selectedElement.type === "countdown" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <CountdownSettings />
            )}

          {state.editor.selectedElement.type === "audio" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <AudioSettings />
            )}

          {state.editor.selectedElement.type === "divider" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <DividerSettings />
            )}

          {state.editor.selectedElement.type === "list" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <ListSettings />
            )}

          {state.editor.selectedElement.type === "icon" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <IconSettings />
            )}

          {state.editor.selectedElement.type === "3Col" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <ThreeColumnSettings />
            )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="Typography" className="px-6 py-0 border-y-[1px]">
        <AccordionTrigger className="!no-underline">
          Typography
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          <TypographySettings />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="Dimensions" className="px-6 py-0">
        <AccordionTrigger className="!no-underline">
          Dimensions
        </AccordionTrigger>
        <AccordionContent>
          <DimensionsSettings />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="Decorations" className="px-6 py-0">
        <AccordionTrigger className="!no-underline">
          Decorations
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          <DecorationsSettings />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="Flexbox" className="px-6 py-0">
        <AccordionTrigger className="!no-underline">Flexbox</AccordionTrigger>
        <AccordionContent>
          <FlexboxSettings />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SettingsTab;
