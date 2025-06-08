"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/providers/editor/editor-provider";
import {
  Mail,
  User,
  MessageSquare,
  Phone,
  Settings,
  Palette,
  Shield,
  Plus,
  Trash2,
  Info,
} from "lucide-react";

type Props = {};

const ContactForm1Settings = (props: Props) => {
  const { dispatch, state } = useEditor();

  if (
    state.editor.selectedElement.type !== "contactForm1" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  const element = state.editor.selectedElement;
  const content = element.content as any;

  // Default values
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

  const handleInputChange = (field: string, value: any) => {
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...element,
          content: {
            ...content,
            [field]: value,
          },
        },
      },
    });
  };

  const handleFieldChange = (index: number, field: string, value: any) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };

    handleInputChange("fields", updatedFields);
  };

  const addField = () => {
    const newField = {
      id: `custom_${Date.now()}`,
      type: "text",
      label: "New Field",
      placeholder: "Enter value...",
      required: false,
      enabled: true,
    };

    handleInputChange("fields", [...fields, newField]);
  };

  const removeField = (index: number) => {
    const updatedFields = fields.filter((_: any, i: number) => i !== index);
    handleInputChange("fields", updatedFields);
  };

  const handleSelectChange = (field: string, value: string) => {
    handleInputChange(field, value);
  };

  const handleSwitchChange = (field: string, checked: boolean) => {
    handleInputChange(field, checked);
  };

  const handleNumberChange = (field: string, value: number) => {
    handleInputChange(field, value);
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail size={14} />;
      case "tel":
        return <Phone size={14} />;
      case "textarea":
        return <MessageSquare size={14} />;
      case "text":
      default:
        return <User size={14} />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Form Header */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-muted-foreground" />
          <Label className="text-sm font-semibold text-muted-foreground">
            Form Header
          </Label>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="formTitle"
              className="text-xs text-muted-foreground"
            >
              Form Title
            </Label>
            <Input
              id="formTitle"
              value={formTitle}
              onChange={(e) => handleInputChange("formTitle", e.target.value)}
              placeholder="Contact Us"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="formDescription"
              className="text-xs text-muted-foreground"
            >
              Form Description
            </Label>
            <Textarea
              id="formDescription"
              value={formDescription}
              onChange={(e) =>
                handleInputChange("formDescription", e.target.value)
              }
              placeholder="Get in touch with us..."
              className="min-h-[60px] resize-vertical"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-muted-foreground">
            Form Fields
          </Label>
          <Button
            onClick={addField}
            size="sm"
            variant="outline"
            className="h-8 px-2"
          >
            <Plus size={14} className="mr-1" />
            Add Field
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field: any, index: number) => (
            <div
              key={field.id}
              className="p-3 border border-gray-100 dark:border-gray-800 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getFieldIcon(field.type)}
                  <span className="text-sm font-medium">{field.label}</span>
                  {field.required && (
                    <span className="text-red-500 text-xs">*</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={field.enabled}
                    onCheckedChange={(checked) =>
                      handleFieldChange(index, "enabled", checked)
                    }
                  />
                  {!["name", "email", "message"].includes(field.id) && (
                    <Button
                      onClick={() => removeField(index)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={12} />
                    </Button>
                  )}
                </div>
              </div>

              {field.enabled && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs text-muted-foreground">
                      Label
                    </Label>
                    <Input
                      value={field.label}
                      onChange={(e) =>
                        handleFieldChange(index, "label", e.target.value)
                      }
                      className="h-8"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs text-muted-foreground">
                      Type
                    </Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) =>
                        handleFieldChange(index, "type", value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="tel">Phone</SelectItem>
                        <SelectItem value="textarea">Textarea</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                        <SelectItem value="url">URL</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <Label className="text-xs text-muted-foreground">
                      Placeholder
                    </Label>
                    <Input
                      value={field.placeholder}
                      onChange={(e) =>
                        handleFieldChange(index, "placeholder", e.target.value)
                      }
                      className="h-8"
                    />
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) =>
                        handleFieldChange(index, "required", checked)
                      }
                    />
                    <Label className="text-xs text-muted-foreground">
                      Required Field
                    </Label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Configuration */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center gap-2">
          <Settings size={16} className="text-muted-foreground" />
          <Label className="text-sm font-semibold text-muted-foreground">
            Form Configuration
          </Label>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="action" className="text-xs text-muted-foreground">
                Form Action URL
              </Label>
              <Input
                id="action"
                value={action}
                onChange={(e) => handleInputChange("action1", e.target.value)}
                placeholder="/api/contact"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="method" className="text-xs text-muted-foreground">
                HTTP Method
              </Label>
              <Select
                value={method}
                onValueChange={(value) => handleSelectChange("method", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="emailTo"
                className="text-xs text-muted-foreground"
              >
                Send To Email
              </Label>
              <Input
                id="emailTo"
                value={emailTo}
                onChange={(e) => handleInputChange("emailTo", e.target.value)}
                placeholder="contact@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="emailSubject"
                className="text-xs text-muted-foreground"
              >
                Email Subject
              </Label>
              <Input
                id="emailSubject"
                value={emailSubject}
                onChange={(e) =>
                  handleInputChange("emailSubject", e.target.value)
                }
                placeholder="New Contact Form Submission"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="redirectUrl"
              className="text-xs text-muted-foreground"
            >
              Redirect URL (Optional)
            </Label>
            <Input
              id="redirectUrl"
              value={redirectUrl}
              onChange={(e) => handleInputChange("redirectUrl", e.target.value)}
              placeholder="/thank-you"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="submitText"
              className="text-xs text-muted-foreground"
            >
              Submit Button Text
            </Label>
            <Input
              id="submitText"
              value={submitText}
              onChange={(e) => handleInputChange("submitText", e.target.value)}
              placeholder="Send Message"
            />
          </div>
        </div>
      </div>

      {/* Layout & Behavior */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Layout & Behavior
        </Label>

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="layout" className="text-xs text-muted-foreground">
              Form Layout
            </Label>
            <Select
              value={layout}
              onValueChange={(value) => handleSelectChange("layout1", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="horizontal">
                  Horizontal (2 columns)
                </SelectItem>
                <SelectItem value="inline">Inline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Show Field Labels
              </Label>
              <Switch
                checked={showLabels}
                onCheckedChange={(checked) =>
                  handleSwitchChange("showLabels", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Show Placeholders
              </Label>
              <Switch
                checked={showPlaceholders}
                onCheckedChange={(checked) =>
                  handleSwitchChange("showPlaceholders", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Show Required Indicator (*)
              </Label>
              <Switch
                checked={showRequiredIndicator}
                onCheckedChange={(checked) =>
                  handleSwitchChange("showRequiredIndicator", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Enable Validation
              </Label>
              <Switch
                checked={enableValidation}
                onCheckedChange={(checked) =>
                  handleSwitchChange("enableValidation", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Show Progress Bar
              </Label>
              <Switch
                checked={showProgressBar}
                onCheckedChange={(checked) =>
                  handleSwitchChange("showProgressBar", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={14} />
                <Label className="text-xs text-muted-foreground">
                  Spam Protection
                </Label>
              </div>
              <Switch
                checked={enableSpamProtection}
                onCheckedChange={(checked) =>
                  handleSwitchChange("enableSpamProtection", checked)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Label className="text-sm font-semibold text-muted-foreground">
          Form Messages
        </Label>

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="successMessage"
              className="text-xs text-muted-foreground"
            >
              Success Message
            </Label>
            <Textarea
              id="successMessage"
              value={successMessage}
              onChange={(e) =>
                handleInputChange("successMessage", e.target.value)
              }
              placeholder="Thank you! Your message has been sent."
              className="min-h-[60px] resize-vertical"
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="errorMessage"
              className="text-xs text-muted-foreground"
            >
              Error Message
            </Label>
            <Textarea
              id="errorMessage"
              value={errorMessage}
              onChange={(e) =>
                handleInputChange("errorMessage", e.target.value)
              }
              placeholder="Sorry, there was an error. Please try again."
              className="min-h-[60px] resize-vertical"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Style Customization */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-muted-foreground" />
          <Label className="text-sm font-semibold text-muted-foreground">
            Style Customization
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Form Background
            </Label>
            <Input
              type="color"
              value={formBackground}
              onChange={(e) =>
                handleInputChange("formBackground", e.target.value)
              }
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">Form Border</Label>
            <Input
              type="color"
              value={formBorder}
              onChange={(e) => handleInputChange("formBorder", e.target.value)}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">Title Color</Label>
            <Input
              type="color"
              value={titleColor}
              onChange={(e) => handleInputChange("titleColor", e.target.value)}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Description Color
            </Label>
            <Input
              type="color"
              value={descriptionColor}
              onChange={(e) =>
                handleInputChange("descriptionColor", e.target.value)
              }
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">Label Color</Label>
            <Input
              type="color"
              value={labelColor}
              onChange={(e) => handleInputChange("labelColor", e.target.value)}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Input Background
            </Label>
            <Input
              type="color"
              value={inputBackground}
              onChange={(e) =>
                handleInputChange("inputBackground", e.target.value)
              }
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Input Border
            </Label>
            <Input
              type="color"
              value={inputBorder}
              onChange={(e) => handleInputChange("inputBorder", e.target.value)}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Focus Border
            </Label>
            <Input
              type="color"
              value={inputFocusBorder}
              onChange={(e) =>
                handleInputChange("inputFocusBorder", e.target.value)
              }
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Button Background
            </Label>
            <Input
              type="color"
              value={buttonBackground}
              onChange={(e) =>
                handleInputChange("buttonBackground", e.target.value)
              }
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">Button Text</Label>
            <Input
              type="color"
              value={buttonText}
              onChange={(e) => handleInputChange("buttonText", e.target.value)}
              className="h-10 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Border Radius: {borderRadius}px
            </Label>
            <Input
              type="range"
              min="0"
              max="24"
              value={borderRadius}
              onChange={(e) =>
                handleNumberChange("borderRadius", parseInt(e.target.value))
              }
              className="h-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Padding: {padding}px
            </Label>
            <Input
              type="range"
              min="12"
              max="48"
              value={padding}
              onChange={(e) =>
                handleNumberChange("padding", parseInt(e.target.value))
              }
              className="h-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Field Spacing: {spacing}px
            </Label>
            <Input
              type="range"
              min="8"
              max="32"
              value={spacing}
              onChange={(e) =>
                handleNumberChange("spacing", parseInt(e.target.value))
              }
              className="h-2"
            />
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <Info size={16} className="mt-0.5 flex-shrink-0 text-blue-600" />
          <div>
            <p className="font-medium mb-1 text-blue-900 dark:text-blue-100">
              Contact Form Best Practices:
            </p>
            <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
              <li>• Keep forms short - only ask for essential information</li>
              <li>• Use clear, descriptive labels and helpful placeholders</li>
              <li>• Enable spam protection to reduce unwanted submissions</li>
              <li>• Test form submission and email delivery thoroughly</li>
              <li>• Provide clear success and error messages</li>
              <li>• Ensure forms are mobile-responsive and accessible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm1Settings;
