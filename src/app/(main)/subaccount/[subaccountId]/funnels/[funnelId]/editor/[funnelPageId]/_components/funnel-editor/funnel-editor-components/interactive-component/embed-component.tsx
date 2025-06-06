"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash, Code2, AlertTriangle, Eye, EyeOff } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  element: EditorElement;
};

const EmbedComponent = (props: Props) => {
  const { dispatch, state } = useEditor();
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const embedRef = useRef<HTMLDivElement>(null);

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

  // Get embed content properties
  const content = props.element.content as any;
  const embedType = content.embedType || "custom";
  const embedCode = content.embedCode || "";
  const iframeSrc = content.iframeSrc || "";
  const allowFullscreen = content.allowFullscreen || false;
  const sandbox = content.sandbox || "";
  const width = content.width || "100%";
  const height = content.height || "400px";
  const loading = content.loading || "lazy";
  const allowScripts = content.allowScripts || false;
  const showPreview = content.showPreview !== false;

  // Convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    const videoId = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId[1]}`;
    }

    return url;
  };

  // Render iframe content
  const renderIframe = () => {
    let src = iframeSrc;

    if (embedType === "youtube") {
      src = getYouTubeEmbedUrl(iframeSrc);
    }

    if (!src) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 text-gray-500">
          <div className="text-center">
            <Code2 size={32} className="mx-auto mb-2" />
            <p>
              No {embedType === "youtube" ? "YouTube URL" : "iframe source"}{" "}
              provided
            </p>
          </div>
        </div>
      );
    }

    return (
      <iframe
        src={src}
        width={width}
        height={height}
        allowFullScreen={allowFullscreen}
        sandbox={sandbox || undefined}
        loading={loading as any}
        className="w-full h-full border-0"
        title="Embedded content"
      />
    );
  };

  // Render custom HTML/JS content
  const renderCustomContent = () => {
    if (!embedCode) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 text-gray-500">
          <div className="text-center">
            <Code2 size={32} className="mx-auto mb-2" />
            <p>
              No {embedType === "script" ? "script" : "custom"} code provided
            </p>
          </div>
        </div>
      );
    }

    // In live mode or when scripts are allowed, render the content
    if (state.editor.liveMode || allowScripts) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: embedCode }}
          className="w-full h-full"
          style={{ width, height }}
        />
      );
    }

    // In editor mode, show code preview
    return (
      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 p-4 overflow-auto">
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
          <Code2 size={16} />
          <span>
            {embedType === "script" ? "Script" : "Custom HTML"} Preview
          </span>
        </div>
        <pre className="text-xs bg-white dark:bg-gray-900 p-3 rounded border overflow-auto">
          <code>{embedCode}</code>
        </pre>
      </div>
    );
  };

  // Main render content based on type
  const renderEmbedContent = () => {
    // Don't show preview in editor mode if showPreview is disabled
    if (!state.editor.liveMode && !showPreview) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 text-gray-500">
          <div className="text-center">
            <EyeOff size={32} className="mx-auto mb-2" />
            <p>Preview disabled</p>
            <p className="text-xs">Enable in settings to see preview</p>
          </div>
        </div>
      );
    }

    switch (embedType) {
      case "iframe":
      case "youtube":
        return renderIframe();
      case "custom":
      case "script":
        return renderCustomContent();
      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 text-gray-500">
            <div className="text-center">
              <Code2 size={32} className="mx-auto mb-2" />
              <p>Select embed type in settings</p>
            </div>
          </div>
        );
    }
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

      <div
        className="w-full rounded-lg overflow-hidden"
        style={{
          width: width,
          height: height,
          minHeight: "200px",
        }}
      >
        {renderEmbedContent()}
      </div>

      {/* Security warning for custom content */}
      {!state.editor.liveMode &&
        (embedType === "custom" || embedType === "script") &&
        allowScripts && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-xs flex items-center gap-1">
              <AlertTriangle size={12} />
              JS Enabled
            </div>
          </div>
        )}

      {/* Preview toggle for editor mode */}
      {!state.editor.liveMode &&
        state.editor.selectedElement.id === props.element.id && (
          <div className="absolute top-2 left-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPreviewMode(!isPreviewMode);
              }}
              className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs flex items-center gap-1 border border-gray-200 dark:border-gray-700"
            >
              {isPreviewMode ? <Eye size={12} /> : <EyeOff size={12} />}
              {isPreviewMode ? "Preview" : "Code"}
            </button>
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

export default EmbedComponent;
