"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AdvancedGSAPCounterProps {
  target: string;
  duration?: number;
  className?: string;
  delay?: number;
  enableEffects?: boolean;
}

export const AdvancedGSAPCounter: React.FC<AdvancedGSAPCounterProps> = ({
  target,
  duration = 2.5,
  className = "",
  delay = 0,
  enableEffects = true,
}) => {
  const counterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const countObject = useRef({ value: 0 });
  const shimmerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!counterRef.current || !containerRef.current) return;

    // Parse target value
    const parseTarget = (target: string) => {
      if (target.includes("K+")) {
        return {
          value: parseInt(target.replace("K+", "")),
          suffix: "K+",
          decimals: 0,
        };
      }
      if (target.includes("%")) {
        return {
          value: parseFloat(target.replace("%", "")),
          suffix: "%",
          decimals: 1,
        };
      }
      if (target === "24/7") {
        return {
          value: 24,
          suffix: "/7",
          decimals: 0,
        };
      }
      return {
        value: parseFloat(target) || 0,
        suffix: "",
        decimals: 0,
      };
    };

    const { value: targetValue, suffix, decimals } = parseTarget(target);

    // Format function
    const formatValue = (val: number) => {
      if (decimals > 0) {
        return val.toFixed(decimals) + suffix;
      }
      return Math.floor(val) + suffix;
    };

    // Create timeline for complex animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "restart none restart reverse",
        onEnter: () => {
          // Add entry effects if enabled
          if (enableEffects) {
            gsap.fromTo(
              counterRef.current,
              {
                scale: 0.8,
                opacity: 0,
              },
              {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                ease: "back.out(1.7)",
              }
            );
          }
        },
        onLeave: () => {
          // Reset when leaving viewport
          countObject.current.value = 0;
          if (counterRef.current) {
            counterRef.current.textContent = formatValue(0);
          }
        },
        onEnterBack: () => {
          // Replay animation when scrolling back
          if (enableEffects) {
            gsap.fromTo(
              counterRef.current,
              {
                scale: 0.8,
                opacity: 0,
              },
              {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                ease: "back.out(1.7)",
              }
            );
          }
        },
        onLeaveBack: () => {
          // Reset when leaving viewport from top
          countObject.current.value = 0;
          if (counterRef.current) {
            counterRef.current.textContent = formatValue(0);
          }
        },
      },
    });

    // Counter animation
    tl.fromTo(
      countObject.current,
      { value: 0 },
      {
        value: targetValue,
        duration: duration,
        delay: delay,
        ease: "power2.out",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = formatValue(
              countObject.current.value
            );
          }
        },
      }
    );

    // Add subtle pulse effect at the end
    if (enableEffects) {
      tl.to(
        counterRef.current,
        {
          scale: 1.05,
          duration: 0.2,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        },
        "-=0.3"
      );
    }

    // Set initial value
    if (counterRef.current) {
      counterRef.current.textContent = formatValue(0);
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [target, duration, delay, enableEffects]);

  return (
    <div ref={containerRef} className="text-center">
      <div
        ref={counterRef}
        className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text transform-gpu ${className}`}
      >
        0
      </div>
    </div>
  );
};
