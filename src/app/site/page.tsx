import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
import { stripe } from "@/lib/stripe";
import clsx from "clsx";
import {
  Check,
  Users,
  MousePointer,
  CreditCard,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdvancedGSAPCounter } from "@/components/animations/animated-counter-component";
import { AnimatedFeatureCards } from "@/components/animations/animated-feature-card-component";
import { LiquidFeatureCards } from "@/components/animations/liquid-feature-card";
import { AnimatedSectionHeading } from "@/components/animations/section-heading-component";
import { AnimatedPricingCards } from "@/components/animations/animated-pricing-card-component";
import Footer from "@/components/site/footer";

export default async function Home() {
  // Fetch dynamic pricing from Stripe
  const prices = await stripe.prices.list({
    product: process.env.NEXT_WEBPRO_PRODUCT_ID,
    active: true,
  });

  const keyFeatures = [
    {
      icon: "Users",
      title: "Team Management",
      description: "Easily manage team members, roles, and permissions.",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      icon: "MousePointer",
      title: "Drag-and-Drop Website Creation",
      description:
        "Create stunning websites with our intuitive drag-and-drop builder.",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: "CreditCard",
      title: "Subscription Management",
      description: "Handle Stripe subscriptions and billing with ease.",
      gradient: "from-pink-500 to-red-600",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Agencies" },
    { number: "50K+", label: "Websites Built" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ];

  const testimonials = [
    {
      name: "Pratik Mali",
      role: "Agency Owner",
      company: "Digital Solutions Co.",
      content:
        "WebPro transformed how we manage our agency. The drag-and-drop builder is incredible!",
      rating: 5,
    },
    {
      name: "Hemant Patil",
      role: "Creative Director",
      company: "Design Studio X",
      content:
        "Best investment we've made. Our productivity increased by 300% in just 2 months.",
      rating: 5,
    },
    {
      name: "Harshali Shelar",
      role: "Freelancer",
      company: "ER Creative",
      content:
        "Finally, a tool that understands agency workflows. Couldn't be happier!",
      rating: 5,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen pt-24 w-full md:pt-32 relative flex items-center justify-center flex-col overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10 opacity-30"></div>

        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full px-6 py-2 text-lg">
          <Zap className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-center text-sm md:text-2xl  whitespace-nowrap">
            Run your agency, in one place
          </p>
          <Zap className="w-4 h-4 text-primary flex-shrink-0" />
        </div>

        <div className="bg-gradient-to-r from-primary to-secondary-foreground hover:from-cyan-500 hover:to-purple-500 text-transparent bg-clip-text relative transition-all duration-500 cursor-default">
          <h1 className="text-8xl font-bold text-center md:text-[300px]">
            WebPro
          </h1>
        </div>

        <div className="flex justify-center items-center relative md:mt-[-70px]">
          <Image
            src={"/assets/resizecom_luke-chesser-JKUTrJ4vK00-unsplash.png"}
            alt="banner image"
            height={1200}
            width={1200}
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
          />
          <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <AdvancedGSAPCounter
                  target={stat.number}
                  duration={2.5}
                  delay={index * 0.2}
                  enableEffects={true}
                />
                <div className="text-muted-foreground font-medium mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Key Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              WebPro offers a comprehensive suite of tools to help you manage
              your agency efficiently.
            </p>
          </div>

          {/* <AnimatedFeatureCards features={keyFeatures} /> */}
          <LiquidFeatureCards features={keyFeatures} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <AnimatedSectionHeading
              text="What Our Clients Say"
              subtitle="Join thousands of satisfied agencies using WebPro"
              animationType="glitch" // Choose: "wave", "floating", "glitch", "typewriter", "morphing"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.name}
                className="border-0 bg-background/80 backdrop-blur-sm hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-base italic leading-relaxed">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Pricing Section */}
      <section className="flex justify-center items-center flex-col gap-4 py-20 px-4 relative z-10">
        <div className="text-center mb-16">
          <AnimatedSectionHeading
            text="Choose what fits you right"
            subtitle=""
            animationType="morphing" // Choose: "wave", "floating", "glitch", "typewriter", "morphing"
          />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our straightforward pricing plans are tailored to meet your needs.
            If you're not ready to commit you can get started for free.
          </p>
        </div>

        <AnimatedPricingCards
          cards={[
            // Free Starter Plan
            {
              title: pricingCards[0].title,
              description: pricingCards[0].description,
              price: "$0",
              interval: "month",
              features:
                pricingCards.find((c) => c.title === "Starter")?.features || [],
              isFree: true,
              href: "/agency",
            },
            // Dynamic Stripe Pricing Cards
            ...prices.data.map((card) => ({
              id: card.id,
              nickname: card.nickname,
              title: card.nickname || "Plan",
              description:
                pricingCards.find((c) => c.title === card.nickname)
                  ?.description || "",
              price: card.unit_amount ? card.unit_amount / 100 : 0,
              interval: card.recurring?.interval || "month",
              features:
                pricingCards.find((c) => c.title === card.nickname)?.features ||
                [],
              isPopular: card.nickname === "Unlimited Saas",
              href: `/agency?plan=${card.id}&from=landing`,
            })),
          ]}
        />
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10 border-y border-primary/20 relative z-10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <AnimatedSectionHeading
            text="Ready to take your agency to the next level?"
            subtitle=""
            animationType="typewriter" // Choose: "wave", "floating", "glitch", "typewriter", "morphing"
          />
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sign up for WebPro today and start streamlining your workflow.
          </p>
          <Link
            href="/agency"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary-foreground text-white rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 group"
          >
            <Zap className="w-5 h-5" />
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </>
  );
}
