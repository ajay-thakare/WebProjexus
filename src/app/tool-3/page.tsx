"use client";
import React from "react";
// hellow
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
  Undo2,
  Redo2,
  PanelLeft,
  PanelRight,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  LayoutGrid,
  Settings,
  Link as LinkIcon,
  ArrowRight,
  Copy,
} from "lucide-react";
import clsx from "clsx";

// Define element types that can be dragged
const ELEMENT_TYPES = {
  INPUT: "INPUT",
  BUTTON: "BUTTON",
  TEXT: "TEXT",
  HEADING: "HEADING",
  CHECKBOX: "CHECKBOX",
  IMAGE: "IMAGE",
  LINK: "LINK",
  DIVIDER: "DIVIDER",
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
  href?: string; // For links
  position: {
    x: number;
    y: number;
  };
  targetPageId?: string; // For navigation between pages
};

// Define page structure
type Page = {
  id: string;
  name: string;
  elements: EditorElement[];
};

// Define history action
type HistoryAction = {
  pages: Page[];
  selectedPageId: string;
};

// Define viewport dimensions
const VIEWPORT_DIMENSIONS = {
  mobile: { width: 375 },
  tablet: { width: 768 },
  desktop: { width: 1200 },
};

const WebsiteBuilder = () => {
  // Pages state
  const [pages, setPages] = React.useState<Page[]>([
    { id: "page-1", name: "Home", elements: [] },
  ]);
  const [selectedPageId, setSelectedPageId] = React.useState("page-1");

  // Elements and selection states
  const [selectedElement, setSelectedElement] =
    React.useState<EditorElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isMovingElement, setIsMovingElement] = React.useState(false);
  const [movingOffset, setMovingOffset] = React.useState({ x: 0, y: 0 });

  // UI states
  const [isPreviewMode, setIsPreviewMode] = React.useState(false);
  const [showElementsPanel, setShowElementsPanel] = React.useState(true);
  const [showPropertiesPanel, setShowPropertiesPanel] = React.useState(true);
  const [viewport, setViewport] = React.useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");
  const [previousViewport, setPreviousViewport] = React.useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");

  // History tracking for undo/redo
  const [history, setHistory] = React.useState<HistoryAction[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const [isUndoRedoAction, setIsUndoRedoAction] = React.useState(false);

  const canvasRef = React.useRef<HTMLDivElement>(null);

  // Get current page elements
  const currentPageElements = React.useMemo(() => {
    const currentPage = pages.find((page) => page.id === selectedPageId);
    return currentPage?.elements || [];
  }, [pages, selectedPageId]);

  // Add state to history
  const addToHistory = React.useCallback(() => {
    if (isUndoRedoAction) {
      setIsUndoRedoAction(false);
      return;
    }

    // Create a deep copy of the current state
    const newHistoryAction: HistoryAction = {
      pages: JSON.parse(JSON.stringify(pages)),
      selectedPageId,
    };

    // Remove future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);

    // Add new action and update index
    setHistory([...newHistory, newHistoryAction]);
    setHistoryIndex(historyIndex + 1);
  }, [history, historyIndex, isUndoRedoAction, pages, selectedPageId]);

  // Handle undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setIsUndoRedoAction(true);
      const prevState = history[historyIndex - 1];
      setPages(prevState.pages);
      setSelectedPageId(prevState.selectedPageId);
      setHistoryIndex(historyIndex - 1);
      setSelectedElement(null);
    }
  };

  // Handle redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setIsUndoRedoAction(true);
      const nextState = history[historyIndex + 1];
      setPages(nextState.pages);
      setSelectedPageId(nextState.selectedPageId);
      setHistoryIndex(historyIndex + 1);
      setSelectedElement(null);
    }
  };

  // Save initial state to history on first render
  React.useEffect(() => {
    if (history.length === 0) {
      addToHistory();
    }
  }, [addToHistory, history.length]);

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
      if (currentPageElements.length > 0) {
        const scaleRatio =
          VIEWPORT_DIMENSIONS[newViewport].width /
          VIEWPORT_DIMENSIONS[viewport].width;

        const updatedPages = pages.map((page) => {
          if (page.id === selectedPageId) {
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
        });

        setPages(updatedPages);
        addToHistory();
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
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      styles: {
        padding: "8px",
        paddingTop: "8px",
        paddingRight: "8px",
        paddingBottom: "8px",
        paddingLeft: "8px",
        margin: "4px",
        width: getDefaultWidth(type),
        backgroundColor:
          type === ELEMENT_TYPES.BUTTON ? "#3B82F6" : "transparent",
        color: type === ELEMENT_TYPES.BUTTON ? "white" : "black",
        borderRadius: "4px",
        fontSize: type === ELEMENT_TYPES.HEADING ? "24px" : "16px",
        fontWeight: type === ELEMENT_TYPES.HEADING ? "bold" : "normal",
        border:
          type === ELEMENT_TYPES.INPUT
            ? "1px solid #e5e7eb"
            : type === ELEMENT_TYPES.DIVIDER
            ? "none"
            : "none",
        borderBottom:
          type === ELEMENT_TYPES.DIVIDER ? "1px solid #e5e7eb" : undefined,
      },
      placeholder: type === ELEMENT_TYPES.INPUT ? "Enter text..." : "",
      content: getDefaultContent(type),
      href: type === ELEMENT_TYPES.LINK ? "#" : undefined,
      position: { x: constrainedX, y: constrainedY },
    };

    const updatedPages = pages.map((page) => {
      if (page.id === selectedPageId) {
        return {
          ...page,
          elements: [...page.elements, newElement],
        };
      }
      return page;
    });

    setPages(updatedPages);
    setSelectedElement(newElement);
    setIsDragging(false);
    addToHistory();
  };

  // Get default width based on element type
  const getDefaultWidth = (type: ElementType): string => {
    switch (type) {
      case ELEMENT_TYPES.BUTTON:
        return "200px";
      case ELEMENT_TYPES.DIVIDER:
        return "100%";
      case ELEMENT_TYPES.IMAGE:
        return "300px";
      default:
        return "300px";
    }
  };

  // Get default width as number for constraint calculations
  const getDefaultWidthNumber = (type: ElementType): number => {
    switch (type) {
      case ELEMENT_TYPES.BUTTON:
        return 200;
      case ELEMENT_TYPES.DIVIDER:
        return 300;
      case ELEMENT_TYPES.IMAGE:
        return 300;
      default:
        return 300;
    }
  };

  // Get default content based on element type
  const getDefaultContent = (type: ElementType): string => {
    switch (type) {
      case ELEMENT_TYPES.BUTTON:
        return "Click Me";
      case ELEMENT_TYPES.TEXT:
        return "Add your text here";
      case ELEMENT_TYPES.HEADING:
        return "Heading";
      case ELEMENT_TYPES.CHECKBOX:
        return "Checkbox option";
      case ELEMENT_TYPES.LINK:
        return "Link Text";
      case ELEMENT_TYPES.IMAGE:
        return "Image Placeholder";
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
    const updatedPages = pages.map((page) => {
      if (page.id === selectedPageId) {
        return {
          ...page,
          elements: page.elements.filter((el) => el.id !== elementId),
        };
      }
      return page;
    });

    setPages(updatedPages);
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
    addToHistory();
  };

  // Handle element property change
  const handleElementPropertyChange = (
    property: keyof EditorElement | keyof EditorElement["styles"],
    value: any,
    isStyle = false
  ) => {
    if (!selectedElement) return;

    const updatedPages = pages.map((page) => {
      if (page.id === selectedPageId) {
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
    });

    setPages(updatedPages);

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

    const updatedPages = pages.map((page) => {
      if (page.id === selectedPageId) {
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
    });

    setPages(updatedPages);

    // Update selected element position
    setSelectedElement({
      ...selectedElement,
      position: { x, y },
    });
  };

  // Stop moving an element
  const stopMovingElement = () => {
    if (isMovingElement) {
      addToHistory();
      setIsMovingElement(false);
    }
  };

  // Clear canvas
  const handleClearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the current page?")) {
      const updatedPages = pages.map((page) => {
        if (page.id === selectedPageId) {
          return {
            ...page,
            elements: [],
          };
        }
        return page;
      });

      setPages(updatedPages);
      setSelectedElement(null);
      addToHistory();
    }
  };

  // Add new page
  const handleAddPage = () => {
    const pageName = prompt("Enter page name:", "New Page");
    if (pageName) {
      const newPageId = `page-${Date.now()}`;
      const newPage = {
        id: newPageId,
        name: pageName,
        elements: [],
      };

      setPages([...pages, newPage]);
      setSelectedPageId(newPageId);
      setSelectedElement(null);
      addToHistory();
    }
  };

  // Delete current page
  const handleDeletePage = () => {
    if (pages.length <= 1) {
      alert("Cannot delete the only page");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete the "${
          pages.find((p) => p.id === selectedPageId)?.name
        }" page?`
      )
    ) {
      const updatedPages = pages.filter((page) => page.id !== selectedPageId);
      setPages(updatedPages);
      setSelectedPageId(updatedPages[0].id);
      setSelectedElement(null);
      addToHistory();
    }
  };

  // Rename current page
  const handleRenamePage = () => {
    const currentPage = pages.find((page) => page.id === selectedPageId);
    if (!currentPage) return;

    const newName = prompt("Enter new page name:", currentPage.name);
    if (newName) {
      const updatedPages = pages.map((page) => {
        if (page.id === selectedPageId) {
          return {
            ...page,
            name: newName,
          };
        }
        return page;
      });

      setPages(updatedPages);
      addToHistory();
    }
  };

  // Duplicate element
  const handleDuplicateElement = (element: EditorElement) => {
    const duplicatedElement: EditorElement = {
      ...JSON.parse(JSON.stringify(element)),
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20,
      },
    };

    const updatedPages = pages.map((page) => {
      if (page.id === selectedPageId) {
        return {
          ...page,
          elements: [...page.elements, duplicatedElement],
        };
      }
      return page;
    });

    setPages(updatedPages);
    setSelectedElement(duplicatedElement);
    addToHistory();
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
    a.download = "website-design.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Load design from JSON
  const loadDesign = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const designData = JSON.parse(event.target?.result as string);
        if (designData.pages) {
          setPages(designData.pages);
          setSelectedPageId(designData.pages[0].id);
          setViewport(designData.viewport || "desktop");
          setSelectedElement(null);
          addToHistory();
        }
      } catch (err) {
        console.error("Error loading design:", err);
        alert("Error loading design file. Please try again with a valid file.");
      }
    };
    reader.readAsText(file);
  };

  // Export HTML
  const exportHTML = () => {
    // Create basic HTML structure
    let html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Exported Website</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 0; }
        .page { display: none; padding: 20px; min-height: 100vh; }
        .page.active { display: block; }
        .element { position: absolute; }
      </style>
    </head>
    <body>
      <nav style="background: #f0f0f0; padding: 10px;">
        ${pages
          .map(
            (page) =>
              `<button onclick="showPage('${page.id}')">${page.name}</button>`
          )
          .join(" ")}
      </nav>
    
      ${pages
        .map(
          (page) =>
            `<div class="page" id="${page.id}">${page.name} Content</div>`
        )
        .join("")}
    
      <script>
        function showPage(id) {
          document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
          document.getElementById(id).classList.add('active');
        }
    
        // Show the first page by default
        showPage('${pages[0].id}');
      </script>
    </body>
    </html>`;

    // Add each page with its elements
    pages.forEach((page, index) => {
      html += `
    <div id="${page.id}" class="page ${index === 0 ? "active" : ""}">
      <div style="position: relative; min-height: 500px;">
  `;

      // Add elements
      page.elements.forEach((element) => {
        const styles = Object.entries(element.styles)
          .map(
            ([key, value]) =>
              `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value}`
          )
          .join("; ");

        html += `<div class="element" style="left: ${element.position.x}px; top: ${element.position.y}px; ${styles}">`;

        // Render element based on type
        switch (element.type) {
          case ELEMENT_TYPES.INPUT:
            html += `<input type="text" placeholder="${
              element.placeholder || ""
            }" />`;
            break;
          case ELEMENT_TYPES.BUTTON:
            if (element.targetPageId) {
              html += `<button onclick="showPage('${element.targetPageId}')">${element.content}</button>`;
            } else {
              html += `<button>${element.content}</button>`;
            }
            break;
          case ELEMENT_TYPES.TEXT:
            html += `<p>${element.content}</p>`;
            break;
          case ELEMENT_TYPES.HEADING:
            html += `<h2>${element.content}</h2>`;
            break;
          case ELEMENT_TYPES.CHECKBOX:
            html += `<label><input type="checkbox" /> ${element.content}</label>`;
            break;
          case ELEMENT_TYPES.LINK:
            html += `<a href="${element.href || "#"}">${element.content}</a>`;
            break;
          case ELEMENT_TYPES.IMAGE:
            html += `<img src="/api/placeholder/400/300" alt="${element.content}" />`;
            break;
          case ELEMENT_TYPES.DIVIDER:
            html += `<hr style="width: 100%;" />`;
            break;
        }

        html += `</div>`;
      });

      html += `
      </div>
    </div>`;
    });

    // Add page navigation script
    html += `
    <script>
        function showPage(pageId) {
            // Hide all pages
            const pages = document.getElementsByClassName('page');
            for (let i = 0; i < pages.length; i++) {
                pages[i].classList.remove('active');
            }
            // Show selected page
            document.getElementById(pageId).classList.add('active');
        }
    </script>
</body>
</html>`;

    // Create download link
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website.html";
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
      case ELEMENT_TYPES.CHECKBOX:
        return (
          <label className="flex items-center gap-2" style={element.styles}>
            <input type="checkbox" className="h-4 w-4" />
            <span>{element.content}</span>
          </label>
        );
      case ELEMENT_TYPES.LINK:
        return (
          <a
            href={element.href}
            className="text-blue-500 underline"
            style={element.styles}
          >
            {element.content}
          </a>
        );
      case ELEMENT_TYPES.IMAGE:
        return (
          <div style={element.styles}>
            <img
              src="/api/placeholder/400/300"
              alt={element.content}
              className="w-full h-auto"
            />
          </div>
        );
      case ELEMENT_TYPES.DIVIDER:
        return (
          <div
            style={{
              ...element.styles,
              height: "1px",
              background: "#e5e7eb",
              width: "100%",
            }}
          />
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
        <h1 className="text-2xl font-bold">Website Builder</h1>

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

          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
          >
            <Undo2 className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
          >
            <Redo2 className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={saveDesign}>
            <Save className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("load-design")?.click()}
          >
            <label htmlFor="load-design" className="cursor-pointer">
              <Download className="h-4 w-4" />
            </label>
          </Button>
          <input
            id="load-design"
            type="file"
            accept=".json"
            onChange={loadDesign}
            className="hidden"
          />

          <Button variant="outline" size="sm" onClick={exportHTML}>
            <Code className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Page tabs */}
      <div className="flex gap-2 items-center bg-gray-100 p-2 rounded">
        <div className="flex-1 flex gap-2 overflow-x-auto py-1">
          {pages.map((page) => (
            <Button
              key={page.id}
              variant={selectedPageId === page.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPageId(page.id)}
            >
              {page.name}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleAddPage}>
            <PlusCircle className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRenamePage}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeletePage}
            disabled={pages.length <= 1}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Toolbox - Hidden in preview mode */}
        {!isPreviewMode && showElementsPanel && (
          <Card className="p-4 w-64">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold">Elements</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowElementsPanel(false)}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </div>
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
          {/* Show hide elements panel button when hidden */}
          {!isPreviewMode && !showElementsPanel && (
            <Button
              variant="outline"
              size="sm"
              className="w-8 h-8 fixed left-4 top-24 z-10"
              onClick={() => setShowElementsPanel(true)}
            >
              <PanelRight className="h-4 w-4" />
            </Button>
          )}

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
              <Button variant="outline" size="sm" onClick={handleClearCanvas}>
                Clear Canvas
                <Trash className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Canvas */}
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
              overflow: "hidden",
            }}
            onDragOver={(e) => !isPreviewMode && e.preventDefault()}
            onDrop={(e) => !isPreviewMode && handleDrop(e)}
            onClick={() => setSelectedElement(null)}
            onMouseMove={(e) => handleElementMove(e)}
            onMouseUp={stopMovingElement}
            onMouseLeave={stopMovingElement}
            ref={canvasRef}
          >
            <h2 className="font-bold mb-4">
              {pages.find((p) => p.id === selectedPageId)?.name || "Page"}{" "}
              Preview
            </h2>
            <div className="relative border border-gray-200 rounded min-h-[400px] bg-white">
              {currentPageElements.map((element) => (
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
                        className="bg-blue-500 text-white p-1 rounded-md cursor-pointer flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateElement(element);
                        }}
                      >
                        <Copy size={16} />
                      </div>
                      <div
                        className="bg-red-500 text-white p-1 rounded-md cursor-pointer flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteElement(element.id);
                        }}
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
        {!isPreviewMode && showPropertiesPanel && (
          <Card className="p-4 w-80">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold">Properties</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPropertiesPanel(false)}
              >
                <PanelRight className="h-4 w-4" />
              </Button>
            </div>

            {selectedElement ? (
              <Tabs defaultValue="content">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="content" className="flex-1">
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="style" className="flex-1">
                    Style
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="flex-1">
                    Advanced
                  </TabsTrigger>
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

                  {selectedElement.type === ELEMENT_TYPES.LINK && (
                    <div className="mb-4">
                      <Label htmlFor="href">URL</Label>
                      <Input
                        id="href"
                        value={selectedElement.href || ""}
                        onChange={(e) =>
                          handleElementPropertyChange("href", e.target.value)
                        }
                      />
                    </div>
                  )}

                  {selectedElement.type === ELEMENT_TYPES.BUTTON && (
                    <div className="mb-4">
                      <Label htmlFor="targetPage">Target Page</Label>
                      <Select
                        value={selectedElement.targetPageId || ""}
                        onValueChange={(value) =>
                          handleElementPropertyChange("targetPageId", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a page" />
                        </SelectTrigger>
                        <SelectContent>
                          {pages.map((page) => (
                            <SelectItem key={page.id} value={page.id}>
                              {page.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="style">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="backgroundColor">Background Color</Label>
                      <Input
                        id="backgroundColor"
                        type="color"
                        value={
                          selectedElement.styles.backgroundColor || "#ffffff"
                        }
                        onChange={(e) =>
                          handleElementPropertyChange(
                            "backgroundColor",
                            e.target.value,
                            true
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="color">Text Color</Label>
                      <Input
                        id="color"
                        type="color"
                        value={selectedElement.styles.color || "#000000"}
                        onChange={(e) =>
                          handleElementPropertyChange(
                            "color",
                            e.target.value,
                            true
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="fontSize">Font Size (px)</Label>
                      <Input
                        id="fontSize"
                        type="number"
                        value={
                          parseInt(selectedElement.styles.fontSize as string) ||
                          16
                        }
                        onChange={(e) =>
                          handleElementPropertyChange(
                            "fontSize",
                            `${e.target.value}px`,
                            true
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="width">Width</Label>
                      <Input
                        id="width"
                        value={selectedElement.styles.width || "100%"}
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
                      <Label htmlFor="padding">Padding (px)</Label>
                      <Input
                        id="padding"
                        type="number"
                        value={
                          parseInt(selectedElement.styles.padding as string) ||
                          8
                        }
                        onChange={(e) =>
                          handleElementPropertyChange(
                            "padding",
                            `${e.target.value}px`,
                            true
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="borderRadius">Border Radius (px)</Label>
                      <Input
                        id="borderRadius"
                        type="number"
                        value={
                          parseInt(
                            selectedElement.styles.borderRadius as string
                          ) || 4
                        }
                        onChange={(e) =>
                          handleElementPropertyChange(
                            "borderRadius",
                            `${e.target.value}px`,
                            true
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="bold">Bold</Label>
                      <Switch
                        id="bold"
                        checked={selectedElement.styles.fontWeight === "bold"}
                        onCheckedChange={(checked) =>
                          handleElementPropertyChange(
                            "fontWeight",
                            checked ? "bold" : "normal",
                            true
                          )
                        }
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced">
                  <div className="space-y-4">
                    {/* Position X */}
                    <div>
                      <Label htmlFor="positionX">Position X (px)</Label>
                      <Input
                        id="positionX"
                        type="number"
                        value={selectedElement.position?.x || 0}
                        onChange={(e) =>
                          handleElementPropertyChange("position", {
                            ...selectedElement.position,
                            x: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>

                    {/* Position Y */}
                    <div>
                      <Label htmlFor="positionY">Position Y (px)</Label>
                      <Input
                        id="positionY"
                        type="number"
                        value={selectedElement.position?.y || 0}
                        onChange={(e) =>
                          handleElementPropertyChange("position", {
                            ...selectedElement.position,
                            y: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>

                    {/* Custom CSS */}
                    <div>
                      <Label htmlFor="customStyles">Custom CSS</Label>
                      <textarea
                        id="customStyles"
                        className="w-full border rounded p-2 text-sm h-24"
                        value={Object.entries(selectedElement.styles || {})
                          .map(([key, value]) => `${key}: ${value};`)
                          .join("\n")}
                        onChange={(e) => {
                          const styles = e.target.value
                            .split("\n")
                            .reduce((acc, line) => {
                              const [key, value] = line
                                .split(":")
                                .map((s) => s.trim());
                              if (key && value) {
                                acc[key] = value.endsWith(";")
                                  ? value.slice(0, -1)
                                  : value;
                              }
                              return acc;
                            }, {} as { [key: string]: string });

                          handleElementPropertyChange("styles", styles);
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select an element to edit its properties
              </div>
            )}
          </Card>
        )}

        {/* Show hide properties panel button when hidden */}
        {!isPreviewMode && !showPropertiesPanel && (
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 fixed right-4 top-24 z-10"
            onClick={() => setShowPropertiesPanel(true)}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default WebsiteBuilder;
