"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PricingCardData {
  id?: string;
  nickname?: string | null; // Allow null to match Stripe's type
  title: string;
  description: string;
  price: number | string;
  interval?: string;
  features: string[];
  isPopular?: boolean;
  isFree?: boolean;
  href: string;
}

interface AnimatedPricingCardsProps {
  cards: PricingCardData[];
  className?: string;
}

export const AnimatedPricingCards: React.FC<AnimatedPricingCardsProps> = ({
  cards,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || cardsRef.current.length === 0) return;

    const cardElements = cardsRef.current.filter(Boolean);

    // Set initial states for all cards
    cardElements.forEach((card, index) => {
      if (!card) return;

      const cardWrapper = card.querySelector(".pricing-card");
      const popularBadge = card.querySelector(".popular-badge");
      const cardHeader = card.querySelector(".card-header");
      const price = card.querySelector(".price-display");
      const features = card.querySelectorAll(".feature-item");
      const ctaButton = card.querySelector(".cta-button");
      const glowEffect = card.querySelector(".glow-effect");

      // Initial hidden states
      gsap.set(cardWrapper, {
        y: 100,
        opacity: 0,
        scale: 0.8,
        rotationY: 15,
      });

      gsap.set(popularBadge, {
        y: -20,
        opacity: 0,
        scale: 0.8,
      });

      gsap.set([cardHeader, price], {
        y: 30,
        opacity: 0,
      });

      gsap.set(features, {
        x: -30,
        opacity: 0,
      });

      gsap.set(ctaButton, {
        y: 20,
        opacity: 0,
        scale: 0.9,
      });

      gsap.set(glowEffect, {
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
    cardElements.forEach((card, index) => {
      if (!card) return;

      const cardWrapper = card.querySelector(".pricing-card");
      const popularBadge = card.querySelector(".popular-badge");
      const cardHeader = card.querySelector(".card-header");
      const price = card.querySelector(".price-display");
      const features = card.querySelectorAll(".feature-item");
      const ctaButton = card.querySelector(".cta-button");
      const glowEffect = card.querySelector(".glow-effect");

      const delay = index * 0.2;

      // Card entrance
      masterTimeline.to(
        cardWrapper,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          ease: "back.out(1.4)",
        },
        delay
      );

      // Popular badge
      if (popularBadge) {
        masterTimeline.to(
          popularBadge,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          delay + 0.2
        );
      }

      // Glow effect for popular cards
      if (glowEffect) {
        masterTimeline.to(
          glowEffect,
          {
            opacity: 0.3,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          delay + 0.3
        );
      }

      // Header content
      masterTimeline.to(
        cardHeader,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        delay + 0.4
      );

      // Price with bounce
      masterTimeline.to(
        price,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.5)",
        },
        delay + 0.5
      );

      // Features with stagger
      masterTimeline.to(
        features,
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1,
        },
        delay + 0.6
      );

      // CTA Button
      masterTimeline.to(
        ctaButton,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.3)",
        },
        delay + 0.8
      );
    });

    // Add hover animations
    cardElements.forEach((card, index) => {
      if (!card) return;

      const cardWrapper = card.querySelector(".pricing-card") as HTMLElement;
      const ctaButton = card.querySelector(".cta-button") as HTMLElement;
      const glowEffect = card.querySelector(".glow-effect") as HTMLElement;
      const price = card.querySelector(".price-display") as HTMLElement;

      if (!cardWrapper) return;

      let hoverTl: gsap.core.Timeline;

      const handleMouseEnter = () => {
        hoverTl = gsap.timeline();

        hoverTl
          .to(cardWrapper, {
            y: -10,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
          })
          .to(
            price,
            {
              scale: 1.05,
              duration: 0.3,
              ease: "power2.out",
            },
            0
          )
          .to(
            ctaButton,
            {
              scale: 1.05,
              duration: 0.3,
              ease: "power2.out",
            },
            0
          );

        if (glowEffect) {
          hoverTl.to(
            glowEffect,
            {
              opacity: 0.5,
              scale: 1.1,
              duration: 0.3,
              ease: "power2.out",
            },
            0
          );
        }
      };

      const handleMouseLeave = () => {
        if (hoverTl) hoverTl.kill();

        gsap.to(cardWrapper, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(price, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(ctaButton, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });

        if (glowEffect) {
          gsap.to(glowEffect, {
            opacity: 0.3,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      };

      cardWrapper.addEventListener("mouseenter", handleMouseEnter);
      cardWrapper.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      masterTimeline.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [cards]);

  return (
    <div
      ref={containerRef}
      className={`flex justify-center gap-8 flex-wrap max-w-6xl ${className}`}
    >
      {cards.map((card, index) => (
        <div
          key={card.title}
          ref={(el) => {
            cardsRef.current[index] = el;
          }}
        >
          <Card
            className={clsx(
              "pricing-card w-[350px] flex flex-col justify-between relative overflow-hidden transition-all duration-300 transform-gpu will-change-transform",
              {
                "border-2 border-primary shadow-xl shadow-primary/20 scale-105":
                  card.isPopular,
                "border border-muted-foreground/20": !card.isPopular,
              }
            )}
          >
            {/* Glow effect for popular cards */}
            {card.isPopular && (
              <div className="glow-effect absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg" />
            )}

            {/* Popular badge */}
            {card.isPopular && (
              <div className="popular-badge absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-secondary-foreground text-white text-center py-2 text-sm font-semibold">
                Most Popular
              </div>
            )}

            <CardHeader
              className={clsx("card-header relative z-10", {
                "pt-12": card.isPopular,
              })}
            >
              <CardTitle
                className={clsx("text-2xl", {
                  "text-primary": card.isPopular,
                  "text-muted-foreground": !card.isPopular,
                })}
              >
                {card.title}
              </CardTitle>
              <CardDescription className="text-base">
                {card.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10">
              <div className="price-display mb-6">
                <span className="text-5xl font-bold">
                  {typeof card.price === "string"
                    ? card.price
                    : `$${card.price}`}
                </span>
                {card.interval && (
                  <span className="text-muted-foreground text-lg">
                    /{card.interval}
                  </span>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-start gap-6 relative z-10">
              <div className="space-y-3">
                {card.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="feature-item flex gap-3 items-center"
                  >
                    <div
                      className={clsx("rounded-full p-1", {
                        "bg-primary/20": card.isPopular,
                        "bg-muted": !card.isPopular,
                      })}
                    >
                      <Check
                        className={clsx("w-4 h-4", {
                          "text-primary": card.isPopular,
                          "text-muted-foreground": !card.isPopular,
                        })}
                      />
                    </div>
                    <p className="text-sm">{feature}</p>
                  </div>
                ))}
              </div>

              <Link
                href={card.href}
                className={clsx(
                  "cta-button w-full text-center p-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 group transform-gpu will-change-transform",
                  {
                    "bg-gradient-to-r from-primary to-secondary-foreground text-white hover:shadow-lg hover:shadow-primary/25":
                      card.isPopular,
                    "bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-background":
                      !card.isPopular,
                  }
                )}
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
};
