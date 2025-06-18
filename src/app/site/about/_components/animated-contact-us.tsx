"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Icon mapping object
const iconMap = {
  Mail,
  Phone,
  MapPin,
};

interface ContactMethod {
  icon: keyof typeof iconMap;
  title: string;
  content: string;
  href: string;
  type: "email" | "phone" | "location";
}

interface AnimatedContactCardsProps {
  contactMethods: ContactMethod[];
  className?: string;
  animationType?: "pulse" | "float" | "connect" | "glow" | "orbit";
}

export const AnimatedContactCards: React.FC<AnimatedContactCardsProps> = ({
  contactMethods,
  className = "",
  animationType = "pulse",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const cardElements = cardsRef.current.filter(
      (card): card is HTMLDivElement => card !== null
    );

    // Setup animations based on type
    if (animationType === "pulse") {
      setupPulseAnimation(cardElements);
    } else if (animationType === "float") {
      setupFloatAnimation(cardElements);
    } else if (animationType === "connect") {
      setupConnectAnimation(cardElements);
    } else if (animationType === "glow") {
      setupGlowAnimation(cardElements);
    } else if (animationType === "orbit") {
      setupOrbitAnimation(cardElements);
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [contactMethods, animationType]);

  const setupPulseAnimation = (cardElements: HTMLDivElement[]) => {
    // Set initial states
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".contact-card");
      const iconContainer = card.querySelector(".icon-container");
      const icon = card.querySelector(".contact-icon");
      const title = card.querySelector(".contact-title");
      const content = card.querySelector(".contact-content");

      gsap.set(cardWrapper, {
        opacity: 0,
        scale: 0.5,
        y: 100,
        filter: "blur(10px)",
      });

      gsap.set(iconContainer, {
        scale: 0,
        rotation: 180,
      });

      gsap.set(icon, {
        scale: 0,
        rotation: -180,
      });

      gsap.set([title, content], {
        opacity: 0,
        y: 30,
      });
    });

    // Create pulse entrance
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "restart none restart reverse",
      },
    });

    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".contact-card");
      const iconContainer = card.querySelector(".icon-container");
      const icon = card.querySelector(".contact-icon");
      const title = card.querySelector(".contact-title");
      const content = card.querySelector(".contact-content");

      const delay = index * 0.2;

      // Card entrance with blur clear
      tl.to(
        cardWrapper,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "back.out(1.4)",
        },
        delay
      )
        // Icon container pulse
        .to(
          iconContainer,
          {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.6)",
          },
          delay + 0.2
        )
        // Icon counter-pulse
        .to(
          icon,
          {
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          delay + 0.3
        )
        // Title pulse
        .to(
          title,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          delay + 0.4
        )
        // Content pulse
        .to(
          content,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          delay + 0.5
        )
        // Final card pulse
        .to(
          cardWrapper,
          {
            scale: 1.05,
            duration: 0.15,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
          },
          delay + 0.7
        );
    });

    // Continuous pulse effect
    cardElements.forEach((card, index) => {
      const iconContainer = card.querySelector(".icon-container");
      gsap.to(iconContainer, {
        scale: 1.1,
        duration: 2 + index * 0.3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.5,
      });
    });

    addContactHoverEffects(cardElements);
  };

  const setupFloatAnimation = (cardElements: HTMLDivElement[]) => {
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".contact-card");

      gsap.set(cardWrapper, {
        opacity: 0,
        y: 150,
        rotationX: 45,
        scale: 0.8,
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

    // Cards float up
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".contact-card");
      const icon = card.querySelector(".contact-icon");

      tl.to(
        cardWrapper,
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        },
        index * 0.15
      ).from(
        icon,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "bounce.out",
        },
        index * 0.15 + 0.3
      );
    });

    // Continuous floating motion
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".contact-card");
      gsap.to(cardWrapper, {
        y: Math.sin(index) * 8,
        rotationZ: Math.cos(index) * 2,
        duration: 3 + index * 0.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.3,
      });
    });

    addContactHoverEffects(cardElements);
  };

  const setupConnectAnimation = (cardElements: HTMLDivElement[]) => {
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".contact-card");

      // Position cards in line formation
      gsap.set(cardWrapper, {
        opacity: 0,
        x: index === 0 ? -200 : index === 2 ? 200 : 0,
        y: index === 1 ? -100 : 0,
        scale: 0.7,
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

    // Cards connect to center
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".contact-card");
      const icon = card.querySelector(".contact-icon");

      tl.to(
        cardWrapper,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "elastic.out(1, 0.6)",
        },
        index * 0.2
      ).from(
        icon,
        {
          rotation: 180,
          scale: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        index * 0.2 + 0.3
      );
    });

    // Draw connection lines (visual effect)
    tl.call(
      () => {
        cardElements.forEach((card, index) => {
          if (index < cardElements.length - 1) {
            const currentCard = card.querySelector(
              ".contact-card"
            ) as HTMLElement;
            const nextCard = cardElements[index + 1]?.querySelector(
              ".contact-card"
            ) as HTMLElement;

            if (currentCard && nextCard) {
              // Create temporary connection line effect
              gsap.fromTo(
                currentCard,
                { boxShadow: "0 0 0px rgba(59, 130, 246, 0)" },
                {
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                  duration: 0.3,
                  yoyo: true,
                  repeat: 1,
                  delay: index * 0.1,
                }
              );
            }
          }
        });
      },
      [],
      1
    );

    addContactHoverEffects(cardElements);
  };

  const setupGlowAnimation = (cardElements: HTMLDivElement[]) => {
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".contact-card");
      const iconContainer = card.querySelector(".icon-container");

      gsap.set(cardWrapper, {
        opacity: 0,
        scale: 0.3,
        filter: "brightness(0) saturate(0)",
      });

      gsap.set(iconContainer, {
        filter: "drop-shadow(0 0 0px rgba(59, 130, 246, 0))",
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

    // Glow effect entrance
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".contact-card");
      const iconContainer = card.querySelector(".icon-container");

      tl.to(
        cardWrapper,
        {
          opacity: 1,
          scale: 1,
          filter: "brightness(1) saturate(1)",
          duration: 0.8,
          ease: "power2.out",
        },
        index * 0.2
      ).to(
        iconContainer,
        {
          filter: "drop-shadow(0 0 15px rgba(59, 130, 246, 0.8))",
          duration: 0.6,
          ease: "power2.out",
        },
        index * 0.2 + 0.2
      );
    });

    // Continuous glow pulse
    cardElements.forEach((card, index) => {
      const iconContainer = card.querySelector(".icon-container");
      gsap.to(iconContainer, {
        filter: "drop-shadow(0 0 25px rgba(59, 130, 246, 1))",
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.4,
      });
    });

    addContactHoverEffects(cardElements);
  };

  const setupOrbitAnimation = (cardElements: HTMLDivElement[]) => {
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".contact-card");

      // Orbital positioning
      const angle = index * 120 * (Math.PI / 180);
      const radius = 150;

      gsap.set(cardWrapper, {
        opacity: 0,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        rotation: index * 120,
        scale: 0.5,
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

    // Cards orbit to center
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".contact-card");

      tl.to(
        cardWrapper,
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
        },
        index * 0.15
      );
    });

    // Continuous orbital motion for icons
    cardElements.forEach((card, index) => {
      const icon = card.querySelector(".contact-icon");
      gsap.to(icon, {
        rotation: 360,
        duration: 6 + index * 2,
        ease: "none",
        repeat: -1,
      });
    });

    addContactHoverEffects(cardElements);
  };

  const addContactHoverEffects = (cardElements: HTMLDivElement[]) => {
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".contact-card") as HTMLElement;
      const iconContainer = card.querySelector(
        ".icon-container"
      ) as HTMLElement;
      const icon = card.querySelector(".contact-icon") as HTMLElement;

      if (!cardWrapper) return;

      let hoverTl: gsap.core.Timeline;

      const handleMouseEnter = () => {
        hoverTl = gsap.timeline();

        hoverTl
          .to(cardWrapper, {
            scale: 1.1,
            y: -20,
            rotationY: index % 2 === 0 ? 5 : -5,
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            duration: 0.4,
            ease: "power2.out",
          })
          .to(
            iconContainer,
            {
              scale: 1.2,
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              duration: 0.4,
              ease: "power2.out",
            },
            0
          )
          .to(
            icon,
            {
              scale: 1.2,
              rotation: "+=15",
              color: "#3b82f6",
              duration: 0.4,
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
          rotationY: 0,
          boxShadow: "0 0px 0px rgba(0,0,0,0)",
          duration: 0.4,
          ease: "power2.out",
        });

        gsap.to(iconContainer, {
          scale: 1,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          duration: 0.4,
          ease: "power2.out",
        });

        gsap.to(icon, {
          scale: 1,
          duration: 0.4,
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
      className={`grid md:grid-cols-3 gap-8 ${className}`}
    >
      {contactMethods.map((method, index) => {
        // Get the icon component from the iconMap
        const IconComponent = iconMap[method.icon];

        return (
          <div
            key={method.title}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
          >
            <Card className="contact-card text-center p-8 border-0 bg-background/80 hover:shadow-lg transition-shadow transform-gpu will-change-transform">
              <div className="icon-container w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 transform-gpu will-change-transform">
                <IconComponent className="contact-icon w-8 h-8 text-primary transform-gpu will-change-transform" />
              </div>
              <h3 className="contact-title font-semibold text-lg mb-2 transform-gpu will-change-transform">
                {method.title}
              </h3>
              {method.type === "location" ? (
                <p className="contact-content text-muted-foreground transform-gpu will-change-transform">
                  {method.content}
                </p>
              ) : (
                <Link
                  href={method.href}
                  className="contact-content text-primary font-semibold hover:underline transform-gpu will-change-transform"
                >
                  {method.content}
                </Link>
              )}
            </Card>
          </div>
        );
      })}
    </div>
  );
};
