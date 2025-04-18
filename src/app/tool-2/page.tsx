"use client";
import React from "react";
import { Card } from "@/components/ui/card";
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
  Copy,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Layout,
  Image,
  ChevronDown,
  ChevronUp,
  Layers,
  Grid,
  Paperclip,
  Sliders,
} from "lucide-react";
import clsx from "clsx";

// Define element types that can be dragged
const ELEMENT_TYPES = {
  INPUT: "INPUT",
  PASSWORD: "PASSWORD",
  BUTTON: "BUTTON",
  TEXT: "TEXT",
  HEADING: "HEADING",
  DIVIDER: "DIVIDER",
  CHECKBOX: "CHECKBOX",
  LINK: "LINK",
  IMAGE: "IMAGE",
  SOCIAL: "SOCIAL",
} as const;

// Define type for the element types
type ElementType = (typeof ELEMENT_TYPES)[keyof typeof ELEMENT_TYPES];

// Define theme options
const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  BLUE: "blue",
  GREEN: "green",
  PURPLE: "purple",
} as const;

type ThemeType = (typeof THEMES)[keyof typeof THEMES];

// Define social login buttons
const SOCIAL_PROVIDERS = {
  GOOGLE: "Google",
  FACEBOOK: "Facebook",
  APPLE: "Apple",
  TWITTER: "Twitter",
} as const;

type SocialProviderType =
  (typeof SOCIAL_PROVIDERS)[keyof typeof SOCIAL_PROVIDERS];

// Define templates
const TEMPLATES = {
  CLEAN: "Clean",
  MODERN: "Modern",
  CORPORATE: "Corporate",
  MINIMAL: "Minimal",
} as const;

type TemplateType = (typeof TEMPLATES)[keyof typeof TEMPLATES];

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
  zIndex: number;
  required?: boolean;
  validation?: string;
  provider?: SocialProviderType;
  url?: string;
};

// Define viewport dimensions
const VIEWPORT_DIMENSIONS = {
  mobile: { width: 375 },
  tablet: { width: 768 },
  desktop: { width: 1200 },
};

// Define history state structure
type HistoryState = {
  elements: EditorElement[];
  viewport: "mobile" | "tablet" | "desktop";
};

const LoginPageBuilder = () => {
  const [elements, setElements] = React.useState<EditorElement[]>([]);
  const [selectedElement, setSelectedElement] =
    React.useState<EditorElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isPreviewMode, setIsPreviewMode] = React.useState(false);
  const [showGrid, setShowGrid] = React.useState<boolean>(false);
  const [viewport, setViewport] = React.useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");
  const [isMovingElement, setIsMovingElement] = React.useState(false);
  const [movingOffset, setMovingOffset] = React.useState({ x: 0, y: 0 });
  const [theme, setTheme] = React.useState<ThemeType>(THEMES.LIGHT);
  const [history, setHistory] = React.useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const [copiedElement, setCopiedElement] =
    React.useState<EditorElement | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<TemplateType | null>(null);
  const canvasRef = React.useRef<HTMLDivElement>(null);

  // Add state to track if history is being updated programmatically
  const isHistoryUpdate = React.useRef(false);

  // Handle history updates
  const addToHistory = (
    elements: EditorElement[],
    viewport: "mobile" | "tablet" | "desktop"
  ) => {
    if (isHistoryUpdate.current) return;

    const newState: HistoryState = {
      elements: JSON.parse(JSON.stringify(elements)),
      viewport,
    };

    // Remove any future states if we're not at the end of history
    const newHistory = history.slice(0, historyIndex + 1);

    setHistory([...newHistory, newState]);
    setHistoryIndex(newHistory.length);
  };

  // Undo action
  const handleUndo = () => {
    if (historyIndex > 0) {
      isHistoryUpdate.current = true;
      const prevState = history[historyIndex - 1];
      setElements(prevState.elements);
      setViewport(prevState.viewport);
      setHistoryIndex(historyIndex - 1);
      setTimeout(() => {
        isHistoryUpdate.current = false;
      }, 0);
    }
  };

  // Redo action
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isHistoryUpdate.current = true;
      const nextState = history[historyIndex + 1];
      setElements(nextState.elements);
      setViewport(nextState.viewport);
      setHistoryIndex(historyIndex + 1);
      setTimeout(() => {
        isHistoryUpdate.current = false;
      }, 0);
    }
  };

  // Update history when elements change
  React.useEffect(() => {
    if (!isHistoryUpdate.current && elements.length > 0) {
      addToHistory(elements, viewport);
    }
  }, [elements]);

  // Handle viewport change with proper scaling
  const handleViewportChange = (
    newViewport: "mobile" | "tablet" | "desktop"
  ) => {
    if (viewport !== newViewport) {
      const scaleRatio =
        VIEWPORT_DIMENSIONS[newViewport].width /
        VIEWPORT_DIMENSIONS[viewport].width;

      const scaledElements = elements.map((element) => {
        return {
          ...element,
          position: {
            x: Math.min(
              element.position.x * scaleRatio,
              VIEWPORT_DIMENSIONS[newViewport].width - 100 // Prevent elements from going too far right
            ),
            y: element.position.y,
          },
        };
      });

      setElements(scaledElements);
      setViewport(newViewport);
      addToHistory(scaledElements, newViewport);
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

    // Find highest z-index
    const highestZIndex =
      elements.length > 0 ? Math.max(...elements.map((el) => el.zIndex)) : 0;

    const newElement: EditorElement = {
      id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      styles: getDefaultStyles(type, theme),
      placeholder:
        type === ELEMENT_TYPES.INPUT
          ? "Username"
          : type === ELEMENT_TYPES.PASSWORD
          ? "Password"
          : "",
      content: getDefaultContent(type),
      position: { x: constrainedX, y: constrainedY },
      zIndex: highestZIndex + 1,
      required: type === ELEMENT_TYPES.INPUT || type === ELEMENT_TYPES.PASSWORD,
      validation:
        type === ELEMENT_TYPES.INPUT
          ? "none"
          : type === ELEMENT_TYPES.PASSWORD
          ? "password"
          : "",
      provider:
        type === ELEMENT_TYPES.SOCIAL ? SOCIAL_PROVIDERS.GOOGLE : undefined,
    };

    setElements([...elements, newElement]);
    setSelectedElement(newElement);
    setIsDragging(false);
  };

  // Get default styles based on element type and theme
  const getDefaultStyles = (
    type: ElementType,
    theme: ThemeType
  ): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      padding: "8px 12px",
      margin: "4px",
      width: getDefaultWidth(type),
      borderRadius: "4px",
      fontSize: type === ELEMENT_TYPES.HEADING ? "24px" : "16px",
      fontWeight: type === ELEMENT_TYPES.HEADING ? "bold" : "normal",
      transition: "all 0.2s ease",
    };

    // Theme-specific colors
    const themeColors = {
      [THEMES.LIGHT]: {
        buttonBg: "#3B82F6",
        buttonText: "white",
        inputBg: "white",
        inputBorder: "#e5e7eb",
        text: "#111827",
      },
      [THEMES.DARK]: {
        buttonBg: "#6366F1",
        buttonText: "white",
        inputBg: "#374151",
        inputBorder: "#4B5563",
        text: "#F9FAFB",
      },
      [THEMES.BLUE]: {
        buttonBg: "#2563EB",
        buttonText: "white",
        inputBg: "#EFF6FF",
        inputBorder: "#BFDBFE",
        text: "#1E40AF",
      },
      [THEMES.GREEN]: {
        buttonBg: "#10B981",
        buttonText: "white",
        inputBg: "#ECFDF5",
        inputBorder: "#A7F3D0",
        text: "#065F46",
      },
      [THEMES.PURPLE]: {
        buttonBg: "#8B5CF6",
        buttonText: "white",
        inputBg: "#F5F3FF",
        inputBorder: "#DDD6FE",
        text: "#5B21B6",
      },
    };

    const colors = themeColors[theme];

    switch (type) {
      case ELEMENT_TYPES.INPUT:
      case ELEMENT_TYPES.PASSWORD:
        return {
          ...baseStyles,
          backgroundColor: colors.inputBg,
          border: `1px solid ${colors.inputBorder}`,
          color: colors.text,
          width: "300px",
        };
      case ELEMENT_TYPES.BUTTON:
        return {
          ...baseStyles,
          backgroundColor: colors.buttonBg,
          color: colors.buttonText,
          border: "none",
          fontWeight: 500,
          cursor: "pointer",
          textAlign: "center",
          width: "300px",
        };
      case ELEMENT_TYPES.TEXT:
        return {
          ...baseStyles,
          color: colors.text,
          backgroundColor: "transparent",
          lineHeight: "1.5",
        };
      case ELEMENT_TYPES.HEADING:
        return {
          ...baseStyles,
          color: colors.text,
          backgroundColor: "transparent",
          fontWeight: "bold",
          lineHeight: "1.2",
        };
      case ELEMENT_TYPES.DIVIDER:
        return {
          ...baseStyles,
          border: "none",
          borderTop: `1px solid ${colors.inputBorder}`,
          margin: "12px 0",
          width: "100%",
          padding: 0,
        };
      case ELEMENT_TYPES.CHECKBOX:
        return {
          ...baseStyles,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: colors.text,
          backgroundColor: "transparent",
        };
      case ELEMENT_TYPES.LINK:
        return {
          ...baseStyles,
          color: colors.buttonBg,
          backgroundColor: "transparent",
          textDecoration: "underline",
          cursor: "pointer",
        };
      case ELEMENT_TYPES.IMAGE:
        return {
          ...baseStyles,
          width: "120px",
          height: "120px",
          backgroundColor: colors.inputBg,
          border: `1px solid ${colors.inputBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        };
      case ELEMENT_TYPES.SOCIAL:
        return {
          ...baseStyles,
          backgroundColor: "white",
          color: "#333",
          border: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          paddingLeft: "16px",
          paddingRight: "16px",
          width: "300px",
        };
      default:
        return baseStyles;
    }
  };

  // Get default width based on element type
  const getDefaultWidth = (type: ElementType): string => {
    switch (type) {
      case ELEMENT_TYPES.BUTTON:
      case ELEMENT_TYPES.INPUT:
      case ELEMENT_TYPES.PASSWORD:
      case ELEMENT_TYPES.SOCIAL:
        return "300px";
      case ELEMENT_TYPES.DIVIDER:
        return "100%";
      case ELEMENT_TYPES.TEXT:
        return "300px";
      case ELEMENT_TYPES.HEADING:
        return "350px";
      case ELEMENT_TYPES.IMAGE:
        return "120px";
      default:
        return "300px";
    }
  };

  // Get default width as number for constraint calculations
  const getDefaultWidthNumber = (type: ElementType): number => {
    switch (type) {
      case ELEMENT_TYPES.BUTTON:
      case ELEMENT_TYPES.INPUT:
      case ELEMENT_TYPES.PASSWORD:
      case ELEMENT_TYPES.SOCIAL:
        return 300;
      case ELEMENT_TYPES.DIVIDER:
        return 300;
      case ELEMENT_TYPES.TEXT:
        return 300;
      case ELEMENT_TYPES.HEADING:
        return 350;
      case ELEMENT_TYPES.IMAGE:
        return 120;
      default:
        return 300;
    }
  };

  // Get default content based on element type
  const getDefaultContent = (type: ElementType): string => {
    switch (type) {
      case ELEMENT_TYPES.BUTTON:
        return "Sign In";
      case ELEMENT_TYPES.TEXT:
        return "Welcome back! Please sign in to your account to access all features.";
      case ELEMENT_TYPES.HEADING:
        return "Sign In to Your Account";
      case ELEMENT_TYPES.CHECKBOX:
        return "Remember me";
      case ELEMENT_TYPES.DIVIDER:
        return "";
      case ELEMENT_TYPES.LINK:
        return "Forgot password?";
      case ELEMENT_TYPES.IMAGE:
        return "Logo";
      case ELEMENT_TYPES.SOCIAL:
        return "Continue with Google";
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
    setElements(elements.filter((el) => el.id !== elementId));
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  // Duplicate element
  const handleDuplicateElement = (element: EditorElement) => {
    const newElement: EditorElement = {
      ...JSON.parse(JSON.stringify(element)),
      id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20,
      },
    };

    setElements([...elements, newElement]);
    setSelectedElement(newElement);
  };

  // Copy element
  const handleCopyElement = (element: EditorElement) => {
    setCopiedElement(JSON.parse(JSON.stringify(element)));
  };

  // Paste element
  const handlePasteElement = () => {
    if (!copiedElement) return;

    const newElement: EditorElement = {
      ...JSON.parse(JSON.stringify(copiedElement)),
      id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: {
        x: copiedElement.position.x + 20,
        y: copiedElement.position.y + 20,
      },
    };

    setElements([...elements, newElement]);
    setSelectedElement(newElement);
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

  // Update element z-index (bring forward/send backward)
  const handleChangeElementOrder = (direction: "up" | "down") => {
    if (!selectedElement) return;

    // Find highest and lowest z-index
    const zIndices = elements.map((el) => el.zIndex);
    const maxZ = Math.max(...zIndices);
    const minZ = Math.min(...zIndices);

    // Determine new z-index
    let newZIndex = selectedElement.zIndex;
    if (direction === "up" && selectedElement.zIndex < maxZ) {
      newZIndex = selectedElement.zIndex + 1;
    } else if (direction === "down" && selectedElement.zIndex > minZ) {
      newZIndex = selectedElement.zIndex - 1;
    }

    // If the z-index would change, find element to swap with
    if (newZIndex !== selectedElement.zIndex) {
      setElements(
        elements.map((el) => {
          if (el.id === selectedElement.id) {
            return { ...el, zIndex: newZIndex };
          } else if (el.zIndex === newZIndex) {
            return { ...el, zIndex: selectedElement.zIndex };
          }
          return el;
        })
      );

      // Update selected element
      setSelectedElement({
        ...selectedElement,
        zIndex: newZIndex,
      });
    }
  };

  // Set element alignment
  const handleAlignElement = (alignment: "left" | "center" | "right") => {
    if (!selectedElement || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const canvasWidth = canvasRect.width;

    // Get element width
    let elementWidth = 200;
    if (typeof selectedElement.styles.width === "string") {
      const match = selectedElement.styles.width.match(/(\d+)/);
      if (match) {
        elementWidth = parseInt(match[0], 10);
      }
    }

    // Calculate new X position based on alignment
    let newX = selectedElement.position.x;
    if (alignment === "left") {
      newX = 20; // Some padding from left
    } else if (alignment === "center") {
      newX = (canvasWidth - elementWidth) / 2;
    } else if (alignment === "right") {
      newX = canvasWidth - elementWidth - 20; // Some padding from right
    }

    // Update element position
    setElements(
      elements.map((el) => {
        if (el.id === selectedElement.id) {
          return {
            ...el,
            position: {
              ...el.position,
              x: newX,
            },
          };
        }
        return el;
      })
    );

    // Update selected element
    setSelectedElement({
      ...selectedElement,
      position: {
        ...selectedElement.position,
        x: newX,
      },
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

    // If grid is enabled, snap to grid
    if (showGrid) {
      const gridSize = 10;
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }

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
      addToHistory([], viewport);
    }
  };

  // Apply template
  const applyTemplate = (template: TemplateType) => {
    // First clear canvas
    setElements([]);
    setSelectedElement(null);

    // Set template elements based on selection
    let templateElements: EditorElement[] = [];

    switch (template) {
      case "Clean":
        templateElements = getCleanTemplate();
        break;
      case "Modern":
        templateElements = getModernTemplate();
        break;
      case "Corporate":
        templateElements = getCorporateTemplate();
        break;
      case "Minimal":
        templateElements = getMinimalTemplate();
        break;
    }

    setElements(templateElements);
    setSelectedTemplate(template);
    addToHistory(templateElements, viewport);
  };

  // Template definitions
  const getCleanTemplate = (): EditorElement[] => {
    return [
      {
        id: `el-${Date.now()}-1`,
        type: ELEMENT_TYPES.HEADING,
        styles: {
          ...getDefaultStyles(ELEMENT_TYPES.HEADING, theme),
          textAlign: "center",
        },
        content: "Welcome Back",
        position: { x: 100, y: 40 },
        zIndex: 1,
      },
      {
        id: `el-${Date.now()}-2`,
        type: ELEMENT_TYPES.TEXT,
        styles: {
          ...getDefaultStyles(ELEMENT_TYPES.TEXT, theme),
          textAlign: "center",
        },
        content: "Sign in to continue to your account",
        position: { x: 100, y: 90 },
        zIndex: 2,
      },
      {
        id: `el-${Date.now()}-3`,
        type: ELEMENT_TYPES.INPUT,
        styles: getDefaultStyles(ELEMENT_TYPES.INPUT, theme),
        placeholder: "Email address",
        position: { x: 100, y: 140 },
        zIndex: 3,
        required: true,
        validation: "email",
      },
      {
        id: `el-${Date.now()}-4`,
        type: ELEMENT_TYPES.PASSWORD,
        styles: getDefaultStyles(ELEMENT_TYPES.PASSWORD, theme),
        placeholder: "Password",
        position: { x: 100, y: 200 },
        zIndex: 4,
        required: true,
        validation: "password",
      },
      {
        id: `el-${Date.now()}-5`,
        type: ELEMENT_TYPES.CHECKBOX,
        styles: getDefaultStyles(ELEMENT_TYPES.CHECKBOX, theme),
        content: "Remember me",
        position: { x: 100, y: 260 },
        zIndex: 5,
      },
      {
        id: `el-${Date.now()}-6`,
        type: ELEMENT_TYPES.BUTTON,
        styles: getDefaultStyles(ELEMENT_TYPES.BUTTON, theme),
        content: "Sign In",
        position: { x: 100, y: 310 },
        zIndex: 6,
      },
      {
        id: `el-${Date.now()}-7`,
        type: ELEMENT_TYPES.LINK,
        styles: {
          ...getDefaultStyles(ELEMENT_TYPES.LINK, theme),
          textAlign: "center",
        },
        content: "Forgot password?",
        position: { x: 100, y: 370 },
        zIndex: 7,
      },
    ];
  };

  const getModernTemplate = (): EditorElement[] => {
    return [
      {
        id: `el-${Date.now()}-1`,
        type: ELEMENT_TYPES.IMAGE,
        styles: {
          ...getDefaultStyles(ELEMENT_TYPES.IMAGE, theme),
          margin: "0 auto",
        },
        content: "Logo",
        position: { x: 140, y: 30 },
        zIndex: 1,
      },
      {
        id: `el-${Date.now()}-2`,
        type: ELEMENT_TYPES.HEADING,
        styles: {
          ...getDefaultStyles(ELEMENT_TYPES.HEADING, theme),
          textAlign: "center",
        },
        content: "Sign In",
        position: { x: 100, y: 160 },
        zIndex: 2,
      },
      {
        id: `el-${Date.now()}-3`,
        type: ELEMENT_TYPES.SOCIAL,
        styles: getDefaultStyles(ELEMENT_TYPES.SOCIAL, theme),
        content: "Continue with Google",
        position: { x: 100, y: 220 },
        zIndex: 3,
        provider: SOCIAL_PROVIDERS.GOOGLE,
      },
      {
        id: `el-${Date.now()}-4`,
        type: ELEMENT_TYPES.DIVIDER,
        styles: {
          ...getDefaultStyles(ELEMENT_TYPES.DIVIDER, theme),
          width: "300px",
        },
        content: "",
        position: { x: 100, y: 280 },
        zIndex: 4,
      },
      {
        id: `el-${Date.now()}-5`,
        type: ELEMENT_TYPES.INPUT,
        styles: getDefaultStyles(ELEMENT_TYPES.INPUT, theme),
        placeholder: "Email",
        position: { x: 100, y: 310 },
        zIndex: 5,
        required: true,
        validation: "email",
      },
      {
        id: `el-${Date.now()}-6`,
        type: ELEMENT_TYPES.PASSWORD,
        styles: getDefaultStyles(ELEMENT_TYPES.PASSWORD, theme),
        placeholder: "Password",
        position: { x: 100, y: 370 },
        zIndex: 6,
        required: true,
        validation: "password",
      },
      {
        id: `el-${Date.now()}-7`,
        type: ELEMENT_TYPES.BUTTON,
        styles: getDefaultStyles(ELEMENT_TYPES.BUTTON, theme),
        content: "Sign In",
        position: { x: 100, y: 430 },
        zIndex: 7,
      },
      {
        id: `el-${Date.now()}-8`,
        type: ELEMENT_TYPES.TEXT,
        styles: {
          ...getDefaultStyles(ELEMENT_TYPES.TEXT, theme),
          textAlign: "center",
          fontSize: "14px",
        },
        content: "Don't have an account? Sign up",
        position: { x: 100, y: 490 },
        zIndex: 8,
      },
    ];
  };

  const getCorporateTemplate = (): EditorElement[] => {
    return [
      {
        id: `el-${Date.now()}-1`,
        type: ELEMENT_TYPES.IMAGE,
        styles: { ...getDefaultStyles(ELEMENT_TYPES.IMAGE, theme) },
        content: "Company Logo",

        position: { x: 40, y: 40 },
        zIndex: 1,
      },
      {
        id: `el-${Date.now()}-2`,
        type: ELEMENT_TYPES.HEADING,
        styles: {
          ...getDefaultStyles(ELEMENT_TYPES.HEADING, theme),
          fontWeight: 600,
        },
        content: "Enterprise Login Portal",
        position: { x: 40, y: 170 },
        zIndex: 2,
      },
      {
        id: `el-${Date.now()}-3`,
        type: ELEMENT_TYPES.TEXT,
        styles: {
          ...getDefaultStyles(ELEMENT_TYPES.TEXT, theme),
          fontSize: "14px",
        },
        content: "Please enter your credentials to access the system.",
        position: { x: 40, y: 220 },
        zIndex: 3,
      },
      {
        id: `el-${Date.now()}-4`,
        type: ELEMENT_TYPES.INPUT,
        styles: {
          ...getDefaultStyles(ELEMENT_TYPES.INPUT, theme),
          borderRadius: "2px",
        },
        placeholder: "Employee ID / Email",
        position: { x: 40, y: 270 },
        zIndex: 4,
        required: true,
        validation: "email",
      },
      {
        id: `el-${Date.now()}-5`,
        type: ELEMENT_TYPES.PASSWORD,
        styles: {
          ...getDefaultStyles(ELEMENT_TYPES.PASSWORD, theme),
          borderRadius: "2px",
        },
        placeholder: "Password",
        position: { x: 40, y: 330 },
        zIndex: 5,
        required: true,
        validation: "password",
      },
      {
        id: `el-${Date.now()}-6`,
        type: ELEMENT_TYPES.CHECKBOX,
        styles: getDefaultStyles(ELEMENT_TYPES.CHECKBOX, theme),
        content: "Keep me signed in on this device",
        position: { x: 40, y: 390 },
        zIndex: 6,
      },
      {
        id: `el-${Date.now()}-7`,
        type: ELEMENT_TYPES.BUTTON,
        styles: {
          ...getDefaultStyles(ELEMENT_TYPES.BUTTON, theme),
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontWeight: "bold",
        },
        content: "Secure Login",
        position: { x: 40, y: 440 },
        zIndex: 7,
      },
      {
        id: `el-${Date.now()}-8`,
        type: ELEMENT_TYPES.LINK,
        styles: getDefaultStyles(ELEMENT_TYPES.LINK, theme),
        content: "Forgot Password / Need Help?",
        position: { x: 40, y: 500 },
        zIndex: 8,
      },
    ];
  };

  const getMinimalTemplate = (): EditorElement[] => {
    return [
      {
        id: `el-${Date.now()}-1`,
        type: ELEMENT_TYPES.HEADING,
        styles: {
          ...getDefaultStyles(ELEMENT_TYPES.HEADING, theme),
          fontWeight: 300,
        },
        content: "Login",
        position: { x: 40, y: 100 },
        zIndex: 1,
      },
      {
        id: `el-${Date.now()}-2`,
        type: ELEMENT_TYPES.INPUT,
        styles: {
          ...getDefaultStyles(ELEMENT_TYPES.INPUT, theme),
          borderWidth: "0 0 1px 0",
          borderRadius: "0",
          backgroundColor: "transparent",
        },
        placeholder: "Username",
        position: { x: 40, y: 180 },
        zIndex: 2,
        required: true,
      },
      {
        id: `el-${Date.now()}-3`,
        type: ELEMENT_TYPES.PASSWORD,
        styles: {
          ...getDefaultStyles(ELEMENT_TYPES.PASSWORD, theme),
          borderWidth: "0 0 1px 0",
          borderRadius: "0",
          backgroundColor: "transparent",
        },
        placeholder: "Password",
        position: { x: 40, y: 250 },
        zIndex: 3,
        required: true,
        validation: "password",
      },
      {
        id: `el-${Date.now()}-4`,
        type: ELEMENT_TYPES.BUTTON,
        styles: {
          ...getDefaultStyles(ELEMENT_TYPES.BUTTON, theme),
          textTransform: "uppercase",
          borderRadius: "0",
        },
        content: "Enter",
        position: { x: 40, y: 330 },
        zIndex: 4,
      },
      {
        id: `el-${Date.now()}-5`,
        type: ELEMENT_TYPES.LINK,
        styles: {
          ...getDefaultStyles(ELEMENT_TYPES.LINK, theme),
          fontSize: "14px",
        },
        content: "Forgot details?",
        position: { x: 40, y: 390 },
        zIndex: 5,
      },
    ];
  };

  // Export generated HTML code
  const generateHTMLCode = () => {
    let htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Form</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: ${theme === THEMES.DARK ? "#1F2937" : "#f5f5f5"};
    }
    .login-container {
      position: relative;
      width: ${
        viewport === "mobile"
          ? "350px"
          : viewport === "tablet"
          ? "500px"
          : "600px"
      };
      padding: 20px;
      background-color: ${theme === THEMES.DARK ? "#111827" : "white"};
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div class="login-container">
`;

    // Sort elements by zIndex for proper rendering
    const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    sortedElements.forEach((element) => {
      // Generate inline styles
      const styleStr = Object.entries(element.styles)
        .map(
          ([key, value]) =>
            `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value}`
        )
        .join("; ");

      const positionStyle = `position: absolute; left: ${element.position.x}px; top: ${element.position.y}px; z-index: ${element.zIndex};`;

      switch (element.type) {
        case ELEMENT_TYPES.INPUT:
          htmlCode += `    <input type="text" placeholder="${
            element.placeholder
          }" style="${styleStr}; ${positionStyle}" ${
            element.required ? "required" : ""
          } />\n`;
          break;
        case ELEMENT_TYPES.PASSWORD:
          htmlCode += `    <input type="password" placeholder="${
            element.placeholder
          }" style="${styleStr}; ${positionStyle}" ${
            element.required ? "required" : ""
          } />\n`;
          break;
        case ELEMENT_TYPES.BUTTON:
          htmlCode += `    <button style="${styleStr}; ${positionStyle}">${element.content}</button>\n`;
          break;
        case ELEMENT_TYPES.TEXT:
          htmlCode += `    <p style="${styleStr}; ${positionStyle}">${element.content}</p>\n`;
          break;
        case ELEMENT_TYPES.HEADING:
          htmlCode += `    <h2 style="${styleStr}; ${positionStyle}">${element.content}</h2>\n`;
          break;
        case ELEMENT_TYPES.DIVIDER:
          htmlCode += `    <hr style="${styleStr}; ${positionStyle}" />\n`;
          break;
        case ELEMENT_TYPES.CHECKBOX:
          htmlCode += `    <div style="${positionStyle}; display: flex; align-items: center;">
      <input type="checkbox" id="cb-${element.id}" style="margin-right: 8px;" />
      <label for="cb-${element.id}" style="${styleStr}">${element.content}</label>
    </div>\n`;
          break;
        case ELEMENT_TYPES.LINK:
          htmlCode += `    <a href="#" style="${styleStr}; ${positionStyle}">${element.content}</a>\n`;
          break;
        case ELEMENT_TYPES.IMAGE:
          htmlCode += `    <div style="${styleStr}; ${positionStyle}; display: flex; align-items: center; justify-content: center;">${element.content}</div>\n`;
          break;
        case ELEMENT_TYPES.SOCIAL:
          htmlCode += `    <button style="${styleStr}; ${positionStyle}">
      <span>${element.provider} </span>
      <span>${element.content}</span>
    </button>\n`;
          break;
      }
    });

    htmlCode += `  </div>
</body>
</html>`;

    return htmlCode;
  };

  // Handle download HTML code
  const handleDownloadHTML = () => {
    const htmlCode = generateHTMLCode();
    const blob = new Blob([htmlCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "login-page.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Update theme for all elements
  const updateThemeForAllElements = (newTheme: ThemeType) => {
    const updatedElements = elements.map((element) => ({
      ...element,
      styles: getDefaultStyles(element.type, newTheme),
    }));

    setElements(updatedElements);
    setTheme(newTheme);

    // Update selected element if there is one
    if (selectedElement) {
      const updatedSelectedElement = updatedElements.find(
        (el) => el.id === selectedElement.id
      );
      if (updatedSelectedElement) {
        setSelectedElement(updatedSelectedElement);
      }
    }
  };

  // Render element based on type
  const renderElement = (element: EditorElement) => {
    const elementStyle: React.CSSProperties = {
      ...element.styles,
      position: "absolute",
      left: element.position.x,
      top: element.position.y,
      zIndex: element.zIndex,
      cursor:
        isMovingElement && selectedElement?.id === element.id
          ? "grabbing"
          : "grab",
      boxShadow:
        selectedElement?.id === element.id ? "0 0 0 2px #3B82F6" : "none",
    };

    switch (element.type) {
      case ELEMENT_TYPES.INPUT:
        return (
          <input
            type="text"
            placeholder={element.placeholder}
            style={elementStyle}
            onClick={(e) => handleElementClick(element, e)}
            onMouseDown={(e) => startMovingElement(e, element)}
          />
        );
      case ELEMENT_TYPES.PASSWORD:
        return (
          <input
            type="password"
            placeholder={element.placeholder}
            style={elementStyle}
            onClick={(e) => handleElementClick(element, e)}
            onMouseDown={(e) => startMovingElement(e, element)}
          />
        );
      case ELEMENT_TYPES.BUTTON:
        return (
          <div
            key={element.id}
            style={elementStyle}
            onClick={(e) => handleElementClick(element, e)}
            onMouseDown={(e) => startMovingElement(e, element)}
          >
            {element.content}
          </div>
        );
      case ELEMENT_TYPES.TEXT:
        return (
          <div
            key={element.id}
            style={elementStyle}
            onClick={(e) => handleElementClick(element, e)}
            onMouseDown={(e) => startMovingElement(e, element)}
          >
            {element.content}
          </div>
        );
      case ELEMENT_TYPES.HEADING:
        return (
          <div
            key={element.id}
            style={elementStyle}
            onClick={(e) => handleElementClick(element, e)}
            onMouseDown={(e) => startMovingElement(e, element)}
          >
            {element.content}
          </div>
        );
      case ELEMENT_TYPES.DIVIDER:
        return (
          <hr
            style={elementStyle}
            onClick={(e) => handleElementClick(element, e)}
            onMouseDown={(e) => startMovingElement(e, element)}
          />
        );
      case ELEMENT_TYPES.CHECKBOX:
        return (
          <div
            key={element.id}
            style={elementStyle}
            onClick={(e) => handleElementClick(element, e)}
            onMouseDown={(e) => startMovingElement(e, element)}
          >
            <input
              type="checkbox"
              disabled={!isPreviewMode}
              style={{ marginRight: "8px" }}
            />
            <span>{element.content}</span>
          </div>
        );
      case ELEMENT_TYPES.LINK:
        return (
          <div
            key={element.id}
            style={elementStyle}
            onClick={(e) => handleElementClick(element, e)}
            onMouseDown={(e) => startMovingElement(e, element)}
          >
            {element.content}
          </div>
        );
      case ELEMENT_TYPES.IMAGE:
        return (
          <div
            key={element.id}
            style={elementStyle}
            onClick={(e) => handleElementClick(element, e)}
            onMouseDown={(e) => startMovingElement(e, element)}
          >
            <Image size={24} />
            <div style={{ marginTop: "8px", fontSize: "12px" }}>
              {element.content}
            </div>
          </div>
        );
      case ELEMENT_TYPES.SOCIAL:
        const iconMap = {
          [SOCIAL_PROVIDERS.GOOGLE]: "G",
          [SOCIAL_PROVIDERS.FACEBOOK]: "f",
          [SOCIAL_PROVIDERS.APPLE]: "A",
          [SOCIAL_PROVIDERS.TWITTER]: "T",
        };
        return (
          <div
            style={{
              ...elementStyle,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={(e) => handleElementClick(element, e)}
            onMouseDown={(e) => startMovingElement(e, element)}
          >
            <span style={{ fontWeight: "bold" }}>
              {iconMap[element.provider || SOCIAL_PROVIDERS.GOOGLE]}
            </span>
            <span>{element.content}</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Render sidebar based on selected element
  const renderSidebar = () => {
    if (!selectedElement) {
      return (
        <div className="p-4">
          <p className="text-sm text-gray-500">
            Select an element to edit its properties
          </p>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Element Properties</h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDuplicateElement(selectedElement)}
              title="Duplicate"
            >
              <Copy size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleCopyElement(selectedElement)}
              title="Copy"
            >
              <Paperclip size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDeleteElement(selectedElement.id)}
              title="Delete"
            >
              <Trash size={16} />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">X</Label>
              <Input
                type="number"
                value={selectedElement.position.x}
                onChange={(e) =>
                  handleElementPropertyChange("position", {
                    ...selectedElement.position,
                    x: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label className="text-xs">Y</Label>
              <Input
                type="number"
                value={selectedElement.position.y}
                onChange={(e) =>
                  handleElementPropertyChange("position", {
                    ...selectedElement.position,
                    y: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Size</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Width</Label>
              <Input
                type="text"
                value={
                  typeof selectedElement.styles.width === "string"
                    ? selectedElement.styles.width
                    : `${selectedElement.styles.width}px`
                }
                onChange={(e) =>
                  handleElementPropertyChange("width", e.target.value, true)
                }
              />
            </div>
            {selectedElement.type !== ELEMENT_TYPES.DIVIDER && (
              <div>
                <Label className="text-xs">Height</Label>
                <Input
                  type="text"
                  value={
                    typeof selectedElement.styles.height === "string"
                      ? selectedElement.styles.height
                      : selectedElement.styles.height
                      ? `${selectedElement.styles.height}px`
                      : "auto"
                  }
                  onChange={(e) =>
                    handleElementPropertyChange("height", e.target.value, true)
                  }
                />
              </div>
            )}
          </div>
        </div>

        {(selectedElement.type === ELEMENT_TYPES.TEXT ||
          selectedElement.type === ELEMENT_TYPES.HEADING ||
          selectedElement.type === ELEMENT_TYPES.BUTTON ||
          selectedElement.type === ELEMENT_TYPES.CHECKBOX ||
          selectedElement.type === ELEMENT_TYPES.LINK) && (
          <div className="space-y-2">
            <Label>Content</Label>
            <Input
              type="text"
              value={selectedElement.content}
              onChange={(e) =>
                handleElementPropertyChange("content", e.target.value)
              }
            />
          </div>
        )}

        {(selectedElement.type === ELEMENT_TYPES.INPUT ||
          selectedElement.type === ELEMENT_TYPES.PASSWORD) && (
          <div className="space-y-2">
            <Label>Placeholder</Label>
            <Input
              type="text"
              value={selectedElement.placeholder}
              onChange={(e) =>
                handleElementPropertyChange("placeholder", e.target.value)
              }
            />
          </div>
        )}

        {(selectedElement.type === ELEMENT_TYPES.INPUT ||
          selectedElement.type === ELEMENT_TYPES.PASSWORD) && (
          <div className="flex items-center space-x-2">
            <Switch
              checked={selectedElement.required || false}
              onCheckedChange={(checked) =>
                handleElementPropertyChange("required", checked)
              }
            />
            <Label>Required</Label>
          </div>
        )}

        {selectedElement.type === ELEMENT_TYPES.INPUT && (
          <div className="space-y-2">
            <Label>Validation</Label>
            <Select
              value={selectedElement.validation || "none"}
              onValueChange={(value) =>
                handleElementPropertyChange("validation", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="tel">Phone</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedElement.type === ELEMENT_TYPES.SOCIAL && (
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select
              value={selectedElement.provider || SOCIAL_PROVIDERS.GOOGLE}
              onValueChange={(value) =>
                handleElementPropertyChange("provider", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SOCIAL_PROVIDERS.GOOGLE}>Google</SelectItem>
                <SelectItem value={SOCIAL_PROVIDERS.FACEBOOK}>
                  Facebook
                </SelectItem>
                <SelectItem value={SOCIAL_PROVIDERS.APPLE}>Apple</SelectItem>
                <SelectItem value={SOCIAL_PROVIDERS.TWITTER}>
                  Twitter
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Appearance</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Background</Label>
              <Input
                type="text"
                value={selectedElement.styles.backgroundColor || "transparent"}
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
              <Label className="text-xs">Text Color</Label>
              <Input
                type="text"
                value={selectedElement.styles.color || "inherit"}
                onChange={(e) =>
                  handleElementPropertyChange("color", e.target.value, true)
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Typography</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Font Size</Label>
              <Input
                type="text"
                value={selectedElement.styles.fontSize || "16px"}
                onChange={(e) =>
                  handleElementPropertyChange("fontSize", e.target.value, true)
                }
              />
            </div>
            <div>
              <Label className="text-xs">Font Weight</Label>
              <Select
                value={
                  selectedElement.styles.fontWeight?.toString() || "normal"
                }
                onValueChange={(value) =>
                  handleElementPropertyChange("fontWeight", value, true)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="300">Light</SelectItem>
                  <SelectItem value="500">Medium</SelectItem>
                  <SelectItem value="600">Semibold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Alignment</Label>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleAlignElement("left")}
            >
              <AlignLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleAlignElement("center")}
            >
              <AlignCenter size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleAlignElement("right")}
            >
              <AlignRight size={16} />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Layering</Label>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleChangeElementOrder("up")}
            >
              <ChevronUp size={16} /> Forward
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleChangeElementOrder("down")}
            >
              <ChevronDown size={16} /> Backward
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Left sidebar - Element toolbox */}
      <div className="w-60 h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold">Login Builder</h2>
          <p className="text-sm text-gray-500">
            Drag elements to design your login page
          </p>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 text-sm">Templates</h3>
              <div className="space-y-2">
                {Object.values(TEMPLATES).map((template) => (
                  <Button
                    key={template}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => applyTemplate(template as TemplateType)}
                  >
                    <Layout className="mr-2 h-4 w-4" />
                    {template}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-sm">Form Elements</h3>
              <div className="space-y-2">
                <Card
                  className="p-2 cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e) => handleDragStart(e, ELEMENT_TYPES.INPUT)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-300 text-xs">
                        Ab
                      </span>
                    </div>
                    <span className="text-sm">Text Input</span>
                  </div>
                </Card>
                <Card
                  className="p-2 cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, ELEMENT_TYPES.PASSWORD)
                  }
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-300 text-xs">
                        ***
                      </span>
                    </div>
                    <span className="text-sm">Password</span>
                  </div>
                </Card>
                <Card
                  className="p-2 cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e) => handleDragStart(e, ELEMENT_TYPES.BUTTON)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-300 text-xs">
                        →
                      </span>
                    </div>
                    <span className="text-sm">Button</span>
                  </div>
                </Card>
                <Card
                  className="p-2 cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, ELEMENT_TYPES.CHECKBOX)
                  }
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded flex items-center justify-center">
                      <span className="text-orange-600 dark:text-orange-300 text-xs">
                        ☑
                      </span>
                    </div>
                    <span className="text-sm">Checkbox</span>
                  </div>
                </Card>
                <Card
                  className="p-2 cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e) => handleDragStart(e, ELEMENT_TYPES.SOCIAL)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900 rounded flex items-center justify-center">
                      <span className="text-indigo-600 dark:text-indigo-300 text-xs">
                        G
                      </span>
                    </div>
                    <span className="text-sm">Social Login</span>
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-sm">Text Elements</h3>
              <div className="space-y-2">
                <Card
                  className="p-2 cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e) => handleDragStart(e, ELEMENT_TYPES.HEADING)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded flex items-center justify-center">
                      <span className="text-red-600 dark:text-red-300 text-xs">
                        H
                      </span>
                    </div>
                    <span className="text-sm">Heading</span>
                  </div>
                </Card>
                <Card
                  className="p-2 cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e) => handleDragStart(e, ELEMENT_TYPES.TEXT)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900 rounded flex items-center justify-center">
                      <span className="text-amber-600 dark:text-amber-300 text-xs">
                        T
                      </span>
                    </div>
                    <span className="text-sm">Paragraph</span>
                  </div>
                </Card>
                <Card
                  className="p-2 cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e) => handleDragStart(e, ELEMENT_TYPES.LINK)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-sky-100 dark:bg-sky-900 rounded flex items-center justify-center">
                      <span className="text-sky-600 dark:text-sky-300 text-xs">
                        L
                      </span>
                    </div>
                    <span className="text-sm">Link</span>
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-sm">Layout Elements</h3>
              <div className="space-y-2">
                <Card
                  className="p-2 cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e) => handleDragStart(e, ELEMENT_TYPES.DIVIDER)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 text-xs">
                        —
                      </span>
                    </div>
                    <span className="text-sm">Divider</span>
                  </div>
                </Card>
                <Card
                  className="p-2 cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e) => handleDragStart(e, ELEMENT_TYPES.IMAGE)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900 rounded flex items-center justify-center">
                      <span className="text-emerald-600 dark:text-emerald-300 text-xs">
                        <Image size={12} />
                      </span>
                    </div>
                    <span className="text-sm">Image / Logo</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center px-4 justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={isPreviewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? (
                <Code size={16} className="mr-1" />
              ) : (
                <Eye size={16} className="mr-1" />
              )}
              {isPreviewMode ? "Edit Mode" : "Preview"}
            </Button>

            <div className="border-l border-gray-200 dark:border-gray-800 h-6 mx-2" />

            <Button
              variant="outline"
              size="icon"
              title="Undo"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
            >
              <Undo size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              title="Redo"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo size={16} />
            </Button>

            <div className="border-l border-gray-200 dark:border-gray-800 h-6 mx-2" />

            <Button
              variant="outline"
              size="icon"
              title="Paste"
              onClick={handlePasteElement}
              disabled={!copiedElement}
            >
              <Paperclip size={16} />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Select
              value={viewport}
              onValueChange={(v) =>
                handleViewportChange(v as "mobile" | "tablet" | "desktop")
              }
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile">
                  <div className="flex items-center">
                    <Smartphone size={16} className="mr-2" />
                    Mobile
                  </div>
                </SelectItem>
                <SelectItem value="tablet">
                  <div className="flex items-center">
                    <Tablet size={16} className="mr-2" />
                    Tablet
                  </div>
                </SelectItem>
                <SelectItem value="desktop">
                  <div className="flex items-center">
                    <Monitor size={16} className="mr-2" />
                    Desktop
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="border-l border-gray-200 dark:border-gray-800 h-6 mx-2" />

            <Select
              value={theme}
              onValueChange={(v) => updateThemeForAllElements(v as ThemeType)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={THEMES.LIGHT}>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value={THEMES.DARK}>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-800 mr-2" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value={THEMES.BLUE}>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-600 mr-2" />
                    Blue
                  </div>
                </SelectItem>
                <SelectItem value={THEMES.GREEN}>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-600 mr-2" />
                    Green
                  </div>
                </SelectItem>
                <SelectItem value={THEMES.PURPLE}>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-600 mr-2" />
                    Purple
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="border-l border-gray-200 dark:border-gray-800 h-6 mx-2" />

            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="icon"
                title="Show Grid"
                onClick={() => setShowGrid(!showGrid)}
                className={
                  showGrid
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200"
                    : ""
                }
              >
                <Grid size={16} className={showGrid ? "text-blue-600" : ""} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                title="Download HTML"
                onClick={handleDownloadHTML}
              >
                <Download size={16} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                title="Clear Canvas"
                onClick={handleClearCanvas}
              >
                <Trash size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-8 bg-gray-100 dark:bg-gray-900">
          <div
            className={clsx(
              "mx-auto transition-all duration-300 relative overflow-hidden",
              {
                "w-[375px]": viewport === "mobile",
                "w-[768px]": viewport === "tablet",
                "w-[1200px]": viewport === "desktop",
              }
            )}
            style={{
              height: "600px",
              backgroundColor: theme === THEMES.DARK ? "#111827" : "white",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              outline: showGrid
                ? "none"
                : `1px solid ${theme === THEMES.DARK ? "#374151" : "#e5e7eb"}`,
              backgroundImage: showGrid
                ? `linear-gradient(to right, ${
                    theme === THEMES.DARK ? "#1F2937" : "#f3f4f6"
                  } 1px, transparent 1px), 
                     linear-gradient(to bottom, ${
                       theme === THEMES.DARK ? "#1F2937" : "#f3f4f6"
                     } 1px, transparent 1px)`
                : "none",
              backgroundSize: "10px 10px",
            }}
            ref={canvasRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => setSelectedElement(null)}
            onMouseMove={handleElementMove}
            onMouseUp={stopMovingElement}
            onMouseLeave={stopMovingElement}
          >
            {elements.map((element) => renderElement(element))}
          </div>
        </div>
      </div>

      {/* Right sidebar - Property panel */}
      <div className="w-80 h-full border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-y-auto">
        <Tabs defaultValue="properties">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="styles">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="properties" className="p-0">
            {renderSidebar()}
          </TabsContent>
          <TabsContent value="styles" className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between">
                <h3 className="font-medium">Generated HTML Code</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadHTML}
                >
                  <Download size={16} className="mr-1" /> Download
                </Button>
              </div>
              <div
                className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 overflow-auto text-sm font-mono h-[600px] whitespace-pre"
                style={{ maxHeight: "60vh" }}
              >
                {generateHTMLCode()}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LoginPageBuilder;
