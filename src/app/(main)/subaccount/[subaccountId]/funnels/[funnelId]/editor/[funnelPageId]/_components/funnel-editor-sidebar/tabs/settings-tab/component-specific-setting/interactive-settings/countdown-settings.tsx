"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { useCustomValuesUpdater } from "../../utils";

type Props = {};

const CountdownSettings = (props: Props) => {
  const { handleChangeCustomValues, state } = useCustomValuesUpdater();

  if (
    state.editor.selectedElement.type !== "countdown" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Target Date & Time</p>
        <Input
          type="datetime-local"
          id="targetDate"
          onChange={handleChangeCustomValues}
          value={
            state.editor.selectedElement.content.targetDate
              ? new Date(state.editor.selectedElement.content.targetDate)
                  .toISOString()
                  .slice(0, 16)
              : ""
          }
        />
        <p className="text-xs text-muted-foreground">
          Set the date and time when the countdown should end
        </p>
      </div>

      {/* Quick preset buttons for common time periods */}
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Quick Presets</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="px-3 py-2 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            onClick={() => {
              const targetDate = new Date();
              targetDate.setHours(targetDate.getHours() + 1);
              handleChangeCustomValues({
                target: {
                  id: "targetDate",
                  value: targetDate.toISOString(),
                },
              });
            }}
          >
            +1 Hour
          </button>
          <button
            type="button"
            className="px-3 py-2 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            onClick={() => {
              const targetDate = new Date();
              targetDate.setDate(targetDate.getDate() + 1);
              handleChangeCustomValues({
                target: {
                  id: "targetDate",
                  value: targetDate.toISOString(),
                },
              });
            }}
          >
            +1 Day
          </button>
          <button
            type="button"
            className="px-3 py-2 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            onClick={() => {
              const targetDate = new Date();
              targetDate.setDate(targetDate.getDate() + 7);
              handleChangeCustomValues({
                target: {
                  id: "targetDate",
                  value: targetDate.toISOString(),
                },
              });
            }}
          >
            +1 Week
          </button>
          <button
            type="button"
            className="px-3 py-2 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            onClick={() => {
              const targetDate = new Date();
              targetDate.setMonth(targetDate.getMonth() + 1);
              handleChangeCustomValues({
                target: {
                  id: "targetDate",
                  value: targetDate.toISOString(),
                },
              });
            }}
          >
            +1 Month
          </button>
        </div>
      </div>

      {/* Display current target date in readable format */}
      {state.editor.selectedElement.content.targetDate && (
        <div className="flex flex-col gap-1 p-3 bg-muted rounded-md">
          <p className="text-xs font-medium">Countdown ends on:</p>
          <p className="text-sm">
            {new Date(
              state.editor.selectedElement.content.targetDate
            ).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default CountdownSettings;
