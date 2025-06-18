"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface AnimatedHeroTitleProps {
  text: string;
  animationType?:
    | "wave"
    | "floating"
    | "glitch"
    | "typewriter"
    | "morphing"
    | "hero";
  className?: string;
}

export const AnimatedHeroTitle: React.FC<AnimatedHeroTitleProps> = ({
  text,
  animationType = "hero",
  className = "",
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    // Split text into individual characters with spans
    const chars = text.split("");
    titleRef.current.innerHTML = chars
      .map(
        (char, index) =>
          `<span class="char-${index} inline-block transform-gpu will-change-transform">${char}</span>`
      )
      .join("");

    const charElements = titleRef.current.querySelectorAll('[class*="char-"]');

    // Set initial states based on animation type
    if (animationType === "wave") {
      setupWaveHeroAnimation(charElements);
    } else if (animationType === "floating") {
      setupFloatingHeroAnimation(charElements);
    } else if (animationType === "glitch") {
      setupGlitchHeroAnimation(charElements);
    } else if (animationType === "typewriter") {
      setupTypewriterHeroAnimation(charElements);
    } else if (animationType === "morphing") {
      setupMorphingHeroAnimation(charElements);
    } else if (animationType === "hero") {
      setupHeroAnimation(charElements);
    }

    return () => {
      // Cleanup any ongoing animations
      gsap.killTweensOf(charElements);
    };
  }, [text, animationType]);

  const setupHeroAnimation = (chars: NodeListOf<Element>) => {
    // Set initial state - dramatic entrance
    gsap.set(chars, {
      y: 200,
      opacity: 0,
      scale: 0.3,
      rotationY: 90,
    });

    // Create dramatic hero entrance
    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(chars, {
      y: 0,
      opacity: 1,
      scale: 1,
      rotationY: 0,
      duration: 1.2,
      ease: "back.out(1.7)",
      stagger: {
        each: 0.08,
        from: "center",
      },
    });

    // Add breathing effect after entrance
    tl.to(
      chars,
      {
        scale: 1.02,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.1,
          repeat: -1,
        },
      },
      "+=1"
    );

    // Subtle continuous float
    chars.forEach((char, index) => {
      gsap.to(char, {
        y: Math.sin(index) * 5,
        duration: 4 + index * 0.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.1,
      });
    });
  };

  const setupWaveHeroAnimation = (chars: NodeListOf<Element>) => {
    gsap.set(chars, {
      y: 150,
      opacity: 0,
      rotationX: 90,
    });

    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(chars, {
      y: 0,
      opacity: 1,
      rotationX: 0,
      duration: 1,
      ease: "back.out(1.5)",
      stagger: 0.06,
    });

    // Continuous wave motion
    gsap.to(chars, {
      y: "random(-15, 15)",
      duration: "random(3, 5)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: {
        each: 0.2,
        repeat: -1,
      },
      delay: 1.5,
    });
  };

  const setupFloatingHeroAnimation = (chars: NodeListOf<Element>) => {
    gsap.set(chars, {
      y: 100,
      opacity: 0,
      scale: 0.2,
      rotation: 360,
    });

    const tl = gsap.timeline({ delay: 0.4 });

    tl.to(chars, {
      y: 0,
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.6)",
      stagger: 0.1,
    });

    // Floating effect
    chars.forEach((char, index) => {
      gsap.to(char, {
        y: Math.random() * 20 - 10,
        x: Math.random() * 10 - 5,
        rotation: Math.random() * 10 - 5,
        duration: Math.random() * 3 + 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.2,
      });
    });
  };

  const setupGlitchHeroAnimation = (chars: NodeListOf<Element>) => {
    gsap.set(chars, {
      opacity: 0,
      x: "random(-100, 100)",
      y: "random(-50, 50)",
      scale: "random(0.5, 1.5)",
    });

    const tl = gsap.timeline({ delay: 0.2 });

    tl.to(chars, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.03,
    });

    // Glitch effects
    chars.forEach((char, index) => {
      gsap.to(char, {
        x: Math.random() * 4 - 2,
        duration: 0.1,
        ease: "none",
        repeat: -1,
        repeatDelay: Math.random() * 3 + 1,
      });

      // Occasional color glitch
      gsap.to(char, {
        filter: "hue-rotate(180deg)",
        duration: 0.1,
        ease: "none",
        repeat: -1,
        repeatDelay: Math.random() * 8 + 5,
        yoyo: true,
      });
    });
  };

  const setupTypewriterHeroAnimation = (chars: NodeListOf<Element>) => {
    gsap.set(chars, {
      opacity: 0,
      x: -20,
      scale: 1.2,
    });

    const tl = gsap.timeline({ delay: 0.8 });

    tl.to(chars, {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.08,
      ease: "power2.out",
      stagger: 0.1,
    });

    // Cursor blink effect on last character
    const lastChar = chars[chars.length - 1];
    if (lastChar) {
      gsap.to(lastChar, {
        opacity: 0.3,
        duration: 0.5,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        delay: chars.length * 0.1 + 1,
      });
    }
  };

  const setupMorphingHeroAnimation = (chars: NodeListOf<Element>) => {
    gsap.set(chars, {
      scale: 0,
      rotation: 360,
      opacity: 0,
    });

    const tl = gsap.timeline({ delay: 0.6 });

    tl.to(chars, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 1,
      ease: "back.out(2)",
      stagger: {
        each: 0.1,
        from: "random",
      },
    });

    // Morphing effect
    chars.forEach((char, index) => {
      gsap.to(char, {
        scaleX: Math.random() * 0.2 + 0.9,
        scaleY: Math.random() * 0.2 + 0.9,
        duration: Math.random() * 2 + 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.1,
      });
    });
  };

  return (
    <div className="bg-gradient-to-r from-primary to-secondary-foreground hover:from-cyan-500 hover:to-purple-500 text-transparent bg-clip-text relative transition-all duration-500 cursor-default">
      <h1
        ref={titleRef}
        className="text-8xl font-bold text-center md:text-[300px]"
        style={{ perspective: "1000px" }}
      >
        {text}
      </h1>
    </div>
  );
};
