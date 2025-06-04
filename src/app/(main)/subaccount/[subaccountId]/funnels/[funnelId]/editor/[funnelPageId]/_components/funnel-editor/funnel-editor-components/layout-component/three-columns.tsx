"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash } from "lucide-react";
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

  const handleOnDrop = (e: React.DragEvent, columnId: string) => {
    e.stopPropagation();
    const componentType = e.dataTransfer.getData("componentType") as any;

    dispatch({
      type: "ADD_ELEMENT",
      payload: {
        containerId: columnId,
        elementDetails: {
          content: [],
          id: crypto.randomUUID(),
          name: componentType,
          styles: {},
          type: componentType,
        },
      },
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Get column configurations safely
  let columnGap = 16;
  let column1Width = 33.33;
  let column2Width = 33.33;
  let column3Width = 33.33;

  if (!Array.isArray(props.element.content)) {
    const content = props.element.content as {
      columnGap?: number;
      column1Width?: number;
      column2Width?: number;
      column3Width?: number;
    };
    columnGap = content.columnGap ?? 16;
    column1Width = content.column1Width ?? 33.33;
    column2Width = content.column2Width ?? 33.33;
    column3Width = content.column3Width ?? 33.33;
  }

  return (
    <div
      style={styles}
      className={clsx("p-4 w-full m-[5px] relative transition-all", {
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
          className={clsx("min-h-[100px] transition-all", {
            "border-dashed border-[1px] border-slate-300":
              !state.editor.liveMode,
            "border-slate-400": !state.editor.liveMode,
          })}
          style={{ width: `${column1Width}%` }}
          onDrop={(e) => handleOnDrop(e, `${props.element.id}-col1`)}
          onDragOver={handleDragOver}
        >
          {Array.isArray(props.element.content) ? (
            props.element.content
              .filter((child) => child.id?.includes(`${props.element.id}-col1`))
              .map((childElement) => (
                <Recursive key={childElement.id} element={childElement} />
              ))
          ) : (
            <div className="p-4 text-center text-slate-500">
              Drop elements here
            </div>
          )}
        </div>

        {/* Column 2 */}
        <div
          className={clsx("min-h-[100px] transition-all", {
            "border-dashed border-[1px] border-slate-300":
              !state.editor.liveMode,
            "border-slate-400": !state.editor.liveMode,
          })}
          style={{ width: `${column2Width}%` }}
          onDrop={(e) => handleOnDrop(e, `${props.element.id}-col2`)}
          onDragOver={handleDragOver}
        >
          {Array.isArray(props.element.content) ? (
            props.element.content
              .filter((child) => child.id?.includes(`${props.element.id}-col2`))
              .map((childElement) => (
                <Recursive key={childElement.id} element={childElement} />
              ))
          ) : (
            <div className="p-4 text-center text-slate-500">
              Drop elements here
            </div>
          )}
        </div>

        {/* Column 3 */}
        <div
          className={clsx("min-h-[100px] transition-all", {
            "border-dashed border-[1px] border-slate-300":
              !state.editor.liveMode,
            "border-slate-400": !state.editor.liveMode,
          })}
          style={{ width: `${column3Width}%` }}
          onDrop={(e) => handleOnDrop(e, `${props.element.id}-col3`)}
          onDragOver={handleDragOver}
        >
          {Array.isArray(props.element.content) ? (
            props.element.content
              .filter((child) => child.id?.includes(`${props.element.id}-col3`))
              .map((childElement) => (
                <Recursive key={childElement.id} element={childElement} />
              ))
          ) : (
            <div className="p-4 text-center text-slate-500">
              Drop elements here
            </div>
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
