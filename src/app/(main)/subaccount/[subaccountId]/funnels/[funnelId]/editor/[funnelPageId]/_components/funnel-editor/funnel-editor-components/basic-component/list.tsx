"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash, Plus, X } from "lucide-react";
import React, { useCallback, useMemo } from "react";

type Props = {
  element: EditorElement;
};

interface ListContent {
  items?: string[];
  listType?: "unordered" | "ordered" | "none";
}

const ListComponent = ({ element }: Props) => {
  const { dispatch, state } = useEditor();

  // Early return for invalid content structure
  if (Array.isArray(element.content)) {
    return (
      <div className="p-4 border-2 border-red-300 bg-red-50 text-red-600 rounded">
        <p>List component error: Invalid content structure</p>
      </div>
    );
  }

  const content = element.content as ListContent;
  const listItems = content.items || ["List item 1"];
  const listType = content.listType || "unordered";
  const isSelected = state.editor.selectedElement.id === element.id;
  const isLiveMode = state.editor.liveMode;

  // Memoized styles conversion
  const styles = useMemo(() => {
    return Object.keys(element.styles).reduce((acc, key) => {
      const camelCaseKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      return { ...acc, [camelCaseKey]: (element.styles as any)[key] };
    }, {} as React.CSSProperties);
  }, [element.styles]);

  // Memoized event handlers
  const handleDeleteElement = useCallback(() => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element },
    });
  }, [dispatch, element]);

  const handleOnClickBody = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch({
        type: "CHANGE_CLICKED_ELEMENT",
        payload: { elementDetails: element },
      });
    },
    [dispatch, element]
  );

  const handleAddItem = useCallback(() => {
    const newItems = [...listItems, `List item ${listItems.length + 1}`];
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...element,
          content: { ...content, items: newItems },
        },
      },
    });
  }, [dispatch, element, content, listItems]);

  const handleRemoveItem = useCallback(
    (index: number) => {
      const newItems = listItems.filter((_, i) => i !== index);
      dispatch({
        type: "UPDATE_ELEMENT",
        payload: {
          elementDetails: {
            ...element,
            content: {
              ...content,
              items: newItems.length > 0 ? newItems : ["List item 1"],
            },
          },
        },
      });
    },
    [dispatch, element, content, listItems]
  );

  const handleItemChange = useCallback(
    (index: number, value: string) => {
      const newItems = [...listItems];
      newItems[index] = value;
      dispatch({
        type: "UPDATE_ELEMENT",
        payload: {
          elementDetails: {
            ...element,
            content: { ...content, items: newItems },
          },
        },
      });
    },
    [dispatch, element, content, listItems]
  );

  // Reusable item renderer component
  const renderItem = useCallback(
    (item: string, index: number) => {
      const key = `${listType}-${index}-${item}`;

      const editableSpan = (
        <span
          contentEditable={!isLiveMode}
          suppressContentEditableWarning={true}
          className="flex-1 outline-none min-h-[1.2em]"
          onBlur={(e) => {
            const spanElement = e.target as HTMLSpanElement;
            handleItemChange(index, spanElement.innerText);
          }}
          dangerouslySetInnerHTML={{ __html: item }}
        />
      );

      const deleteButton = isSelected && !isLiveMode && (
        <X
          className="ml-2 cursor-pointer opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 mt-0.5"
          size={14}
          onClick={() => handleRemoveItem(index)}
        />
      );

      return { key, editableSpan, deleteButton };
    },
    [listType, isLiveMode, isSelected, handleItemChange, handleRemoveItem]
  );

  // Memoized list content based on type
  const listContent = useMemo(() => {
    switch (listType) {
      case "ordered":
        return (
          <div className="space-y-1">
            {listItems.map((item, index) => {
              const { key, editableSpan, deleteButton } = renderItem(
                item,
                index
              );
              return (
                <div key={key} className="flex items-start group relative pl-6">
                  <span className="absolute left-0 top-0 font-medium text-gray-700">
                    {index + 1}.
                  </span>
                  {editableSpan}
                  {deleteButton}
                </div>
              );
            })}
          </div>
        );

      case "unordered":
        return (
          <div className="space-y-1">
            {listItems.map((item, index) => {
              const { key, editableSpan, deleteButton } = renderItem(
                item,
                index
              );
              return (
                <div key={key} className="flex items-start group relative pl-6">
                  <span className="absolute left-0 top-0 font-bold text-gray-700">
                    •
                  </span>
                  {editableSpan}
                  {deleteButton}
                </div>
              );
            })}
          </div>
        );

      default: // "none"
        return (
          <div className="space-y-1">
            {listItems.map((item, index) => {
              const { key, editableSpan, deleteButton } = renderItem(
                item,
                index
              );
              return (
                <div key={key} className="flex items-start group">
                  {editableSpan}
                  {deleteButton}
                </div>
              );
            })}
          </div>
        );
    }
  }, [listType, listItems, renderItem]);

  const containerClasses = clsx(
    "p-[2px] w-full m-[5px] relative transition-all",
    {
      "!border-blue-500 !border-solid": isSelected,
      "border-dashed border-[1px] border-slate-300": !isLiveMode,
    }
  );

  return (
    <div
      style={styles}
      className={containerClasses}
      onClick={handleOnClickBody}
    >
      {/* Selected element badge */}
      {isSelected && !isLiveMode && (
        <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
          {state.editor.selectedElement.name}
        </Badge>
      )}

      {/* List content */}
      {listContent}

      {/* Controls for selected element */}
      {isSelected && !isLiveMode && (
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
