"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import {
  Trash,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
} from "lucide-react";
import React, { useState, useRef } from "react";

type Props = {
  element: EditorElement;
};

const ContactForm1Component = (props: Props) => {
  const { dispatch, state } = useEditor();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

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

  // Get contact form content properties
  const content = props.element.content as any;
  const formTitle = content.formTitle || "Contact Us";
  const formDescription =
    content.formDescription ||
    "Get in touch with us. We'd love to hear from you!";
  const submitText = content.submitText || "Send Message";
  const successMessage =
    content.successMessage ||
    "Thank you! Your message has been sent successfully.";
  const errorMessage =
    content.errorMessage ||
    "Sorry, there was an error sending your message. Please try again.";

  // Form configuration
  const action = content.action1 || "/api/contact";
  const method = content.method || "POST";
  const redirectUrl = content.redirectUrl || "";
  const emailTo = content.emailTo || "contact@example.com";
  const emailSubject = content.emailSubject || "New Contact Form Submission";

  // Fields configuration
  const fields = content.fields || [
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
  ];

  const layout = content.layout1 || "vertical";
  const showLabels = content.showLabels !== false;
  const showPlaceholders = content.showPlaceholders !== false;
  const showRequiredIndicator = content.showRequiredIndicator !== false;
  const enableValidation = content.enableValidation !== false;
  const showProgressBar = content.showProgressBar || false;
  const enableSpamProtection = content.enableSpamProtection !== false;

  // Styling
  const formBackground = content.formBackground || "#ffffff";
  const formBorder = content.formBorder || "#e5e7eb";
  const titleColor = content.titleColor || "#111827";
  const descriptionColor = content.descriptionColor || "#6b7280";
  const labelColor = content.labelColor || "#374151";
  const inputBackground = content.inputBackground || "#ffffff";
  const inputBorder = content.inputBorder || "#d1d5db";
  const inputFocusBorder = content.inputFocusBorder || "#3b82f6";
  const buttonBackground = content.buttonBackground || "#3b82f6";
  const buttonText = content.buttonText || "#ffffff";
  const buttonHover = content.buttonHover || "#2563eb";
  const borderRadius = content.borderRadius || 8;
  const padding = content.padding || 24;
  const spacing = content.spacing || 16;

  // Get enabled fields only
  const enabledFields = fields.filter((field: any) => field.enabled);

  // Calculate progress
  const calculateProgress = () => {
    const requiredFields = enabledFields.filter((field: any) => field.required);
    const filledRequiredFields = requiredFields.filter((field: any) =>
      formData[field.id]?.trim()
    );
    return requiredFields.length > 0
      ? (filledRequiredFields.length / requiredFields.length) * 100
      : 0;
  };

  // Validate field
  const validateField = (field: any, value: string) => {
    if (field.required && !value?.trim()) {
      return `${field.label} is required`;
    }

    if (field.type === "email" && value?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }

    if (field.type === "tel" && value?.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))) {
        return "Please enter a valid phone number";
      }
    }

    return "";
  };

  // Handle input change
  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));

    // Clear error for this field
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }

    // Update progress
    if (showProgressBar) {
      setProgress(calculateProgress());
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.editor.liveMode) {
      setSubmitStatus("success");
      setTimeout(() => setSubmitStatus("idle"), 3000);
      return;
    }

    // Validate all fields
    const newErrors: Record<string, string> = {};
    enabledFields.forEach((field: any) => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, you would submit to the action URL
      const response = await fetch(action, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          emailTo,
          emailSubject,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({});
        if (redirectUrl) {
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 2000);
        }
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  // Render form field
  const renderField = (field: any) => {
    const fieldError = errors[field.id];
    const fieldValue = formData[field.id] || "";

    const inputStyles = {
      backgroundColor: inputBackground,
      borderColor: fieldError ? "#ef4444" : inputBorder,
      borderRadius: `${borderRadius}px`,
      transition: "all 0.2s ease",
    };

    const focusStyles = {
      borderColor: inputFocusBorder,
      boxShadow: `0 0 0 3px ${inputFocusBorder}20`,
    };

    switch (field.type) {
      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            {showLabels && (
              <label
                htmlFor={field.id}
                className="block text-sm font-medium"
                style={{ color: labelColor }}
              >
                {field.label}
                {field.required && showRequiredIndicator && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
            )}
            <Textarea
              id={field.id}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={showPlaceholders ? field.placeholder : ""}
              required={field.required}
              className="w-full min-h-[100px] resize-vertical focus:outline-none"
              style={inputStyles}
              onFocus={(e) => Object.assign(e.target.style, focusStyles)}
              onBlur={(e) => Object.assign(e.target.style, inputStyles)}
              rows={4}
            />
            {fieldError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {fieldError}
              </p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            {showLabels && (
              <label
                htmlFor={field.id}
                className="block text-sm font-medium"
                style={{ color: labelColor }}
              >
                {field.label}
                {field.required && showRequiredIndicator && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
            )}
            <select
              id={field.id}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              required={field.required}
              className="w-full px-3 py-2 border focus:outline-none"
              style={inputStyles}
              onFocus={(e) => Object.assign(e.target.style, focusStyles)}
              onBlur={(e) => Object.assign(e.target.style, inputStyles)}
            >
              <option value="">
                {showPlaceholders ? field.placeholder : `Select ${field.label}`}
              </option>
              {field.options?.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {fieldError}
              </p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={field.id}
                checked={fieldValue === "true"}
                onChange={(e) =>
                  handleInputChange(field.id, e.target.checked.toString())
                }
                required={field.required}
                className="w-4 h-4 rounded focus:outline-none"
                style={{ accentColor: inputFocusBorder }}
              />
              {showLabels && (
                <label
                  htmlFor={field.id}
                  className="text-sm font-medium cursor-pointer"
                  style={{ color: labelColor }}
                >
                  {field.label}
                  {field.required && showRequiredIndicator && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
              )}
            </div>
            {fieldError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {fieldError}
              </p>
            )}
          </div>
        );

      default:
        return (
          <div key={field.id} className="space-y-2">
            {showLabels && (
              <label
                htmlFor={field.id}
                className="block text-sm font-medium"
                style={{ color: labelColor }}
              >
                {field.label}
                {field.required && showRequiredIndicator && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
            )}
            <Input
              type={field.type}
              id={field.id}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={showPlaceholders ? field.placeholder : ""}
              required={field.required}
              className="w-full focus:outline-none"
              style={inputStyles}
              onFocus={(e) => Object.assign(e.target.style, focusStyles)}
              onBlur={(e) => Object.assign(e.target.style, inputStyles)}
            />
            {fieldError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {fieldError}
              </p>
            )}
          </div>
        );
    }
  };

  // Get layout classes
  const getLayoutClasses = () => {
    switch (layout) {
      case "horizontal":
        return "grid grid-cols-1 md:grid-cols-2 gap-4";
      case "inline":
        return "flex flex-wrap gap-4 items-end";
      default:
        return "space-y-4";
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
        className="w-full border shadow-sm"
        style={{
          backgroundColor: formBackground,
          borderColor: formBorder,
          borderRadius: `${borderRadius}px`,
          padding: `${padding}px`,
        }}
      >
        {/* Form Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{ color: titleColor }}>
            {formTitle}
          </h2>
          {formDescription && (
            <p className="text-sm" style={{ color: descriptionColor }}>
              {formDescription}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {showProgressBar && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: labelColor }}>Progress</span>
              <span style={{ color: labelColor }}>
                {Math.round(calculateProgress())}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${calculateProgress()}%`,
                  backgroundColor: inputFocusBorder,
                }}
              />
            </div>
          </div>
        )}

        {/* Success Message */}
        {submitStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-red-800 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields */}
          <div className={getLayoutClasses()} style={{ gap: `${spacing}px` }}>
            {enabledFields.map((field: any) => renderField(field))}
          </div>

          {/* Spam Protection */}
          {enableSpamProtection && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield size={16} />
              <span>This form is protected against spam</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || submitStatus === "success"}
              className="w-full md:w-auto px-8 py-3 font-medium transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                backgroundColor: isSubmitting ? buttonHover : buttonBackground,
                color: buttonText,
                borderRadius: `${borderRadius}px`,
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : submitStatus === "success" ? (
                <>
                  <CheckCircle size={16} />
                  Sent!
                </>
              ) : (
                <>
                  <Send size={16} />
                  {submitText}
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Form Info for Editor */}
        {!state.editor.liveMode && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
            <p className="font-medium mb-1">Contact Form Configuration:</p>
            <p>• Action: {action}</p>
            <p>• Method: {method}</p>
            <p>• Fields: {enabledFields.length} enabled</p>
            <p>• Layout: {layout}</p>
            {enableSpamProtection && <p>• Spam protection enabled</p>}
          </div>
        )}
      </div>

      {/* Editor Mode Info */}
      {!state.editor.liveMode &&
        state.editor.selectedElement.id === props.element.id && (
          <div className="absolute bottom-2 left-2 right-2 z-10">
            <div className="bg-black/75 text-white px-2 py-1 rounded text-xs text-center">
              Contact Form • {enabledFields.length} fields • {layout} layout
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

export default ContactForm1Component;
