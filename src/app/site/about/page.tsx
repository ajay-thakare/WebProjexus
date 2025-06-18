import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Star,
  Zap,
  ArrowRight,
  Target,
  Heart,
  Users,
  Lightbulb,
  Shield,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AnimatedSectionHeading } from "@/components/animations/section-heading-component";
import { AnimatedTimeline } from "./_components/animated-timeline";
import { AnimatedStorySection } from "./_components/animated-story-section";
import { AnimatedValuesCards } from "./_components/animated-values-card";
import { AnimatedTeamCards } from "./_components/animated-team-card";
import { AnimatedContactCards } from "./_components/animated-contact-us";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "A",
      role: "CEO",
      description:
        "Visionary leader with 10+ years in tech, passionate about empowering agencies to achieve their full potential.",
      image: "/api/placeholder/200/200",
      gradient: "from-blue-400 to-purple-500",
    },
    {
      name: "S",
      role: "Head of Product",
      description:
        "Product strategist focused on creating intuitive solutions that solve real agency challenges.",
      image: "/api/placeholder/200/200",
      gradient: "from-purple-400 to-pink-500",
    },
    {
      name: "N",
      role: "Lead Developer",
      description:
        "Full-stack engineer building scalable solutions with cutting-edge technology and best practices.",
      image: "/api/placeholder/200/200",
      gradient: "from-pink-400 to-red-500",
    },
  ];

  const values = [
    {
      icon: "Lightbulb",
      title: "Innovation",
      description:
        "We continuously push boundaries to bring you cutting-edge solutions that keep you ahead of the competition.",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: "Users",
      title: "User-Centric Design",
      description:
        "Every feature is designed with our users in mind, ensuring intuitive and delightful experiences.",
      gradient: "from-blue-400 to-cyan-500",
    },
    {
      icon: "Shield",
      title: "Reliability",
      description:
        "We maintain 99.9% uptime and robust security to ensure your business runs smoothly 24/7.",
      gradient: "from-green-400 to-emerald-500",
    },
    {
      icon: "Heart",
      title: "Customer Success",
      description:
        "Your success is our success. We're committed to providing exceptional support and guidance.",
      gradient: "from-red-400 to-pink-500",
    },
  ];

  const milestones = [
    {
      year: "Aug 2024",
      event: "WebPro Conceptualized",
      description:
        "Initial idea sparked to empower digital agencies with an all-in-one solution.",
    },
    {
      year: "Sep 2024",
      event: "WebPro Project Initiated",
      description:
        "Began the journey with a dedicated team, focused on building tools for modern agencies.",
    },
    {
      year: "Oct 2024",
      event: "Architecture & Planning",
      description:
        "Defined system architecture using Next.js, Clerk, Stripe, Prisma, and PostgreSQL.",
    },
    {
      year: "Mar 2025",
      event: "Project Kickoff",
      description: "Setup project with Next.js, Clerk, Prisma, and Stripe.",
    },
    {
      year: "Apr 2025",
      event: "Core Modules Built",
      description:
        "Completed landing page, auth, settings, and team management.",
    },
    {
      year: "May 2025",
      event: "CRM & Billing",
      description:
        "Added pipeline, contact management, and Stripe integration.",
    },
    {
      year: "Jun 2025",
      event: "Funnel Builder & Dashboards",
      description: "Released drag-and-drop editor and analytics dashboards.",
    },
    {
      year: "June 2025",
      event: "Beta Testing ",
      description:
        "Onboarded early users and received actionable feedback from real agencies.",
    },
    {
      year: "July 2025",
      event: "Global Expansion",
      description:
        "Officially launched WebPro for agencies with full SaaS capabilities.",
    },
  ];

  const contactMethods = [
    {
      icon: "Mail" as const,
      title: "Email",
      content: "support@webpro.com",
      href: "mailto:support@webpro.com",
      type: "email" as const,
    },
    {
      icon: "Phone" as const,
      title: "Phone",
      content: "+919604791614",
      href: "tel:+919604791614",
      type: "phone" as const,
    },
    {
      icon: "MapPin" as const,
      title: "Office",
      content: "123 Main Street, Shahada, India",
      href: "#",
      type: "location" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10 opacity-30"></div>

        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary-foreground hover:from-cyan-500 hover:to-purple-500 text-transparent bg-clip-text transition-all duration-500 cursor-default">
            About Us
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Learn more about our mission, values, and the team behind WebPro.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <AnimatedStorySection
        title="Our Story"
        paragraphs={[
          {
            text: "The WebPro project started in September 2024 with a simple yet ambitious goal: to empower agency owners with the tools they need to thrive in the digital age. We recognized the challenges faced by agencies in managing their teams, creating stunning websites, and handling subscriptions efficiently.",
          },
          {
            text: "Our platform was born out of a desire to simplify these processes, allowing agency owners to focus on what truly matters: growing their business and delivering exceptional results for their clients.",
          },
        ]}
        animationType="fade" // "typewriter", "fade"
        className="py-20"
      />

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-muted/30 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <AnimatedSectionHeading
              text="Our Journey"
              subtitle="Key milestones that shaped WebPro into what it is today"
              animationType="morphing"
            />
          </div>

          <AnimatedTimeline milestones={milestones} />
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <AnimatedSectionHeading
                text="Our Mission"
                subtitle=""
                animationType="typewriter"
              />
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                At WebPro, our mission is to empower agency owners with the
                tools they need to succeed. We believe that managing your team,
                creating stunning websites, and handling subscriptions should be
                seamless and efficient.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Our platform is designed to simplify these processes, allowing
                you to focus on what matters most: growing your business.
              </p>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8 border border-primary/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary-foreground rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">Goal-Oriented</h3>
                    <p className="text-sm text-muted-foreground">
                      Focused on achieving measurable results
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">Efficient</h3>
                    <p className="text-sm text-muted-foreground">
                      Streamlined processes for maximum productivity
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 px-4 bg-muted/30 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <AnimatedSectionHeading
              text="Our Values"
              subtitle=""
              animationType="particle"
            />
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We are committed to innovation, user-centric design, and
              exceptional customer support. Our values drive us to continuously
              improve our platform and provide the best possible experience for
              our users.
            </p>
          </div>

          <AnimatedValuesCards
            values={values}
            animationType="cascade" // Choose: "cascade", "spiral", "magnetic", "orbit"
          />
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <AnimatedSectionHeading
              text="Meet the Team"
              subtitle=""
              animationType="spiral"
            />
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our team is composed of experienced professionals passionate about
              technology and design. We bring diverse skills and perspectives to
              create a platform that meets the unique needs of agency owners.
            </p>
          </div>

          <AnimatedTeamCards
            teamMembers={teamMembers}
            animationType="flip" // Choose: "spotlight", "carousel", "flip", "zoom"
          />

          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-br from-background to-muted/30 border border-primary/20 p-8">
              <CardContent>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  We are dedicated to providing exceptional service and support
                  to help our users achieve their goals. Our diverse team brings
                  together expertise in technology, design, and customer success
                  to create the best possible experience for agency owners
                  worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 px-4 bg-muted/30 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <AnimatedSectionHeading
              text="Contact Us"
              subtitle=""
              animationType="glitch"
            />
            <p className="text-xl text-muted-foreground">
              We'd love to hear from you! Whether you have questions, feedback,
              or just want to learn more about WebPro, please don't hesitate to
              reach out.
            </p>
          </div>

          <div className="mb-12">
            <AnimatedContactCards
              contactMethods={contactMethods}
              animationType="connect" // Choose: "pulse", "float", "connect", "glow", "orbit"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text">
            Ready to join our mission?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the WebPro difference and see why thousands of agencies
            trust us with their success.
          </p>
          <Link
            href="/agency"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary-foreground text-white rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 group"
          >
            <Zap className="w-5 h-5" />
            Get Started Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer Links */}
      <footer className="py-16 border-t border-muted-foreground/20 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Contact Us
            </Link>
          </div>

          <div className="text-center mt-8 text-muted-foreground">
            <p>© 2025 WebPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
