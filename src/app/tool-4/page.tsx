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
  Save,
  Download,
  PlusCircle,
  Home,
  LogIn,
  Link as LinkIcon,
} from "lucide-react";
import clsx from "clsx";

// element types that can be dragged
const ELEMENT_TYPES = {
  INPUT: "INPUT",
  BUTTON: "BUTTON",
  TEXT: "TEXT",
  HEADING: "HEADING",
  CHECKBOX: "CHECKBOX",
  LINK: "LINK",
} as const;

// type for the element types
type ElementType = (typeof ELEMENT_TYPES)[keyof typeof ELEMENT_TYPES];

// structure of an editor element
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
  targetPage?: string;
};

// Define page structure
type Page = {
  id: string;
  name: string;
  elements: EditorElement[];
};

const VIEWPORT_DIMENSIONS = {
  mobile: { width: 375 },
  tablet: { width: 768 },
  desktop: { width: 1200 },
};

const PageBuilder = () => {
  // Store multiple pages instead of just elements
  const [pages, setPages] = React.useState<Page[]>([
    { id: "home", name: "Home Page", elements: [] },
    { id: "login", name: "Login Page", elements: [] },
  ]);
  const [currentPageId, setCurrentPageId] = React.useState<string>("login");
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
  const [previousViewport, setPreviousViewport] = React.useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");

  // Get current page elements
  const currentPage =
    pages.find((page) => page.id === currentPageId) || pages[0];
  const elements = currentPage.elements;

  // Handle viewport change with proper scaling
  const handleViewportChange = (
    newViewport: "mobile" | "tablet" | "desktop"
  ) => {
    if (viewport !== newViewport) {
      // Store the old viewport to calculate scaling ratios
      setPreviousViewport(viewport);

      // Update the current viewport
      setViewport(newViewport);

      // Scale element positions based on viewport change ratio
      if (elements.length > 0) {
        const scaleRatio =
          VIEWPORT_DIMENSIONS[newViewport].width /
          VIEWPORT_DIMENSIONS[viewport].width;

        setPages(
          pages.map((page) => {
            if (page.id === currentPageId) {
              return {
                ...page,
                elements: page.elements.map((element) => {
                  return {
                    ...element,
                    position: {
                      x: element.position.x * scaleRatio,
                      y: element.position.y,
                    },
                  };
                }),
              };
            }
            return page;
          })
        );
      }
    }
  };

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

    // Ensure the element is dropped within canvas bounds
    const constrainedX = Math.min(
      x,
      canvasRect.width - getDefaultWidthNumber(type)
    );
    const constrainedY = Math.min(y, canvasRect.height - 50);

    const newElement: EditorElement = {
      id: Math.random().toString(),
      type,
      styles: {
        padding: "8px",
        margin: "4px",
        width: getDefaultWidth(type),
        backgroundColor:
          type === ELEMENT_TYPES.BUTTON || type === ELEMENT_TYPES.LINK
            ? "#3B82F6"
            : "transparent",
        color:
          type === ELEMENT_TYPES.BUTTON || type === ELEMENT_TYPES.LINK
            ? "white"
            : "black",
        borderRadius: "4px",
        fontSize: type === ELEMENT_TYPES.HEADING ? "24px" : "16px",
        fontWeight: type === ELEMENT_TYPES.HEADING ? "bold" : "normal",
        border: type === ELEMENT_TYPES.INPUT ? "1px solid #e5e7eb" : "none",
        cursor:
          type === ELEMENT_TYPES.BUTTON || type === ELEMENT_TYPES.LINK
            ? "pointer"
            : "auto",
        textDecoration: type === ELEMENT_TYPES.LINK ? "none" : "auto",
      },
      placeholder: type === ELEMENT_TYPES.INPUT ? "Enter text..." : "",
      content: getDefaultContent(type),
      position: { x: constrainedX, y: constrainedY },
      targetPage:
        type === ELEMENT_TYPES.LINK
          ? currentPageId === "login"
            ? "home"
            : "login"
          : undefined,
    };

    setPages(
      pages.map((page) => {
        if (page.id === currentPageId) {
          return {
            ...page,
            elements: [...page.elements, newElement],
          };
        }
        return page;
      })
    );

    setSelectedElement(newElement);
    setIsDragging(false);
  };

  // Switch between pages
  const handlePageChange = (pageId: string) => {
    setCurrentPageId(pageId);
    setSelectedElement(null);
  };

  // Add a new page
  const addNewPage = () => {
    const newPageName = prompt("Enter name for new page:");
    if (newPageName) {
      const newPageId = newPageName.toLowerCase().replace(/\s+/g, "-");
      setPages([...pages, { id: newPageId, name: newPageName, elements: [] }]);
    }
  };

  // Get default width based on element type
  const getDefaultWidth = (type: ElementType): string => {
    switch (type) {
      case ELEMENT_TYPES.BUTTON:
      case ELEMENT_TYPES.LINK:
        return "200px";
      default:
        return "300px";
    }
  };

  // Get default width as number for constraint calculations
  const getDefaultWidthNumber = (type: ElementType): number => {
    switch (type) {
      case ELEMENT_TYPES.BUTTON:
      case ELEMENT_TYPES.LINK:
        return 200;
      default:
        return 300;
    }
  };

  // Get default content based on element type
  const getDefaultContent = (type: ElementType): string => {
    switch (type) {
      case ELEMENT_TYPES.BUTTON:
        return currentPageId === "login" ? "Login" : "Submit";
      case ELEMENT_TYPES.TEXT:
        return currentPageId === "login"
          ? "Welcome back! Please log in to your account."
          : "Welcome to our website! Explore our services.";
      case ELEMENT_TYPES.HEADING:
        return currentPageId === "login"
          ? "Login to Your Account"
          : "Welcome to Our Website";
      case ELEMENT_TYPES.CHECKBOX:
        return "Remember me";
      case ELEMENT_TYPES.LINK:
        return currentPageId === "login"
          ? "Go to Home Page"
          : "Go to Login Page";
      default:
        return "";
    }
  };

  // Handle element click for selection
  const handleElementClick = (element: EditorElement, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement(element);
  };

  // Handle element deletion
  const handleDeleteElement = (elementId: string) => {
    setPages(
      pages.map((page) => {
        if (page.id === currentPageId) {
          return {
            ...page,
            elements: page.elements.filter((el) => el.id !== elementId),
          };
        }
        return page;
      })
    );

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

    setPages(
      pages.map((page) => {
        if (page.id === currentPageId) {
          return {
            ...page,
            elements: page.elements.map((el) => {
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
            }),
          };
        }
        return page;
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

  // Start moving an element
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

  // Handle element movement with constraints
  const handleElementMove = (e: React.MouseEvent) => {
    if (!isMovingElement || !selectedElement || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();

    // Calculate new position
    let x = Math.max(0, e.clientX - canvasRect.left - movingOffset.x);
    let y = Math.max(0, e.clientY - canvasRect.top - movingOffset.y);

    // Get element width (defaulting to 200 if not a number)
    let elementWidth = 200;
    if (typeof selectedElement.styles.width === "string") {
      const match = selectedElement.styles.width.match(/(\d+)/);
      if (match) {
        elementWidth = parseInt(match[0], 10);
      }
    }

    // Constrain position to canvas bounds
    x = Math.min(x, canvasRect.width - elementWidth);
    y = Math.min(y, canvasRect.height - 50);

    setPages(
      pages.map((page) => {
        if (page.id === currentPageId) {
          return {
            ...page,
            elements: page.elements.map((el) => {
              if (el.id === selectedElement.id) {
                return {
                  ...el,
                  position: { x, y },
                };
              }
              return el;
            }),
          };
        }
        return page;
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
    if (
      window.confirm(`Are you sure you want to clear the ${currentPage.name}?`)
    ) {
      setPages(
        pages.map((page) => {
          if (page.id === currentPageId) {
            return {
              ...page,
              elements: [],
            };
          }
          return page;
        })
      );
      setSelectedElement(null);
    }
  };

  // Save design as JSON
  const saveDesign = () => {
    const designData = {
      pages,
      viewport,
    };

    const blob = new Blob([JSON.stringify(designData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "page-design.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Navigate between pages in preview mode
  const handlePageNavigation = (targetPageId: string) => {
    if (isPreviewMode) {
      setCurrentPageId(targetPageId);
    }
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
      case ELEMENT_TYPES.CHECKBOX:
        return (
          <label className="flex items-center gap-2" style={element.styles}>
            <input type="checkbox" className="h-4 w-4" />
            <span>{element.content}</span>
          </label>
        );
      case ELEMENT_TYPES.LINK:
        return (
          <div
            className="p-2 rounded w-full text-center"
            style={element.styles}
            onClick={
              isPreviewMode
                ? () => handlePageNavigation(element.targetPage || "")
                : undefined
            }
          >
            {element.content}
          </div>
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
        <h1 className="text-2xl font-bold">Page Builder</h1>

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

          <Button variant="outline" size="sm" onClick={saveDesign}>
            Save Design
            <Save className="ml-2 h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={handleClearCanvas}>
            Clear Canvas
            <Trash className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="flex items-center gap-2 mb-2">
        <div className="font-bold">Pages:</div>
        <div className="flex gap-2">
          {pages.map((page) => (
            <Button
              key={page.id}
              variant={currentPageId === page.id ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page.id)}
            >
              {page.id === "home" ? (
                <Home className="mr-1 h-4 w-4" />
              ) : page.id === "login" ? (
                <LogIn className="mr-1 h-4 w-4" />
              ) : null}
              {page.name}
            </Button>
          ))}
          {!isPreviewMode && (
            <Button variant="outline" size="sm" onClick={addNewPage}>
              <PlusCircle className="h-4 w-4" />
            </Button>
          )}
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
                  {type === "LINK" && <LinkIcon className="mr-2 h-4 w-4" />}
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
                onClick={() => handleViewportChange("mobile")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button
                variant={viewport === "tablet" ? "default" : "outline"}
                size="sm"
                onClick={() => handleViewportChange("tablet")}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewport === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => handleViewportChange("desktop")}
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
              overflow: "hidden", // Prevent content from spilling out
            }}
            onDragOver={(e) => !isPreviewMode && e.preventDefault()}
            onDrop={(e) => !isPreviewMode && handleDrop(e)}
            onClick={() => setSelectedElement(null)}
            onMouseMove={(e) => handleElementMove(e)}
            onMouseUp={stopMovingElement}
            onMouseLeave={stopMovingElement}
            ref={canvasRef}
          >
            <h2 className="font-bold mb-4">{currentPage.name} Preview</h2>
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
                    maxWidth: `${
                      viewport === "mobile"
                        ? "350px"
                        : viewport === "tablet"
                        ? "740px"
                        : "100%"
                    }`,
                  }}
                  onClick={(e) =>
                    !isPreviewMode
                      ? handleElementClick(element, e)
                      : element.type === ELEMENT_TYPES.LINK &&
                        element.targetPage
                      ? handlePageNavigation(element.targetPage)
                      : undefined
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
                  {selectedElement.type === ELEMENT_TYPES.LINK && (
                    <TabsTrigger value="link" className="flex-1">
                      Link
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="content">
                  {(selectedElement.type === ELEMENT_TYPES.TEXT ||
                    selectedElement.type === ELEMENT_TYPES.BUTTON ||
                    selectedElement.type === ELEMENT_TYPES.HEADING ||
                    selectedElement.type === ELEMENT_TYPES.CHECKBOX ||
                    selectedElement.type === ELEMENT_TYPES.LINK) && (
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

                  <div className="mb-4">
                    <Label htmlFor="position">Position</Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label htmlFor="posX" className="text-xs">
                          X
                        </Label>
                        <Input
                          id="posX"
                          type="number"
                          value={Math.round(selectedElement.position.x)}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              const canvasWidth =
                                viewport === "mobile"
                                  ? 375
                                  : viewport === "tablet"
                                  ? 768
                                  : 1200;
                              const constrainedX = Math.max(
                                0,
                                Math.min(value, canvasWidth)
                              );
                              handleElementPropertyChange("position", {
                                ...selectedElement.position,
                                x: constrainedX,
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="posY" className="text-xs">
                          Y
                        </Label>
                        <Input
                          id="posY"
                          type="number"
                          value={Math.round(selectedElement.position.y)}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              const constrainedY = Math.max(0, value);
                              handleElementPropertyChange("position", {
                                ...selectedElement.position,
                                y: constrainedY,
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
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

                    {(selectedElement.type === ELEMENT_TYPES.INPUT ||
                      selectedElement.type === ELEMENT_TYPES.BUTTON ||
                      selectedElement.type === ELEMENT_TYPES.LINK) && (
                      <div>
                        <Label htmlFor="border">Border</Label>
                        <Input
                          id="border"
                          value={
                            (selectedElement.styles.border as string) ||
                            "1px solid #e5e7eb"
                          }
                          onChange={(e) =>
                            handleElementPropertyChange(
                              "border",
                              e.target.value,
                              true
                            )
                          }
                        />
                      </div>
                    )}

                    {(selectedElement.type === ELEMENT_TYPES.BUTTON ||
                      selectedElement.type === ELEMENT_TYPES.LINK) && (
                      <div>
                        <Label htmlFor="cursor">Cursor</Label>
                        <select
                          id="cursor"
                          className="w-full p-2 border rounded"
                          value={
                            (selectedElement.styles.cursor as string) ||
                            "pointer"
                          }
                          onChange={(e) =>
                            handleElementPropertyChange(
                              "cursor",
                              e.target.value,
                              true
                            )
                          }
                        >
                          <option value="pointer">Pointer</option>
                          <option value="default">Default</option>
                          <option value="hand">Hand</option>
                        </select>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {selectedElement.type === ELEMENT_TYPES.LINK && (
                  <TabsContent value="link">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="targetPage">Target Page</Label>
                        <select
                          id="targetPage"
                          className="w-full p-2 border rounded"
                          value={selectedElement.targetPage || ""}
                          onChange={(e) =>
                            handleElementPropertyChange(
                              "targetPage",
                              e.target.value
                            )
                          }
                        >
                          {pages.map((page) => (
                            <option key={page.id} value={page.id}>
                              {page.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mt-2">
                          This link will navigate to the selected page when
                          clicked in preview mode.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            ) : (
              <div className="text-center text-gray-500 my-8">
                Select an element to edit its properties
              </div>
            )}

            {!selectedElement && elements.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Canvas Settings</h3>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="canvasWidth">Canvas Width</Label>
                    <div className="text-sm text-gray-600">
                      {viewport === "mobile"
                        ? "375px"
                        : viewport === "tablet"
                        ? "768px"
                        : "Full width"}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="elementCount">Elements</Label>
                    <div className="text-sm text-gray-600">
                      {elements.length}{" "}
                      {elements.length === 1 ? "element" : "elements"} on canvas
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!selectedElement && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Navigation Guide</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>To add navigation between pages:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      Drag a <strong>Link</strong> element onto the canvas
                    </li>
                    <li>
                      Select the link element and go to the{" "}
                      <strong>Link</strong> tab
                    </li>
                    <li>Choose the target page from the dropdown</li>
                    <li>
                      Switch to <strong>Preview Mode</strong> to test navigation
                    </li>
                  </ol>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default PageBuilder;
