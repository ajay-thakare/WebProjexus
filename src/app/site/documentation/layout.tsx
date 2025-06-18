"use client";

import {
  Users,
  CheckSquare,
  Rocket,
  FileText,
  Monitor,
  Layers,
  Settings,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface DocumentationLayoutProps {
  children: React.ReactNode;
}

export default function DocumentationLayout({
  children,
}: DocumentationLayoutProps) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const navigationItems = [
    {
      href: "/documentation",
      icon: FileText,
      label: "Introduction",
      isActive: pathname === "/documentation",
      sections: ["hero", "key-sections"],
    },
    {
      href: "/documentation/getting-started",
      icon: Rocket,
      label: "Getting Started",
      isActive: pathname === "/documentation/getting-started",
      sections: ["getting-started"],
    },
    {
      href: "/documentation/features",
      icon: Layers,
      label: "Features",
      isActive: pathname === "/documentation/features",
      sections: ["features"],
    },
    {
      href: "/documentation/agency-dashboard",
      icon: Monitor,
      label: "Agency Dashboard",
      isActive: pathname === "/documentation/agency-dashboard",
      sections: ["agency-dashboard"],
    },
    {
      href: "/documentation/team",
      icon: Users,
      label: "Team Management",
      isActive: pathname === "/documentation/team",
      sections: ["team", "user-guides"],
    },
    {
      href: "/documentation/funnels",
      icon: Settings,
      label: "Funnels",
      isActive: pathname === "/documentation/funnels",
      sections: ["funnels"],
    },
    {
      href: "/documentation/to-do-board",
      icon: CheckSquare,
      label: "To-Do Board",
      isActive: pathname === "/documentation/to-do-board",
      sections: ["to-do-board"],
    },
  ];

  // Table of contents
  const tableOfContents = [
    { id: "hero", label: "Welcome to WebPro Documentation", href: "#hero" },
    { id: "key-sections", label: "Key Sections", href: "#key-sections" },
    {
      id: "getting-started",
      label: "Getting Started",
      href: "#getting-started",
    },
    { id: "user-guides", label: "User Guides", href: "#user-guides" },
    { id: "faqs", label: "Frequently Asked Questions", href: "#faqs" },
    { id: "support", label: "Need More Help", href: "#support" },
  ];

  // Track scroll position for table of contents and progress bar
  useEffect(() => {
    const handleScroll = () => {
      // Update scroll progress
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));

      const sections = [
        { id: "hero", element: document.getElementById("hero") },
        {
          id: "key-sections",
          element: document.getElementById("key-sections"),
        },
        {
          id: "getting-started",
          element: document.getElementById("getting-started"),
        },
        { id: "user-guides", element: document.getElementById("user-guides") },
        { id: "faqs", element: document.getElementById("faqs") },
        { id: "support", element: document.getElementById("support") },
      ];

      const scrollPosition = window.scrollY + 200; // Offset for better UX

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Set initial values

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to check if navigation item should be highlighted based on active section
  const isNavItemActive = (item: (typeof navigationItems)[0]) => {
    if (item.isActive) return true;

    //  check if current section matches any of the item's sections
    return item.sections.includes(activeSection);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Fixed Sidebar Navigation */}
        <aside className="hidden lg:block w-64 border-r border-muted-foreground/20 fixed h-screen pt-24 bg-background z-30">
          <div className="p-6 h-full overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4 bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text">
              WebPro Docs
            </h3>
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = isNavItemActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group ${
                      isActive
                        ? "text-primary font-semibold bg-primary/10 border-l-2 border-primary shadow-sm"
                        : "hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 transition-transform ${
                        isActive ? "scale-110" : "group-hover:scale-105"
                      }`}
                    />
                    <span
                      className={`transition-all ${
                        isActive ? "tracking-wide" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 xl:mr-64">
          {children}

          {/* CTA Section - Global for all documentation pages */}
          <section id="support" className="py-20 px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text">
                Need more help?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to
                help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary-foreground text-white rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 group"
                >
                  <Zap className="w-5 h-5" />
                  Contact Support
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/agency"
                  className="px-8 py-4 border-2 border-muted-foreground/30 text-foreground rounded-lg font-semibold text-lg hover:bg-muted/50 hover:border-primary/50 transition-all duration-300"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </section>

          {/* Footer Links - Global for all documentation pages */}
          <footer className="py-16 border-t border-muted-foreground/20 relative z-10">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-muted-foreground">
                <Link
                  href="/documentation"
                  className="hover:text-foreground transition-colors"
                >
                  Documentation Home
                </Link>
                <Link
                  href="/api-reference"
                  className="hover:text-foreground transition-colors"
                >
                  API Reference
                </Link>
                <Link
                  href="/changelog"
                  className="hover:text-foreground transition-colors"
                >
                  Changelog
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Support
                </Link>
              </div>

              <div className="text-center mt-8 text-muted-foreground">
                <p>© 2025 WebPro. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </main>

        {/* Fixed Table of Contents */}
        <aside className="hidden xl:block w-64 border-l border-muted-foreground/20 fixed right-0 h-screen pt-24 bg-background z-30">
          <div className="p-6 h-full overflow-hidden">
            <h3 className="font-semibold text-lg mb-4">On this page</h3>

            {/* Progress Bar */}
            <div className="relative mb-6">
              <div className="h-1 bg-muted rounded-full">
                <div
                  className="h-1 bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${scrollProgress}%` }}
                ></div>
              </div>
              <span className="text-xs text-muted-foreground mt-1 block">
                Scroll Progress
              </span>
            </div>

            <nav className="space-y-2 text-sm">
              {tableOfContents.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left py-2 px-3 rounded-lg transition-all ${
                    activeSection === item.id
                      ? "text-primary font-semibold bg-primary/10 border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-8 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Quick Actions</h4>
              <div className="space-y-2 text-xs">
                <Link
                  href="/contact"
                  className="block text-primary hover:underline"
                >
                  Report an Issue
                </Link>
                <Link
                  href="/changelog"
                  className="block text-primary hover:underline"
                >
                  View Changelog
                </Link>
                <Link
                  href="/api-reference"
                  className="block text-primary hover:underline"
                >
                  API Reference
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
