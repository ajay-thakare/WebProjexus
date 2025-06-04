"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit3 } from "lucide-react";
import { useCustomValuesUpdater } from "../../utils";
import { TabItem } from "@/providers/editor/editor-provider";

type Props = {};

const TabsSettings = (props: Props) => {
  const { handleChangeCustomValues, state } = useCustomValuesUpdater();

  if (
    state.editor.selectedElement.type !== "tabs" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  const tabs = (state.editor.selectedElement.content as any).tabs || [];

  const handleAddTab = () => {
    const newTabId = `tab${tabs.length + 1}`;
    const newTabs = [
      ...tabs,
      {
        id: newTabId,
        label: `Tab ${tabs.length + 1}`,
        content: `Content for tab ${tabs.length + 1}`,
      },
    ];

    const event = {
      target: {
        id: "tabs",
        value: newTabs,
      },
    } as any;
    handleChangeCustomValues(event);
  };

  const handleRemoveTab = (tabId: string) => {
    if (tabs.length <= 1) return; // Don't allow removing the last tab

    const newTabs = tabs.filter((tab: TabItem) => tab.id !== tabId);

    const event = {
      target: {
        id: "tabs",
        value: newTabs,
      },
    } as any;
    handleChangeCustomValues(event);
  };

  const handleTabChange = (
    tabId: string,
    field: keyof TabItem,
    value: string
  ) => {
    const newTabs = tabs.map((tab: TabItem) =>
      tab.id === tabId ? { ...tab, [field]: value } : tab
    );

    const event = {
      target: {
        id: "tabs",
        value: newTabs,
      },
    } as any;
    handleChangeCustomValues(event);
  };

  const handleGlobalTabChange = (field: string, value: string) => {
    const event = {
      target: {
        id: field,
        value: value,
      },
    } as any;
    handleChangeCustomValues(event);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Global Tab Colors */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Global Tab Styling
        </Label>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="tabsBackgroundColor"
              className="text-xs text-muted-foreground"
            >
              Container Background
            </Label>
            <Input
              id="tabsBackgroundColor"
              type="color"
              value={
                (state.editor.selectedElement.content as any)
                  .tabsBackgroundColor || "#ffffff"
              }
              onChange={(e) =>
                handleGlobalTabChange("tabsBackgroundColor", e.target.value)
              }
              className="h-10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="tabsHeaderBackgroundColor"
              className="text-xs text-muted-foreground"
            >
              Header Background
            </Label>
            <Input
              id="tabsHeaderBackgroundColor"
              type="color"
              value={
                (state.editor.selectedElement.content as any)
                  .tabsHeaderBackgroundColor || "#f8fafc"
              }
              onChange={(e) =>
                handleGlobalTabChange(
                  "tabsHeaderBackgroundColor",
                  e.target.value
                )
              }
              className="h-10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="tabsContentBackgroundColor"
              className="text-xs text-muted-foreground"
            >
              Content Background
            </Label>
            <Input
              id="tabsContentBackgroundColor"
              type="color"
              value={
                (state.editor.selectedElement.content as any)
                  .tabsContentBackgroundColor || "#ffffff"
              }
              onChange={(e) =>
                handleGlobalTabChange(
                  "tabsContentBackgroundColor",
                  e.target.value
                )
              }
              className="h-10"
            />
          </div>
        </div>
      </div>

      {/* Individual Tab Management */}
      <div className="flex items-center justify-between">
        <Label className="text-muted-foreground">Individual Tab Settings</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddTab}
          className="h-8 w-8 p-0"
        >
          <Plus size={14} />
        </Button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {tabs.map((tab: TabItem, index: number) => (
          <div
            key={tab.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4"
          >
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground">
                Tab {index + 1}
              </Label>
              {tabs.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveTab(tab.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </div>

            {/* Tab Label */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor={`tab-label-${tab.id}`}
                className="text-xs text-muted-foreground"
              >
                Tab Label
              </Label>
              <Input
                id={`tab-label-${tab.id}`}
                value={tab.label}
                onChange={(e) =>
                  handleTabChange(tab.id, "label", e.target.value)
                }
                placeholder={`Tab ${index + 1}`}
                className="text-sm"
              />
            </div>

            {/* Tab Content */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor={`tab-content-${tab.id}`}
                className="text-xs text-muted-foreground"
              >
                Tab Content
              </Label>
              <Textarea
                id={`tab-content-${tab.id}`}
                value={tab.content}
                onChange={(e) =>
                  handleTabChange(tab.id, "content", e.target.value)
                }
                placeholder={`Content for tab ${index + 1}`}
                className="text-sm min-h-[80px] resize-none"
                rows={3}
              />
            </div>

            {/* Tab Colors */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor={`tab-bg-${tab.id}`}
                  className="text-xs text-muted-foreground"
                >
                  Inactive Background
                </Label>
                <Input
                  id={`tab-bg-${tab.id}`}
                  type="color"
                  value={tab.backgroundColor || "#f1f5f9"}
                  onChange={(e) =>
                    handleTabChange(tab.id, "backgroundColor", e.target.value)
                  }
                  className="h-8"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor={`tab-text-${tab.id}`}
                  className="text-xs text-muted-foreground"
                >
                  Inactive Text
                </Label>
                <Input
                  id={`tab-text-${tab.id}`}
                  type="color"
                  value={tab.textColor || "#64748b"}
                  onChange={(e) =>
                    handleTabChange(tab.id, "textColor", e.target.value)
                  }
                  className="h-8"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor={`tab-active-bg-${tab.id}`}
                  className="text-xs text-muted-foreground"
                >
                  Active Background
                </Label>
                <Input
                  id={`tab-active-bg-${tab.id}`}
                  type="color"
                  value={tab.activeBackgroundColor || "#ffffff"}
                  onChange={(e) =>
                    handleTabChange(
                      tab.id,
                      "activeBackgroundColor",
                      e.target.value
                    )
                  }
                  className="h-8"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor={`tab-active-text-${tab.id}`}
                  className="text-xs text-muted-foreground"
                >
                  Active Text
                </Label>
                <Input
                  id={`tab-active-text-${tab.id}`}
                  type="color"
                  value={tab.activeTextColor || "#3b82f6"}
                  onChange={(e) =>
                    handleTabChange(tab.id, "activeTextColor", e.target.value)
                  }
                  className="h-8"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <p className="font-medium mb-1">Color Tips:</p>
        <ul className="space-y-1 text-xs">
          <li>• Use Global Styling for consistent container appearance</li>
          <li>• Customize individual tabs for unique branding</li>
          <li>• Active colors show when a tab is selected</li>
          <li>• Inactive colors show when a tab is not selected</li>
          <li>• Consider contrast for accessibility</li>
        </ul>
      </div>
    </div>
  );
};

export default TabsSettings;
