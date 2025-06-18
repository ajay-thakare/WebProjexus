"use client";

import { useEffect, useRef, useState } from "react";
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
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

interface LiquidFeatureCardsProps {
  features: FeatureCardData[];
  className?: string;
}

export const LiquidFeatureCards: React.FC<LiquidFeatureCardsProps> = ({
  features,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current || cardsRef.current.length === 0) return;

    const cards = cardsRef.current.filter(Boolean);

    // Set initial states
    cards.forEach((card) => {
      if (!card) return;

      const cardElement = card.querySelector(".card-wrapper");
      const liquidBg = card.querySelector(".liquid-bg");
      const icon = card.querySelector(".feature-icon");
      const iconBg = card.querySelector(".icon-background");
      const content = card.querySelector(".card-content");
      gsap.set(cardElement, {
        opacity: 0,
        y: 80,
        scale: 0.8,
      });

      gsap.set(liquidBg, {
        scale: 0,
        borderRadius: "50%",
      });

      gsap.set([icon, iconBg], {
        scale: 0,
        rotation: 360,
      });

      gsap.set(content, {
        opacity: 0,
        y: 30,
      });
    });

    // Create entrance animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "restart none restart reverse",
      },
    });

    cards.forEach((card, index) => {
      if (!card) return;

      const cardElement = card.querySelector(".card-wrapper");
      const liquidBg = card.querySelector(".liquid-bg");
      const icon = card.querySelector(".feature-icon");
      const iconBg = card.querySelector(".icon-background");
      const content = card.querySelector(".card-content");

      // Card entrance
      tl.to(
        cardElement,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        index * 0.15
      );

      // Liquid background morph
      tl.to(
        liquidBg,
        {
          scale: 1,
          borderRadius: "16px",
          duration: 1.2,
          ease: "elastic.out(1, 0.8)",
        },
        index * 0.15 + 0.2
      );

      // Icon background pop
      tl.to(
        iconBg,
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        index * 0.15 + 0.4
      );

      // Icon spin-in
      tl.to(
        icon,
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: "back.out(1.3)",
        },
        index * 0.15 + 0.5
      );

      // Content fade-in
      tl.to(
        content,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        index * 0.15 + 0.6
      );
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [features]);

  // Add hover effects for each card
  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);

    cards.forEach((card) => {
      if (!card) return;

      const cardElement = card.querySelector(".card-wrapper") as HTMLElement;
      const liquidBg = card.querySelector(".liquid-bg") as HTMLElement;
      const icon = card.querySelector(".feature-icon") as HTMLElement;
      const iconBg = card.querySelector(".icon-background") as HTMLElement;
      const ripple = card.querySelector(".ripple-effect") as HTMLElement;

      if (!cardElement) return;

      let isHovering = false;

      const handleMouseEnter = () => {
        isHovering = true;

        const hoverTl = gsap.timeline();

        hoverTl
          .to(cardElement, {
            scale: 1.05,
            y: -12,
            duration: 0.4,
            ease: "power2.out",
          })
          .to(
            liquidBg,
            {
              scale: 1.1,
              borderRadius: "24px",
              duration: 0.6,
              ease: "elastic.out(1, 0.6)",
            },
            0
          )
          .to(
            iconBg,
            {
              scale: 1.2,
              rotation: 10,
              duration: 0.4,
              ease: "power2.out",
            },
            0
          )
          .to(
            icon,
            {
              scale: 1.1,
              rotation: -5,
              duration: 0.4,
              ease: "power2.out",
            },
            0.1
          )
          .to(
            ripple,
            {
              scale: 2,
              opacity: 0,
              duration: 0.8,
              ease: "power2.out",
            },
            0
          );
      };

      const handleMouseLeave = () => {
        isHovering = false;

        gsap.to(cardElement, {
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        });

        gsap.to(liquidBg, {
          scale: 1,
          borderRadius: "16px",
          duration: 0.6,
          ease: "elastic.out(1, 0.6)",
        });

        gsap.to(iconBg, {
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: "power2.out",
        });

        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isHovering) return;

        const rect = cardElement.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;

        gsap.to(liquidBg, {
          x: x * 0.5,
          y: y * 0.5,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(iconBg, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      cardElement.addEventListener("mouseenter", handleMouseEnter);
      cardElement.addEventListener("mouseleave", handleMouseLeave);
      cardElement.addEventListener("mousemove", handleMouseMove);

      return () => {
        cardElement.removeEventListener("mouseenter", handleMouseEnter);
        cardElement.removeEventListener("mouseleave", handleMouseLeave);
        cardElement.removeEventListener("mousemove", handleMouseMove);
      };
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={`grid md:grid-cols-3 gap-8 ${className}`}
    >
      {features.map((feature, index) => {
        const IconComponent = iconMap[feature.icon] || Users;
        return (
          <div
            key={feature.title}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
          >
            <Card className="card-wrapper group relative overflow-hidden border-0 bg-transparent cursor-pointer transform-gpu will-change-transform">
              {/* Liquid morphing background */}
              <div
                className={`liquid-bg absolute inset-2 bg-gradient-to-br ${feature.gradient} opacity-10 transform-gpu will-change-transform`}
                style={{
                  filter: "blur(1px)",
                }}
              />

              {/* Ripple effect on hover */}
              <div className="ripple-effect absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-lg scale-0 opacity-0" />

              <CardHeader className="relative z-10 p-8">
                {/* Icon with liquid background */}
                <div className="relative mb-6">
                  <div
                    className={`icon-background w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center transform-gpu will-change-transform shadow-lg`}
                  >
                    <IconComponent className="feature-icon w-10 h-10 text-white transform-gpu will-change-transform" />
                  </div>
                </div>

                <div className="card-content">
                  <CardTitle className="text-2xl mb-4 font-bold">
                    {feature.title}
                  </CardTitle>

                  <CardDescription className="text-base leading-relaxed mb-6 text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 px-8 pb-8">
                <div className="flex items-center text-primary font-semibold gap-2 group-hover:gap-3 transition-all">
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};
