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

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
  gradient: string;
}

interface AnimatedTeamCardsProps {
  teamMembers: TeamMember[];
  className?: string;
  animationType?: "spotlight" | "carousel" | "flip" | "zoom";
}

export const AnimatedTeamCards: React.FC<AnimatedTeamCardsProps> = ({
  teamMembers,
  className = "",
  animationType = "spotlight",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const cardElements = cardsRef.current.filter(
      (card): card is HTMLDivElement => card !== null
    );

    // Setup animations based on type
    if (animationType === "spotlight") {
      setupSpotlightAnimation(cardElements);
    } else if (animationType === "carousel") {
      setupCarouselAnimation(cardElements);
    } else if (animationType === "flip") {
      setupFlipAnimation(cardElements);
    } else if (animationType === "zoom") {
      setupZoomAnimation(cardElements);
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [teamMembers, animationType]);

  const setupSpotlightAnimation = (cardElements: HTMLDivElement[]) => {
    // Set initial states
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".team-card");
      const avatar = card.querySelector(".team-avatar");
      const avatarBg = card.querySelector(".avatar-background");
      const nameTitle = card.querySelector(".team-name");
      const roleTitle = card.querySelector(".team-role");
      const description = card.querySelector(".team-description");

      gsap.set(cardWrapper, {
        opacity: 0,
        scale: 0.8,
        y: 80,
        filter: "brightness(0.3)",
      });

      gsap.set(avatar, {
        scale: 0,
        rotation: 180,
      });

      gsap.set(avatarBg, {
        scale: 0,
        rotation: -180,
      });

      gsap.set([nameTitle, roleTitle, description], {
        opacity: 0,
        y: 30,
        x: index % 2 === 0 ? -20 : 20,
      });
    });

    // Create spotlight effect - each card gets individual attention
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".team-card");
      const avatar = card.querySelector(".team-avatar");
      const avatarBg = card.querySelector(".avatar-background");
      const nameTitle = card.querySelector(".team-name");
      const roleTitle = card.querySelector(".team-role");
      const description = card.querySelector(".team-description");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
      });

      // Spotlight effect - card brightens
      tl.to(cardWrapper, {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "brightness(1)",
        duration: 0.8,
        ease: "power3.out",
      })
        // Avatar background spins in
        .to(
          avatarBg,
          {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.6"
        )
        // Avatar reveals with counter-spin
        .to(
          avatar,
          {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(1.5)",
          },
          "-=0.4"
        )
        // Name appears
        .to(
          nameTitle,
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.2"
        )
        // Role appears
        .to(
          roleTitle,
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3"
        )
        // Description appears
        .to(
          description,
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        // Final spotlight pulse
        .to(cardWrapper, {
          scale: 1.02,
          duration: 0.2,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        });
    });

    addTeamHoverEffects(cardElements);
  };

  const setupCarouselAnimation = (cardElements: HTMLDivElement[]) => {
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".team-card");

      // Carousel positioning
      const offset = (index - 1) * 120; // Center the middle card

      gsap.set(cardWrapper, {
        opacity: 0,
        x: offset,
        rotationY: index === 1 ? 0 : index < 1 ? 45 : -45,
        scale: index === 1 ? 1 : 0.8,
        z: index === 1 ? 0 : -100,
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

    // Carousel entrance
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".team-card");
      const avatar = card.querySelector(".team-avatar");

      tl.to(
        cardWrapper,
        {
          opacity: 1,
          x: 0,
          rotationY: 0,
          scale: 1,
          z: 0,
          duration: 1,
          ease: "power3.out",
        },
        index * 0.2
      ).from(
        avatar,
        {
          scale: 0,
          rotation: 360,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        index * 0.2 + 0.3
      );
    });

    addTeamHoverEffects(cardElements);
  };

  const setupFlipAnimation = (cardElements: HTMLDivElement[]) => {
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".team-card");

      gsap.set(cardWrapper, {
        opacity: 0,
        rotationY: 180,
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

    // Cards flip in sequence
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".team-card");
      const avatar = card.querySelector(".team-avatar");

      tl.to(
        cardWrapper,
        {
          opacity: 1,
          rotationY: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.4)",
        },
        index * 0.2
      ).from(
        avatar,
        {
          rotationY: 180,
          duration: 0.6,
          ease: "power2.out",
        },
        index * 0.2 + 0.2
      );
    });

    addTeamHoverEffects(cardElements);
  };

  const setupZoomAnimation = (cardElements: HTMLDivElement[]) => {
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".team-card");
      const avatar = card.querySelector(".team-avatar");
      const content = card.querySelectorAll(
        ".team-name, .team-role, .team-description"
      );

      gsap.set(cardWrapper, {
        opacity: 0,
        scale: 0.1,
      });

      gsap.set(avatar, {
        scale: 3,
        opacity: 0,
      });

      gsap.set(content, {
        scale: 0,
        opacity: 0,
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

    // Dramatic zoom in effect
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".team-card");
      const avatar = card.querySelector(".team-avatar");
      const content = card.querySelectorAll(
        ".team-name, .team-role, .team-description"
      );

      tl.to(
        cardWrapper,
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        index * 0.2
      )
        .to(
          avatar,
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          index * 0.2 + 0.2
        )
        .to(
          content,
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.5)",
            stagger: 0.1,
          },
          index * 0.2 + 0.4
        );
    });

    addTeamHoverEffects(cardElements);
  };

  const addTeamHoverEffects = (cardElements: HTMLDivElement[]) => {
    cardElements.forEach((card, index) => {
      const cardWrapper = card.querySelector(".team-card") as HTMLElement;
      const avatar = card.querySelector(".team-avatar") as HTMLElement;
      const avatarBg = card.querySelector(".avatar-background") as HTMLElement;

      if (!cardWrapper) return;

      let hoverTl: gsap.core.Timeline;

      const handleMouseEnter = () => {
        hoverTl = gsap.timeline();

        hoverTl
          .to(cardWrapper, {
            scale: 1.05,
            y: -15,
            rotationY: index % 2 === 0 ? 2 : -2,
            duration: 0.4,
            ease: "power2.out",
          })
          .to(
            avatarBg,
            {
              scale: 1.1,
              rotation: "+=10",
              duration: 0.4,
              ease: "power2.out",
            },
            0
          )
          .to(
            avatar,
            {
              scale: 1.1,
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
          duration: 0.4,
          ease: "power2.out",
        });

        gsap.to(avatarBg, {
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        });

        gsap.to(avatar, {
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
      {teamMembers.map((member, index) => (
        <div
          key={member.name}
          ref={(el) => {
            cardsRef.current[index] = el;
          }}
        >
          <Card className="team-card group text-center border-0 bg-gradient-to-br from-background to-muted/30 hover:shadow-xl transition-all duration-300 overflow-hidden transform-gpu will-change-transform">
            <CardHeader className="relative p-8">
              <div className="relative mx-auto mb-6">
                <div
                  className={`avatar-background w-48 h-48 rounded-full bg-gradient-to-br ${member.gradient} p-1 transform-gpu will-change-transform`}
                >
                  <div className="team-avatar w-full h-full rounded-full bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground transform-gpu will-change-transform">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>
              </div>
              <CardTitle className="team-name text-2xl mb-2 transform-gpu will-change-transform">
                {member.name}
              </CardTitle>
              <p className="team-role text-primary font-semibold mb-4 transform-gpu will-change-transform">
                {member.role}
              </p>
              <CardDescription className="team-description text-sm leading-relaxed transform-gpu will-change-transform">
                {member.description}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      ))}
    </div>
  );
};
