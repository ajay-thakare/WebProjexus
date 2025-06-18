import { AnimatedPricingCards } from "@/components/animations/animated-pricing-card-component";
import { AnimatedSectionHeading } from "@/components/animations/section-heading-component";
import { FAQSection } from "@/components/site/modules-helper/faq-section";
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
import {
  Check,
  ArrowRight,
  Star,
  Zap,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

export default async function PricingPage() {
  // Fetch prices on server side
  const prices = await stripe.prices.list({
    product: process.env.NEXT_WEBPRO_PRODUCT_ID,
    active: true,
  });

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, including Visa, Mastercard, etc. We also support payments through PayPal for your convenience.",
    },
    {
      question: "Can I upgrade or downgrade my plan at any time?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle. You'll have immediate access to new features when upgrading.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "No, we currently do not offer refunds. We recommend reviewing our features and scheduling a walkthrough to ensure WebPro is the right fit for your agency before subscribing.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "No, we currently do not offer a free trial. However, you can explore our features in detail or check out testimonials from other agencies to see how WebPro can support your needs.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "Support depends on your plan. Basic users receive email support, while Unlimited SaaS users get access to 24/7 support. Starter users can access community resources and help documentation.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. Your account will remain active until the end of your current billing period, and you won't be charged for the next cycle.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-20 pb-10 px-4 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10"></div>

        <div className="max-w-6xl mx-auto text-center">
          {/* <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full px-6 py-2 text-sm mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span>14-day free trial • No credit card required</span>
          </div> */}

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary-foreground hover:from-cyan-500 hover:to-purple-500 text-transparent bg-clip-text transition-all duration-500 cursor-default">
            Choose the plan that's right for you
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
            Scale your agency with flexible pricing plans designed to grow with
            your business.
          </p>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-0 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex">
            <AnimatedPricingCards
              cards={[
                // Free Starter Plan
                {
                  title: pricingCards[0].title,
                  description: pricingCards[0].description,
                  price: "$0",
                  interval: "month",
                  features:
                    pricingCards.find((c) => c.title === "Starter")?.features ||
                    [],
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
                    pricingCards.find((c) => c.title === card.nickname)
                      ?.features || [],
                  isPopular: card.nickname === "Unlimited Saas",
                  href: `/agency?plan=${card.id}&from=landing`,
                })),
              ]}
            />
          </div>
        </div>
      </section>

      {/* Features Comparison Section */}
      <section className="py-20 px-4 bg-muted/30 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <AnimatedSectionHeading
              text="All plans include"
              subtitle="Every WebPro subscription comes with these essential features"
              animationType="glitch"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Drag & Drop Builder",
              "Mobile Responsive",
              "SSL Certificate",
              "99.9% Uptime",
              // "Global CDN",
              // "SEO Tools",
              "Analytics Dashboard",
              "Custom Forms",
              // "Social Media Integration",
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 p-4 bg-background/80 rounded-lg border border-muted-foreground/20"
              >
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection faqs={faqs} />

      {/* Contact Section */}
      <section className="py-20 px-4 bg-muted/30 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            {/* <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Still have questions?
            </h2> */}
            <AnimatedSectionHeading
              text="Still have questions?"
              subtitle=""
              animationType="spiral"
            />
            <p className="text-xl text-muted-foreground mb-8">
              Our team is here to help you find the perfect plan for your
              agency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="text-center p-8 border-0 bg-background/80 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email Support</h3>
              <p className="text-muted-foreground mb-4">
                Get help via email within 24 hours
              </p>
              <Link
                href="mailto:support@webpro.com"
                className="text-primary font-semibold hover:underline"
              >
                support@webpro.com
              </Link>
            </Card>

            {/* <Card className="text-center p-8 border-0 bg-background/80 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
              <p className="text-muted-foreground mb-4">
                Chat with our team in real-time
              </p>
              <button className="text-primary font-semibold hover:underline">
                Start Chat
              </button>
            </Card> */}

            <Card className="text-center p-8 border-0 bg-background/80 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
              <p className="text-muted-foreground mb-4">
                Speak directly with our experts
              </p>
              <Link
                href="tel:+919604791614"
                className="text-primary font-semibold hover:underline"
              >
                +91 9604791614
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text">
            Ready to get started?
          </h2>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of agencies already using WebPro to streamline their
            workflow and grow their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/agency?trial=true"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary-foreground text-white rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 group"
            >
              <Zap className="w-5 h-5" />
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
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
