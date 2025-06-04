"use client";
import { Badge } from "@/components/ui/badge";
import {
  EditorElement,
  useEditor,
  TabItem,
} from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash, Plus, X, Edit3 } from "lucide-react";
import React, { useState } from "react";
import Recursive from "../recursive";

type Props = {
  element: EditorElement;
};

const TabsComponent = (props: Props) => {
  const { dispatch, state } = useEditor();
  const [activeTab, setActiveTab] = useState<string>("");
  const [editingTab, setEditingTab] = useState<string | null>(null);

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

  const tabs = (props.element.content as any)?.tabs || [
    {
      id: "tab1",
      label: "Tab 1",
      content: "Content for tab 1",
      elements: [], // Add elements array for each tab
      backgroundColor: "#f1f5f9", // Default inactive background
      textColor: "#64748b", // Default inactive text
      activeBackgroundColor: "#ffffff", // Default active background
      activeTextColor: "#3b82f6", // Default active text
    },
    {
      id: "tab2",
      label: "Tab 2",
      content: "Content for tab 2",
      elements: [], // Add elements array for each tab
      backgroundColor: "#f1f5f9",
      textColor: "#64748b",
      activeBackgroundColor: "#ffffff",
      activeTextColor: "#3b82f6",
    },
  ];

  // Get global tab styling
  const tabsBackgroundColor =
    (props.element.content as any)?.tabsBackgroundColor || "#ffffff";
  const tabsHeaderBackgroundColor =
    (props.element.content as any)?.tabsHeaderBackgroundColor || "#f8fafc";
  const tabsContentBackgroundColor =
    (props.element.content as any)?.tabsContentBackgroundColor || "#ffffff";

  const currentActiveTab = activeTab || tabs[0]?.id || "";

  const handleAddTab = () => {
    const newTabId = `tab${Date.now()}`; // Use timestamp for unique IDs
    const newTabs = [
      ...tabs,
      {
        id: newTabId,
        label: `Tab ${tabs.length + 1}`,
        content: `Content for tab ${tabs.length + 1}`,
        elements: [], // Initialize with empty elements array
        backgroundColor: "#f1f5f9", // Default colors for new tabs
        textColor: "#64748b",
        activeBackgroundColor: "#ffffff",
        activeTextColor: "#3b82f6",
      },
    ];

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...props.element,
          content: {
            ...(props.element.content as any),
            tabs: newTabs,
          },
        },
      },
    });
  };

  const handleRemoveTab = (tabId: string) => {
    if (tabs.length <= 1) return; // Don't allow removing the last tab

    const newTabs = tabs.filter((tab: any) => tab.id !== tabId);

    // If we're removing the active tab, switch to the first tab
    if (currentActiveTab === tabId) {
      setActiveTab(newTabs[0]?.id || "");
    }

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...props.element,
          content: {
            ...(props.element.content as any),
            tabs: newTabs,
          },
        },
      },
    });
  };

  const handleTabLabelChange = (tabId: string, newLabel: string) => {
    const newTabs = tabs.map((tab: any) =>
      tab.id === tabId ? { ...tab, label: newLabel } : tab
    );

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...props.element,
          content: {
            ...(props.element.content as any),
            tabs: newTabs,
          },
        },
      },
    });
  };

  const handleTabContentChange = (tabId: string, newContent: string) => {
    const newTabs = tabs.map((tab: any) =>
      tab.id === tabId ? { ...tab, content: newContent } : tab
    );

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...props.element,
          content: {
            ...(props.element.content as any),
            tabs: newTabs,
          },
        },
      },
    });
  };

  // Handle drag and drop functionality
  const handleOnDrop = (e: React.DragEvent, tabId: string) => {
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
        default:
          return {
            ...baseElement,
            content: { innerText: "Unknown Element" },
          };
      }
    };

    const newElement = createElement(componentType);

    // Update the specific tab's elements
    const newTabs = tabs.map((tab: any) => {
      if (tab.id === tabId) {
        return {
          ...tab,
          elements: [...(tab.elements || []), newElement],
        };
      }
      return tab;
    });

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...props.element,
          content: {
            ...(props.element.content as any),
            tabs: newTabs,
          },
        },
      },
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const currentActiveTabData = tabs.find(
    (tab: any) => tab.id === currentActiveTab
  );
  const activeTabContent = currentActiveTabData?.content || "";
  const activeTabElements = currentActiveTabData?.elements || [];

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

      <div className="w-full" style={{ backgroundColor: tabsBackgroundColor }}>
        {/* Tab Headers */}
        <div
          className="flex border-b border-gray-200 dark:border-gray-700 relative"
          style={{ backgroundColor: tabsHeaderBackgroundColor }}
        >
          {tabs.map((tab: any) => (
            <div
              key={tab.id}
              className={clsx(
                "relative flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors group border-b-2",
                {
                  "border-blue-500": currentActiveTab === tab.id,
                  "border-transparent": currentActiveTab !== tab.id,
                }
              )}
              style={{
                backgroundColor:
                  currentActiveTab === tab.id
                    ? tab.activeBackgroundColor || "#ffffff"
                    : tab.backgroundColor || "#f1f5f9",
                color:
                  currentActiveTab === tab.id
                    ? tab.activeTextColor || "#3b82f6"
                    : tab.textColor || "#64748b",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab(tab.id);
              }}
            >
              {editingTab === tab.id && !state.editor.liveMode ? (
                <input
                  type="text"
                  value={tab.label}
                  onChange={(e) => handleTabLabelChange(tab.id, e.target.value)}
                  onBlur={() => setEditingTab(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setEditingTab(null);
                    }
                  }}
                  className="bg-transparent border-none outline-none text-sm font-medium min-w-0"
                  autoFocus
                />
              ) : (
                <span
                  className="text-sm font-medium"
                  onDoubleClick={() => {
                    if (!state.editor.liveMode) {
                      setEditingTab(tab.id);
                    }
                  }}
                >
                  {tab.label}
                </span>
              )}

              {state.editor.selectedElement.id === props.element.id &&
                !state.editor.liveMode && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit3
                      size={12}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTab(tab.id);
                      }}
                    />
                    {tabs.length > 1 && (
                      <X
                        size={12}
                        className="text-red-400 hover:text-red-600 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTab(tab.id);
                        }}
                      />
                    )}
                  </div>
                )}
            </div>
          ))}

          {state.editor.selectedElement.id === props.element.id &&
            !state.editor.liveMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddTab();
                }}
                className="flex items-center justify-center w-8 h-8 ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <Plus size={14} />
              </button>
            )}
        </div>

        {/* Tab Content */}
        <div
          className={clsx("p-4 rounded-b-lg min-h-[200px] relative", {
            "border-2 border-dashed border-blue-300 bg-blue-50/50":
              !state.editor.liveMode && activeTabElements.length === 0,
          })}
          style={{ backgroundColor: tabsContentBackgroundColor }}
          onDrop={(e) => handleOnDrop(e, currentActiveTab)}
          onDragOver={handleDragOver}
        >
          {/* Render dragged elements if any */}
          {activeTabElements.length > 0 ? (
            <div className="space-y-2">
              {activeTabElements.map((element: EditorElement) => (
                <Recursive key={element.id} element={element} />
              ))}
            </div>
          ) : (
            // Show placeholder content or text content
            <div>
              {!state.editor.liveMode && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                  <div className="text-center">
                    <p className="text-sm font-medium">Drop components here</p>
                    <p className="text-xs">
                      Drag and drop elements from the sidebar
                    </p>
                  </div>
                </div>
              )}

              {/* Original text content - only show if no elements */}
              <div
                contentEditable={!state.editor.liveMode}
                suppressContentEditableWarning={true}
                className="outline-none min-h-[60px] text-gray-700 dark:text-gray-300"
                onBlur={(e) => {
                  const divElement = e.target as HTMLDivElement;
                  handleTabContentChange(
                    currentActiveTab,
                    divElement.innerText
                  );
                }}
                dangerouslySetInnerHTML={{ __html: activeTabContent }}
              />
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

export default TabsComponent;
