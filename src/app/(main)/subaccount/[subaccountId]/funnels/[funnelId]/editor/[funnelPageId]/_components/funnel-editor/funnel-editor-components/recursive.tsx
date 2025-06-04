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

    default:
      return null;
  }
};

export default Recursive;
