"use client";

// File: src/app/documentation/page.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Zap,
  ArrowRight,
  Users,
  Globe,
  CheckSquare,
  Image as ImageIcon,
  CreditCard,
  Book,
  ChevronDown,
  ChevronUp,
  Palette,
  Code,
  BarChart3,
  Shield,
  Building2,
  Target,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number>(-1);
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    {}
  );

  const webproFeatures = [
    {
      icon: Globe,
      title: "Website & Funnel Builder",
      description:
        "Build stunning, responsive sites and sales funnels without code",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      icon: Users,
      title: "Team & Client Management",
      description: "Add team members, assign roles, and manage sub-accounts",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: CreditCard,
      title: "Billing & Subscriptions",
      description:
        "Integrated Stripe-based billing for your clients and services",
      gradient: "from-green-500 to-teal-600",
    },
    {
      icon: BarChart3,
      title: "Dashboards & Analytics",
      description: "Get real-time insights and performance metrics",
      gradient: "from-orange-500 to-red-600",
    },
    {
      icon: Shield,
      title: "Role-Based Access Control",
      description: "Control who sees and does what in your agency",
      gradient: "from-red-500 to-pink-600",
    },
  ];

  const targetAudience = [
    {
      icon: Building2,
      title: "Agencies",
      description: "Managing multiple client websites and teams",
    },
    {
      icon: Palette,
      title: "Designers",
      description: "Who want drag-and-drop freedom with professional output",
    },
    {
      icon: Code,
      title: "Developers",
      description: "Looking to streamline workflows with prebuilt modules",
    },
    {
      icon: Target,
      title: "Freelancers",
      description: "Offering web design and digital services to businesses",
    },
    {
      icon: Users,
      title: "Teams",
      description:
        "Needing collaboration, permissions, and centralized control",
    },
  ];

  const keySections = [
    {
      icon: Users,
      title: "Team Management",
      description: "Learn how to add and manage team members",
      gradient: "from-blue-500 to-purple-600",
      href: "/documentation/team-management",
    },
    {
      icon: Globe,
      title: "Website Editing",
      description: "Guide to using the drag-and-drop website editor",
      gradient: "from-purple-500 to-pink-600",
      href: "/documentation/website-editing",
    },
    {
      icon: CheckSquare,
      title: "Task Management",
      description: "Manage tasks and projects effectively",
      gradient: "from-pink-500 to-red-600",
      href: "/documentation/task-management",
    },
    {
      icon: ImageIcon,
      title: "Media Uploads",
      description: "Upload and manage media assets",
      gradient: "from-green-500 to-teal-600",
      href: "/documentation/media-uploads",
    },
    {
      icon: CreditCard,
      title: "Subscription Settings",
      description: "Manage your Stripe subscription",
      gradient: "from-orange-500 to-red-600",
      href: "/documentation/subscription-settings",
    },
    {
      icon: Layers,
      title: "Funnel Builder",
      description: "Create high-converting sales funnels",
      gradient: "from-indigo-500 to-blue-600",
      href: "/documentation/funnel-builder",
    },
  ];

  const gettingStartedSteps = [
    { id: 1, text: "Create your first agency project", completed: false },
    { id: 2, text: "Set up your team and assign roles", completed: false },
    { id: 3, text: "Build your first website or funnel", completed: false },
    {
      id: 4,
      text: "Configure client billing and subscriptions",
      completed: false,
    },
    { id: 5, text: "Launch and start managing clients", completed: false },
  ];

  const userGuides = [
    {
      title: "Agency Setup",
      description:
        "Complete guide to setting up your agency account and initial configuration.",
      href: "/documentation/agency-setup",
    },
    {
      title: "Team Management",
      description:
        "Learn how to add, manage, and assign roles to your team members.",
      href: "/documentation/team-management",
    },
    {
      title: "Website & Funnel Builder",
      description:
        "Master the drag-and-drop builder to create stunning websites and funnels.",
      href: "/documentation/website-editing",
    },
    {
      title: "Client Management",
      description:
        "Manage client accounts, projects, and sub-account permissions effectively.",
      href: "/documentation/client-management",
    },
    {
      title: "Billing & Subscriptions",
      description:
        "Set up Stripe integration and manage client billing and subscriptions.",
      href: "/documentation/billing-subscriptions",
    },
    {
      title: "Analytics & Reporting",
      description:
        "Track performance metrics and generate reports for your agency and clients.",
      href: "/documentation/analytics-reporting",
    },
  ];

  const faqs = [
    {
      question: "What is WebPro and how does it help agencies?",
      answer:
        "WebPro is an all-in-one SaaS platform designed specifically for agencies to build, manage, and scale their digital presence. It combines website building, team management, client billing, and analytics into one unified platform, eliminating the need for multiple tools and streamlining agency workflows.",
    },
    {
      question: "Who can benefit from using WebPro?",
      answer:
        "WebPro is perfect for agencies managing multiple clients, designers wanting drag-and-drop freedom, developers looking to streamline workflows, freelancers offering web services, and teams needing collaboration and centralized control over their projects.",
    },
    {
      question: "How do I add and manage team members?",
      answer:
        "Navigate to the Team section in your agency dashboard, click 'Invite Member', enter their email address, and assign their role (Admin, Editor, Viewer, etc.). Team members will receive an invitation email to join your agency workspace with the appropriate permissions.",
    },
    {
      question: "Can I build websites and funnels without coding?",
      answer:
        "Yes! WebPro features a powerful drag-and-drop builder that lets you create professional websites and high-converting sales funnels without any coding knowledge. Simply choose from pre-built components, customize them to your needs, and publish with one click.",
    },
    {
      question: "How does the billing and subscription system work?",
      answer:
        "WebPro integrates with Stripe to handle all billing automatically. You can set up subscription plans for your clients, manage recurring payments, handle upgrades/downgrades, and track all billing activity from your agency dashboard.",
    },
    {
      question: "What kind of analytics and reporting does WebPro provide?",
      answer:
        "WebPro provides comprehensive dashboards with real-time insights including website performance, funnel conversion rates, client activity, team productivity metrics, and financial reporting. You can generate custom reports for clients and track your agency's growth.",
    },
    {
      question: "How do role-based permissions work?",
      answer:
        "WebPro's role-based access control lets you define exactly what each team member can see and do. Assign roles like Admin, Project Manager, Designer, or custom roles with specific permissions for different clients, projects, or features.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? -1 : index);
  };

  const toggleChecked = (id: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-20 px-4 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10 opacity-30"></div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full px-6 py-2 text-sm mb-8">
            <Book className="w-4 h-4 text-primary" />
            <span>Complete guide to using WebPro effectively</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text">
            WebPro Documentation
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
            Your complete guide to mastering WebPro - the all-in-one platform
            for agencies to build, manage, and scale their digital presence.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search documentation, guides, and FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-muted-foreground/20 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What is WebPro Section */}
      <section id="what-is-webpro" className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What is WebPro?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              WebPro is an all-in-one SaaS platform designed to help agencies
              build, manage, and scale their digital presence with ease. From
              website and funnel creation to client management and billing,
              WebPro centralizes the tools agencies need to deliver high-quality
              services efficiently.
            </p>
          </div>

          {/* Key Features */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center mb-12">
              Key Features & Benefits
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {webproFeatures.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="group h-full border-2 border-muted-foreground/20 bg-gradient-to-br from-background to-muted/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105 hover:border-primary/30"
                  >
                    <CardHeader className="p-6">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-lg mb-2">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Target Audience */}
          <div className="bg-muted/30 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-center mb-12">
              Who is WebPro for?
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {targetAudience.map((audience) => {
                const IconComponent = audience.icon;
                return (
                  <div
                    key={audience.title}
                    className="flex items-start gap-4 p-4 bg-background/60 rounded-lg border border-muted-foreground/20"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{audience.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {audience.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Key Sections */}
      <section id="key-sections" className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Documentation Sections
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore comprehensive guides for every aspect of WebPro
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keySections.map((section) => {
              const IconComponent = section.icon;
              return (
                <Link key={section.title} href={section.href}>
                  <Card className="group h-full border-2 border-muted-foreground/20 bg-gradient-to-br from-background to-muted/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105 hover:border-primary/30">
                    <CardHeader className="p-8">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl mb-3">
                        {section.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {section.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section
        id="getting-started"
        className="py-20 px-4 bg-muted/30 relative z-10"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Getting Started with WebPro
            </h2>
            <p className="text-xl text-muted-foreground">
              Follow these steps to set up your agency and start serving
              clients:
            </p>
          </div>

          <Card className="bg-background/80 border border-primary/20 p-8">
            <CardContent className="space-y-6">
              {gettingStartedSteps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-muted-foreground/20 hover:bg-muted/30 transition-colors"
                >
                  <button
                    onClick={() => toggleChecked(step.id)}
                    className={`w-6 h-6 rounded border-2 transition-all ${
                      checkedItems[step.id]
                        ? "bg-primary border-primary text-white"
                        : "border-muted-foreground/40 hover:border-primary/50"
                    }`}
                  >
                    {checkedItems[step.id] && (
                      <span className="text-xs">✓</span>
                    )}
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {step.id}
                    </span>
                    <span
                      className={`text-lg ${
                        checkedItems[step.id]
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {step.text}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* User Guides Section */}
      <section id="user-guides" className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Comprehensive User Guides
            </h2>
            <p className="text-xl text-muted-foreground">
              In-depth guides to help you master every feature of WebPro
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {userGuides.map((guide) => (
              <Link key={guide.title} href={guide.href}>
                <Card className="group h-full border border-muted-foreground/20 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-105 hover:border-primary/50">
                  <CardHeader className="p-6">
                    <CardTitle className="text-lg mb-3 group-hover:text-primary transition-colors">
                      {guide.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {guide.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 text-primary font-medium text-sm mt-4">
                      Read Guide
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="py-20 px-4 bg-muted/30 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Find quick answers to common questions about WebPro
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="border border-muted-foreground/20 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg pr-4">
                      {faq.question}
                    </h3>
                    {openFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
