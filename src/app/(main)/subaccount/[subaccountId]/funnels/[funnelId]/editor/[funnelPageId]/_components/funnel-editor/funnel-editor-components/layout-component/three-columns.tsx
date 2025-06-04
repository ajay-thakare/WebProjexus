"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash, Plus } from "lucide-react";
import React from "react";
import Recursive from "../recursive";

type Props = {
  element: EditorElement;
};

const ThreeColumnComponent = (props: Props) => {
  const { dispatch, state } = useEditor();

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: props.element },
    });
  };

  // Convert style properties to React's camelCase format
  const convertStyles = (styles: React.CSSProperties) => {
    return Object.keys(styles).reduce((acc, key) => {
      const camelCaseKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      return { ...acc, [camelCaseKey]: styles[key as keyof typeof styles] };
    }, {} as React.CSSProperties);
  };

  const styles = convertStyles(props.element.styles);

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element,
      },
    });
  };

  // Get column settings
  const columnGap = (props.element.content as any)?.columnGap || 20;
  const column1Width = (props.element.content as any)?.column1Width || 33.33;
  const column2Width = (props.element.content as any)?.column2Width || 33.33;
  const column3Width = (props.element.content as any)?.column3Width || 33.33;

  // Get column elements
  const column1Elements = (props.element.content as any)?.column1Elements || [];
  const column2Elements = (props.element.content as any)?.column2Elements || [];
  const column3Elements = (props.element.content as any)?.column3Elements || [];

  // Handle drag and drop functionality for each column
  const handleOnDrop = (e: React.DragEvent, columnNumber: 1 | 2 | 3) => {
    e.stopPropagation();
    const componentType = e.dataTransfer.getData("componentType");

    if (!componentType) return;

    // Generate unique ID for the new element
    const newElementId = `${componentType}-${Date.now()}`;

    // Create new element based on component type
    const createElement = (type: string) => {
      const baseElement = {
        id: newElementId,
        name: type.charAt(0).toUpperCase() + type.slice(1),
        styles: {
          margin: "10px 0",
          padding: "5px",
        },
        type: type as any,
      };

      switch (type) {
        case "text":
          return {
            ...baseElement,
            content: { innerText: "Text Element" },
            styles: { ...baseElement.styles, color: "black" },
          };
        case "button":
          return {
            ...baseElement,
            content: { innerText: "Click me" },
            styles: {
              ...baseElement.styles,
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "10px 20px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            },
          };
        case "divider":
          return {
            ...baseElement,
            content: {
              dividerStyle: "solid",
              dividerColor: "#d1d5db",
              dividerThickness: 1,
            },
            styles: {
              ...baseElement.styles,
              width: "100%",
              margin: "10px 0",
            },
          };
        case "list":
          return {
            ...baseElement,
            content: {
              items: ["List item 1", "List item 2", "List item 3"],
              listType: "unordered",
            },
            styles: {
              ...baseElement.styles,
              color: "black",
              padding: "10px",
            },
          };
        case "icon":
          return {
            ...baseElement,
            content: {
              iconName: "star",
              iconSize: 24,
              iconColor: "#6366f1",
            },
            styles: {
              ...baseElement.styles,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "auto",
              height: "auto",
              padding: "10px",
            },
          };
        case "spacer":
          return {
            ...baseElement,
            content: {
              spacerHeight: 50,
              spacerWidth: "100%",
              spacerBackgroundColor: "transparent",
            },
            styles: {
              ...baseElement.styles,
              width: "100%",
              display: "block",
            },
          };
        default:
          return {
            ...baseElement,
            content: { innerText: "Unknown Element" },
          };
      }
    };

    const newElement = createElement(componentType);

    // Update the specific column's elements
    const columnKey = `column${columnNumber}Elements`;
    const currentElements = (props.element.content as any)?.[columnKey] || [];

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...props.element,
          content: {
            ...(props.element.content as any),
            [columnKey]: [...currentElements, newElement],
          },
        },
      },
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      style={styles}
      className={clsx("p-[2px] w-full m-[5px] relative transition-all", {
        "!border-blue-500":
          state.editor.selectedElement.id === props.element.id,
        "!border-solid": state.editor.selectedElement.id === props.element.id,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      onClick={handleOnClickBody}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
            {state.editor.selectedElement.name}
          </Badge>
        )}

      <div className="flex w-full" style={{ gap: `${columnGap}px` }}>
        {/* Column 1 */}
        <div
          className={clsx("relative min-h-[100px] transition-all", {
            "border border-dashed border-emerald-300 bg-emerald-50/50":
              !state.editor.liveMode && column1Elements.length === 0,
          })}
          style={{ width: `${column1Width}%` }}
          onDrop={(e) => handleOnDrop(e, 1)}
          onDragOver={handleDragOver}
        >
          {column1Elements.length > 0 ? (
            <div className="space-y-2 p-2">
              {column1Elements.map((element: EditorElement) => (
                <Recursive key={element.id} element={element} />
              ))}
            </div>
          ) : (
            !state.editor.liveMode && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                <div className="text-center">
                  <p className="text-xs font-medium">Column 1</p>
                  <p className="text-xs">Drop elements here</p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Column 2 */}
        <div
          className={clsx("relative min-h-[100px] transition-all", {
            "border border-dashed border-emerald-300 bg-emerald-50/50":
              !state.editor.liveMode && column2Elements.length === 0,
          })}
          style={{ width: `${column2Width}%` }}
          onDrop={(e) => handleOnDrop(e, 2)}
          onDragOver={handleDragOver}
        >
          {column2Elements.length > 0 ? (
            <div className="space-y-2 p-2">
              {column2Elements.map((element: EditorElement) => (
                <Recursive key={element.id} element={element} />
              ))}
            </div>
          ) : (
            !state.editor.liveMode && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                <div className="text-center">
                  <p className="text-xs font-medium">Column 2</p>
                  <p className="text-xs">Drop elements here</p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Column 3 */}
        <div
          className={clsx("relative min-h-[100px] transition-all", {
            "border border-dashed border-emerald-300 bg-emerald-50/50":
              !state.editor.liveMode && column3Elements.length === 0,
          })}
          style={{ width: `${column3Width}%` }}
          onDrop={(e) => handleOnDrop(e, 3)}
          onDragOver={handleDragOver}
        >
          {column3Elements.length > 0 ? (
            <div className="space-y-2 p-2">
              {column3Elements.map((element: EditorElement) => (
                <Recursive key={element.id} element={element} />
              ))}
            </div>
          ) : (
            !state.editor.liveMode && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                <div className="text-center">
                  <p className="text-xs font-medium">Column 3</p>
                  <p className="text-xs">Drop elements here</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};

export default ThreeColumnComponent;
