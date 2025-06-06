"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import {
  Trash,
  HelpCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Eye,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

type Props = {
  element: EditorElement;
};

const TooltipComponent = (props: Props) => {
  const { dispatch, state } = useEditor();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: props.element },
    });
  };

  // Convert style properties to React's camelCase format
  const convertStyles = (styles: React.CSSProperties) => {
    return Object.keys(styles).reduce((acc, key) => {
      const camelCaseKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      return { ...acc, [camelCaseKey]: styles[key as keyof typeof styles] };
    }, {} as React.CSSProperties);
  };

  const styles = convertStyles(props.element.styles);

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element,
      },
    });
  };

  // Get tooltip content properties
  const content = props.element.content as any;
  const triggerText = content.triggerText || "Hover me";
  const tooltipContent =
    content.tooltipContent || "This is a helpful tooltip with information.";
  const triggerType = content.triggerTypee || "hover";
  const position = content.positionn || "top";
  const theme = content.theme || "dark";
  const size = content.size || "medium";
  const animation = content.animationn || "fade";
  const arrow = content.arrow !== false;
  const delay = content.delay || 0;
  const hideDelay = content.hideDelay || 0;
  const maxWidth = content.maxWidth || 200;
  const offset = content.offset || 8;
  const followCursor = content.followCursor || false;
  const interactive = content.interactive || false;
  const multiline = content.multiline || false;

  // Custom styling
  const customStyle = content.customStyle || false;
  const backgroundColor = content.backgroundColor || "#1f2937";
  const textColor = content.textColor || "#ffffff";
  const borderColor = content.borderColor || "#374151";
  const borderRadius = content.borderRadius || 6;
  const fontSize = content.fontSize || 14;
  const padding = content.padding || 8;

  // Trigger element styling
  const triggerStyle = content.triggerStyle || "button";
  const triggerButtonColor = content.triggerButtonColor || "#3b82f6";
  const triggerButtonTextColor = content.triggerButtonTextColor || "#ffffff";
  const triggerUnderline = content.triggerUnderline || false;

  // Get theme colors
  const getThemeColors = () => {
    if (theme === "custom") {
      return {
        background: backgroundColor,
        text: textColor,
        border: borderColor,
      };
    }

    const themes = {
      dark: { background: "#1f2937", text: "#ffffff", border: "#374151" },
      light: { background: "#ffffff", text: "#1f2937", border: "#e5e7eb" },
      warning: { background: "#f59e0b", text: "#ffffff", border: "#d97706" },
      error: { background: "#ef4444", text: "#ffffff", border: "#dc2626" },
      success: { background: "#10b981", text: "#ffffff", border: "#059669" },
      info: { background: "#3b82f6", text: "#ffffff", border: "#2563eb" },
    };

    return themes[theme as keyof typeof themes] || themes.dark;
  };

  // Get size values
  const getSizeValues = () => {
    const sizes = {
      small: { fontSize: 12, padding: 6, maxWidth: 150 },
      medium: { fontSize: 14, padding: 8, maxWidth: 200 },
      large: { fontSize: 16, padding: 12, maxWidth: 300 },
      custom: { fontSize, padding, maxWidth },
    };
    return sizes[size as keyof typeof sizes] || sizes.medium;
  };

  // Get position classes and styles
  const getPositionStyles = () => {
    const sizeValues = getSizeValues();
    const baseStyles = {
      position: "absolute" as const,
      zIndex: 1000,
      maxWidth: `${sizeValues.maxWidth}px`,
      fontSize: `${sizeValues.fontSize}px`,
      padding: `${sizeValues.padding}px`,
      borderRadius: `${borderRadius}px`,
      pointerEvents: interactive ? "auto" : "none",
      wordWrap: "break-word" as const,
      whiteSpace: multiline ? "pre-wrap" : "nowrap",
    };

    // Position calculations would be more complex in a real implementation
    // For demo purposes, we'll use simple positioning
    const positions = {
      top: {
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginBottom: `${offset}px`,
      },
      bottom: {
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginTop: `${offset}px`,
      },
      left: {
        right: "100%",
        top: "50%",
        transform: "translateY(-50%)",
        marginRight: `${offset}px`,
      },
      right: {
        left: "100%",
        top: "50%",
        transform: "translateY(-50%)",
        marginLeft: `${offset}px`,
      },
      "top-start": { bottom: "100%", left: "0", marginBottom: `${offset}px` },
      "top-end": { bottom: "100%", right: "0", marginBottom: `${offset}px` },
      "bottom-start": { top: "100%", left: "0", marginTop: `${offset}px` },
      "bottom-end": { top: "100%", right: "0", marginTop: `${offset}px` },
      "left-start": { right: "100%", top: "0", marginRight: `${offset}px` },
      "left-end": { right: "100%", bottom: "0", marginRight: `${offset}px` },
      "right-start": { left: "100%", top: "0", marginLeft: `${offset}px` },
      "right-end": { left: "100%", bottom: "0", marginLeft: `${offset}px` },
    };

    return {
      ...baseStyles,
      ...positions[position as keyof typeof positions],
    };
  };

  // Get animation classes
  const getAnimationClasses = () => {
    if (!isTooltipVisible) return "opacity-0 scale-95 pointer-events-none";

    const animations = {
      fade: "opacity-100 scale-100 transition-all duration-200 ease-out",
      scale: "opacity-100 scale-100 transition-all duration-200 ease-out",
      shift: "opacity-100 translate-y-0 transition-all duration-200 ease-out",
      perspective: "opacity-100 scale-100 transition-all duration-300 ease-out",
      slide: "opacity-100 translate-x-0 transition-all duration-200 ease-out",
      none: "opacity-100",
    };

    return animations[animation as keyof typeof animations] || animations.fade;
  };

  // Get trigger icon based on theme
  const getTriggerIcon = () => {
    const iconProps = { size: 16, className: "ml-1" };

    switch (theme) {
      case "warning":
        return <AlertTriangle {...iconProps} />;
      case "error":
        return <XCircle {...iconProps} />;
      case "success":
        return <CheckCircle {...iconProps} />;
      case "info":
        return <Info {...iconProps} />;
      default:
        return <HelpCircle {...iconProps} />;
    }
  };

  // Handle mouse events
  const handleMouseEnter = (e: React.MouseEvent) => {
    if (triggerType !== "hover") return;

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (followCursor) {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsTooltipVisible(true);
      }, delay);
    } else {
      setIsTooltipVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (triggerType !== "hover") return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (hideDelay > 0) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsTooltipVisible(false);
      }, hideDelay);
    } else {
      setIsTooltipVisible(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (followCursor && isTooltipVisible) {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleClick = () => {
    if (triggerType === "click") {
      setIsTooltipVisible(!isTooltipVisible);
    }
  };

  const handleFocus = () => {
    if (triggerType === "focus") {
      setIsTooltipVisible(true);
    }
  };

  const handleBlur = () => {
    if (triggerType === "focus") {
      setIsTooltipVisible(false);
    }
  };

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Handle editor preview mode
  const handleEditorPreview = () => {
    if (!state.editor.liveMode) {
      setIsTooltipVisible(!isTooltipVisible);
    }
  };

  // Render trigger element
  const renderTrigger = () => {
    const triggerProps = {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseMove: handleMouseMove,
      onClick: state.editor.liveMode ? handleClick : handleEditorPreview,
      onFocus: handleFocus,
      onBlur: handleBlur,
      className: clsx(
        "inline-flex items-center transition-all duration-200",
        triggerType === "click" && "cursor-pointer",
        triggerStyle === "link" && "text-blue-600 hover:text-blue-800",
        triggerUnderline &&
          (triggerStyle === "text" || triggerStyle === "link") &&
          "underline"
      ),
    };

    switch (triggerStyle) {
      case "button":
        return (
          <Button
            {...triggerProps}
            style={{
              backgroundColor: triggerButtonColor,
              color: triggerButtonTextColor,
            }}
            className="h-auto px-3 py-2"
          >
            {triggerText}
            {!state.editor.liveMode && <Eye size={14} className="ml-2" />}
          </Button>
        );

      case "icon":
        return (
          <div
            {...triggerProps}
            className={clsx(triggerProps.className, "p-1 rounded")}
          >
            {getTriggerIcon()}
          </div>
        );

      case "badge":
        return (
          <div
            {...triggerProps}
            className={clsx(
              triggerProps.className,
              "px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
            )}
          >
            {triggerText}
            {getTriggerIcon()}
          </div>
        );

      case "text":
      case "link":
      default:
        return (
          <span {...triggerProps}>
            {triggerText}
            {triggerStyle === "text" && getTriggerIcon()}
          </span>
        );
    }
  };

  // Render arrow
  const renderArrow = () => {
    if (!arrow) return null;

    const themeColors = getThemeColors();
    const arrowSize = 6;

    const arrowStyles = {
      position: "absolute" as const,
      width: 0,
      height: 0,
      borderStyle: "solid",
    };

    const arrowPositions = {
      top: {
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        borderLeft: `${arrowSize}px solid transparent`,
        borderRight: `${arrowSize}px solid transparent`,
        borderTop: `${arrowSize}px solid ${themeColors.background}`,
      },
      bottom: {
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        borderLeft: `${arrowSize}px solid transparent`,
        borderRight: `${arrowSize}px solid transparent`,
        borderBottom: `${arrowSize}px solid ${themeColors.background}`,
      },
      left: {
        left: "100%",
        top: "50%",
        transform: "translateY(-50%)",
        borderTop: `${arrowSize}px solid transparent`,
        borderBottom: `${arrowSize}px solid transparent`,
        borderLeft: `${arrowSize}px solid ${themeColors.background}`,
      },
      right: {
        right: "100%",
        top: "50%",
        transform: "translateY(-50%)",
        borderTop: `${arrowSize}px solid transparent`,
        borderBottom: `${arrowSize}px solid transparent`,
        borderRight: `${arrowSize}px solid ${themeColors.background}`,
      },
    };

    const basePosition = position.split("-")[0] as keyof typeof arrowPositions;
    const arrowPosition = arrowPositions[basePosition];

    if (!arrowPosition) return null;

    return (
      <div
        style={{
          ...arrowStyles,
          ...arrowPosition,
        }}
      />
    );
  };

  const themeColors = getThemeColors();

  return (
    <div
      style={styles}
      className={clsx("p-[2px] w-full m-[5px] relative transition-all", {
        "!border-blue-500":
          state.editor.selectedElement.id === props.element.id,
        "!border-solid": state.editor.selectedElement.id === props.element.id,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      onClick={handleOnClickBody}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
            {state.editor.selectedElement.name}
          </Badge>
        )}

      {/* Trigger Element Container */}
      <div className="p-4 min-h-[60px] flex items-center justify-center">
        <div
          ref={triggerRef}
          className="relative inline-block"
          style={{ position: "relative" }}
        >
          {renderTrigger()}

          {/* Tooltip */}
          {(isTooltipVisible || !state.editor.liveMode) && (
            <div
              ref={tooltipRef}
              className={clsx(
                "tooltip-content",
                getAnimationClasses(),
                !state.editor.liveMode &&
                  isTooltipVisible &&
                  "opacity-100 scale-100"
              )}
              style={{
                ...getPositionStyles(),
                backgroundColor: themeColors.background,
                color: themeColors.text,
                border: `1px solid ${themeColors.border}`,
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                ...(followCursor &&
                  state.editor.liveMode && {
                    position: "fixed",
                    left: mousePosition.x + 10,
                    top: mousePosition.y - 10,
                    transform: "none",
                  }),
              }}
              onMouseEnter={() => interactive && handleMouseEnter}
              onMouseLeave={() => interactive && handleMouseLeave}
            >
              {renderArrow()}

              <div
                dangerouslySetInnerHTML={{
                  __html: tooltipContent.replace(
                    /\n/g,
                    multiline ? "<br/>" : " "
                  ),
                }}
              />

              {/* Interactive content indicator */}
              {interactive && (
                <div className="absolute top-1 right-1">
                  <MessageSquare size={10} opacity={0.5} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Editor Mode Info */}
      {!state.editor.liveMode &&
        state.editor.selectedElement.id === props.element.id && (
          <div className="absolute bottom-2 left-2 right-2 z-10">
            <div className="bg-black/75 text-white px-2 py-1 rounded text-xs text-center">
              Trigger: {triggerType} • Position: {position} • Theme: {theme}
            </div>
          </div>
        )}

      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};

export default TooltipComponent;
