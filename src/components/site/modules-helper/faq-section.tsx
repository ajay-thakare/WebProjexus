"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatedSectionHeading } from "@/components/animations/section-heading-component";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openFAQ, setOpenFAQ] = useState<number>(0);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? -1 : index);
  };

  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          {/* <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h2> */}
          <AnimatedSectionHeading
            text="Frequently Asked Questions"
            subtitle=""
            animationType="morphing" // or any other type
          />
          <p className="text-xl text-muted-foreground">
            Got questions? We've got answers. If you can't find what you're
            looking for, feel free to contact us.
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
                  <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
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
  );
}
