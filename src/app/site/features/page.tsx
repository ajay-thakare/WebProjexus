"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MousePointer,
  Users,
  CreditCard,
  ArrowRight,
  Star,
  Check,
  X,
  ThumbsUp,
  MessageCircle,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function FeaturesPage() {
  const [visibleSections, setVisibleSections] = useState(new Set());

  const keyFeatures = [
    {
      icon: MousePointer,
      title: "Drag & Drop Website Builder",
      description:
        "Easily create stunning websites with our intuitive drag-and-drop interface. No coding required!",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Collaborate seamlessly with your team on projects, manage tasks, and share feedback in real-time.",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: CreditCard,
      title: "Subscription Management",
      description:
        "Manage your client subscriptions effortlessly, track payments, and automate billing processes.",
      gradient: "from-pink-500 to-red-600",
    },
  ];

  // Updated inDepthFeatures with image paths
  const inDepthFeatures = [
    {
      title: "Drag & Drop Website Builder",
      subtitle: "Create stunning websites effortlessly",
      description:
        "Our intuitive drag-and-drop interface allows you to create professional websites without any coding knowledge. Simply drag elements onto the canvas and customize them to fit your brand.",
      image: "/Features/drag-drop-builder.png",
      imageAlt: "Website builder interface showing drag and drop functionality",
    },
    {
      title: "Team Collaboration",
      subtitle: "Work together efficiently",
      description:
        "WebPro enables seamless team collaboration with features like task management, real-time feedback, and project sharing. Keep everyone on the same page and streamline your workflow.",
      image: "/Features/pipelines.png",
      imageAlt:
        "Team collaboration illustration with two people working together",
    },
    {
      title: "Subscription Management",
      subtitle: "Simplify client billing",
      description:
        "Manage your client subscriptions with ease. Track payments, automate billing, and ensure timely renewals, all from one centralized dashboard.",
      image: "/Features/subscription-management.png",
      imageAlt: "Dashboard showing subscription management interface",
    },
  ];

  const testimonials = [
    {
      name: "Sejal Patel",
      date: "June 15, 2025",
      rating: 5,
      content:
        "WebPro has transformed the way we build websites. The drag-and-drop interface is incredibly user-friendly, and our team can now create stunning sites in a fraction of the time.",
      likes: 12,
      replies: 1,
    },
    {
      name: "Neha Vasaikar",
      date: "May 22, 2025",
      rating: 5,
      content:
        "The team collaboration features in WebPro are a game-changer. We can easily manage tasks, share feedback, and keep all our projects organized. Highly recommend!",
      likes: 15,
      replies: 0,
    },
  ];

  const comparisonFeatures = [
    { feature: "Drag & Drop Builder", webpro: true, competitor: true },
    { feature: "Team Collaboration", webpro: true, competitor: "Limited" },
    { feature: "Subscription Management", webpro: true, competitor: false },
    { feature: "Real-time Feedback", webpro: true, competitor: false },
    { feature: "Custom Branding", webpro: true, competitor: "Limited" },
    { feature: "24/7 Support", webpro: true, competitor: false },
  ];

  // Intersection Observer Hook
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          } else {
            // Remove from visible sections when out of view
            setVisibleSections((prev) => {
              const newSet = new Set(prev);
              newSet.delete(entry.target.id);
              return newSet;
            });
          }
        });
      },
      {
        threshold: 0.15, // Smooth threshold
        rootMargin: "20px 0px -20px 0px", // Balanced margins for smooth transitions
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const getSectionClasses = (sectionId: string, baseClasses: string = "") => {
    const isVisible = visibleSections.has(sectionId);
    return `${baseClasses} transition-all duration-700 ease-in-out ${
      isVisible
        ? "opacity-100 translate-y-0 scale-100"
        : "opacity-0 translate-y-8 scale-95"
    }`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        id="hero"
        data-section
        className={getSectionClasses(
          "hero",
          "pt-24 pb-12 px-4 relative overflow-hidden"
        )}
      >
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10"></div>

        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary-foreground hover:from-cyan-500 hover:to-purple-500 text-transparent bg-clip-text transition-all duration-500 cursor-default">
            WebPro Features
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore the powerful features of WebPro designed to streamline your
            agency operations.
          </p>
        </div>
      </section>

      {/* Key Features Section */}
      <section
        id="key-features"
        data-section
        className={getSectionClasses(
          "key-features",
          "pt-0 pb-20 px-4 relative z-10"
        )}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className={`group relative overflow-hidden border-2 border-muted-foreground/20 bg-gradient-to-br from-background to-muted/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:scale-105 hover:border-primary/30 ${
                    visibleSections.has("key-features")
                      ? `opacity-100 translate-y-0 delay-${index * 100}`
                      : "opacity-0 translate-y-6"
                  }`}
                  style={{
                    transition: "all 0.6s ease-out",
                    transitionDelay: visibleSections.has("key-features")
                      ? `${index * 100}ms`
                      : "0ms",
                  }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
                  ></div>

                  <CardHeader className="relative p-8">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-4 text-foreground">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* In-Depth Features Section - UPDATED WITH IMAGES */}
      <section
        id="in-depth-features"
        data-section
        className={getSectionClasses(
          "in-depth-features",
          "py-20 px-4 bg-muted/30 relative z-10"
        )}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary-foreground hover:from-cyan-500 hover:to-purple-500 text-transparent bg-clip-text transition-all duration-500 cursor-default">
              In-Depth Features
            </h2>
          </div>

          <div className="space-y-20">
            {inDepthFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`flex flex-col ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
                } gap-12 items-center ${
                  visibleSections.has("in-depth-features")
                    ? `opacity-100 ${
                        index % 2 === 0 ? "translate-x-0" : "translate-x-0"
                      }`
                    : `opacity-0 ${
                        index % 2 === 0 ? "-translate-x-8" : "translate-x-8"
                      }`
                }`}
                style={{
                  transition: "all 0.8s ease-out",
                  transitionDelay: visibleSections.has("in-depth-features")
                    ? `${index * 200}ms`
                    : "0ms",
                }}
              >
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-background to-muted/50 rounded-3xl p-8 border border-muted-foreground/20 shadow-lg overflow-hidden">
                    <div className="aspect-[4/3] relative rounded-2xl overflow-hidden">
                      {feature.image ? (
                        <Image
                          src={feature.image}
                          alt={feature.imageAlt}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={index === 0} // Priority loading for first image
                        />
                      ) : (
                        // Fallback if no image is provided
                        <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                          <div className="text-muted-foreground text-lg font-medium text-center">
                            {feature.title} Preview
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-primary font-semibold mb-4">
                      {feature.subtitle}
                    </p>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <Link
                    href="/site/documentation"
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
                  >
                    Learn more
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section
        id="testimonials"
        data-section
        className={getSectionClasses(
          "testimonials",
          "py-20 px-4 relative z-10"
        )}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary-foreground hover:from-cyan-500 hover:to-purple-500 text-transparent bg-clip-text transition-all duration-500 cursor-default">
              Customer Testimonials
            </h2>
          </div>

          <div className="space-y-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={`${testimonial.name}-${index}`}
                className={`p-8 border-0 bg-gradient-to-br from-background to-muted/30 shadow-lg ${
                  visibleSections.has("testimonials")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{
                  transition: "all 0.6s ease-out",
                  transitionDelay: visibleSections.has("testimonials")
                    ? `${index * 150}ms`
                    : "0ms",
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary-foreground rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">
                        {testimonial.name}
                      </h4>
                      <span className="text-muted-foreground text-sm">
                        {testimonial.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {testimonial.content}
                    </p>

                    <div className="flex items-center gap-6 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{testimonial.likes}</span>
                      </div>
                      {testimonial.replies > 0 && (
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>{testimonial.replies}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Section */}
      <section
        id="comparison"
        data-section
        className={getSectionClasses(
          "comparison",
          "py-20 px-4 bg-muted/30 relative z-10"
        )}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary-foreground hover:from-cyan-500 hover:to-purple-500 text-transparent bg-clip-text transition-all duration-500 cursor-default">
              Feature Comparison
            </h2>
          </div>

          <Card
            className={`overflow-hidden border-0 bg-background/80 backdrop-blur-sm shadow-xl ${
              visibleSections.has("comparison")
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}
            style={{
              transition: "all 0.7s ease-out",
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-muted-foreground/20">
                    <th className="text-left p-6 font-semibold text-lg">
                      Feature
                    </th>
                    <th className="text-center p-6 font-semibold text-lg text-primary">
                      WebPro
                    </th>
                    <th className="text-center p-6 font-semibold text-lg text-muted-foreground">
                      Squarespace
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, index) => (
                    <tr
                      key={`${item.feature}-${index}`}
                      className="border-b border-muted-foreground/10 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-6 font-medium">{item.feature}</td>
                      <td className="p-6 text-center">
                        {item.webpro === true ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full">
                            <Check className="w-5 h-5 text-primary" />
                          </div>
                        ) : (
                          <span className="text-primary font-semibold">
                            {item.webpro}
                          </span>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {item.competitor === true ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full">
                            <Check className="w-5 h-5 text-green-500" />
                          </div>
                        ) : item.competitor === false ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-full">
                            <X className="w-5 h-5 text-red-500" />
                          </div>
                        ) : (
                          <span className="text-muted-foreground font-semibold">
                            {item.competitor}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        data-section
        className={getSectionClasses("cta", "py-20 px-4 relative z-10")}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text">
            Ready to take your agency to the next level?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sign up for WebPro today and experience the difference.
          </p>
          <Link
            href="/agency"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary-foreground text-white rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 group"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer Links */}
      <footer
        id="footer"
        data-section
        className={getSectionClasses(
          "footer",
          "py-16 border-t border-muted-foreground/20 relative z-10"
        )}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-muted-foreground">
            <Link
              href="/site/about"
              className="hover:text-foreground transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/site/documentation"
              className="hover:text-foreground transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="/site/pricing"
              className="hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </div>

          <div className="text-center mt-8 text-muted-foreground">
            <p>©2025 WebPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
