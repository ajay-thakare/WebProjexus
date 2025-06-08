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
  Quote,
  User,
  Star,
  Image as ImageIcon,
  Palette,
  Layout,
  Plus,
  Trash2,
  Settings,
  Info,
} from "lucide-react";

type Props = {};

const TestimonialSettings = (props: Props) => {
  const { dispatch, state } = useEditor();

  if (
    state.editor.selectedElement.type !== "testimonial" ||
    Array.isArray(state.editor.selectedElement.content)
  ) {
    return null;
  }

  const element = state.editor.selectedElement;
  const content = element.content as any;

  // Default values
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

  const handleTestimonialChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const updatedTestimonials = [...testimonials];
    updatedTestimonials[index] = {
      ...updatedTestimonials[index],
      [field]: value,
    };

    handleInputChange("testimonials", updatedTestimonials);
  };

  const addTestimonial = () => {
    const newTestimonial = {
      id: Date.now().toString(),
      quote: "Add your testimonial quote here...",
      author: "Author Name",
      position: "Position",
      company: "Company Name",
      avatar: "https://placehold.co/80x80",
      rating: 5,
    };

    handleInputChange("testimonials", [...testimonials, newTestimonial]);
  };

  const removeTestimonial = (index: number) => {
    const updatedTestimonials = testimonials.filter(
      (_: any, i: number) => i !== index
    );
    handleInputChange("testimonials", updatedTestimonials);
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

  return (
    <div className="flex flex-col gap-6">
      {/* Testimonials Management */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Quote size={16} className="text-muted-foreground" />
            <Label className="text-sm font-semibold text-muted-foreground">
              Testimonials
            </Label>
          </div>
          <Button
            onClick={addTestimonial}
            size="sm"
            variant="outline"
            className="h-8 px-2"
          >
            <Plus size={14} className="mr-1" />
            Add
          </Button>
        </div>

        <div className="space-y-4">
          {testimonials.map((testimonial: any, index: number) => (
            <div
              key={testimonial.id}
              className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Quote size={16} />
                  <span className="text-sm font-medium">
                    Testimonial {index + 1}
                  </span>
                </div>
                {testimonials.length > 1 && (
                  <Button
                    onClick={() => removeTestimonial(index)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={12} />
                  </Button>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">Quote</Label>
                  <Textarea
                    value={testimonial.quote}
                    onChange={(e) =>
                      handleTestimonialChange(index, "quote", e.target.value)
                    }
                    placeholder="Enter testimonial quote..."
                    className="min-h-[80px] resize-vertical"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs text-muted-foreground">
                      Author
                    </Label>
                    <Input
                      value={testimonial.author}
                      onChange={(e) =>
                        handleTestimonialChange(index, "author", e.target.value)
                      }
                      placeholder="Author name"
                      className="h-8"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs text-muted-foreground">
                      Position
                    </Label>
                    <Input
                      value={testimonial.position}
                      onChange={(e) =>
                        handleTestimonialChange(
                          index,
                          "position",
                          e.target.value
                        )
                      }
                      placeholder="Job title"
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs text-muted-foreground">
                      Company
                    </Label>
                    <Input
                      value={testimonial.company}
                      onChange={(e) =>
                        handleTestimonialChange(
                          index,
                          "company",
                          e.target.value
                        )
                      }
                      placeholder="Company name"
                      className="h-8"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs text-muted-foreground">
                      Rating
                    </Label>
                    <Select
                      value={testimonial.rating.toString()}
                      onValueChange={(value) =>
                        handleTestimonialChange(
                          index,
                          "rating",
                          parseInt(value)
                        )
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">
                    Avatar URL
                  </Label>
                  <Input
                    value={testimonial.avatar}
                    onChange={(e) =>
                      handleTestimonialChange(index, "avatar", e.target.value)
                    }
                    placeholder="https://example.com/avatar.jpg"
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layout Settings */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center gap-2">
          <Layout size={16} className="text-muted-foreground" />
          <Label className="text-sm font-semibold text-muted-foreground">
            Layout & Style
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">Layout</Label>
            <Select
              value={layout}
              onValueChange={(value) => handleSelectChange("layoutt", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="quote">Quote Block</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="bubble">Speech Bubble</SelectItem>
                <SelectItem value="split">Split Layout</SelectItem>
                <SelectItem value="centered">Centered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">Style</Label>
            <Select
              value={style}
              onValueChange={(value) => handleSelectChange("stylee", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="elegant">Elegant</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Show Avatar</Label>
            <Switch
              checked={showAvatar}
              onCheckedChange={(checked) =>
                handleSwitchChange("showAvatar", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Show Rating</Label>
            <Switch
              checked={showRating}
              onCheckedChange={(checked) =>
                handleSwitchChange("showRating", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Show Quote Marks
            </Label>
            <Switch
              checked={showQuotes}
              onCheckedChange={(checked) =>
                handleSwitchChange("showQuotes", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Show Company
            </Label>
            <Switch
              checked={showCompany}
              onCheckedChange={(checked) =>
                handleSwitchChange("showCompany", checked)
              }
            />
          </div>
        </div>
      </div>

      {/* Carousel Settings */}
      {testimonials.length > 1 && (
        <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-muted-foreground" />
            <Label className="text-sm font-semibold text-muted-foreground">
              Carousel Settings
            </Label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">
                Items Per View
              </Label>
              <Select
                value={itemsPerView.toString()}
                onValueChange={(value) =>
                  handleNumberChange("itemsPerView", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Item</SelectItem>
                  <SelectItem value="2">2 Items</SelectItem>
                  <SelectItem value="3">3 Items</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">
                Autoplay Speed: {autoplaySpeed / 1000}s
              </Label>
              <Input
                type="range"
                min="2000"
                max="10000"
                step="1000"
                value={autoplaySpeed}
                onChange={(e) =>
                  handleNumberChange("autoplaySpeed", parseInt(e.target.value))
                }
                className="h-2"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Auto Play</Label>
              <Switch
                checked={autoplay}
                onCheckedChange={(checked) =>
                  handleSwitchChange("autoplay", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Show Navigation
              </Label>
              <Switch
                checked={showNavigation}
                onCheckedChange={(checked) =>
                  handleSwitchChange("showNavigation", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Show Dots</Label>
              <Switch
                checked={showDots}
                onCheckedChange={(checked) =>
                  handleSwitchChange("showDots", checked)
                }
              />
            </div>
          </div>
        </div>
      )}

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
              Background Color
            </Label>
            <Input
              type="color"
              value={backgroundColor}
              onChange={(e) =>
                handleInputChange("backgroundColor", e.target.value)
              }
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">Text Color</Label>
            <Input
              type="color"
              value={textColor}
              onChange={(e) => handleInputChange("textColor", e.target.value)}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">Quote Color</Label>
            <Input
              type="color"
              value={quoteColor}
              onChange={(e) => handleInputChange("quoteColor", e.target.value)}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Author Color
            </Label>
            <Input
              type="color"
              value={authorColor}
              onChange={(e) => handleInputChange("authorColor", e.target.value)}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Position Color
            </Label>
            <Input
              type="color"
              value={positionColor}
              onChange={(e) =>
                handleInputChange("positionColor", e.target.value)
              }
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Card Background
            </Label>
            <Input
              type="color"
              value={cardBackground}
              onChange={(e) =>
                handleInputChange("cardBackground", e.target.value)
              }
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">Card Border</Label>
            <Input
              type="color"
              value={cardBorder}
              onChange={(e) => handleInputChange("cardBorder", e.target.value)}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Rating Color
            </Label>
            <Input
              type="color"
              value={ratingColor}
              onChange={(e) => handleInputChange("ratingColor", e.target.value)}
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
              max="32"
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
              Spacing: {spacing}px
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
              Testimonial Best Practices:
            </p>
            <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
              <li>• Use real customer testimonials for authenticity</li>
              <li>• Include specific details and results in quotes</li>
              <li>• Add professional photos for credibility</li>
              <li>• Mix different types of customers and use cases</li>
              <li>• Keep testimonials concise but impactful</li>
              <li>• Update testimonials regularly to stay relevant</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSettings;
