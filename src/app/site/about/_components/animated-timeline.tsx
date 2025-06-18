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

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TimelineMilestone {
  year: string;
  event: string;
  description: string;
}

interface AnimatedTimelineProps {
  milestones: TimelineMilestone[];
  className?: string;
}

export const AnimatedTimeline: React.FC<AnimatedTimelineProps> = ({
  milestones,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const milestonesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || !timelineLineRef.current) return;

    const milestoneElements = milestonesRef.current.filter(Boolean);

    // Set initial states
    gsap.set(timelineLineRef.current, {
      scaleY: 0,
      transformOrigin: "top center",
    });

    milestoneElements.forEach((milestone, index) => {
      if (!milestone) return;

      const card = milestone.querySelector(".timeline-card");
      const dot = milestone.querySelector(".timeline-dot");
      const yearBadge = milestone.querySelector(".year-badge");
      const content = milestone.querySelector(".timeline-content");

      // Enhanced initial hidden states for better staggered effect
      gsap.set(card, {
        opacity: 0,
        x: index % 2 === 0 ? -150 : 150, // Increased distance for more dramatic effect
        y: 50,
        scale: 0.7,
        rotation: index % 2 === 0 ? -5 : 5, // Slight rotation for dynamic entrance
      });

      gsap.set(dot, {
        scale: 0,
        opacity: 0,
        rotation: 360, // Full rotation for dramatic entrance
      });

      gsap.set(yearBadge, {
        scale: 0,
        rotation: 180,
        opacity: 0,
        y: -20,
      });

      gsap.set(content, {
        opacity: 0,
        y: 40,
        x: index % 2 === 0 ? -20 : 20,
      });
    });

    // Progressive Line Animation based on scroll progress
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1, // Smooth scrubbing animation
      onUpdate: (self) => {
        // Progressive line fill based on scroll progress
        gsap.to(timelineLineRef.current, {
          scaleY: self.progress,
          duration: 0.1,
          ease: "none",
        });
      },
    });

    // Individual milestone animations with enhanced staggering
    milestoneElements.forEach((milestone, index) => {
      if (!milestone) return;

      const card = milestone.querySelector(".timeline-card");
      const dot = milestone.querySelector(".timeline-dot");
      const yearBadge = milestone.querySelector(".year-badge");
      const content = milestone.querySelector(".timeline-content");

      // Create individual scroll trigger for each milestone
      const milestoneTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: milestone,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
      });

      // Enhanced staggered animation sequence
      const baseDelay = index * 0.15; // Reduced for smoother cascade

      // Dot entrance with rotation
      milestoneTimeline.to(
        dot,
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.6,
          ease: "back.out(2)",
        },
        baseDelay
      );

      // Card dramatic entrance
      milestoneTimeline.to(
        card,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.4)",
        },
        baseDelay + 0.1
      );

      // Year badge with enhanced bounce
      milestoneTimeline.to(
        yearBadge,
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.6)",
        },
        baseDelay + 0.3
      );

      // Content cascade effect
      milestoneTimeline.to(
        content,
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        baseDelay + 0.5
      );

      // Add subtle scale pulse at the end
      milestoneTimeline.to(
        card,
        {
          scale: 1.02,
          duration: 0.2,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        },
        baseDelay + 0.8
      );
    });

    // Add hover animations
    milestoneElements.forEach((milestone, index) => {
      if (!milestone) return;

      const card = milestone.querySelector(".timeline-card") as HTMLElement;
      const dot = milestone.querySelector(".timeline-dot") as HTMLElement;

      if (!card || !dot) return;

      let hoverTl: gsap.core.Timeline;

      const handleMouseEnter = () => {
        hoverTl = gsap.timeline();

        hoverTl
          .to(card, {
            scale: 1.05,
            y: -12,
            rotationY: index % 2 === 0 ? 2 : -2, // Slight 3D tilt
            duration: 0.4,
            ease: "power2.out",
          })
          .to(
            dot,
            {
              scale: 1.4,
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)",
              duration: 0.4,
              ease: "power2.out",
            },
            0
          );
      };

      const handleMouseLeave = () => {
        if (hoverTl) hoverTl.kill();

        gsap.to(card, {
          scale: 1,
          y: 0,
          rotationY: 0,
          duration: 0.4,
          ease: "power2.out",
        });

        gsap.to(dot, {
          scale: 1,
          boxShadow: "0 0 0px rgba(59, 130, 246, 0)",
          duration: 0.4,
          ease: "power2.out",
        });
      };

      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);
    });

    // Enhanced continuous floating animation for dots
    milestoneElements.forEach((milestone, index) => {
      if (!milestone) return;

      const dot = milestone.querySelector(".timeline-dot");
      if (dot) {
        // Organic floating motion
        gsap.to(dot, {
          y: Math.sin(index) * 4,
          x: Math.cos(index) * 2,
          rotation: Math.sin(index * 0.5) * 5,
          duration: 3 + index * 0.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: index * 0.3,
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [milestones]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Animated Timeline Line */}
      <div
        ref={timelineLineRef}
        className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-primary to-secondary-foreground"
      />

      <div className="space-y-12">
        {milestones.map((milestone, index) => (
          <div
            key={milestone.year}
            ref={(el) => {
              milestonesRef.current[index] = el;
            }}
            className={`flex items-center ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div
              className={`w-1/2 ${
                index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
              }`}
            >
              <Card className="timeline-card bg-background/80 backdrop-blur-sm border border-primary/20 hover:shadow-lg transition-shadow transform-gpu will-change-transform">
                <CardHeader>
                  <CardTitle className="year-badge text-2xl font-bold text-primary transform-gpu will-change-transform">
                    {milestone.year}
                  </CardTitle>
                  <CardDescription className="text-lg font-semibold">
                    {milestone.event}
                  </CardDescription>
                </CardHeader>
                <CardContent className="timeline-content transform-gpu will-change-transform">
                  <p className="text-muted-foreground">
                    {milestone.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Animated Timeline Dot */}
            <div className="timeline-dot w-6 h-6 bg-primary rounded-full border-4 border-background shadow-lg z-10 transform-gpu will-change-transform relative">
              {/* Pulsing ring effect */}
              <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary-foreground rounded-full"></div>
            </div>

            <div className="w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
