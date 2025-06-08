"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import {
  Trash,
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

type Props = {
  element: EditorElement;
};

const TestimonialComponent = (props: Props) => {
  const { dispatch, state } = useEditor();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

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

  // Get testimonial content properties
  const content = props.element.content as any;
  const testimonials = content.testimonials || [
    {
      id: "1",
      quote:
        "This product has completely transformed our business. The results exceeded our expectations!",
      author: "John Smith",
      position: "CEO",
      company: "Tech Solutions Inc.",
      avatar: "https://placehold.co/80x80",
      rating: 5,
    },
  ];

  const layout = content.layoutt || "card";
  const style = content.stylee || "modern";
  const showAvatar = content.showAvatar !== false;
  const showRating = content.showRating !== false;
  const showQuotes = content.showQuotes !== false;
  const showCompany = content.showCompany !== false;
  const autoplay = content.autoplay || false;
  const autoplaySpeed = content.autoplaySpeed || 5000;
  const showNavigation = content.showNavigation !== false;
  const showDots = content.showDots !== false;
  const itemsPerView = content.itemsPerView || 1;

  // Styling
  const backgroundColor = content.backgroundColor || "#ffffff";
  const textColor = content.textColor || "#111827";
  const quoteColor = content.quoteColor || "#6b7280";
  const authorColor = content.authorColor || "#111827";
  const positionColor = content.positionColor || "#6b7280";
  const cardBackground = content.cardBackground || "#f9fafb";
  const cardBorder = content.cardBorder || "#e5e7eb";
  const ratingColor = content.ratingColor || "#fbbf24";
  const borderRadius = content.borderRadius || 12;
  const padding = content.padding || 24;
  const spacing = content.spacing || 16;

  // Auto-play functionality
  useEffect(() => {
    if (autoplay && testimonials.length > 1 && state.editor.liveMode) {
      setIsAutoPlaying(true);
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex + itemsPerView >= testimonials.length
            ? 0
            : prevIndex + itemsPerView
        );
      }, autoplaySpeed);
    } else {
      setIsAutoPlaying(false);
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [
    autoplay,
    autoplaySpeed,
    testimonials.length,
    itemsPerView,
    state.editor.liveMode,
  ]);

  // Navigation functions
  const goToPrevious = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      setIsAutoPlaying(false);
    }
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(0, testimonials.length - itemsPerView)
        : Math.max(0, prevIndex - itemsPerView)
    );
  };

  const goToNext = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      setIsAutoPlaying(false);
    }
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerView >= testimonials.length
        ? 0
        : prevIndex + itemsPerView
    );
  };

  const goToSlide = (index: number) => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      setIsAutoPlaying(false);
    }
    setCurrentIndex(index);
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={clsx(
              star <= rating ? "fill-current" : "fill-none",
              "transition-colors"
            )}
            style={{ color: ratingColor }}
          />
        ))}
      </div>
    );
  };

  // Get layout classes
  const getLayoutClasses = () => {
    const layoutClasses = {
      card: "bg-white border rounded-lg shadow-sm",
      quote: "relative pl-8 border-l-4",
      minimal: "text-center",
      bubble:
        "relative bg-white rounded-2xl shadow-sm before:absolute before:bottom-0 before:left-8 before:w-0 before:h-0 before:border-l-[12px] before:border-r-[12px] before:border-t-[12px] before:border-l-transparent before:border-r-transparent before:transform before:translate-y-full",
      split: "grid grid-cols-1 md:grid-cols-2 gap-6 items-center",
      centered: "text-center max-w-2xl mx-auto",
    };
    return (
      layoutClasses[layout as keyof typeof layoutClasses] || layoutClasses.card
    );
  };

  // Get style classes
  const getStyleClasses = () => {
    const styleClasses = {
      modern: "shadow-lg hover:shadow-xl transition-shadow duration-300",
      classic: "border-2 shadow-md",
      elegant:
        "shadow-sm border border-gray-100 hover:border-gray-200 transition-colors",
      corporate: "border border-gray-300 shadow-sm bg-gray-50",
      creative:
        "transform hover:scale-105 transition-transform duration-300 shadow-lg",
      minimal: "border-none shadow-none",
    };
    return (
      styleClasses[style as keyof typeof styleClasses] || styleClasses.modern
    );
  };

  // Render single testimonial
  const renderTestimonial = (testimonial: any, index: number) => {
    return (
      <div
        key={testimonial.id}
        className={clsx(
          "relative transition-all duration-300",
          getLayoutClasses(),
          getStyleClasses()
        )}
        style={{
          backgroundColor:
            layout === "card" || layout === "bubble"
              ? cardBackground
              : backgroundColor,
          borderColor: cardBorder,
          borderRadius: `${borderRadius}px`,
          padding: `${padding}px`,
          margin: layout === "centered" ? "0 auto" : undefined,
        }}
      >
        {/* Quote marks */}
        {showQuotes && (
          <div className="absolute top-4 left-4 opacity-20">
            <Quote size={32} style={{ color: quoteColor }} />
          </div>
        )}

        {/* Rating */}
        {showRating && (
          <div className="mb-4">{renderStars(testimonial.rating)}</div>
        )}

        {/* Quote */}
        <div className="mb-6">
          <p
            className={clsx("text-lg leading-relaxed", showQuotes && "pl-8")}
            style={{
              color: quoteColor,
              fontSize: layout === "centered" ? "1.25rem" : "1rem",
              fontStyle: layout === "quote" ? "italic" : "normal",
            }}
          >
            {showQuotes && '"'}
            {testimonial.quote}
            {showQuotes && '"'}
          </p>
        </div>

        {/* Author section */}
        <div
          className={clsx(
            "flex items-center",
            layout === "centered" ? "justify-center" : "justify-start",
            layout === "split" && index % 2 === 1
              ? "flex-row-reverse text-right"
              : ""
          )}
        >
          {/* Avatar */}
          {showAvatar && (
            <div className="flex-shrink-0 mr-4">
              <div
                className="rounded-full overflow-hidden bg-gray-200 flex items-center justify-center"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                }}
              >
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const next = e.currentTarget
                        .nextElementSibling as HTMLElement | null;
                      if (next) next.style.display = "flex";
                    }}
                  />
                ) : null}
                <User
                  size={24}
                  className="text-gray-400"
                  style={{ display: testimonial.avatar ? "none" : "flex" }}
                />
              </div>
            </div>
          )}

          {/* Author info */}
          <div
            className={clsx(
              "flex-grow",
              layout === "split" && index % 2 === 1 ? "text-right mr-4" : ""
            )}
          >
            <h4
              className="font-semibold text-sm"
              style={{ color: authorColor }}
            >
              {testimonial.author}
            </h4>
            <p className="text-sm" style={{ color: positionColor }}>
              {testimonial.position}
              {showCompany && testimonial.company && (
                <span> at {testimonial.company}</span>
              )}
            </p>
          </div>
        </div>

        {/* Creative style decorations */}
        {style === "creative" && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full opacity-20" />
        )}
      </div>
    );
  };

  // Get visible testimonials based on items per view
  const getVisibleTestimonials = () => {
    if (itemsPerView === 1) {
      return [testimonials[currentIndex]];
    }

    const visible = [];
    for (
      let i = 0;
      i < itemsPerView && i + currentIndex < testimonials.length;
      i++
    ) {
      visible.push(testimonials[currentIndex + i]);
    }
    return visible;
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
        className="w-full relative"
        style={{
          backgroundColor: backgroundColor,
          padding: `${spacing}px`,
          borderRadius: `${borderRadius}px`,
        }}
      >
        {/* Testimonials Container */}
        <div
          className={clsx(
            "transition-all duration-500 ease-in-out",
            itemsPerView > 1 ? `grid gap-${spacing}px` : "block",
            itemsPerView === 2 && "grid-cols-1 md:grid-cols-2",
            itemsPerView === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {getVisibleTestimonials().map((testimonial, index) =>
            renderTestimonial(testimonial, index)
          )}
        </div>

        {/* Navigation - only show if multiple testimonials */}
        {testimonials.length > itemsPerView && (
          <>
            {/* Arrow Navigation */}
            {showNavigation && (
              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevious}
                  disabled={currentIndex === 0}
                  className="rounded-full w-10 h-10 p-0"
                >
                  <ChevronLeft size={16} />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNext}
                  disabled={currentIndex + itemsPerView >= testimonials.length}
                  className="rounded-full w-10 h-10 p-0"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}

            {/* Dot Navigation */}
            {showDots && (
              <div className="flex justify-center items-center mt-4 space-x-2">
                {Array.from({
                  length: Math.ceil(testimonials.length / itemsPerView),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index * itemsPerView)}
                    className={clsx(
                      "w-2 h-2 rounded-full transition-all duration-200",
                      Math.floor(currentIndex / itemsPerView) === index
                        ? "bg-blue-500 w-4"
                        : "bg-gray-300 hover:bg-gray-400"
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Autoplay indicator */}
        {isAutoPlaying && (
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>

      {/* Editor Mode Info */}
      {!state.editor.liveMode &&
        state.editor.selectedElement.id === props.element.id && (
          <div className="absolute bottom-2 left-2 right-2 z-10">
            <div className="bg-black/75 text-white px-2 py-1 rounded text-xs text-center">
              {testimonials.length} testimonial
              {testimonials.length !== 1 ? "s" : ""} • {layout} layout • {style}{" "}
              style
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

export default TestimonialComponent;
