"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "@/components/ui/card";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StoryParagraph {
  text: string;
  delay?: number;
}

interface AnimatedStorySectionProps {
  title: string;
  paragraphs: StoryParagraph[];
  className?: string;
  animationType?: "typewriter" | "fade" | "slide" | "reveal" | "morph";
}

export const AnimatedStorySection: React.FC<AnimatedStorySectionProps> = ({
  title,
  paragraphs,
  className = "",
  animationType = "typewriter",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || !titleRef.current || !cardRef.current) return;

    const paragraphElements = paragraphsRef.current.filter(
      (p): p is HTMLParagraphElement => p !== null
    );

    // Setup animations based on type
    if (animationType === "typewriter") {
      setupTypewriterAnimation(paragraphElements);
    } else if (animationType === "fade") {
      setupFadeAnimation(paragraphElements);
    } else if (animationType === "slide") {
      setupSlideAnimation(paragraphElements);
    } else if (animationType === "reveal") {
      setupRevealAnimation(paragraphElements);
    } else if (animationType === "morph") {
      setupMorphAnimation(paragraphElements);
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [title, paragraphs, animationType]);

  const setupTypewriterAnimation = (
    paragraphElements: HTMLParagraphElement[]
  ) => {
    // Set initial states
    gsap.set(titleRef.current, {
      opacity: 0,
      y: 50,
      scale: 0.9,
    });

    gsap.set(cardRef.current, {
      opacity: 0,
      y: 80,
      scale: 0.95,
      rotationX: 15,
    });

    // Hide all text initially
    paragraphElements.forEach((p) => {
      const text = p.textContent || "";
      p.innerHTML = "";
      p.setAttribute("data-original-text", text);
      gsap.set(p, { opacity: 0 });
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

    // Title entrance
    masterTl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.4)",
    });

    // Card entrance
    masterTl.to(
      cardRef.current,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.4"
    );

    // Typewriter effect for each paragraph
    paragraphElements.forEach((p, index) => {
      const originalText = p.getAttribute("data-original-text") || "";
      const delay = index * 1.5;

      masterTl.to(
        p,
        {
          opacity: 1,
          duration: 0.3,
        },
        delay
      );

      // Typewriter animation
      masterTl.to(
        {},
        {
          duration: originalText.length * 0.03,
          ease: "none",
          onUpdate: function () {
            const progress = this.progress();
            const visibleChars = Math.floor(progress * originalText.length);
            p.innerHTML =
              originalText.slice(0, visibleChars) +
              (progress < 1 ? '<span class="animate-pulse">|</span>' : "");
          },
          onComplete: () => {
            p.innerHTML = originalText;
          },
        },
        delay + 0.3
      );
    });
  };

  const setupFadeAnimation = (paragraphElements: HTMLParagraphElement[]) => {
    gsap.set(titleRef.current, {
      opacity: 0,
      y: 30,
    });

    gsap.set(cardRef.current, {
      opacity: 0,
      scale: 0.9,
    });

    gsap.set(paragraphElements, {
      opacity: 0,
      y: 40,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "restart none restart reverse",
      },
    });

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
    })
      .to(
        cardRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .to(
        paragraphElements,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.3,
        },
        "-=0.4"
      );
  };

  const setupSlideAnimation = (paragraphElements: HTMLParagraphElement[]) => {
    gsap.set(titleRef.current, {
      opacity: 0,
      x: -100,
    });

    gsap.set(cardRef.current, {
      opacity: 0,
      x: 100,
      rotationY: 15,
    });

    gsap.set(paragraphElements, {
      opacity: 0,
      x: (index) => (index % 2 === 0 ? -80 : 80),
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "restart none restart reverse",
      },
    });

    tl.to(titleRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: "back.out(1.2)",
    })
      .to(
        cardRef.current,
        {
          opacity: 1,
          x: 0,
          rotationY: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.6"
      )
      .to(
        paragraphElements,
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "back.out(1.1)",
          stagger: 0.2,
        },
        "-=0.5"
      );
  };

  const setupRevealAnimation = (paragraphElements: HTMLParagraphElement[]) => {
    gsap.set(titleRef.current, {
      opacity: 0,
      clipPath: "inset(0 100% 0 0)",
    });

    gsap.set(cardRef.current, {
      opacity: 0,
      clipPath: "inset(100% 0 0 0)",
    });

    paragraphElements.forEach((p) => {
      gsap.set(p, {
        opacity: 0,
        clipPath: "inset(0 0 100% 0)",
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

    tl.to(titleRef.current, {
      opacity: 1,
      clipPath: "inset(0 0% 0 0)",
      duration: 1,
      ease: "power2.inOut",
    })
      .to(
        cardRef.current,
        {
          opacity: 1,
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "power2.inOut",
        },
        "-=0.6"
      )
      .to(
        paragraphElements,
        {
          opacity: 1,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.8,
          ease: "power2.inOut",
          stagger: 0.3,
        },
        "-=0.8"
      );
  };

  const setupMorphAnimation = (paragraphElements: HTMLParagraphElement[]) => {
    gsap.set(titleRef.current, {
      opacity: 0,
      scale: 0,
      rotation: 180,
    });

    gsap.set(cardRef.current, {
      opacity: 0,
      scale: 0.3,
      borderRadius: "50%",
    });

    gsap.set(paragraphElements, {
      opacity: 0,
      scale: 0,
      rotation: (index) => (index % 2 === 0 ? -90 : 90),
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "restart none restart reverse",
      },
    });

    tl.to(titleRef.current, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1,
      ease: "elastic.out(1, 0.6)",
    })
      .to(
        cardRef.current,
        {
          opacity: 1,
          scale: 1,
          borderRadius: "12px",
          duration: 1.2,
          ease: "elastic.out(1, 0.4)",
        },
        "-=0.7"
      )
      .to(
        paragraphElements,
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.15,
        },
        "-=0.8"
      );
  };

  return (
    <section
      ref={containerRef}
      className={`py-3 px-4 relative z-10 ${className}`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ perspective: "1000px" }}
          >
            {title}
          </h2>
        </div>

        <Card
          ref={cardRef}
          className="border-2 border-primary rounded-xl bg-gradient-to-br from-background to-muted/30 shadow-xl p-8 transform-gpu will-change-transform"
          style={{ perspective: "1000px" }}
        >
          <CardContent className="text-center space-y-6">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                ref={(el) => {
                  paragraphsRef.current[index] = el;
                }}
                className="text-lg leading-relaxed text-muted-foreground transform-gpu will-change-transform"
              >
                {paragraph.text}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
