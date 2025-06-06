import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EditorBtns } from "@/lib/constants";
import React from "react";
import ContainerPlaceholder from "./placeholders/layout-ph/container-placeholder";
import TwoColumnsPlaceholder from "./placeholders/layout-ph/two-columns-placeholder";
import TextPlaceholder from "./placeholders/basic-ph/text-placeholder";
import ButtonPlaceholder from "./placeholders/basic-ph/button-placeholder";
import LinkPlaceholder from "./placeholders/basic-ph/link-placeholder";
import ImagePlaceholder from "./placeholders/media-ph/image-placeholder";
import VideoPlaceholder from "./placeholders/media-ph/video-placeholder";
import ContactFormComponentPlaceholder from "./placeholders/forms-ph/contact-form-placeholder";
import CountdownPlaceholder from "./placeholders/interactive-ph/countdown-placeholder";
import CheckoutPlaceholder from "./placeholders/buisness-ph/checkout-placeholder";
import AudioPlaceholder from "./placeholders/media-ph/audio-placeholder";
import DividerPlaceholder from "./placeholders/basic-ph/divider-placholder";
import ListPlaceholder from "./placeholders/basic-ph/list-placeholder";
import IconPlaceholder from "./placeholders/basic-ph/icon-placholder";
import ThreeColumnPlaceholder from "./placeholders/layout-ph/three-columns-placeholder";
import SpacerPlaceholder from "./placeholders/layout-ph/spacer-placeholder";
import TabsPlaceholder from "./placeholders/layout-ph/tabs-placeholder";
import InputPlaceholder from "./placeholders/forms-ph/input-placeholder";
import TextareaPlaceholder from "./placeholders/forms-ph/text-area-placeholder";
import RadioPlaceholder from "./placeholders/forms-ph/radio-placeholder";
import CheckboxPlaceholder from "./placeholders/forms-ph/chkbox-placeholder";
import SelectPlaceholder from "./placeholders/forms-ph/select-placeholder";
import FormPlaceholder from "./placeholders/forms-ph/form-placeholder";

type Props = {};

const ComponentsTab = (props: Props) => {
  const elements: {
    Component: React.ReactNode;
    label: string;
    id: EditorBtns;
    group: "layout" | "basic" | "media" | "forms" | "interactive" | "business";
  }[] = [
    // Layout Elements
    {
      Component: <ContainerPlaceholder />,
      label: "Container",
      id: "container",
      group: "layout",
    },
    {
      Component: <TwoColumnsPlaceholder />,
      label: "2 Columns",
      id: "2Col",
      group: "layout",
    },
    {
      Component: <ThreeColumnPlaceholder />,
      label: "3 Col",
      id: "3Col",
      group: "layout",
    },
    {
      Component: <SpacerPlaceholder />,
      label: "Spacer",
      id: "spacer",
      group: "layout",
    },
    {
      Component: <TabsPlaceholder />,
      label: "Tabs",
      id: "tabs",
      group: "layout",
    },

    // {
    //   Component: <GridPlaceholder />,
    //   label: "Grid",
    //   id: "grid",
    //   group: "layout",
    // },

    // Basic Elements
    {
      Component: <TextPlaceholder />,
      label: "Text",
      id: "text",
      group: "basic",
    },
    {
      Component: <ButtonPlaceholder />,
      label: "Button",
      id: "button",
      group: "basic",
    },
    {
      Component: <LinkPlaceholder />,
      label: "Link",
      id: "link",
      group: "basic",
    },
    {
      Component: <DividerPlaceholder />,
      label: "Divider",
      id: "divider",
      group: "basic",
    },
    {
      Component: <ListPlaceholder />,
      label: "List",
      id: "list",
      group: "basic",
    },
    {
      Component: <IconPlaceholder />,
      label: "Icon",
      id: "icon",
      group: "basic",
    },

    // Media Elements
    {
      Component: <ImagePlaceholder />,
      label: "Image",
      id: "image",
      group: "media",
    },
    {
      Component: <VideoPlaceholder />,
      label: "Video",
      id: "video",
      group: "media",
    },
    {
      Component: <AudioPlaceholder />,
      label: "Audio",
      id: "audio",
      group: "media",
    },
    // {
    //   Component: <ImageGalleryPlaceholder />,
    //   label: "Image Gallery",
    //   id: "imageGallery",
    //   group: "media",
    // },

    // Forms Elements
    {
      Component: <InputPlaceholder />,
      label: "Input",
      id: "input",
      group: "forms",
    },
    {
      Component: <TextareaPlaceholder />,
      label: "Textarea",
      id: "textarea",
      group: "forms",
    },
    {
      Component: <CheckboxPlaceholder />,
      label: "Chkbox",
      id: "checkbox",
      group: "forms",
    },
    {
      Component: <RadioPlaceholder />,
      label: "Radio",
      id: "radio",
      group: "forms",
    },
    {
      Component: <SelectPlaceholder />,
      label: "Select",
      id: "select",
      group: "forms",
    },
    {
      Component: <FormPlaceholder />,
      label: "Form",
      id: "form",
      group: "forms",
    },
    {
      Component: <ContactFormComponentPlaceholder />,
      label: "Contact Form",
      id: "contactForm",
      group: "forms",
    },

    // Interactive Elements
    {
      Component: <CountdownPlaceholder />,
      label: "Timer",
      id: "countdown",
      group: "interactive",
    },
    // {
    //   Component: <EmbedPlaceholder />,
    //   label: "Embed/Code",
    //   id: "embed",
    //   group: "interactive",
    // },
    // {
    //   Component: <SocialIconsPlaceholder />,
    //   label: "Social Icons",
    //   id: "socialIcons",
    //   group: "interactive",
    // },
    // {
    //   Component: <PopupPlaceholder />,
    //   label: "Popup/Modal",
    //   id: "popup",
    //   group: "interactive",
    // },
    // {
    //   Component: <TabsPlaceholder />,
    //   label: "Tabs",
    //   id: "tabs",
    //   group: "interactive",
    // },
    // {
    //   Component: <AccordionPlaceholder />,
    //   label: "Accordion",
    //   id: "accordion",
    //   group: "interactive",
    // },

    // Business Elements
    {
      Component: <CheckoutPlaceholder />,
      label: "Checkout",
      id: "paymentForm",
      group: "business",
    },
    // {
    //   Component: <TestimonialPlaceholder />,
    //   label: "Testimonial",
    //   id: "testimonial",
    //   group: "business",
    // },
  ];

  const groupConfig = [
    { key: "layout", label: "Layout", icon: "🧩" },
    { key: "basic", label: "Basic Elements", icon: "🧱" },
    { key: "media", label: "Media Elements", icon: "🖼️" },
    { key: "forms", label: "Forms", icon: "🧮" },
    { key: "interactive", label: "Interactive", icon: "⚙️" },
    { key: "business", label: "Business", icon: "💼" },
  ];

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["Layout", "Basic Elements", "Media Elements"]}
    >
      {groupConfig.map((group) => {
        const groupElements = elements.filter(
          (element) => element.group === group.key
        );

        // Only render groups that have elements
        if (groupElements.length === 0) return null;

        return (
          <AccordionItem
            key={group.key}
            value={group.label}
            className="px-6 py-0 border-y-[1px]"
          >
            <AccordionTrigger className="!no-underline">
              <span className="flex items-center gap-2">
                <span>{group.icon}</span>
                {group.label}
              </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-wrap gap-2">
              {groupElements.map((element) => (
                <div
                  key={element.id}
                  className="flex-col items-center justify-center flex"
                >
                  {element.Component}
                  <span className="text-muted-foreground text-xs mt-1">
                    {element.label}
                  </span>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default ComponentsTab;
