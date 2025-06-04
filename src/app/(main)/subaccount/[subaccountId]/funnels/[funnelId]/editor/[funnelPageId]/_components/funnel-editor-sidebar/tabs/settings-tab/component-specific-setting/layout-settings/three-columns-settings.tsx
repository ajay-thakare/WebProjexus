"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useCustomValuesUpdater } from "../../utils";

type Props = {};

const ThreeColumnSettings = (props: Props) => {
  const { handleChangeCustomValues, state } = useCustomValuesUpdater();

  if (
    state.editor.selectedElement.type !== "3Col" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  const currentContent = state.editor.selectedElement.content as any;
  const columnGap = currentContent.columnGap || 20;
  const column1Width = currentContent.column1Width || 33.33;
  const column2Width = currentContent.column2Width || 33.33;
  const column3Width = currentContent.column3Width || 33.33;

  const handleSliderChange = (field: string, value: number[]) => {
    const event = {
      target: {
        id: field,
        value: value[0],
      },
    } as any;
    handleChangeCustomValues(event);
  };

  const handlePresetLayout = (
    layout: "equal" | "left-heavy" | "center-heavy" | "right-heavy"
  ) => {
    let widths = {
      column1Width: 33.33,
      column2Width: 33.33,
      column3Width: 33.33,
    };

    switch (layout) {
      case "equal":
        widths = {
          column1Width: 33.33,
          column2Width: 33.33,
          column3Width: 33.33,
        };
        break;
      case "left-heavy":
        widths = { column1Width: 50, column2Width: 25, column3Width: 25 };
        break;
      case "center-heavy":
        widths = { column1Width: 25, column2Width: 50, column3Width: 25 };
        break;
      case "right-heavy":
        widths = { column1Width: 25, column2Width: 25, column3Width: 50 };
        break;
    }

    // Update all three columns at once
    Object.entries(widths).forEach(([key, value]) => {
      const event = {
        target: {
          id: key,
          value: value,
        },
      } as any;
      handleChangeCustomValues(event);
    });
  };

  const handleGapPreset = (gap: number) => {
    const event = {
      target: {
        id: "columnGap",
        value: gap,
      },
    } as any;
    handleChangeCustomValues(event);
  };

  // Calculate remaining width when one column changes
  const totalWidth = column1Width + column2Width + column3Width;
  const isBalanced = Math.abs(totalWidth - 100) < 0.1;

  return (
    <div className="flex flex-col gap-6">
      {/* Column Gap Settings */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Column Spacing
        </Label>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="columnGap"
              className="text-xs text-muted-foreground"
            >
              Gap Between Columns (px)
            </Label>
            <Input
              id="columnGap"
              type="number"
              min="0"
              max="100"
              value={columnGap}
              onChange={handleChangeCustomValues}
              className="h-10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Quick Gap Presets
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 10, 20, 30].map((gap) => (
                <Button
                  key={gap}
                  type="button"
                  variant={columnGap === gap ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleGapPreset(gap)}
                  className="text-xs"
                >
                  {gap}px
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Layout Presets */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Layout Presets
        </Label>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handlePresetLayout("equal")}
            className="text-xs flex flex-col items-center gap-1 h-auto py-2"
          >
            <div className="flex gap-1">
              <div className="w-3 h-2 bg-gray-300 rounded-sm"></div>
              <div className="w-3 h-2 bg-gray-300 rounded-sm"></div>
              <div className="w-3 h-2 bg-gray-300 rounded-sm"></div>
            </div>
            Equal (33/33/33)
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handlePresetLayout("left-heavy")}
            className="text-xs flex flex-col items-center gap-1 h-auto py-2"
          >
            <div className="flex gap-1">
              <div className="w-5 h-2 bg-gray-400 rounded-sm"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
            </div>
            Left Heavy (50/25/25)
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handlePresetLayout("center-heavy")}
            className="text-xs flex flex-col items-center gap-1 h-auto py-2"
          >
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
              <div className="w-5 h-2 bg-gray-400 rounded-sm"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
            </div>
            Center Heavy (25/50/25)
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handlePresetLayout("right-heavy")}
            className="text-xs flex flex-col items-center gap-1 h-auto py-2"
          >
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
              <div className="w-5 h-2 bg-gray-400 rounded-sm"></div>
            </div>
            Right Heavy (25/25/50)
          </Button>
        </div>
      </div>

      {/* Individual Column Widths */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-muted-foreground">
            Column Widths
          </Label>
          {!isBalanced && (
            <span className="text-xs text-orange-500 font-medium">
              Total: {totalWidth.toFixed(1)}%
            </span>
          )}
        </div>

        {/* Column 1 */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Column 1 Width (%)
          </Label>
          <div className="flex items-center gap-3">
            <Slider
              value={[column1Width]}
              onValueChange={(value) =>
                handleSliderChange("column1Width", value)
              }
              max={80}
              min={10}
              step={0.1}
              className="flex-1"
            />
            <Input
              id="column1Width"
              type="number"
              min="10"
              max="80"
              step="0.1"
              value={column1Width.toFixed(1)}
              onChange={handleChangeCustomValues}
              className="w-20 h-8 text-xs"
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Column 2 Width (%)
          </Label>
          <div className="flex items-center gap-3">
            <Slider
              value={[column2Width]}
              onValueChange={(value) =>
                handleSliderChange("column2Width", value)
              }
              max={80}
              min={10}
              step={0.1}
              className="flex-1"
            />
            <Input
              id="column2Width"
              type="number"
              min="10"
              max="80"
              step="0.1"
              value={column2Width.toFixed(1)}
              onChange={handleChangeCustomValues}
              className="w-20 h-8 text-xs"
            />
          </div>
        </div>

        {/* Column 3 */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Column 3 Width (%)
          </Label>
          <div className="flex items-center gap-3">
            <Slider
              value={[column3Width]}
              onValueChange={(value) =>
                handleSliderChange("column3Width", value)
              }
              max={80}
              min={10}
              step={0.1}
              className="flex-1"
            />
            <Input
              id="column3Width"
              type="number"
              min="10"
              max="80"
              step="0.1"
              value={column3Width.toFixed(1)}
              onChange={handleChangeCustomValues}
              className="w-20 h-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <p className="font-medium mb-1">Column Layout Tips:</p>
        <ul className="space-y-1 text-xs">
          <li>• Drag elements from the sidebar into any column</li>
          <li>• Use presets for common layouts</li>
          <li>• Column widths should total 100% for best results</li>
          <li>• Adjust gap for spacing between columns</li>
          <li>• Each column can contain multiple elements</li>
        </ul>
      </div>
    </div>
  );
};

export default ThreeColumnSettings;
