"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import React from "react";
import { v4 } from "uuid";
import Recursive from "./recursive";
import { Trash } from "lucide-react";

type Props = { element: EditorElement };

const Container = ({ element }: Props) => {
  const { id, content, styles, type } = element;
  const { dispatch, state } = useEditor();

  const handleOnDrop = (e: React.DragEvent, type: string) => {
    e.stopPropagation();
    const componentType = e.dataTransfer.getData("componentType") as EditorBtns;

    switch (componentType) {
      case "text":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: { innerText: "Text Element" },
              id: v4(),
              name: "Text",
              styles: {
                color: "black",
                ...defaultStyles,
              },
              type: "text",
            },
          },
        });
        break;

      case "link":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                innerText: "Link Element",
                href: "#",
              },
              id: v4(),
              name: "Link",
              styles: {
                color: "black",
                ...defaultStyles,
              },
              type: "link",
            },
          },
        });
        break;

      case "video":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                src: "https://www.youtube.com/embed/IWgK2Ew04h8?si=7iRh_7SGkr44O58_",
              },
              id: v4(),
              name: "Video",
              styles: {},
              type: "video",
            },
          },
        });
        break;

      case "container":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: "Container",
              styles: { ...defaultStyles },
              type: "container",
            },
          },
        });
        break;

      case "contactForm":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: "Contact Form",
              styles: {},
              type: "contactForm",
            },
          },
        });
        break;

      case "paymentForm":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: "Payment Form",
              styles: {},
              type: "paymentForm",
            },
          },
        });
        break;

      case "2Col":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: [],
                  id: v4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
                {
                  content: [],
                  id: v4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
              ],
              id: v4(),
              name: "Two Columns",
              styles: { ...defaultStyles, display: "flex" },
              type: "2Col",
            },
          },
        });
        break;

      case "image":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                src: "https://placehold.co/600x400",
                alt: "Placeholder Image",
              },
              id: v4(),
              name: "Image",
              styles: {
                ...defaultStyles,
                width: "100%",
                height: "auto",
              },
              type: "image",
            },
          },
        });
        break;

      case "button":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                innerText: "Click Me",
                href: "#",
              },
              id: v4(),
              name: "Button",
              styles: {
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "10px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                ...defaultStyles,
              },
              type: "button",
            },
          },
        });
        break;

      case "countdown":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                targetDate: new Date(
                  Date.now() + 7 * 24 * 60 * 60 * 1000
                ).toISOString(), // 7 days from now
              },
              id: v4(),
              name: "Countdown",
              styles: {
                color: "black",
                width: "100%",
                padding: "15px",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              },
              type: "countdown",
            },
          },
        });
        break;

      case "audio":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                controls: true,
                autoplay: false,
                loop: false,
                muted: false,
              },
              id: v4(),
              name: "Audio Player",
              styles: {
                width: "100%",
                padding: "10px",
                ...defaultStyles,
              },
              type: "audio",
            },
          },
        });
        break;

      case "divider":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                dividerStyle: "solid",
                dividerColor: "#d1d5db",
                dividerThickness: 1,
              },
              id: v4(),
              name: "Divider",
              styles: {
                width: "100%",
                margin: "10px 0",
                ...defaultStyles,
              },
              type: "divider",
            },
          },
        });
        break;

      case "list":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                items: ["List item 1", "List item 2", "List item 3"],
                listType: "none",
              },
              id: v4(),
              name: "List",
              styles: {
                color: "black",
                padding: "10px",
                ...defaultStyles,
              },
              type: "list",
            },
          },
        });
        break;

      case "icon":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                iconName: "star",
                iconSize: 24,
                iconColor: "#6366f1",
              },
              id: v4(),
              name: "Icon",
              styles: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "auto",
                height: "auto",
                padding: "10px",
                ...defaultStyles,
              },
              type: "icon",
            },
          },
        });
        break;

      case "3Col":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: [],
                  id: v4(),
                  name: "Column 1",
                  styles: {
                    ...defaultStyles,
                    width: "100%",
                    minHeight: "100px",
                  },
                  type: "container",
                },
                {
                  content: [],
                  id: v4(),
                  name: "Column 2",
                  styles: {
                    ...defaultStyles,
                    width: "100%",
                    minHeight: "100px",
                  },
                  type: "container",
                },
                {
                  content: [],
                  id: v4(),
                  name: "Column 3",
                  styles: {
                    ...defaultStyles,
                    width: "100%",
                    minHeight: "100px",
                  },
                  type: "container",
                },
              ],
              id: v4(),
              name: "Three Column",
              styles: {
                display: "flex",
                width: "100%",
                minHeight: "150px",
                padding: "20px",
                backgroundColor: "transparent",
                columnGap: "16px",
                ...defaultStyles,
              },
              type: "3Col",
            },
          },
        });
        break;

      case "spacer":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                spacerHeight: 50,
                spacerWidth: "100%",
                spacerBackgroundColor: "transparent",
              },
              id: v4(),
              name: "Spacer",
              styles: {
                width: "100%",
                display: "block",
                ...defaultStyles,
              },
              type: "spacer",
            },
          },
        });
        break;

      case "tabs":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                tabs: [
                  {
                    id: "tab1",
                    label: "Tab 1",
                    content: "Content for tab 1. Click to edit this text.",
                    elements: [],
                    backgroundColor: "#f1f5f9",
                    textColor: "#64748b",
                    activeBackgroundColor: "#ffffff",
                    activeTextColor: "#3b82f6",
                  },
                  {
                    id: "tab2",
                    label: "Tab 2",
                    content: "Content for tab 2. Click to edit this text.",
                    elements: [],
                    backgroundColor: "#f1f5f9",
                    textColor: "#64748b",
                    activeBackgroundColor: "#ffffff",
                    activeTextColor: "#3b82f6",
                  },
                  {
                    id: "tab3",
                    label: "Tab 3",
                    content: "Content for tab 3. Click to edit this text.",
                    elements: [],
                    backgroundColor: "#f1f5f9",
                    textColor: "#64748b",
                    activeBackgroundColor: "#ffffff",
                    activeTextColor: "#3b82f6",
                  },
                ],
                tabsBackgroundColor: "#ffffff",
                tabsHeaderBackgroundColor: "#f8fafc",
                tabsContentBackgroundColor: "#ffffff",
              },
              id: v4(),
              name: "Tabs",
              styles: {
                width: "100%",
                minHeight: "200px",
                ...defaultStyles,
              },
              type: "tabs",
            },
          },
        });
        break;

      case "input":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                inputType: "text",
                placeholder: "Enter text...",
                label: "Input Label",
                required: false,
                disabled: false,
                value: "",
                name: "",
                helperText: "",
                errorText: "",

                backgroundColor: "#ffffff",
                textColor: "#111827",
                borderColor: "#d1d5db",
                focusBorderColor: "#3b82f6",
                labelColor: "#374151",
                placeholderColor: "#9ca3af",
              },
              id: v4(),
              name: "Input",
              styles: {
                width: "100%",
                margin: "10px 0",
                ...defaultStyles,
              },
              type: "input",
            },
          },
        });
        break;

      case "textarea":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                placeholder: "Enter your message...",
                label: "Message",
                required: false,
                disabled: false,
                value: "",
                name: "",
                rows: 4,
                maxLength: 500,
                minLength: 0,
                helperText: "",
                errorText: "",
                resize: "vertical",
                backgroundColor: "#ffffff",
                textColor: "#111827",
                borderColor: "#d1d5db",
                focusBorderColor: "#3b82f6",
                labelColor: "#374151",
                placeholderColor: "#9ca3af",
              },
              id: v4(),
              name: "Textarea",
              styles: {
                width: "100%",
                margin: "10px 0",
                ...defaultStyles,
              },
              type: "textarea",
            },
          },
        });
        break;

      case "checkbox":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                label: "Checkbox Option",
                required: false,
                disabled: false,
                checked: false,
                name: "",
                value: "",
                helperText: "",
                errorText: "",
                size: "medium",
                layout: "horizontal",
                // Default colors
                checkboxColor: "#3b82f6",
                labelColor: "#374151",
                borderColor: "#d1d5db",
                focusColor: "#3b82f6",
              },
              id: v4(),
              name: "Checkbox",
              styles: {
                width: "100%",
                margin: "10px 0",
                ...defaultStyles,
              },
              type: "checkbox",
            },
          },
        });
        break;

      case "radio":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                groupLabel: "Radio Group",
                required: false,
                disabled: false,
                selectedValue: "",
                name: "",
                helperText: "",
                errorText: "",
                size: "medium",
                layout: "vertical",
                options: [
                  { id: "option1", label: "Option 1", value: "option1" },
                  { id: "option2", label: "Option 2", value: "option2" },
                  { id: "option3", label: "Option 3", value: "option3" },
                ],
                // Default colors
                radioColor: "#3b82f6",
                labelColor: "#374151",
                groupLabelColor: "#111827",
                borderColor: "#d1d5db",
                focusColor: "#3b82f6",
              },
              id: v4(),
              name: "Radio Group",
              styles: {
                width: "100%",
                margin: "10px 0",
                ...defaultStyles,
              },
              type: "radio",
            },
          },
        });
        break;

      case "select":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                label: "Select Option",
                placeholder: "Choose an option...",
                required: false,
                disabled: false,
                selectedValue: "",
                name: "",
                helperText: "",
                errorText: "",
                multiple: false,
                size: "medium",
                options: [
                  { id: "option1", label: "Option 1", value: "option1" },
                  { id: "option2", label: "Option 2", value: "option2" },
                  { id: "option3", label: "Option 3", value: "option3" },
                ],
                // Default colors
                backgroundColor: "#ffffff",
                textColor: "#111827",
                borderColor: "#d1d5db",
                focusBorderColor: "#3b82f6",
                labelColor: "#374151",
                placeholderColor: "#9ca3af",
              },
              id: v4(),
              name: "Select",
              styles: {
                width: "100%",
                margin: "10px 0",
                ...defaultStyles,
              },
              type: "select",
            },
          },
        });
        break;

      case "form":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: "Form",
              styles: {
                width: "100%",
                minHeight: "300px",
                margin: "20px 0",
                ...defaultStyles,
              },
              type: "form",
              formProps: {
                formTitle: "Contact Form",
                formDescription:
                  "Please fill out this form to get in touch with us",
                action: "",
                method: "POST",
                enctype: "application/x-www-form-urlencoded",
                target: "_self",
                submitButtonText: "Submit",
                resetButtonText: "Reset",
                showResetButton: false,
                successMessage: "Form submitted successfully!",
                errorMessage: "Please fix the errors and try again.",
                novalidate: false,
                backgroundColor: "#ffffff",
                borderColor: "#e5e7eb",
                titleColor: "#111827",
                descriptionColor: "#6b7280",
                submitButtonColor: "#3b82f6",
                submitButtonTextColor: "#ffffff",
                resetButtonColor: "#6b7280",
                resetButtonTextColor: "#ffffff",
              },
            },
          },
        });
        break;

      case "embed":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                embedType: "custom",
                embedCode: `<div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; border-radius: 8px;">
  <h3 style="margin: 0 0 10px 0;">Custom Embed Content</h3>
  <p style="margin: 0;">Click to edit this embed and add your own HTML, CSS, or JavaScript!</p>
</div>`,
                iframeSrc: "",
                allowFullscreen: false,
                sandbox: "",
                width: "100%",
                height: "300px",
                loading: "lazy",
                allowScripts: false,
                showPreview: true,
              },
              id: v4(),
              name: "Embed",
              styles: {
                width: "100%",
                minHeight: "300px",
                margin: "20px 0",
                ...defaultStyles,
              },
              type: "embed",
            },
          },
        });
        break;

      case "socialIcons":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                socialLinks: [
                  {
                    id: "1",
                    platform: "facebook",
                    url: "https://facebook.com/yourpage",
                    label: "Facebook",
                  },
                  {
                    id: "2",
                    platform: "twitter",
                    url: "https://twitter.com/yourhandle",
                    label: "Twitter",
                  },
                  {
                    id: "3",
                    platform: "instagram",
                    url: "https://instagram.com/yourprofile",
                    label: "Instagram",
                  },
                  {
                    id: "4",
                    platform: "linkedin",
                    url: "https://linkedin.com/company/yourcompany",
                    label: "LinkedIn",
                  },
                ],
                iconSize: 24,
                iconSpacing: 16,
                layout: "horizontal",
                style: "filled",
                borderRadius: 8,
                showLabels: false,
                openInNewTab: true,
                hoverEffect: "scale",
                alignment: "center",
                customColors: false,
                iconColor: "#ffffff",
                backgroundColor: "#3b82f6",
                hoverColor: "#2563eb",
                labelColor: "#374151",
              },
              id: v4(),
              name: "Social Icons",
              styles: {
                width: "100%",
                margin: "20px 0",
                ...defaultStyles,
              },
              type: "socialIcons",
            },
          },
        });
        break;

      case "popup":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                triggerType: "click",
                triggerText: "Open Popup",
                popupTitle: "Welcome!",
                popupContent: `<h3>Special Offer!</h3>
<p>Get 20% off your first order when you sign up for our newsletter.</p>
<p>Don't miss out on this exclusive deal!</p>`,
                popupSize: "medium",
                position: "center",
                animation: "fadeIn",
                overlay: true,
                closeOnOverlay: true,
                closeOnEscape: true,
                showCloseButton: true,
                autoClose: false,
                autoCloseDelay: 5000,

                // Trigger settings
                scrollTrigger: false,
                scrollPercentage: 50,
                timeTrigger: false,
                timeDelay: 3000,
                exitIntentTrigger: false,

                // Style settings
                backgroundColor: "#ffffff",
                textColor: "#111827",
                overlayColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: 8,
                padding: 24,
                maxWidth: 600,
                maxHeight: 400,

                // Button styles
                triggerButtonStyle: "primary",
                triggerButtonColor: "#3b82f6",
                triggerButtonTextColor: "#ffffff",
              },
              id: v4(),
              name: "Popup",
              styles: {
                width: "100%",
                margin: "20px 0",
                ...defaultStyles,
              },
              type: "popup",
            },
          },
        });
        break;

      case "tooltip":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                triggerText: "Hover for info",
                tooltipContent:
                  "This is a helpful tooltip that provides additional information to users.",
                triggerTypee: "hover",
                positionn: "top",
                theme: "dark",
                size: "medium",
                animationn: "fade",
                arrow: true,
                delay: 0,
                hideDelay: 0,
                maxWidth: 200,
                offset: 8,
                followCursor: false,
                interactive: false,
                multiline: false,

                // Custom styling
                customStyle: false,
                backgroundColor: "#1f2937",
                textColor: "#ffffff",
                borderColor: "#374151",
                borderRadius: 6,
                fontSize: 14,
                padding: 8,

                // Trigger element styling
                triggerStyle: "button",
                triggerButtonColor: "#3b82f6",
                triggerButtonTextColor: "#ffffff",
                triggerUnderline: false,
              },
              id: v4(),
              name: "Tooltip",
              styles: {
                width: "auto",
                display: "inline-block",
                margin: "10px",
                ...defaultStyles,
              },
              type: "tooltip",
            },
          },
        });
        break;

      case "testimonial":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                testimonials: [
                  {
                    id: "1",
                    quote:
                      "This product has completely transformed our business. The results exceeded our expectations and we've seen a 200% increase in productivity!",
                    author: "Sarah Johnson",
                    position: "CEO",
                    company: "Tech Innovations Inc.",
                    avatar: "https://placehold.co/80x80/4f46e5/ffffff?text=SJ",
                    rating: 5,
                  },
                  {
                    id: "2",
                    quote:
                      "Outstanding service and support. The team went above and beyond to ensure our success. Highly recommend to anyone looking for quality solutions.",
                    author: "Michael Chen",
                    position: "Product Manager",
                    company: "Digital Solutions Ltd.",
                    avatar: "https://placehold.co/80x80/059669/ffffff?text=MC",
                    rating: 5,
                  },
                  {
                    id: "3",
                    quote:
                      "User-friendly, powerful, and reliable. This tool has become an essential part of our daily workflow. Couldn't imagine working without it now.",
                    author: "Emily Rodriguez",
                    position: "Operations Director",
                    company: "Growth Partners",
                    avatar: "https://placehold.co/80x80/dc2626/ffffff?text=ER",
                    rating: 4,
                  },
                ],
                layoutt: "card",
                stylee: "modern",
                showAvatar: true,
                showRating: true,
                showQuotes: true,
                showCompany: true,
                autoplay: false,
                autoplaySpeed: 5000,
                showNavigation: true,
                showDots: true,
                itemsPerView: 1,

                // Styling
                backgroundColor: "#ffffff",
                textColor: "#111827",
                quoteColor: "#6b7280",
                authorColor: "#111827",
                positionColor: "#6b7280",
                cardBackground: "#f9fafb",
                cardBorder: "#e5e7eb",
                ratingColor: "#fbbf24",
                borderRadius: 12,
                padding: 24,
                spacing: 16,
              },
              id: v4(),
              name: "Testimonial",
              styles: {
                width: "100%",
                margin: "20px 0",
                ...defaultStyles,
              },
              type: "testimonial",
            },
          },
        });
        break;

      case "contactForm1":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                formTitle: "Contact Us",
                formDescription:
                  "Get in touch with us. We'd love to hear from you!",
                submitText: "Send Message",
                successMessage:
                  "Thank you! Your message has been sent successfully.",
                errorMessage:
                  "Sorry, there was an error sending your message. Please try again.",

                // Form configuration
                action1: "/api/contact",
                method: "POST",
                redirectUrl: "",
                emailTo: "contact@example.com",
                emailSubject: "New Contact Form Submission",

                // Fields configuration
                fields: [
                  {
                    id: "name",
                    type: "text",
                    label: "Full Name",
                    placeholder: "Enter your full name",
                    required: true,
                    enabled: true,
                  },
                  {
                    id: "email",
                    type: "email",
                    label: "Email Address",
                    placeholder: "Enter your email",
                    required: true,
                    enabled: true,
                  },
                  {
                    id: "phone",
                    type: "tel",
                    label: "Phone Number",
                    placeholder: "Enter your phone number",
                    required: false,
                    enabled: true,
                  },
                  {
                    id: "subject",
                    type: "text",
                    label: "Subject",
                    placeholder: "What is this about?",
                    required: false,
                    enabled: true,
                  },
                  {
                    id: "message",
                    type: "textarea",
                    label: "Message",
                    placeholder: "Enter your message here...",
                    required: true,
                    enabled: true,
                  },
                ],

                layout: "vertical",
                showLabels: true,
                showPlaceholders: true,
                showRequiredIndicator: true,
                enableValidation: true,
                showProgressBar: false,
                enableSpamProtection: true,

                // Styling
                formBackground: "#ffffff",
                formBorder: "#e5e7eb",
                titleColor: "#111827",
                descriptionColor: "#6b7280",
                labelColor: "#374151",
                inputBackground: "#ffffff",
                inputBorder: "#d1d5db",
                inputFocusBorder: "#3b82f6",
                buttonBackground: "#3b82f6",
                buttonText: "#ffffff",
                buttonHover: "#2563eb",
                borderRadius: 8,
                padding: 24,
                spacing: 16,
              },
              id: v4(),
              name: "Contact Form",
              styles: {
                width: "100%",
                margin: "20px 0",
                ...defaultStyles,
              },
              type: "contactForm1",
            },
          },
        });
        break;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent, type: string) => {
    if (type === "__body") return;
    e.dataTransfer.setData("componentType", type);
  };
  // challenge to duplicate an component

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  return (
    <div
      style={styles}
      className={clsx("relative p-4 transition-all group", {
        "max-w-full w-full": type === "container" || type === "2Col",
        "h-fit": type === "container",
        "h-full": type === "__body",
        "overflow-auto ": type === "__body",
        "flex flex-col md:!flex-row": type === "2Col",
        "!border-blue-500":
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type !== "__body",
        "!border-yellow-400 !border-4":
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type === "__body",
        "!border-solid":
          state.editor.selectedElement.id === id && !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      onDrop={(e) => handleOnDrop(e, id)}
      onDragOver={handleDragOver}
      draggable={type !== "__body"}
      onClick={handleOnClickBody}
      onDragStart={(e) => handleDragStart(e, "container")}
    >
      <Badge
        className={clsx(
          "absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden",
          {
            block:
              state.editor.selectedElement.id === element.id &&
              !state.editor.liveMode,
          }
        )}
      >
        {element.name}
      </Badge>

      {Array.isArray(content) &&
        content.map((childElement) => (
          <Recursive key={childElement.id} element={childElement} />
        ))}

      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== "__body" && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg ">
            <Trash size={16} onClick={handleDeleteElement} />
          </div>
        )}
    </div>
  );
};

export default Container;
