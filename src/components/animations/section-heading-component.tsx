"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedSectionHeadingProps {
  text: string;
  subtitle?: string;
  animationType?:
    | "wave"
    | "floating"
    | "glitch"
    | "typewriter"
    | "morphing"
    | "neon"
    | "liquid"
    | "hologram"
    | "spiral"
    | "cyber"
    | "particle"
    | "matrix"
    | "explosion"
    | "origami"
    | "quantum"
    | "ice"
    | "gravity"
    | "lightning"
    | "dna";
  className?: string;
}

export const AnimatedSectionHeading: React.FC<AnimatedSectionHeadingProps> = ({
  text,
  subtitle,
  animationType = "wave",
  className = "",
}) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headingRef.current || !containerRef.current) return;

    const words = text.split(" ");

    // Split text into individual words with spans
    headingRef.current.innerHTML = words
      .map(
        (word, index) =>
          `<span class="word-${index} inline-block mr-4">${word
            .split("")
            .map(
              (char, charIndex) =>
                `<span class="char-${index}-${charIndex} inline-block">${char}</span>`
            )
            .join("")}</span>`
      )
      .join("");

    const chars =
      headingRef.current.querySelectorAll<HTMLElement>('[class*="char-"]');
    const wordElements =
      headingRef.current.querySelectorAll<HTMLElement>('[class*="word-"]');

    // Helper functions defined before they're used
    const setupWaveAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      // Set initial state
      gsap.set(chars, {
        y: 100,
        opacity: 0,
        rotationX: 90,
      });

      // Create wave entrance animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      tl.to(chars, {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: {
          each: 0.03,
          from: "start",
        },
      });

      // Continuous wave animation
      gsap.to(chars, {
        y: "random(-8, 8)",
        duration: "random(2, 4)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.1,
          repeat: -1,
        },
        delay: 1,
      });

      // Subtitle
      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }
    };

    const setupFloatingAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        y: 50,
        opacity: 0,
        scale: 0.5,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      tl.to(chars, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "elastic.out(1, 0.8)",
        stagger: 0.05,
      });

      // Floating effect
      chars.forEach((char, index) => {
        gsap.to(char, {
          y: "random(-15, 15)",
          x: "random(-5, 5)",
          rotation: "random(-5, 5)",
          duration: "random(3, 6)",
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: index * 0.1,
        });
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5"
        );
      }
    };

    const setupGlitchAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        opacity: 0,
        x: "random(-50, 50)",
        y: "random(-30, 30)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      tl.to(chars, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.02,
      });

      // Random glitch effects
      chars.forEach((char) => {
        gsap.to(char, {
          x: "random(-2, 2)",
          duration: 0.1,
          ease: "none",
          repeat: -1,
          repeatDelay: Math.random() * 3 + 2, // Random between 2-5 seconds
        });
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.2"
        );
      }
    };

    const setupTypewriterAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        opacity: 0,
        x: -10,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      tl.to(chars, {
        opacity: 1,
        x: 0,
        duration: 0.05,
        ease: "none",
        stagger: 0.05,
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.5"
        );
      }
    };

    const setupMorphingAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        scale: 0,
        rotation: 180,
        opacity: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      tl.to(chars, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: {
          each: 0.05,
          from: "center",
        },
      });

      // Breathing effect
      gsap.to(words, {
        scale: 1.02,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }
    };

    const setupNeonAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        opacity: 0,
        scale: 0.5,
        filter: "brightness(0)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      tl.to(chars, {
        opacity: 1,
        scale: 1,
        filter: "brightness(1.5) drop-shadow(0 0 10px cyan)",
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.05,
      });

      // Neon flicker effect
      chars.forEach((char, index) => {
        gsap.to(char, {
          filter: `brightness(${1.2 + Math.random() * 0.5}) drop-shadow(0 0 ${
            5 + Math.random() * 10
          }px cyan)`,
          duration: 0.1,
          ease: "none",
          repeat: -1,
          repeatDelay: Math.random() * 2 + 1,
          yoyo: true,
        });
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }
    };

    const setupLiquidAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        scaleY: 0,
        transformOrigin: "bottom center",
        opacity: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      tl.to(chars, {
        scaleY: 1,
        opacity: 1,
        duration: 0.8,
        ease: "elastic.out(1.2, 0.4)",
        stagger: 0.04,
      });

      // Liquid wave effect
      chars.forEach((char, index) => {
        gsap.to(char, {
          scaleY: 1 + Math.sin(index * 0.8) * 0.1,
          scaleX: 1 + Math.cos(index * 0.6) * 0.05,
          y: Math.sin(index * 0.4) * 3,
          duration: 3 + index * 0.05,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: index * 0.05,
        });
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }
    };

    const setupHologramAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        opacity: 0,
        rotationY: 90,
        z: -100,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      tl.to(chars, {
        opacity: 1,
        rotationY: 0,
        z: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.06,
      });

      // Holographic shimmer
      chars.forEach((char, index) => {
        gsap.to(char, {
          filter: `hue-rotate(${Math.sin(index) * 60}deg) brightness(${
            1.2 + Math.sin(index * 2) * 0.3
          })`,
          duration: 2 + index * 0.1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        gsap.to(char, {
          rotationY: Math.sin(index * 0.5) * 10,
          duration: 4 + index * 0.1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: index * 0.1,
        });
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5"
        );
      }
    };

    const setupMatrixAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        opacity: 0,
        y: -200,
        color: "#00ff00",
        fontFamily: "monospace",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      // Matrix rain effect
      chars.forEach((char, index) => {
        gsap.set(char, { textContent: Math.random() > 0.5 ? "1" : "0" });

        gsap.to(char, {
          opacity: 1,
          y: 0,
          duration: 0.1,
          delay: index * 0.02,
          ease: "none",
        });

        // Character morphing to final text
        gsap.to(char, {
          delay: index * 0.02 + 0.5,
          duration: 0.3,
          onStart: () => {
            const originalChar = text.split("").filter((c) => c !== " ")[index];
            if (originalChar) {
              char.textContent = originalChar;
              char.style.color = "#ffffff";
            }
          },
        });

        // Continuous matrix flicker
        gsap.to(char, {
          textShadow: "0 0 10px #00ff00, 0 0 20px #00ff00",
          duration: 0.1,
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 5,
        });
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }
    };

    const setupExplosionAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        scale: 0,
        rotation: "random(-360, 360)",
        x: "random(-300, 300)",
        y: "random(-300, 300)",
        opacity: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      tl.to(chars, {
        scale: 1,
        rotation: 0,
        x: 0,
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "expo.out",
        stagger: {
          each: 0.02,
          from: "center",
        },
      });

      // Particle explosion effect
      chars.forEach((char, index) => {
        gsap.to(char, {
          boxShadow: `0 0 ${Math.random() * 20}px rgba(255, ${
            Math.random() * 255
          }, 0, 0.8)`,
          duration: 0.2,
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 3,
        });
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5"
        );
      }
    };

    const setupOrigamiAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        rotationX: 90,
        rotationY: 45,
        transformOrigin: "center bottom",
        opacity: 0,
        z: -100,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      tl.to(chars, {
        rotationX: 0,
        rotationY: 0,
        opacity: 1,
        z: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
        stagger: {
          each: 0.1,
          from: "start",
        },
      });

      // Origami folding effect
      chars.forEach((char, index) => {
        gsap.to(char, {
          rotationY: Math.sin(index * 0.5) * 15,
          rotationX: Math.cos(index * 0.3) * 5,
          duration: 4 + index * 0.1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }
    };

    const setupQuantumAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        opacity: 0,
        scale: 0,
        filter: "blur(10px)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      tl.to(chars, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.03,
      });

      // Quantum uncertainty principle
      chars.forEach((char, index) => {
        gsap.to(char, {
          x: `random(-${(index % 3) + 1}, ${(index % 3) + 1})`,
          y: `random(-${(index % 2) + 1}, ${(index % 2) + 1})`,
          opacity: 0.7 + Math.random() * 0.3,
          duration: 0.1,
          repeat: -1,
          ease: "none",
          delay: Math.random() * 2,
        });
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }
    };

    const setupSpiralAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        rotation: 720,
        scale: 0,
        opacity: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      chars.forEach((char, index) => {
        const radius = 100 + index * 10;
        const angle = index * 30;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        gsap.set(char, { x, y });

        tl.to(
          char,
          {
            rotation: 0,
            scale: 1,
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.5,
            ease: "power2.out",
            delay: index * 0.05,
          },
          0
        );
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.5"
        );
      }
    };

    const setupIceAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        scale: 0,
        opacity: 0,
        color: "#87ceeb",
        textShadow: "0 0 10px #add8e6",
        filter: "blur(2px)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      tl.to(chars, {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
        stagger: 0.08,
      });

      // Ice crystal formation
      chars.forEach((char, index) => {
        gsap.to(char, {
          textShadow: `0 0 ${3 + Math.sin(index) * 7}px #add8e6, 0 0 ${
            10 + Math.cos(index) * 10
          }px #87ceeb`,
          duration: 2 + index * 0.1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }
    };

    const setupLightningAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        opacity: 0,
        x: "random(-20, 20)",
        y: "random(-10, 10)",
        color: "#ffff00",
        textShadow: "0 0 5px #ffffff",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      // Lightning strike effect
      chars.forEach((char, index) => {
        gsap.to(char, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.05,
          delay: index * 0.01,
          ease: "none",
        });

        // Lightning flashes
        gsap.to(char, {
          textShadow: `0 0 ${Math.random() * 20}px #ffffff, 0 0 ${
            Math.random() * 30
          }px #ffff00`,
          duration: 0.05,
          repeat: -1,
          repeatDelay: Math.random() * 3 + 1,
          ease: "none",
        });
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }
    };

    const setupGravityAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        y: -500,
        opacity: 0,
        rotation: "random(-180, 180)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      chars.forEach((char, index) => {
        tl.to(
          char,
          {
            y: 0,
            opacity: 1,
            rotation: 0,
            duration: 1 + Math.random() * 0.5,
            ease: "bounce.out",
            delay: index * 0.03,
          },
          0
        );

        // Gravity wobble
        gsap.to(char, {
          y: Math.sin(index) * 3,
          duration: 2 + index * 0.1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1.5,
        });
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "bounce.out",
          },
          "-=0.5"
        );
      }
    };

    const setupParticleAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        scale: 0,
        opacity: 0,
        filter: "blur(5px)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      chars.forEach((char, index) => {
        // Create particle trail effect
        const particles = Array.from({ length: 5 }, (_, i) => {
          const particle = char.cloneNode(true) as HTMLElement;
          particle.style.position = "absolute";
          particle.style.pointerEvents = "none";
          char.parentNode?.insertBefore(particle, char);
          return particle;
        });

        tl.to(
          char,
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power2.out",
            delay: index * 0.04,
          },
          0
        );

        // Particle system
        particles.forEach((particle, i) => {
          gsap.to(particle, {
            x: `random(-${i * 10}, ${i * 10})`,
            y: `random(-${i * 5}, ${i * 5})`,
            opacity: 0.3 - i * 0.05,
            scale: 0.8 - i * 0.1,
            duration: 2,
            repeat: -1,
            yoyo: true,
            delay: i * 0.1,
          });
        });
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }
    };

    const setupCyberAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        opacity: 0,
        x: -100,
        skewX: 20,
        color: "#00ffff",
        fontFamily: "monospace",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      tl.to(chars, {
        opacity: 1,
        x: 0,
        skewX: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.03,
      });

      // Cyber glitch effects
      chars.forEach((char, index) => {
        gsap.to(char, {
          textShadow: `${Math.random() * 2}px 0 #ff0080, -${
            Math.random() * 2
          }px 0 #00ffff`,
          duration: 0.1,
          repeat: -1,
          ease: "none",
          delay: Math.random() * 2,
        });

        gsap.to(char, {
          skewX: `random(-2, 2)`,
          duration: 0.05,
          repeat: -1,
          repeatDelay: Math.random() * 5,
        });
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }
    };

    const setupDnaAnimation = (
      chars: NodeListOf<HTMLElement>,
      words: NodeListOf<HTMLElement>
    ) => {
      gsap.set(chars, {
        opacity: 0,
        rotationY: 180,
        scale: 0.5,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart reverse",
        },
      });

      chars.forEach((char, index) => {
        tl.to(
          char,
          {
            opacity: 1,
            rotationY: 0,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            delay: index * 0.1,
          },
          0
        );

        // DNA double helix motion
        gsap.to(char, {
          x: Math.sin(index * 0.5) * 10,
          y: Math.cos(index * 0.8) * 5,
          rotationY: Math.sin(index * 0.3) * 20,
          duration: 4 + index * 0.1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5"
        );
      }
    };

    // Set initial states based on animation type
    if (animationType === "wave") {
      setupWaveAnimation(chars, wordElements);
    } else if (animationType === "floating") {
      setupFloatingAnimation(chars, wordElements);
    } else if (animationType === "glitch") {
      setupGlitchAnimation(chars, wordElements);
    } else if (animationType === "typewriter") {
      setupTypewriterAnimation(chars, wordElements);
    } else if (animationType === "morphing") {
      setupMorphingAnimation(chars, wordElements);
    } else if (animationType === "neon") {
      setupNeonAnimation(chars, wordElements);
    } else if (animationType === "liquid") {
      setupLiquidAnimation(chars, wordElements);
    } else if (animationType === "hologram") {
      setupHologramAnimation(chars, wordElements);
    } else if (animationType === "matrix") {
      setupMatrixAnimation(chars, wordElements);
    } else if (animationType === "explosion") {
      setupExplosionAnimation(chars, wordElements);
    } else if (animationType === "origami") {
      setupOrigamiAnimation(chars, wordElements);
    } else if (animationType === "quantum") {
      setupQuantumAnimation(chars, wordElements);
    } else if (animationType === "spiral") {
      setupSpiralAnimation(chars, wordElements);
    } else if (animationType === "ice") {
      setupIceAnimation(chars, wordElements);
    } else if (animationType === "lightning") {
      setupLightningAnimation(chars, wordElements);
    } else if (animationType === "gravity") {
      setupGravityAnimation(chars, wordElements);
    } else if (animationType === "particle") {
      setupParticleAnimation(chars, wordElements);
    } else if (animationType === "cyber") {
      setupCyberAnimation(chars, wordElements);
    } else if (animationType === "dna") {
      setupDnaAnimation(chars, wordElements);
    }

    // Subtitle animation - Set initial state here
    if (subtitleRef.current) {
      gsap.set(subtitleRef.current, {
        opacity: 0,
        y: 30,
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [text, animationType]);

  return (
    <div ref={containerRef} className={`text-center ${className}`}>
      <h2
        ref={headingRef}
        className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
        style={{ perspective: "1000px" }}
      >
        {text}
      </h2>
      {subtitle && (
        <p ref={subtitleRef} className="text-xl text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
};
