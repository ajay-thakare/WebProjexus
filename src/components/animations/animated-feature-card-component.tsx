"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Users,
  MousePointer,
  CreditCard,
  LucideIcon,
} from "lucide-react";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Icon mapping for server-safe usage
const iconMap: Record<string, LucideIcon> = {
  Users,
  MousePointer,
  CreditCard,
};

interface FeatureCardData {
  icon: string; // Changed from LucideIcon to string
  title: string;
  description: string;
  gradient: string;
}

interface AnimatedFeatureCardsProps {
  features: FeatureCardData[];
  className?: string;
}

export const AnimatedFeatureCards: React.FC<AnimatedFeatureCardsProps> = ({
  features,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || cardsRef.current.length === 0) return;

    const cards = cardsRef.current.filter(Boolean);

    // Set initial states for all animated elements
    cards.forEach((card, index) => {
      if (!card) return;

      const cardElement = card.querySelector(".card-wrapper");
      const icon = card.querySelector(".feature-icon");
      const iconBg = card.querySelector(".icon-background");
      const title = card.querySelector(".feature-title");
      const description = card.querySelector(".feature-description");
      const learnMore = card.querySelector(".learn-more");
      const gradientBg = card.querySelector(".gradient-bg");

      // Initial hidden states
      gsap.set(cardElement, {
        scale: 0.3,
        opacity: 0,
        y: 100,
        rotationY: 15,
      });

      gsap.set([icon, iconBg], {
        scale: 0,
        rotation: 180,
      });

      gsap.set([title, description, learnMore], {
        opacity: 0,
        y: 30,
      });

      gsap.set(gradientBg, {
        opacity: 0,
        scale: 0.5,
      });
    });

    // Create master timeline
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "restart none restart reverse",
      },
    });

    // Animate each card with staggered timing
    cards.forEach((card, index) => {
      if (!card) return;

      const cardElement = card.querySelector(".card-wrapper");
      const icon = card.querySelector(".feature-icon");
      const iconBg = card.querySelector(".icon-background");
      const title = card.querySelector(".feature-title");
      const description = card.querySelector(".feature-description");
      const learnMore = card.querySelector(".learn-more");
      const gradientBg = card.querySelector(".gradient-bg");

      // Card entrance animation
      masterTimeline.to(
        cardElement,
        {
          scale: 1,
          opacity: 1,
          y: 0,
          rotationY: 0,
          duration: 0.8,
          ease: "back.out(1.2)",
        },
        index * 0.2
      );

      // Gradient background
      masterTimeline.to(
        gradientBg,
        {
          opacity: 0.05,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        index * 0.2 + 0.2
      );

      // Icon background
      masterTimeline.to(
        iconBg,
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: "back.out(1.5)",
        },
        index * 0.2 + 0.3
      );

      // Icon
      masterTimeline.to(
        icon,
        {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(1.3)",
        },
        index * 0.2 + 0.4
      );

      // Title
      masterTimeline.to(
        title,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        index * 0.2 + 0.5
      );

      // Description
      masterTimeline.to(
        description,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        index * 0.2 + 0.6
      );

      // Learn more
      masterTimeline.to(
        learnMore,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        index * 0.2 + 0.7
      );
    });

    // Add hover animations for each card
    cards.forEach((card) => {
      if (!card) return;

      const cardElement = card.querySelector(".card-wrapper") as HTMLElement;
      const icon = card.querySelector(".feature-icon") as HTMLElement;
      const iconBg = card.querySelector(".icon-background") as HTMLElement;
      const gradientBg = card.querySelector(".gradient-bg") as HTMLElement;
      const learnMore = card.querySelector(".learn-more") as HTMLElement;

      if (!cardElement) return;

      let hoverTl: gsap.core.Timeline;

      cardElement.addEventListener("mouseenter", () => {
        hoverTl = gsap.timeline();

        hoverTl
          .to(cardElement, {
            scale: 1.02,
            y: -8,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            duration: 0.3,
            ease: "power2.out",
          })
          .to(
            iconBg,
            {
              scale: 1.1,
              duration: 0.3,
              ease: "power2.out",
            },
            0
          )
          .to(
            icon,
            {
              scale: 1.1,
              rotation: 5,
              duration: 0.3,
              ease: "power2.out",
            },
            0
          )
          .to(
            gradientBg,
            {
              opacity: 0.1,
              scale: 1.05,
              duration: 0.3,
              ease: "power2.out",
            },
            0
          )
          .to(
            learnMore,
            {
              x: 5,
              duration: 0.3,
              ease: "power2.out",
            },
            0
          );
      });

      cardElement.addEventListener("mouseleave", () => {
        if (hoverTl) hoverTl.kill();

        gsap.to(cardElement, {
          scale: 1,
          y: 0,
          boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(iconBg, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(gradientBg, {
          opacity: 0.05,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(learnMore, {
          x: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    return () => {
      masterTimeline.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [features]);

  return (
    <div
      ref={containerRef}
      className={`grid md:grid-cols-3 gap-8 ${className}`}
    >
      {features.map((feature, index) => {
        const IconComponent = iconMap[feature.icon] || Users; // Fallback to Users icon
        return (
          <div
            key={feature.title}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
          >
            <Card className="card-wrapper group relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/30 cursor-pointer transform-gpu will-change-transform">
              {/* Animated gradient background */}
              <div
                className={`gradient-bg absolute inset-0 bg-gradient-to-br ${feature.gradient} transition-opacity`}
              />

              <CardHeader className="relative z-10">
                {/* Icon with animated background */}
                <div className="relative mb-4">
                  <div
                    className={`icon-background w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center transform-gpu will-change-transform`}
                  >
                    <IconComponent className="feature-icon w-8 h-8 text-white transform-gpu will-change-transform" />
                  </div>
                </div>

                <CardTitle className="feature-title text-2xl mb-3 transform-gpu will-change-transform">
                  {feature.title}
                </CardTitle>

                <CardDescription className="feature-description text-base leading-relaxed transform-gpu will-change-transform">
                  {feature.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10">
                <div className="learn-more flex items-center text-primary font-semibold gap-2 transform-gpu will-change-transform">
                  Learn more
                  <ArrowRight className="w-4 h-4 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};
