"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Lightbulb,
  Users,
  Shield,
  Heart,
  Star,
  Zap,
  Target,
  LucideIcon,
} from "lucide-react";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Icon mapping to convert string names to components
const iconMap: Record<string, LucideIcon> = {
  Lightbulb,
  Users,
  Shield,
  Heart,
  Star,
  Zap,
  Target,
};

interface ValueCard {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

interface AnimatedValuesCardsProps {
  values: ValueCard[];
  className?: string;
  animationType?: "cascade" | "spiral" | "magnetic" | "orbit";
}

export const AnimatedValuesCards: React.FC<AnimatedValuesCardsProps> = ({
  values,
  className = "",
  animationType = "cascade",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const cardElements = cardsRef.current.filter(
      (card): card is HTMLDivElement => card !== null
    );

    //  animations based on type
    if (animationType === "cascade") {
      setupCascadeAnimation(cardElements);
    } else if (animationType === "spiral") {
      setupSpiralAnimation(cardElements);
    } else if (animationType === "magnetic") {
      setupMagneticAnimation(cardElements);
    } else if (animationType === "orbit") {
      setupOrbitAnimation(cardElements);
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [values, animationType]);

  const setupCascadeAnimation = (cardElements: HTMLDivElement[]) => {
    // Set initial states
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".values-card");
      const icon = card.querySelector(".value-icon");
      const iconBg = card.querySelector(".icon-background");
      const title = card.querySelector(".value-title");
      const description = card.querySelector(".value-description");
      const gradientBg = card.querySelector(".gradient-bg");

      gsap.set(cardWrapper, {
        opacity: 0,
        y: 100 + index * 20,
        x: index % 2 === 0 ? -50 : 50,
        scale: 0.7,
        rotationY: index % 2 === 0 ? -15 : 15,
      });

      gsap.set(iconBg, {
        scale: 0,
        rotation: 360,
      });

      gsap.set(icon, {
        scale: 0,
        rotation: -360,
      });

      gsap.set([title, description], {
        opacity: 0,
        y: 30,
      });

      gsap.set(gradientBg, {
        opacity: 0,
        scale: 0.5,
      });
    });

    // Create master timeline
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "restart none restart reverse",
      },
    });

    // Animate each card with cascade effect
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".values-card");
      const icon = card.querySelector(".value-icon");
      const iconBg = card.querySelector(".icon-background");
      const title = card.querySelector(".value-title");
      const description = card.querySelector(".value-description");
      const gradientBg = card.querySelector(".gradient-bg");

      const delay = index * 0.2;

      // Card entrance
      masterTl.to(
        cardWrapper,
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          ease: "back.out(1.4)",
        },
        delay
      );

      // Gradient background
      masterTl.to(
        gradientBg,
        {
          opacity: 0.05,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        delay + 0.2
      );

      // Icon background spin
      masterTl.to(
        iconBg,
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        delay + 0.3
      );

      // Icon counter-spin
      masterTl.to(
        icon,
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: "back.out(1.5)",
        },
        delay + 0.4
      );

      // Title
      masterTl.to(
        title,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        delay + 0.5
      );

      // Description
      masterTl.to(
        description,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        delay + 0.6
      );
    });

    // Add hover animations
    addHoverEffects(cardElements);
  };

  const setupSpiralAnimation = (cardElements: HTMLDivElement[]) => {
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".values-card");
      const icon = card.querySelector(".value-icon");
      const iconBg = card.querySelector(".icon-background");

      // Spiral positioning
      const angle = index * 90 * (Math.PI / 180);
      const radius = 200;

      gsap.set(cardWrapper, {
        opacity: 0,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        scale: 0.3,
        rotation: index * 90,
      });

      gsap.set([iconBg, icon], {
        scale: 0,
        rotation: 180,
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "restart none restart reverse",
      },
    });

    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".values-card");
      const icon = card.querySelector(".value-icon");
      const iconBg = card.querySelector(".icon-background");
      const content = card.querySelectorAll(".value-title, .value-description");

      const delay = index * 0.3;

      tl.to(
        cardWrapper,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.6)",
        },
        delay
      )
        .to(
          [iconBg, icon],
          {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(1.5)",
            stagger: 0.1,
          },
          delay + 0.3
        )
        .to(
          content,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
          },
          delay + 0.6
        );
    });

    addHoverEffects(cardElements);
  };

  const setupMagneticAnimation = (cardElements: HTMLDivElement[]) => {
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".values-card");

      gsap.set(cardWrapper, {
        opacity: 0,
        x: `random(-300, 300)`,
        y: `random(-200, 200)`,
        scale: 0.2,
        rotation: `random(-180, 180)`,
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "restart none restart reverse",
      },
    });

    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".values-card");
      const icon = card.querySelector(".value-icon");
      const iconBg = card.querySelector(".icon-background");

      tl.to(
        cardWrapper,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 1.5,
          ease: "elastic.out(1, 0.8)",
        },
        index * 0.15
      ).from(
        [iconBg, icon],
        {
          scale: 0,
          rotation: 360,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.1,
        },
        index * 0.15 + 0.5
      );
    });

    addHoverEffects(cardElements);
  };

  const setupOrbitAnimation = (cardElements: HTMLDivElement[]) => {
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".values-card");
      const icon = card.querySelector(".value-icon");

      gsap.set(cardWrapper, {
        opacity: 0,
        scale: 0,
      });

      gsap.set(icon, {
        rotation: 0,
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "restart none restart reverse",
      },
    });

    // Cards appear in sequence
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".values-card");

      tl.to(
        cardWrapper,
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        index * 0.2
      );
    });

    // Continuous orbit rotation for icons
    cardElements.forEach((card, index) => {
      const icon = card.querySelector(".value-icon");
      gsap.to(icon, {
        rotation: 360,
        duration: 8 + index * 2,
        ease: "none",
        repeat: -1,
      });
    });

    addHoverEffects(cardElements);
  };

  const addHoverEffects = (cardElements: HTMLDivElement[]) => {
    cardElements.forEach((card) => {
      const cardWrapper = card.querySelector(".values-card") as HTMLElement;
      const icon = card.querySelector(".value-icon") as HTMLElement;
      const iconBg = card.querySelector(".icon-background") as HTMLElement;

      if (!cardWrapper) return;

      let hoverTl: gsap.core.Timeline;

      const handleMouseEnter = () => {
        hoverTl = gsap.timeline();

        hoverTl
          .to(cardWrapper, {
            scale: 1.05,
            y: -10,
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
              rotation: "+=10",
              duration: 0.3,
              ease: "power2.out",
            },
            0
          );
      };

      const handleMouseLeave = () => {
        if (hoverTl) hoverTl.kill();

        gsap.to(cardWrapper, {
          scale: 1,
          y: 0,
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
          duration: 0.3,
          ease: "power2.out",
        });
      };

      cardWrapper.addEventListener("mouseenter", handleMouseEnter);
      cardWrapper.addEventListener("mouseleave", handleMouseLeave);
    });
  };

  return (
    <div
      ref={containerRef}
      className={`grid md:grid-cols-2 lg:grid-cols-4 gap-8 ${className}`}
    >
      {values.map((value, index) => {
        // Get the icon component from the string name
        const IconComponent = iconMap[value.icon] || Lightbulb; // Fallback to Lightbulb if icon not found

        return (
          <div
            key={value.title}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
          >
            <Card className="values-card group relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 transform-gpu will-change-transform">
              <div
                className={`gradient-bg absolute inset-0 bg-gradient-to-br ${value.gradient} transition-opacity`}
              />

              <CardHeader className="relative text-center p-8">
                <div
                  className={`icon-background w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mx-auto mb-4 transform-gpu will-change-transform`}
                >
                  <IconComponent className="value-icon w-8 h-8 text-white transform-gpu will-change-transform" />
                </div>
                <CardTitle className="value-title text-xl mb-3 transform-gpu will-change-transform">
                  {value.title}
                </CardTitle>
                <CardDescription className="value-description text-sm leading-relaxed transform-gpu will-change-transform">
                  {value.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        );
      })}
    </div>
  );
};
