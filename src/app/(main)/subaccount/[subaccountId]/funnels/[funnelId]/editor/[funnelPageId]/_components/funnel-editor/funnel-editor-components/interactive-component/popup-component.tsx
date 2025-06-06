"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash, X, Square, Eye } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

type Props = {
  element: EditorElement;
};

const PopupComponent = (props: Props) => {
  const { dispatch, state } = useEditor();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Get popup content properties
  const content = props.element.content as any;
  const triggerType = content.triggerType || "click";
  const triggerText = content.triggerText || "Open Popup";
  const popupTitle = content.popupTitle || "Popup Title";
  const popupContent =
    content.popupContent ||
    "This is popup content. You can add any text, images, or HTML here.";
  const popupSize = content.popupSize || "medium";
  const position = content.position || "center";
  const animation = content.animation || "fadeIn";
  const overlay = content.overlay !== false;
  const closeOnOverlay = content.closeOnOverlay !== false;
  const closeOnEscape = content.closeOnEscape !== false;
  const showCloseButton = content.showCloseButton !== false;
  const autoClose = content.autoClose || false;
  const autoCloseDelay = content.autoCloseDelay || 5000;

  // Trigger settings
  const scrollTrigger = content.scrollTrigger || false;
  const scrollPercentage = content.scrollPercentage || 50;
  const timeTrigger = content.timeTrigger || false;
  const timeDelay = content.timeDelay || 3000;
  const exitIntentTrigger = content.exitIntentTrigger || false;

  // Style settings
  const backgroundColor = content.backgroundColor || "#ffffff";
  const textColor = content.textColor || "#111827";
  const overlayColor = content.overlayColor || "rgba(0, 0, 0, 0.5)";
  const borderRadius = content.borderRadius || 8;
  const padding = content.padding || 24;
  const maxWidth = content.maxWidth || 600;
  const maxHeight = content.maxHeight || 400;

  // Button styles
  const triggerButtonStyle = content.triggerButtonStyle || "primary";
  const triggerButtonColor = content.triggerButtonColor || "#3b82f6";
  const triggerButtonTextColor = content.triggerButtonTextColor || "#ffffff";

  // Get popup size dimensions
  const getPopupDimensions = () => {
    switch (popupSize) {
      case "small":
        return { maxWidth: "400px", maxHeight: "300px" };
      case "medium":
        return { maxWidth: "600px", maxHeight: "400px" };
      case "large":
        return { maxWidth: "800px", maxHeight: "600px" };
      case "fullscreen":
        return { maxWidth: "100vw", maxHeight: "100vh" };
      case "custom":
        return { maxWidth: `${maxWidth}px`, maxHeight: `${maxHeight}px` };
      default:
        return { maxWidth: "600px", maxHeight: "400px" };
    }
  };

  // Get position classes
  const getPositionClasses = () => {
    const positions = {
      center: "items-center justify-center",
      top: "items-start justify-center pt-20",
      bottom: "items-end justify-center pb-20",
      left: "items-center justify-start pl-20",
      right: "items-center justify-end pr-20",
      "top-left": "items-start justify-start p-20",
      "top-right": "items-start justify-end p-20",
      "bottom-left": "items-end justify-start p-20",
      "bottom-right": "items-end justify-end p-20",
    };
    return positions[position as keyof typeof positions] || positions.center;
  };

  // Get animation classes
  const getAnimationClasses = () => {
    const animations = {
      fadeIn: "animate-in fade-in duration-300",
      slideUp: "animate-in slide-in-from-bottom-4 duration-300",
      slideDown: "animate-in slide-in-from-top-4 duration-300",
      slideLeft: "animate-in slide-in-from-right-4 duration-300",
      slideRight: "animate-in slide-in-from-left-4 duration-300",
      zoomIn: "animate-in zoom-in-95 duration-300",
      bounce: "animate-in zoom-in-95 duration-500 animate-bounce",
      flip: "animate-in flip-in-x duration-500",
    };
    return (
      animations[animation as keyof typeof animations] || animations.fadeIn
    );
  };

  // Get trigger button variant
  const getTriggerButtonVariant = () => {
    switch (triggerButtonStyle) {
      case "primary":
        return "default";
      case "secondary":
        return "secondary";
      case "outline":
        return "outline";
      case "ghost":
        return "ghost";
      case "link":
        return "link";
      default:
        return "default";
    }
  };

  // Handle popup triggers
  useEffect(() => {
    if (!state.editor.liveMode) return;

    // Auto trigger on page load
    if (triggerType === "auto" && !hasTriggered) {
      setIsPopupOpen(true);
      setHasTriggered(true);
    }

    // Time trigger
    if (timeTrigger && !hasTriggered) {
      timeoutRef.current = setTimeout(() => {
        setIsPopupOpen(true);
        setHasTriggered(true);
      }, timeDelay);
    }

    // Scroll trigger
    if (scrollTrigger && !hasTriggered) {
      const handleScroll = () => {
        const scrolled =
          (window.scrollY /
            (document.documentElement.scrollHeight - window.innerHeight)) *
          100;
        if (scrolled >= scrollPercentage) {
          setIsPopupOpen(true);
          setHasTriggered(true);
          window.removeEventListener("scroll", handleScroll);
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    // Exit intent trigger
    if (exitIntentTrigger && !hasTriggered) {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          setIsPopupOpen(true);
          setHasTriggered(true);
          document.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    state.editor.liveMode,
    triggerType,
    timeTrigger,
    timeDelay,
    scrollTrigger,
    scrollPercentage,
    exitIntentTrigger,
    hasTriggered,
  ]);

  // Auto close popup
  useEffect(() => {
    if (isPopupOpen && autoClose) {
      const timer = setTimeout(() => {
        setIsPopupOpen(false);
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isPopupOpen, autoClose, autoCloseDelay]);

  // Handle escape key
  useEffect(() => {
    if (!isPopupOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isPopupOpen, closeOnEscape]);

  // Handle click and hover triggers
  const handleTriggerClick = () => {
    if (!state.editor.liveMode) {
      // In editor mode, just show preview
      setIsPopupOpen(true);
      return;
    }
    setIsPopupOpen(true);
  };

  const handleTriggerHover = () => {
    if (!state.editor.liveMode) return;
    if (triggerType === "hover") {
      setIsPopupOpen(true);
    }
  };

  // Close popup
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      closePopup();
    }
  };

  // Render trigger button
  const renderTrigger = () => {
    if (triggerType === "click" || triggerType === "hover") {
      return (
        <Button
          variant={getTriggerButtonVariant() as any}
          onClick={handleTriggerClick}
          onMouseEnter={handleTriggerHover}
          style={{
            backgroundColor:
              triggerButtonStyle === "primary" ? triggerButtonColor : undefined,
            color:
              triggerButtonStyle === "primary"
                ? triggerButtonTextColor
                : undefined,
            borderColor:
              triggerButtonStyle === "outline" ? triggerButtonColor : undefined,
          }}
          className="transition-all duration-200 hover:scale-105"
        >
          {triggerText}
        </Button>
      );
    }

    // For other trigger types, show a preview button in editor mode
    if (!state.editor.liveMode) {
      return (
        <Button
          variant="outline"
          onClick={() => setIsPopupOpen(true)}
          className="bg-gray-100 border-dashed border-gray-300"
        >
          <Eye size={16} className="mr-2" />
          Preview Popup ({triggerType})
        </Button>
      );
    }

    return null;
  };

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

      {/* Trigger Element */}
      <div className="p-4 min-h-[60px] flex items-center justify-center">
        {renderTrigger()}
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div
          className={clsx(
            "fixed inset-0 z-50 flex",
            getPositionClasses(),
            !state.editor.liveMode && "absolute"
          )}
          onClick={handleOverlayClick}
        >
          {/* Overlay */}
          {overlay && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: overlayColor }}
            />
          )}

          {/* Popup Content */}
          <div
            ref={popupRef}
            className={clsx(
              "relative bg-white rounded-lg shadow-2xl z-10 overflow-hidden",
              getAnimationClasses(),
              popupSize === "fullscreen" && "w-full h-full rounded-none"
            )}
            style={{
              backgroundColor: backgroundColor,
              color: textColor,
              borderRadius:
                popupSize === "fullscreen" ? "0px" : `${borderRadius}px`,
              ...getPopupDimensions(),
              width: popupSize === "fullscreen" ? "100%" : "auto",
              height: popupSize === "fullscreen" ? "100%" : "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            {showCloseButton && (
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Close popup"
              >
                <X size={16} />
              </button>
            )}

            {/* Popup Header */}
            {popupTitle && (
              <div
                className="border-b border-gray-200 px-6 py-4"
                style={{ borderColor: `${textColor}20` }}
              >
                <h3
                  className="text-lg font-semibold"
                  style={{ color: textColor }}
                >
                  {popupTitle}
                </h3>
              </div>
            )}

            {/* Popup Body */}
            <div
              className="overflow-auto"
              style={{
                padding: `${padding}px`,
                maxHeight:
                  popupSize === "fullscreen"
                    ? "calc(100% - 120px)"
                    : `${parseInt(getPopupDimensions().maxHeight) - 120}px`,
              }}
            >
              <div
                className="prose prose-sm max-w-none"
                style={{ color: textColor }}
                dangerouslySetInnerHTML={{
                  __html: popupContent.replace(/\n/g, "<br/>"),
                }}
              />
            </div>

            {/* Auto close indicator */}
            {autoClose && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-full bg-blue-500 transition-all ease-linear"
                  style={{
                    animation: `autoCloseProgress ${autoCloseDelay}ms linear`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Editor Mode Info */}
      {!state.editor.liveMode &&
        state.editor.selectedElement.id === props.element.id && (
          <div className="absolute bottom-2 left-2 right-2 z-10">
            <div className="bg-black/75 text-white px-2 py-1 rounded text-xs text-center">
              Trigger: {triggerType} • Size: {popupSize} • Position: {position}
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

      {/* CSS for auto close animation */}
      <style jsx>{`
        @keyframes autoCloseProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default PopupComponent;
