"use client";
import React, { ChangeEventHandler } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlignCenter,
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  ChevronsLeftRightIcon,
  LucideImageDown,
} from "lucide-react";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditor } from "@/providers/editor/editor-provider";
import { Slider } from "@/components/ui/slider";

type Props = {};

const SettingsTab = (props: Props) => {
  const { state, dispatch } = useEditor();

  const handleOnChanges = (e: any) => {
    const styleSettings = e.target.id;
    let value = e.target.value;
    const styleObject = {
      [styleSettings]: value,
    };

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          styles: {
            ...state.editor.selectedElement.styles,
            ...styleObject,
          },
        },
      },
    });
  };

  const handleChangeCustomValues = (e: any) => {
    const settingProperty = e.target.id;
    let value = e.target.value;
    const styleObject = {
      [settingProperty]: value,
    };

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          content: {
            ...state.editor.selectedElement.content,
            ...styleObject,
          },
        },
      },
    });
  };

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["Typography", "Dimensions", "Decorations", "Flexbox"]}
    >
      <AccordionItem value="Custom" className="px-6 py-0  ">
        <AccordionTrigger className="!no-underline">Custom</AccordionTrigger>
        <AccordionContent>
          {state.editor.selectedElement.type === "link" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Link Path</p>
                <Input
                  id="href"
                  placeholder="https://domain.example.com/pathname"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.href || ""}
                />
              </div>
            )}
          {state.editor.selectedElement.type === "video" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Video Source</p>
                <Input
                  id="src"
                  placeholder="https://example.com/video.mp4"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.src || ""}
                />
              </div>
            )}
          {state.editor.selectedElement.type === "image" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground">Image Source</p>
                  <Input
                    id="src"
                    placeholder="https://example.com/image.jpg"
                    onChange={handleChangeCustomValues}
                    value={state.editor.selectedElement.content.src || ""}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground">Alt Text</p>
                  <Input
                    id="alt"
                    placeholder="Image description"
                    onChange={handleChangeCustomValues}
                    value={state.editor.selectedElement.content.alt || ""}
                  />
                </div>
              </div>
            )}
          {state.editor.selectedElement.type === "button" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-4">
                {/* Button Text */}
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground font-medium">
                    Button Text
                  </p>
                  <Input
                    id="innerText"
                    placeholder="Click Me!"
                    onChange={handleChangeCustomValues}
                    value={state.editor.selectedElement.content.innerText || ""}
                  />
                </div>

                {/* Button Link */}
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground font-medium">
                    Button Link (URL)
                  </p>
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
                  <p className="text-muted-foreground font-medium">
                    Button Size
                  </p>
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
                  <p className="text-muted-foreground font-medium">
                    Button Action
                  </p>
                  <Select
                    onValueChange={(value) => {
                      handleChangeCustomValues({
                        target: {
                          id: "action",
                          value: value,
                        },
                      });
                    }}
                    value={
                      state.editor.selectedElement.content.action || "link"
                    }
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
                      checked={
                        state.editor.selectedElement.content.target === "_blank"
                      }
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
                      {state.editor.selectedElement.content.innerText ||
                        "Button Text"}
                    </button>
                  </div>
                </div>
              </div>
            )}

          {state.editor.selectedElement.type === "countdown" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground">Target Date & Time</p>
                  <Input
                    type="datetime-local"
                    id="targetDate"
                    onChange={handleChangeCustomValues}
                    value={
                      state.editor.selectedElement.content.targetDate
                        ? new Date(
                            state.editor.selectedElement.content.targetDate
                          )
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
            )}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Typography" className="px-6 py-0  border-y-[1px]">
        <AccordionTrigger className="!no-underline">
          Typography
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 ">
          <div className="flex flex-col gap-2 ">
            <p className="text-muted-foreground">Text Align</p>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: "textAlign",
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.textAlign}
            >
              <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                <TabsTrigger
                  value="left"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignLeft size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="right"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignRight size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="center"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignCenter size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="justify"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                >
                  <AlignJustify size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Font Family</p>
            <Input
              id="DM Sans"
              onChange={handleOnChanges}
              value={state.editor.selectedElement.styles.fontFamily || ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Color</p>
            <Input
              id="color"
              onChange={handleOnChanges}
              value={state.editor.selectedElement.styles.color || ""}
            />
          </div>
          <div className="flex gap-4">
            <div>
              <Label className="text-muted-foreground">Weight</Label>
              <Select
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "font-weight",
                      value: e,
                    },
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Font Weights</SelectLabel>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="normal">Regular</SelectItem>
                    <SelectItem value="lighter">Light</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-muted-foreground">Size</Label>
              <Input
                placeholder="px"
                id="fontSize"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.fontSize || ""}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Dimensions" className=" px-6 py-0 ">
        <AccordionTrigger className="!no-underline">
          Dimensions
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 flex-col">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Height</Label>
                    <Input
                      id="height"
                      placeholder="px"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.height || ""}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Width</Label>
                    <Input
                      placeholder="px"
                      id="width"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.width || ""}
                    />
                  </div>
                </div>
              </div>
              <p>Margin px</p>
              <div className="flex gap-4 flex-col">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Top</Label>
                    <Input
                      id="marginTop"
                      placeholder="px"
                      onChange={handleOnChanges}
                      value={
                        state.editor.selectedElement.styles.marginTop || ""
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bottom</Label>
                    <Input
                      placeholder="px"
                      id="marginBottom"
                      onChange={handleOnChanges}
                      value={
                        state.editor.selectedElement.styles.marginBottom || ""
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Left</Label>
                    <Input
                      placeholder="px"
                      id="marginLeft"
                      onChange={handleOnChanges}
                      value={
                        state.editor.selectedElement.styles.marginLeft || ""
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Right</Label>
                    <Input
                      placeholder="px"
                      id="marginRight"
                      onChange={handleOnChanges}
                      value={
                        state.editor.selectedElement.styles.marginRight || ""
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p>Padding px</p>
              <div className="flex gap-4 flex-col">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Top</Label>
                    <Input
                      placeholder="px"
                      id="paddingTop"
                      onChange={handleOnChanges}
                      value={
                        state.editor.selectedElement.styles.paddingTop || ""
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bottom</Label>
                    <Input
                      placeholder="px"
                      id="paddingBottom"
                      onChange={handleOnChanges}
                      value={
                        state.editor.selectedElement.styles.paddingBottom || ""
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Left</Label>
                    <Input
                      placeholder="px"
                      id="paddingLeft"
                      onChange={handleOnChanges}
                      value={
                        state.editor.selectedElement.styles.paddingLeft || ""
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Right</Label>
                    <Input
                      placeholder="px"
                      id="paddingRight"
                      onChange={handleOnChanges}
                      value={
                        state.editor.selectedElement.styles.paddingRight || ""
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Decorations" className="px-6 py-0 ">
        <AccordionTrigger className="!no-underline">
          Decorations
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          <div>
            <Label className="text-muted-foreground">Opacity</Label>
            <div className="flex items-center justify-end">
              <small className="p-2">
                {typeof state.editor.selectedElement.styles?.opacity ===
                "number"
                  ? state.editor.selectedElement.styles?.opacity
                  : parseFloat(
                      (
                        state.editor.selectedElement.styles?.opacity || "0"
                      ).replace("%", "")
                    ) || 0}
                %
              </small>
            </div>
            <Slider
              onValueChange={(e) => {
                handleOnChanges({
                  target: {
                    id: "opacity",
                    value: `${e[0]}%`,
                  },
                });
              }}
              defaultValue={[
                typeof state.editor.selectedElement.styles?.opacity === "number"
                  ? state.editor.selectedElement.styles?.opacity
                  : parseFloat(
                      (
                        state.editor.selectedElement.styles?.opacity || "0"
                      ).replace("%", "")
                    ) || 0,
              ]}
              max={100}
              step={1}
            />
          </div>
          <div>
            <Label className="text-muted-foreground">Border Radius</Label>
            <div className="flex items-center justify-end">
              <small className="">
                {typeof state.editor.selectedElement.styles?.borderRadius ===
                "number"
                  ? state.editor.selectedElement.styles?.borderRadius
                  : parseFloat(
                      (
                        state.editor.selectedElement.styles?.borderRadius || "0"
                      ).replace("px", "")
                    ) || 0}
                px
              </small>
            </div>
            <Slider
              onValueChange={(e) => {
                handleOnChanges({
                  target: {
                    id: "borderRadius",
                    value: `${e[0]}px`,
                  },
                });
              }}
              defaultValue={[
                typeof state.editor.selectedElement.styles?.borderRadius ===
                "number"
                  ? state.editor.selectedElement.styles?.borderRadius
                  : parseFloat(
                      (
                        state.editor.selectedElement.styles?.borderRadius || "0"
                      ).replace("%", "")
                    ) || 0,
              ]}
              max={100}
              step={1}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Background Color</Label>
            <div className="flex  border-[1px] rounded-md overflow-clip">
              <div
                className="w-12 "
                style={{
                  backgroundColor:
                    state.editor.selectedElement.styles.backgroundColor,
                }}
              />
              <Input
                placeholder="#HFI245"
                className="!border-y-0 rounded-none !border-r-0 mr-2"
                id="backgroundColor"
                onChange={handleOnChanges}
                value={
                  state.editor.selectedElement.styles.backgroundColor || ""
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Background Image</Label>
            <div className="flex  border-[1px] rounded-md overflow-clip">
              <div
                className="w-12 "
                style={{
                  backgroundImage:
                    state.editor.selectedElement.styles.backgroundImage,
                }}
              />
              <Input
                placeholder="url()"
                className="!border-y-0 rounded-none !border-r-0 mr-2"
                id="backgroundImage"
                onChange={handleOnChanges}
                value={
                  state.editor.selectedElement.styles.backgroundImage || ""
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Image Position</Label>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: "backgroundSize",
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.backgroundSize?.toString()}
            >
              <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                <TabsTrigger
                  value="cover"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <ChevronsLeftRightIcon size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="contain"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignVerticalJustifyCenter size={22} />
                </TabsTrigger>
                <TabsTrigger
                  value="auto"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <LucideImageDown size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Flexbox" className="px-6 py-0  ">
        <AccordionTrigger className="!no-underline">Flexbox</AccordionTrigger>
        <AccordionContent>
          <Label className="text-muted-foreground">Justify Content</Label>
          <Tabs
            onValueChange={(e) =>
              handleOnChanges({
                target: {
                  id: "justifyContent",
                  value: e,
                },
              })
            }
            value={state.editor.selectedElement.styles.justifyContent}
          >
            <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
              <TabsTrigger
                value="space-between"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
              >
                <AlignHorizontalSpaceBetween size={18} />
              </TabsTrigger>
              <TabsTrigger
                value="space-evenly"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
              >
                <AlignHorizontalSpaceAround size={18} />
              </TabsTrigger>
              <TabsTrigger
                value="center"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
              >
                <AlignHorizontalJustifyCenterIcon size={18} />
              </TabsTrigger>
              <TabsTrigger
                value="start"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted "
              >
                <AlignHorizontalJustifyStart size={18} />
              </TabsTrigger>
              <TabsTrigger
                value="end"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted "
              >
                <AlignHorizontalJustifyEndIcon size={18} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Label className="text-muted-foreground">Align Items</Label>
          <Tabs
            onValueChange={(e) =>
              handleOnChanges({
                target: {
                  id: "alignItems",
                  value: e,
                },
              })
            }
            value={state.editor.selectedElement.styles.alignItems}
          >
            <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
              <TabsTrigger
                value="center"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
              >
                <AlignVerticalJustifyCenter size={18} />
              </TabsTrigger>
              <TabsTrigger
                value="normal"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted "
              >
                <AlignVerticalJustifyStart size={18} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Input
              className="h-4 w-4"
              placeholder="px"
              type="checkbox"
              id="display"
              onChange={(va) => {
                handleOnChanges({
                  target: {
                    id: "display",
                    value: va.target.checked ? "flex" : "block",
                  },
                });
              }}
            />
            <Label className="text-muted-foreground">Flex</Label>
          </div>
          <div>
            <Label className="text-muted-foreground"> Direction</Label>
            <Input
              placeholder="px"
              id="flexDirection"
              onChange={handleOnChanges}
              value={state.editor.selectedElement.styles.flexDirection}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SettingsTab;
