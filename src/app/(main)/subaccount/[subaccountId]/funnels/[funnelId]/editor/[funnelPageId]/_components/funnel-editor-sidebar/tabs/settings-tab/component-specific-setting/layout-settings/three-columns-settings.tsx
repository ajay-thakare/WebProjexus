"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const handleSliderChange = (field: string, value: number[]) => {
    const event = {
      target: {
        id: field,
        value: value[0].toString(),
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChangeCustomValues(event);
  };

  const columnGap =
    Number(state.editor.selectedElement.content.columnGap) || 16;
  const column1Width =
    Number(state.editor.selectedElement.content.column1Width) || 33.33;
  const column2Width =
    Number(state.editor.selectedElement.content.column2Width) || 33.33;
  const column3Width =
    Number(state.editor.selectedElement.content.column3Width) || 33.33;

  // Calculate remaining width when one column is adjusted
  const handleColumnWidthChange = (columnField: string, newWidth: number) => {
    const remaining = 100 - newWidth;
    const otherColumnsCount = 2;
    const otherColumnWidth = remaining / otherColumnsCount;

    // Update the main column
    const mainEvent = {
      target: {
        id: columnField,
        value: newWidth.toString(),
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChangeCustomValues(mainEvent);

    // Update other columns
    const otherColumns = [
      "column1Width",
      "column2Width",
      "column3Width",
    ].filter((col) => col !== columnField);

    otherColumns.forEach((col) => {
      const event = {
        target: {
          id: col,
          value: otherColumnWidth.toString(),
        },
      } as React.ChangeEvent<HTMLInputElement>;
      handleChangeCustomValues(event);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="columnGap" className="text-muted-foreground">
          Column Gap (px)
        </Label>
        <div className="px-2">
          <Slider
            value={[columnGap]}
            onValueChange={(value) => handleSliderChange("columnGap", value)}
            max={48}
            min={0}
            step={4}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0px</span>
            <span>{columnGap}px</span>
            <span>48px</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Column Widths</h4>

        <div className="flex flex-col gap-2">
          <Label htmlFor="column1Width" className="text-muted-foreground">
            Column 1 Width (%)
          </Label>
          <div className="px-2">
            <Slider
              value={[column1Width]}
              onValueChange={(value) =>
                handleColumnWidthChange("column1Width", value[0])
              }
              max={80}
              min={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>10%</span>
              <span>{column1Width.toFixed(1)}%</span>
              <span>80%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="column2Width" className="text-muted-foreground">
            Column 2 Width (%)
          </Label>
          <div className="px-2">
            <Slider
              value={[column2Width]}
              onValueChange={(value) =>
                handleColumnWidthChange("column2Width", value[0])
              }
              max={80}
              min={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>10%</span>
              <span>{column2Width.toFixed(1)}%</span>
              <span>80%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="column3Width" className="text-muted-foreground">
            Column 3 Width (%)
          </Label>
          <div className="px-2">
            <Slider
              value={[column3Width]}
              onValueChange={(value) =>
                handleColumnWidthChange("column3Width", value[0])
              }
              max={80}
              min={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>10%</span>
              <span>{column3Width.toFixed(1)}%</span>
              <span>80%</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
          Total: {(column1Width + column2Width + column3Width).toFixed(1)}%
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-muted-foreground">Quick Layouts</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              const events = [
                { field: "column1Width", value: "33.33" },
                { field: "column2Width", value: "33.33" },
                { field: "column3Width", value: "33.34" },
              ];
              events.forEach(({ field, value }) => {
                const event = {
                  target: { id: field, value },
                } as React.ChangeEvent<HTMLInputElement>;
                handleChangeCustomValues(event);
              });
            }}
            className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Equal (33-33-33)
          </button>
          <button
            type="button"
            onClick={() => {
              const events = [
                { field: "column1Width", value: "50" },
                { field: "column2Width", value: "25" },
                { field: "column3Width", value: "25" },
              ];
              events.forEach(({ field, value }) => {
                const event = {
                  target: { id: field, value },
                } as React.ChangeEvent<HTMLInputElement>;
                handleChangeCustomValues(event);
              });
            }}
            className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Main-Side (50-25-25)
          </button>
          <button
            type="button"
            onClick={() => {
              const events = [
                { field: "column1Width", value: "25" },
                { field: "column2Width", value: "50" },
                { field: "column3Width", value: "25" },
              ];
              events.forEach(({ field, value }) => {
                const event = {
                  target: { id: field, value },
                } as React.ChangeEvent<HTMLInputElement>;
                handleChangeCustomValues(event);
              });
            }}
            className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Side-Main-Side (25-50-25)
          </button>
          <button
            type="button"
            onClick={() => {
              const events = [
                { field: "column1Width", value: "60" },
                { field: "column2Width", value: "20" },
                { field: "column3Width", value: "20" },
              ];
              events.forEach(({ field, value }) => {
                const event = {
                  target: { id: field, value },
                } as React.ChangeEvent<HTMLInputElement>;
                handleChangeCustomValues(event);
              });
            }}
            className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Content-Sidebar (60-20-20)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreeColumnSettings;
