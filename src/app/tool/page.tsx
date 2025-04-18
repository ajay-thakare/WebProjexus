"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Trash,
  Move,
  Smartphone,
  Tablet,
  Monitor,
  Code,
  Eye,
  Palette,
} from "lucide-react";
import clsx from "clsx";

// Define element types that can be dragged
const ELEMENT_TYPES = {
  INPUT: "INPUT",
  BUTTON: "BUTTON",
  TEXT: "TEXT",
  HEADING: "HEADING",
  DIVIDER: "DIVIDER",
  CHECKBOX: "CHECKBOX",
} as const;

// Define type for the element types
type ElementType = (typeof ELEMENT_TYPES)[keyof typeof ELEMENT_TYPES];

// Define the structure of an editor element
type EditorElement = {
  id: string;
  type: ElementType;
  styles: React.CSSProperties;
  content?: string;
  placeholder?: string;
  position: {
    x: number;
    y: number;
  };
};

const LoginPageBuilder = () => {
  const [elements, setElements] = React.useState<EditorElement[]>([]);
  const [selectedElement, setSelectedElement] =
    React.useState<EditorElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isPreviewMode, setIsPreviewMode] = React.useState(false);
  const [viewport, setViewport] = React.useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");
  const [isMovingElement, setIsMovingElement] = React.useState(false);
  const [movingOffset, setMovingOffset] = React.useState({ x: 0, y: 0 });
  const canvasRef = React.useRef<HTMLDivElement>(null);

  // Handle drag start from toolbox
  const handleDragStart = (e: React.DragEvent, type: ElementType) => {
    e.dataTransfer.setData("elementType", type);
    setIsDragging(true);
  };

  // Handle drop on canvas
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("elementType") as ElementType;

    if (!canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    const newElement: EditorElement = {
      id: Math.random().toString(),
      type,
      styles: {
        padding: "8px",
        margin: "4px",
        width: getDefaultWidth(type),
        backgroundColor:
          type === ELEMENT_TYPES.BUTTON ? "#3B82F6" : "transparent",
        color: type === ELEMENT_TYPES.BUTTON ? "white" : "black",
        borderRadius: "4px",
        fontSize: type === ELEMENT_TYPES.HEADING ? "24px" : "16px",
        fontWeight: type === ELEMENT_TYPES.HEADING ? "bold" : "normal",
      },
      placeholder: type === ELEMENT_TYPES.INPUT ? "Enter text..." : "",
      content: getDefaultContent(type),
      position: { x, y },
    };

    setElements([...elements, newElement]);
    setSelectedElement(newElement);
    setIsDragging(false);
  };

  // Get default width based on element type
  const getDefaultWidth = (type: ElementType): string => {
    switch (type) {
      case ELEMENT_TYPES.BUTTON:
        return "200px";
      case ELEMENT_TYPES.DIVIDER:
        return "100%";
      default:
        return "300px";
    }
  };

  // Get default content based on element type
  const getDefaultContent = (type: ElementType): string => {
    switch (type) {
      case ELEMENT_TYPES.BUTTON:
        return "Login";
      case ELEMENT_TYPES.TEXT:
        return "Welcome back! Please log in to your account.";
      case ELEMENT_TYPES.HEADING:
        return "Login to Your Account";
      case ELEMENT_TYPES.CHECKBOX:
        return "Remember me";
      case ELEMENT_TYPES.DIVIDER:
        return "";
      default:
        return "";
    }
  };

  // Handle element click for selection
  const handleElementClick = (element: EditorElement, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement(element);
  };

  // Handle element deletion - Fixed to ensure it works
  const handleDeleteElement = (elementId: string) => {
    setElements(elements.filter((el) => el.id !== elementId));
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  // Handle element property change
  const handleElementPropertyChange = (
    property: keyof EditorElement | keyof EditorElement["styles"],
    value: any,
    isStyle = false
  ) => {
    if (!selectedElement) return;

    setElements(
      elements.map((el) => {
        if (el.id === selectedElement.id) {
          if (isStyle) {
            return {
              ...el,
              styles: {
                ...el.styles,
                [property]: value,
              },
            };
          } else {
            return {
              ...el,
              [property]: value,
            };
          }
        }
        return el;
      })
    );

    // Update selected element
    setSelectedElement((prev) => {
      if (!prev) return null;
      if (isStyle) {
        return {
          ...prev,
          styles: {
            ...prev.styles,
            [property]: value,
          },
        };
      } else {
        return {
          ...prev,
          [property]: value,
        };
      }
    });
  };

  // Start moving an element - Fixed to calculate offset
  const startMovingElement = (e: React.MouseEvent, element: EditorElement) => {
    e.stopPropagation();
    e.preventDefault();

    if (!canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - canvasRect.left - element.position.x;
    const offsetY = e.clientY - canvasRect.top - element.position.y;

    setMovingOffset({ x: offsetX, y: offsetY });
    setIsMovingElement(true);
    setSelectedElement(element);
  };

  // Handle element movement - Fixed to use offset for smoother dragging
  const handleElementMove = (e: React.MouseEvent) => {
    if (!isMovingElement || !selectedElement || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, e.clientX - canvasRect.left - movingOffset.x);
    const y = Math.max(0, e.clientY - canvasRect.top - movingOffset.y);

    setElements(
      elements.map((el) => {
        if (el.id === selectedElement.id) {
          return {
            ...el,
            position: { x, y },
          };
        }
        return el;
      })
    );

    // Update selected element position
    setSelectedElement({
      ...selectedElement,
      position: { x, y },
    });
  };

  // Stop moving an element
  const stopMovingElement = () => {
    setIsMovingElement(false);
  };

  // Clear canvas
  const handleClearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      setElements([]);
      setSelectedElement(null);
    }
  };

  // Export the design as HTML
  const exportAsHTML = () => {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Page</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background-color: #f5f5f5;
    }
    .login-container {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      position: relative;
      width: 400px;
    }
    .element {
      position: absolute;
    }
  </style>
</head>
<body>
  <div class="login-container">
`;

    elements.forEach((element) => {
      const { x, y } = element.position;
      const styles = Object.entries(element.styles)
        .map(
          ([key, value]) =>
            `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value}`
        )
        .join("; ");

      html += `    <div class="element" style="left: ${x}px; top: ${y}px;">`;

      switch (element.type) {
        case ELEMENT_TYPES.INPUT:
          html += `<input type="text" placeholder="${element.placeholder}" style="${styles}">`;
          break;
        case ELEMENT_TYPES.BUTTON:
          html += `<button style="${styles}">${element.content}</button>`;
          break;
        case ELEMENT_TYPES.TEXT:
          html += `<p style="${styles}">${element.content}</p>`;
          break;
        case ELEMENT_TYPES.HEADING:
          html += `<h2 style="${styles}">${element.content}</h2>`;
          break;
        case ELEMENT_TYPES.DIVIDER:
          html += `<hr style="${styles}">`;
          break;
        case ELEMENT_TYPES.CHECKBOX:
          html += `<label style="${styles}"><input type="checkbox"> ${element.content}</label>`;
          break;
      }

      html += `</div>\n`;
    });

    html += `  </div>
</body>
</html>`;

    // Create a blob and download
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "login-page.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Render draggable element
  const renderElement = (element: EditorElement) => {
    switch (element.type) {
      case ELEMENT_TYPES.INPUT:
        return (
          <input
            type="text"
            placeholder={element.placeholder}
            className="border p-2 rounded w-full"
            style={element.styles}
          />
        );
      case ELEMENT_TYPES.BUTTON:
        return (
          <button className="p-2 rounded w-full" style={element.styles}>
            {element.content}
          </button>
        );
      case ELEMENT_TYPES.TEXT:
        return <p style={element.styles}>{element.content}</p>;
      case ELEMENT_TYPES.HEADING:
        return <h2 style={element.styles}>{element.content}</h2>;
      case ELEMENT_TYPES.DIVIDER:
        return (
          <hr style={{ ...element.styles, border: "1px solid #e5e7eb" }} />
        );
      case ELEMENT_TYPES.CHECKBOX:
        return (
          <label className="flex items-center gap-2" style={element.styles}>
            <input type="checkbox" className="h-4 w-4" />
            <span>{element.content}</span>
          </label>
        );
      default:
        return null;
    }
  };

  // Get canvas width based on viewport
  const getCanvasWidth = () => {
    switch (viewport) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      case "desktop":
        return "100%";
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Login Page Builder</h1>

        <div className="flex gap-2">
          <Button
            variant={isPreviewMode ? "outline" : "default"}
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? "Edit Mode" : "Preview Mode"}
            {isPreviewMode ? (
              <Palette className="ml-2 h-4 w-4" />
            ) : (
              <Eye className="ml-2 h-4 w-4" />
            )}
          </Button>

          <Button variant="outline" size="sm" onClick={exportAsHTML}>
            Export HTML
            <Code className="ml-2 h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={handleClearCanvas}>
            Clear Canvas
            <Trash className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Toolbox - Hidden in preview mode */}
        {!isPreviewMode && (
          <Card className="p-4 w-64">
            <h2 className="font-bold mb-4">Elements</h2>
            <div className="flex flex-col gap-2">
              {Object.entries(ELEMENT_TYPES).map(([key, type]) => (
                <div
                  key={type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, type)}
                  className="bg-gray-400 p-2 rounded cursor-move hover:bg-gray-500 flex items-center"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Viewport controls */}
          <Card className="p-2">
            <div className="flex justify-center gap-2">
              <Button
                variant={viewport === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewport("mobile")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button
                variant={viewport === "tablet" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewport("tablet")}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewport === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewport("desktop")}
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Canvas */}
          <Card
            className={clsx(
              "flex-1 min-h-[500px] p-4 relative",
              !isPreviewMode &&
                isDragging &&
                "border-2 border-dashed border-blue-500"
            )}
            style={{
              width: getCanvasWidth(),
              margin: "0 auto",
              transition: "width 0.3s ease",
            }}
            onDragOver={(e) => !isPreviewMode && e.preventDefault()}
            onDrop={(e) => !isPreviewMode && handleDrop(e)}
            onClick={() => setSelectedElement(null)}
            onMouseMove={(e) => handleElementMove(e)}
            onMouseUp={stopMovingElement}
            onMouseLeave={stopMovingElement}
            ref={canvasRef}
          >
            <h2 className="font-bold mb-4">Login Page Preview</h2>
            <div className="relative border border-gray-200 rounded min-h-[400px] bg-white">
              {elements.map((element) => (
                <div
                  key={element.id}
                  className={clsx(
                    "absolute",
                    !isPreviewMode &&
                      selectedElement?.id === element.id &&
                      "ring-2 ring-blue-500"
                  )}
                  style={{
                    left: `${element.position.x}px`,
                    top: `${element.position.y}px`,
                  }}
                  onClick={(e) =>
                    !isPreviewMode && handleElementClick(element, e)
                  }
                >
                  {!isPreviewMode && selectedElement?.id === element.id && (
                    <div className="absolute -top-8 right-0 flex gap-1 z-10">
                      <div
                        className="bg-blue-500 text-white p-1 rounded-md cursor-pointer flex items-center justify-center"
                        onMouseDown={(e) => startMovingElement(e, element)}
                      >
                        <Move size={16} />
                      </div>
                      <div
                        className="bg-red-500 text-white p-1 rounded-md cursor-pointer flex items-center justify-center"
                        onClick={() => handleDeleteElement(element.id)}
                      >
                        <Trash size={16} />
                      </div>
                    </div>
                  )}
                  {renderElement(element)}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Properties panel - Hidden in preview mode */}
        {!isPreviewMode && (
          <Card className="p-4 w-72">
            <h2 className="font-bold mb-4">Properties</h2>
            {selectedElement ? (
              <Tabs defaultValue="content">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="content" className="flex-1">
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="style" className="flex-1">
                    Style
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content">
                  {(selectedElement.type === ELEMENT_TYPES.TEXT ||
                    selectedElement.type === ELEMENT_TYPES.BUTTON ||
                    selectedElement.type === ELEMENT_TYPES.HEADING ||
                    selectedElement.type === ELEMENT_TYPES.CHECKBOX) && (
                    <div className="mb-4">
                      <Label htmlFor="content">Content</Label>
                      <Input
                        id="content"
                        value={selectedElement.content || ""}
                        onChange={(e) =>
                          handleElementPropertyChange("content", e.target.value)
                        }
                      />
                    </div>
                  )}

                  {selectedElement.type === ELEMENT_TYPES.INPUT && (
                    <div className="mb-4">
                      <Label htmlFor="placeholder">Placeholder</Label>
                      <Input
                        id="placeholder"
                        value={selectedElement.placeholder || ""}
                        onChange={(e) =>
                          handleElementPropertyChange(
                            "placeholder",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="style">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="width">Width</Label>
                      <Input
                        id="width"
                        value={(selectedElement.styles.width as string) || ""}
                        onChange={(e) =>
                          handleElementPropertyChange(
                            "width",
                            e.target.value,
                            true
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="bgColor">Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="bgColor"
                          value={
                            (selectedElement.styles
                              .backgroundColor as string) || ""
                          }
                          onChange={(e) =>
                            handleElementPropertyChange(
                              "backgroundColor",
                              e.target.value,
                              true
                            )
                          }
                        />
                        <input
                          type="color"
                          value={
                            (selectedElement.styles
                              .backgroundColor as string) || "#ffffff"
                          }
                          onChange={(e) =>
                            handleElementPropertyChange(
                              "backgroundColor",
                              e.target.value,
                              true
                            )
                          }
                          className="w-10 h-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="textColor">Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="textColor"
                          value={(selectedElement.styles.color as string) || ""}
                          onChange={(e) =>
                            handleElementPropertyChange(
                              "color",
                              e.target.value,
                              true
                            )
                          }
                        />
                        <input
                          type="color"
                          value={
                            (selectedElement.styles.color as string) ||
                            "#000000"
                          }
                          onChange={(e) =>
                            handleElementPropertyChange(
                              "color",
                              e.target.value,
                              true
                            )
                          }
                          className="w-10 h-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="fontSize">Font Size (px)</Label>
                      <Input
                        id="fontSize"
                        value={
                          (selectedElement.styles.fontSize as string)?.replace(
                            "px",
                            ""
                          ) || "16"
                        }
                        onChange={(e) =>
                          handleElementPropertyChange(
                            "fontSize",
                            `${e.target.value}px`,
                            true
                          )
                        }
                        type="number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="padding">Padding (px)</Label>
                      <Input
                        id="padding"
                        value={
                          (selectedElement.styles.padding as string)?.replace(
                            "px",
                            ""
                          ) || "8"
                        }
                        onChange={(e) =>
                          handleElementPropertyChange(
                            "padding",
                            `${e.target.value}px`,
                            true
                          )
                        }
                        type="number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="borderRadius">Border Radius (px)</Label>
                      <Input
                        id="borderRadius"
                        value={
                          (
                            selectedElement.styles.borderRadius as string
                          )?.replace("px", "") || "4"
                        }
                        onChange={(e) =>
                          handleElementPropertyChange(
                            "borderRadius",
                            `${e.target.value}px`,
                            true
                          )
                        }
                        type="number"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center text-gray-500 my-8">
                Select an element to edit its properties
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default LoginPageBuilder;
