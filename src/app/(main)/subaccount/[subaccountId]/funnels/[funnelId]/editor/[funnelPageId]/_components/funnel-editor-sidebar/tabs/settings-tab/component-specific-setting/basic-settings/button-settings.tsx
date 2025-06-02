"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomValuesUpdater } from "../../utils";

type Props = {};

const ButtonSettings = (props: Props) => {
  const { handleChangeCustomValues, state, dispatch } =
    useCustomValuesUpdater();

  if (
    state.editor.selectedElement.type !== "button" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Button Text */}
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground font-medium">Button Text</p>
        <Input
          id="innerText"
          placeholder="Click Me!"
          onChange={handleChangeCustomValues}
          value={state.editor.selectedElement.content.innerText || ""}
        />
      </div>

      {/* Button Link */}
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground font-medium">Button Link (URL)</p>
        <Input
          id="href"
          placeholder="https://example.com or #section"
          onChange={handleChangeCustomValues}
          value={state.editor.selectedElement.content.href || ""}
        />
        <p className="text-xs text-muted-foreground">
          Where should this button navigate when clicked?
        </p>
      </div>

      {/* Button Style Presets */}
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground font-medium">
          Button Style Presets
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="px-3 py-2 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={() => {
              dispatch({
                type: "UPDATE_ELEMENT",
                payload: {
                  elementDetails: {
                    ...state.editor.selectedElement,
                    styles: {
                      ...state.editor.selectedElement.styles,
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    },
                  },
                },
              });
            }}
          >
            Primary
          </button>

          <button
            type="button"
            className="px-3 py-2 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            onClick={() => {
              dispatch({
                type: "UPDATE_ELEMENT",
                payload: {
                  elementDetails: {
                    ...state.editor.selectedElement,
                    styles: {
                      ...state.editor.selectedElement.styles,
                      backgroundColor: "#4b5563",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    },
                  },
                },
              });
            }}
          >
            Secondary
          </button>

          <button
            type="button"
            className="px-3 py-2 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            onClick={() => {
              dispatch({
                type: "UPDATE_ELEMENT",
                payload: {
                  elementDetails: {
                    ...state.editor.selectedElement,
                    styles: {
                      ...state.editor.selectedElement.styles,
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    },
                  },
                },
              });
            }}
          >
            Success
          </button>

          <button
            type="button"
            className="px-3 py-2 text-xs border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => {
              dispatch({
                type: "UPDATE_ELEMENT",
                payload: {
                  elementDetails: {
                    ...state.editor.selectedElement,
                    styles: {
                      ...state.editor.selectedElement.styles,
                      backgroundColor: "transparent",
                      color: "#374151",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    },
                  },
                },
              });
            }}
          >
            Outline
          </button>
        </div>
      </div>

      {/* Button Size Presets */}
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground font-medium">Button Size</p>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            onClick={() => {
              dispatch({
                type: "UPDATE_ELEMENT",
                payload: {
                  elementDetails: {
                    ...state.editor.selectedElement,
                    styles: {
                      ...state.editor.selectedElement.styles,
                      padding: "8px 16px",
                      fontSize: "12px",
                    },
                  },
                },
              });
            }}
          >
            Small
          </button>

          <button
            type="button"
            className="flex-1 px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            onClick={() => {
              dispatch({
                type: "UPDATE_ELEMENT",
                payload: {
                  elementDetails: {
                    ...state.editor.selectedElement,
                    styles: {
                      ...state.editor.selectedElement.styles,
                      padding: "12px 24px",
                      fontSize: "14px",
                    },
                  },
                },
              });
            }}
          >
            Medium
          </button>

          <button
            type="button"
            className="flex-1 px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            onClick={() => {
              dispatch({
                type: "UPDATE_ELEMENT",
                payload: {
                  elementDetails: {
                    ...state.editor.selectedElement,
                    styles: {
                      ...state.editor.selectedElement.styles,
                      padding: "16px 32px",
                      fontSize: "16px",
                    },
                  },
                },
              });
            }}
          >
            Large
          </button>
        </div>
      </div>

      {/* Button Actions */}
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground font-medium">Button Action</p>
        <Select
          onValueChange={(value) => {
            handleChangeCustomValues({
              target: {
                id: "action",
                value: value,
              },
            });
          }}
          value={state.editor.selectedElement.content.action || "link"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select button action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="link">Navigate to URL</SelectItem>
            <SelectItem value="scroll">Scroll to Section</SelectItem>
            <SelectItem value="popup">Open Popup</SelectItem>
            <SelectItem value="download">Download File</SelectItem>
            <SelectItem value="submit">Submit Form</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Settings Toggle */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="openInNewTab"
            className="h-4 w-4"
            onChange={(e) => {
              handleChangeCustomValues({
                target: {
                  id: "target",
                  value: e.target.checked ? "_blank" : "_self",
                },
              });
            }}
            checked={state.editor.selectedElement.content.target === "_blank"}
          />
          <Label
            htmlFor="openInNewTab"
            className="text-sm text-muted-foreground"
          >
            Open link in new tab
          </Label>
        </div>
      </div>

      {/* Button Preview */}
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground font-medium">Preview</p>
        <div className="p-4 bg-muted rounded-md flex justify-center">
          <button
            style={{
              ...state.editor.selectedElement.styles,
              pointerEvents: "none",
            }}
            className="inline-flex items-center justify-center"
          >
            {state.editor.selectedElement.content.innerText || "Button Text"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ButtonSettings;
