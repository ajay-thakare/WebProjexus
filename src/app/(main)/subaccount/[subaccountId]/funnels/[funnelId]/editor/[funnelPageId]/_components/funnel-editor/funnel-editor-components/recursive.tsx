import { EditorElement } from "@/providers/editor/editor-provider";
import React from "react";
import Container from "./container";
import TextComponent from "./basic-component/text";
import LinkComponent from "./basic-component/link";
import VideoComponent from "./media-component/video";
import ContactFormComponent from "./forms-component/contact-form-component";
import Checkout from "./business-component/checkout";
import ImageComponent from "./media-component/image";
import ButtonComponent from "./basic-component/button";
import CountdownComponent from "./interactive-component/countdown";
import AudioComponent from "./media-component/audio";
import DividerComponent from "./basic-component/divider";
import ListComponent from "./basic-component/list";
import IconComponent from "./basic-component/icon";
import ThreeColumnComponent from "./layout-component/three-columns";
import SpacerComponent from "./layout-component/spacer-component";
import TabsComponent from "./layout-component/tabs-component";
import InputComponent from "./forms-component/input-component";
import TextareaComponent from "./forms-component/text-area-component";
import CheckboxComponent from "./forms-component/chkbox-component";
import RadioComponent from "./forms-component/radio-component";
import SelectComponent from "./forms-component/select-component";
import FormComponent from "./forms-component/form-component";
import EmbedComponent from "./interactive-component/embed-component";
import SocialIconsComponent from "./interactive-component/socialIcons-componet";
import PopupComponent from "./interactive-component/popup-component";
import TooltipComponent from "./interactive-component/tooltip-component";

type Props = {
  element: EditorElement;
};

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case "text":
      return <TextComponent element={element} />;

    case "__body":
      return <Container element={element} />;

    case "container":
      return <Container element={element} />;

    case "link":
      return <LinkComponent element={element} />;

    case "video":
      return <VideoComponent element={element} />;

    case "2Col":
      return <Container element={element} />;

    case "contactForm":
      return <ContactFormComponent element={element} />;

    case "paymentForm":
      return <Checkout element={element} />;

    case "image":
      return <ImageComponent element={element} />;

    case "button":
      return <ButtonComponent element={element} />;

    case "countdown":
      return <CountdownComponent element={element} />;

    case "audio":
      return <AudioComponent element={element} />;

    case "divider":
      return <DividerComponent element={element} />;

    case "list":
      return <ListComponent element={element} />;

    case "icon":
      return <IconComponent element={element} />;

    case "3Col":
      return <Container element={element} />;

    case "spacer":
      return <SpacerComponent element={element} />;

    case "tabs":
      return <TabsComponent element={element} />;

    case "input":
      return <InputComponent element={element} />;

    case "textarea":
      return <TextareaComponent element={element} />;

    case "checkbox":
      return <CheckboxComponent element={element} />;

    case "radio":
      return <RadioComponent element={element} />;

    case "select":
      return <SelectComponent element={element} />;

    case "form":
      return <FormComponent element={element} />;

    case "embed":
      return <EmbedComponent element={element} />;

    case "socialIcons":
      return <SocialIconsComponent element={element} />;

    case "popup":
      return <PopupComponent element={element} />;

    case "tooltip":
      return <TooltipComponent element={element} />;

    default:
      return null;
  }
};

export default Recursive;
