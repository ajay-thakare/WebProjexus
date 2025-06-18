"use client";

import { ModeToggle } from "@/components/global/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navigation = () => {
  const { user } = useUser();
  const pathname = usePathname();

  const navigationItems = [
    { href: "/site/pricing", label: "Pricing" },
    { href: "/site/about", label: "About" },
    { href: "/site/documentation", label: "Documentation" },
    { href: "/site/features", label: "Features" },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="fixed top-0 right-0 left-0 flex justify-between p-4 items-center z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      {/* left */}
      <aside className="flex items-center gap-2">
        <Link
          href="/site"
          className="flex items-center gap-2 group hover:scale-105 transition-all duration-300 ease-in-out"
        >
          <div className="relative">
            <Image
              src={"/assets/webpro-logo.svg"}
              alt="Webpro logo"
              width={40}
              height={40}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300 -z-10"></div>
          </div>
          <span className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
            WebPro.
          </span>
        </Link>
      </aside>

      {/* middle */}
      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex justify-center items-center gap-8">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`transition-colors font-medium ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* right */}
      <aside className="flex gap-2 items-center">
        {!user ? (
          <Link
            href={"/agency"}
            className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80 transition-colors"
          >
            Login
          </Link>
        ) : (
          <UserButton />
        )}
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
