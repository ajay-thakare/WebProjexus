"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import {
  Trash,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Globe,
  Mail,
  MessageCircle,
} from "lucide-react";
import React from "react";

type Props = {
  element: EditorElement;
};

const SocialIconsComponent = (props: Props) => {
  const { dispatch, state } = useEditor();

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

  // Get social icons content properties
  const content = props.element.content as any;
  const socialLinks = content.socialLinks || [
    {
      id: "1",
      platform: "facebook",
      url: "https://facebook.com",
      label: "Facebook",
    },
    {
      id: "2",
      platform: "twitter",
      url: "https://twitter.com",
      label: "Twitter",
    },
    {
      id: "3",
      platform: "instagram",
      url: "https://instagram.com",
      label: "Instagram",
    },
  ];
  const iconSize = content.iconSize || 24;
  const iconSpacing = content.iconSpacing || 16;
  const layout = content.layout || "horizontal";
  const style = content.style || "filled";
  const borderRadius = content.borderRadius || 8;
  const showLabels = content.showLabels || false;
  const openInNewTab = content.openInNewTab !== false;
  const hoverEffect = content.hoverEffect || "scale";
  const alignment = content.alignment || "center";

  // Color settings
  const customColors = content.customColors || false;
  const iconColor = content.iconColor || "#ffffff";
  const backgroundColor = content.backgroundColor || "#3b82f6";
  const hoverColor = content.hoverColor || "#2563eb";
  const labelColor = content.labelColor || "#374151";

  // Get platform-specific icon and colors
  const getPlatformIcon = (platform: string) => {
    const iconProps = { size: iconSize, className: "flex-shrink-0" };

    switch (platform) {
      case "facebook":
        return <Facebook {...iconProps} />;
      case "twitter":
        return <Twitter {...iconProps} />;
      case "instagram":
        return <Instagram {...iconProps} />;
      case "linkedin":
        return <Linkedin {...iconProps} />;
      case "youtube":
        return <Youtube {...iconProps} />;
      case "github":
        return <Github {...iconProps} />;
      case "email":
        return <Mail {...iconProps} />;
      case "discord":
        return <MessageCircle {...iconProps} />;
      default:
        return <Globe {...iconProps} />;
    }
  };

  const getPlatformColors = (platform: string) => {
    if (customColors) {
      return {
        background: backgroundColor,
        iconColor: iconColor,
        hoverBackground: hoverColor,
      };
    }

    // Default platform colors
    switch (platform) {
      case "facebook":
        return {
          background: "#1877f2",
          iconColor: "#ffffff",
          hoverBackground: "#166fe5",
        };
      case "twitter":
        return {
          background: "#1da1f2",
          iconColor: "#ffffff",
          hoverBackground: "#1a91da",
        };
      case "instagram":
        return {
          background: "#e4405f",
          iconColor: "#ffffff",
          hoverBackground: "#d73549",
        };
      case "linkedin":
        return {
          background: "#0077b5",
          iconColor: "#ffffff",
          hoverBackground: "#006fa6",
        };
      case "youtube":
        return {
          background: "#ff0000",
          iconColor: "#ffffff",
          hoverBackground: "#e60000",
        };
      case "github":
        return {
          background: "#333333",
          iconColor: "#ffffff",
          hoverBackground: "#2d2d2d",
        };
      case "email":
        return {
          background: "#ea4335",
          iconColor: "#ffffff",
          hoverBackground: "#d33b2c",
        };
      case "discord":
        return {
          background: "#5865f2",
          iconColor: "#ffffff",
          hoverBackground: "#4752c4",
        };
      default:
        return {
          background: "#6b7280",
          iconColor: "#ffffff",
          hoverBackground: "#5b6471",
        };
    }
  };

  // Get layout classes
  const getLayoutClasses = () => {
    const alignmentClasses = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    };

    const layoutClasses = {
      horizontal: `flex flex-row ${
        alignmentClasses[alignment as keyof typeof alignmentClasses]
      } items-center flex-wrap`,
      vertical: `flex flex-col ${
        alignmentClasses[alignment as keyof typeof alignmentClasses]
      } items-center`,
      grid: `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ${
        alignmentClasses[alignment as keyof typeof alignmentClasses]
      } place-items-center`,
    };

    return (
      layoutClasses[layout as keyof typeof layoutClasses] ||
      layoutClasses.horizontal
    );
  };

  // Get style classes for icons
  const getStyleClasses = (platform: string) => {
    const colors = getPlatformColors(platform);
    const baseClasses =
      "inline-flex items-center justify-center transition-all duration-200 cursor-pointer";

    const hoverEffectClasses = {
      none: "",
      scale: "hover:scale-110",
      bounce: "hover:animate-bounce",
      fade: "hover:opacity-80",
      slide: "hover:-translate-y-1",
    };

    const styleClasses = {
      filled: `${baseClasses} ${
        hoverEffectClasses[hoverEffect as keyof typeof hoverEffectClasses]
      }`,
      outlined: `${baseClasses} border-2 bg-transparent ${
        hoverEffectClasses[hoverEffect as keyof typeof hoverEffectClasses]
      }`,
      minimal: `${baseClasses} bg-transparent ${
        hoverEffectClasses[hoverEffect as keyof typeof hoverEffectClasses]
      }`,
      rounded: `${baseClasses} rounded-full ${
        hoverEffectClasses[hoverEffect as keyof typeof hoverEffectClasses]
      }`,
    };

    return (
      styleClasses[style as keyof typeof styleClasses] || styleClasses.filled
    );
  };

  // Get inline styles for each icon
  const getIconStyles = (platform: string) => {
    const colors = getPlatformColors(platform);
    const padding = Math.max(8, iconSize * 0.3);

    const baseStyles = {
      borderRadius: style === "rounded" ? "50%" : `${borderRadius}px`,
      padding: `${padding}px`,
      color: colors.iconColor,
      width: `${iconSize + padding * 2}px`,
      height: `${iconSize + padding * 2}px`,
    };

    switch (style) {
      case "filled":
        return {
          ...baseStyles,
          backgroundColor: colors.background,
        };
      case "outlined":
        return {
          ...baseStyles,
          borderColor: colors.background,
          color: colors.background,
          backgroundColor: "transparent",
        };
      case "minimal":
        return {
          ...baseStyles,
          color: colors.background,
          backgroundColor: "transparent",
          padding: "4px",
        };
      case "rounded":
        return {
          ...baseStyles,
          backgroundColor: colors.background,
          borderRadius: "50%",
        };
      default:
        return baseStyles;
    }
  };

  // Handle click
  const handleIconClick = (url: string, e: React.MouseEvent) => {
    if (!state.editor.liveMode) {
      e.preventDefault();
      return;
    }

    if (url && url !== "#") {
      if (openInNewTab) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = url;
      }
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
        className={clsx("w-full p-4", getLayoutClasses())}
        style={{
          gap: `${iconSpacing}px`,
          minHeight: "60px",
        }}
      >
        {socialLinks.length > 0 ? (
          socialLinks.map((link: any) => {
            const colors = getPlatformColors(link.platform);

            return (
              <div
                key={link.id}
                className={clsx(
                  "flex",
                  showLabels
                    ? layout === "horizontal"
                      ? "flex-col items-center"
                      : "flex-row items-center"
                    : "flex-col items-center"
                )}
                style={{ gap: showLabels ? "8px" : "0" }}
              >
                <div
                  className={getStyleClasses(link.platform)}
                  style={{
                    ...getIconStyles(link.platform),
                    ...(state.editor.liveMode && {
                      ":hover": {
                        backgroundColor: colors.hoverBackground,
                        transform:
                          hoverEffect === "scale" ? "scale(1.1)" : undefined,
                      },
                    }),
                  }}
                  onClick={(e) => handleIconClick(link.url, e)}
                  title={link.label}
                >
                  {getPlatformIcon(link.platform)}
                </div>

                {showLabels && (
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: customColors ? labelColor : "#374151",
                      textAlign: "center",
                    }}
                  >
                    {link.label}
                  </span>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center w-full h-16 text-gray-400">
            <div className="text-center">
              <Facebook size={24} className="mx-auto mb-2" />
              <p className="text-xs">No social links configured</p>
            </div>
          </div>
        )}
      </div>

      {/* Show platform info in editor mode */}
      {!state.editor.liveMode &&
        state.editor.selectedElement.id === props.element.id && (
          <div className="absolute bottom-2 left-2 right-2 z-10">
            <div className="bg-black/75 text-white px-2 py-1 rounded text-xs text-center">
              {socialLinks.length} social link
              {socialLinks.length !== 1 ? "s" : ""} • {style} style • {layout}{" "}
              layout
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

export default SocialIconsComponent;
