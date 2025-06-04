"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import React from "react";
import { v4 } from "uuid";
import Recursive from "./recursive";
import { Trash } from "lucide-react";

type Props = { element: EditorElement };

const Container = ({ element }: Props) => {
  const { id, content, styles, type } = element;
  const { dispatch, state } = useEditor();

  const handleOnDrop = (e: React.DragEvent, type: string) => {
    e.stopPropagation();
    const componentType = e.dataTransfer.getData("componentType") as EditorBtns;

    switch (componentType) {
      case "text":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: { innerText: "Text Element" },
              id: v4(),
              name: "Text",
              styles: {
                color: "black",
                ...defaultStyles,
              },
              type: "text",
            },
          },
        });
        break;

      case "link":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                innerText: "Link Element",
                href: "#",
              },
              id: v4(),
              name: "Link",
              styles: {
                color: "black",
                ...defaultStyles,
              },
              type: "link",
            },
          },
        });
        break;

      case "video":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                src: "https://www.youtube.com/embed/IWgK2Ew04h8?si=7iRh_7SGkr44O58_",
              },
              id: v4(),
              name: "Video",
              styles: {},
              type: "video",
            },
          },
        });
        break;

      case "container":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: "Container",
              styles: { ...defaultStyles },
              type: "container",
            },
          },
        });
        break;

      case "contactForm":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: "Contact Form",
              styles: {},
              type: "contactForm",
            },
          },
        });
        break;

      case "paymentForm":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: "Payment Form",
              styles: {},
              type: "paymentForm",
            },
          },
        });
        break;

      case "2Col":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: [],
                  id: v4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
                {
                  content: [],
                  id: v4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
              ],
              id: v4(),
              name: "Two Columns",
              styles: { ...defaultStyles, display: "flex" },
              type: "2Col",
            },
          },
        });
        break;

      case "image":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                src: "https://placehold.co/600x400",
                alt: "Placeholder Image",
              },
              id: v4(),
              name: "Image",
              styles: {
                ...defaultStyles,
                width: "100%",
                height: "auto",
              },
              type: "image",
            },
          },
        });
        break;

      case "button":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                innerText: "Click Me",
                href: "#",
              },
              id: v4(),
              name: "Button",
              styles: {
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "10px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                ...defaultStyles,
              },
              type: "button",
            },
          },
        });
        break;

      case "countdown":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                targetDate: new Date(
                  Date.now() + 7 * 24 * 60 * 60 * 1000
                ).toISOString(), // 7 days from now
              },
              id: v4(),
              name: "Countdown",
              styles: {
                color: "black",
                width: "100%",
                padding: "15px",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              },
              type: "countdown",
            },
          },
        });
        break;

      case "audio":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                controls: true,
                autoplay: false,
                loop: false,
                muted: false,
              },
              id: v4(),
              name: "Audio Player",
              styles: {
                width: "100%",
                padding: "10px",
                ...defaultStyles,
              },
              type: "audio",
            },
          },
        });
        break;

      case "divider":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                dividerStyle: "solid",
                dividerColor: "#d1d5db",
                dividerThickness: 1,
              },
              id: v4(),
              name: "Divider",
              styles: {
                width: "100%",
                margin: "10px 0",
                ...defaultStyles,
              },
              type: "divider",
            },
          },
        });
        break;

      case "list":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                items: ["List item 1", "List item 2", "List item 3"],
                listType: "none",
              },
              id: v4(),
              name: "List",
              styles: {
                color: "black",
                padding: "10px",
                ...defaultStyles,
              },
              type: "list",
            },
          },
        });
        break;

      case "icon":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                iconName: "star",
                iconSize: 24,
                iconColor: "#6366f1",
              },
              id: v4(),
              name: "Icon",
              styles: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "auto",
                height: "auto",
                padding: "10px",
                ...defaultStyles,
              },
              type: "icon",
            },
          },
        });
        break;

      case "3Col":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: [],
                  id: v4(),
                  name: "Column 1",
                  styles: {
                    ...defaultStyles,
                    width: "100%",
                    minHeight: "100px",
                  },
                  type: "container",
                },
                {
                  content: [],
                  id: v4(),
                  name: "Column 2",
                  styles: {
                    ...defaultStyles,
                    width: "100%",
                    minHeight: "100px",
                  },
                  type: "container",
                },
                {
                  content: [],
                  id: v4(),
                  name: "Column 3",
                  styles: {
                    ...defaultStyles,
                    width: "100%",
                    minHeight: "100px",
                  },
                  type: "container",
                },
              ],
              id: v4(),
              name: "Three Column",
              styles: {
                display: "flex",
                width: "100%",
                minHeight: "150px",
                padding: "20px",
                backgroundColor: "transparent",
                columnGap: "16px",
                ...defaultStyles,
              },
              type: "3Col",
            },
          },
        });
        break;

      case "spacer":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                spacerHeight: 50,
                spacerWidth: "100%",
                spacerBackgroundColor: "transparent",
              },
              id: v4(),
              name: "Spacer",
              styles: {
                width: "100%",
                ...defaultStyles,
              },
              type: "spacer",
            },
          },
        });
        break;

      case "tabs":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                tabs: [
                  {
                    id: "tab1",
                    label: "Tab 1",
                    content: "Content for tab 1. Click to edit this text.",
                    elements: [],
                    backgroundColor: "#f1f5f9",
                    textColor: "#64748b",
                    activeBackgroundColor: "#ffffff",
                    activeTextColor: "#3b82f6",
                  },
                  {
                    id: "tab2",
                    label: "Tab 2",
                    content: "Content for tab 2. Click to edit this text.",
                    elements: [],
                    backgroundColor: "#f1f5f9",
                    textColor: "#64748b",
                    activeBackgroundColor: "#ffffff",
                    activeTextColor: "#3b82f6",
                  },
                  {
                    id: "tab3",
                    label: "Tab 3",
                    content: "Content for tab 3. Click to edit this text.",
                    elements: [],
                    backgroundColor: "#f1f5f9",
                    textColor: "#64748b",
                    activeBackgroundColor: "#ffffff",
                    activeTextColor: "#3b82f6",
                  },
                ],
                tabsBackgroundColor: "#ffffff",
                tabsHeaderBackgroundColor: "#f8fafc",
                tabsContentBackgroundColor: "#ffffff",
              },
              id: v4(),
              name: "Tabs",
              styles: {
                width: "100%",
                minHeight: "200px",
                ...defaultStyles,
              },
              type: "tabs",
            },
          },
        });
        break;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent, type: string) => {
    if (type === "__body") return;
    e.dataTransfer.setData("componentType", type);
  };
  // challenge to duplicate an component

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  return (
    <div
      style={styles}
      className={clsx("relative p-4 transition-all group", {
        "max-w-full w-full": type === "container" || type === "2Col",
        "h-fit": type === "container",
        "h-full": type === "__body",
        "overflow-auto ": type === "__body",
        "flex flex-col md:!flex-row": type === "2Col",
        "!border-blue-500":
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type !== "__body",
        "!border-yellow-400 !border-4":
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type === "__body",
        "!border-solid":
          state.editor.selectedElement.id === id && !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      onDrop={(e) => handleOnDrop(e, id)}
      onDragOver={handleDragOver}
      draggable={type !== "__body"}
      onClick={handleOnClickBody}
      onDragStart={(e) => handleDragStart(e, "container")}
    >
      <Badge
        className={clsx(
          "absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden",
          {
            block:
              state.editor.selectedElement.id === element.id &&
              !state.editor.liveMode,
          }
        )}
      >
        {element.name}
      </Badge>

      {Array.isArray(content) &&
        content.map((childElement) => (
          <Recursive key={childElement.id} element={childElement} />
        ))}

      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== "__body" && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg ">
            <Trash size={16} onClick={handleDeleteElement} />
          </div>
        )}
    </div>
  );
};

export default Container;
