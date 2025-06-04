"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash, Plus, X } from "lucide-react";
import React from "react";

type Props = {
  element: EditorElement;
};

const ListComponent = (props: Props) => {
  const { dispatch, state } = useEditor();

  // Type guard: only proceed if content is not an array
  if (Array.isArray(props.element.content)) {
    return (
      <div className="p-4 border-2 border-red-300 bg-red-50 text-red-600 rounded">
        <p>List component error: Invalid content structure</p>
      </div>
    );
  }

  // Type assertion for content
  const content = props.element.content as {
    items?: string[];
    listType?: "unordered" | "ordered" | "none";
  };

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

  const handleAddItem = () => {
    const currentItems = content.items || ["List item 1"];
    const newItems = [...currentItems, `List item ${currentItems.length + 1}`];

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...props.element,
          content: {
            ...content,
            items: newItems,
          },
        },
      },
    });
  };

  const handleRemoveItem = (index: number) => {
    const currentItems = content.items || [];
    const newItems = currentItems.filter((_, i) => i !== index);

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...props.element,
          content: {
            ...content,
            items: newItems.length > 0 ? newItems : ["List item 1"],
          },
        },
      },
    });
  };

  const handleItemChange = (index: number, value: string) => {
    const currentItems = content.items || [];
    const newItems = [...currentItems];
    newItems[index] = value;

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...props.element,
          content: {
            ...content,
            items: newItems,
          },
        },
      },
    });
  };

  const listItems = content.items || ["List item 1"];
  const listType = content.listType || "unordered";

  // Function to render list items based on type
  const renderListItems = () => {
    return listItems.map((item: string, index: number) => (
      <li
        key={`${listType}-${index}-${item}`}
        className="flex items-start group"
      >
        <span
          contentEditable={!state.editor.liveMode}
          suppressContentEditableWarning={true}
          className="flex-1 outline-none min-h-[1.2em]"
          onBlur={(e) => {
            const spanElement = e.target as HTMLSpanElement;
            handleItemChange(index, spanElement.innerText);
          }}
          dangerouslySetInnerHTML={{ __html: item }}
        />
        {state.editor.selectedElement.id === props.element.id &&
          !state.editor.liveMode && (
            <X
              className="ml-2 cursor-pointer opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 mt-0.5"
              size={14}
              onClick={() => handleRemoveItem(index)}
            />
          )}
      </li>
    ));
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
      {/* Render different list types */}
      {listType === "ordered" ? (
        <ol
          className="list-decimal list-inside space-y-1 pl-4"
          style={{ listStyleType: "decimal" }}
          key={`ordered-${props.element.id}`}
        >
          {renderListItems()}
        </ol>
      ) : listType === "unordered" ? (
        <ul
          className="list-disc list-inside space-y-1 pl-4"
          style={{ listStyleType: "disc" }}
          key={`unordered-${props.element.id}`}
        >
          {renderListItems()}
        </ul>
      ) : (
        // listType === "none"
        <div className="space-y-1" key={`none-${props.element.id}`}>
          {listItems.map((item: string, index: number) => (
            <div
              key={`none-${index}-${item}`}
              className="flex items-start group"
            >
              <span
                contentEditable={!state.editor.liveMode}
                suppressContentEditableWarning={true}
                className="flex-1 outline-none min-h-[1.2em]"
                onBlur={(e) => {
                  const spanElement = e.target as HTMLSpanElement;
                  handleItemChange(index, spanElement.innerText);
                }}
                dangerouslySetInnerHTML={{ __html: item }}
              />
              {state.editor.selectedElement.id === props.element.id &&
                !state.editor.liveMode && (
                  <X
                    className="ml-2 cursor-pointer opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 mt-0.5"
                    size={14}
                    onClick={() => handleRemoveItem(index)}
                  />
                )}
            </div>
          ))}
        </div>
      )}
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <>
            <div className="flex justify-center mt-2">
              <Plus
                className="cursor-pointer text-green-500 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-full p-1"
                size={20}
                onClick={handleAddItem}
              />
            </div>
            <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
              <Trash
                className="cursor-pointer"
                size={16}
                onClick={handleDeleteElement}
              />
            </div>
          </>
        )}
    </div>
  );
};

export default ListComponent;
