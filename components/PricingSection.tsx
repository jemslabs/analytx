"use client";

import { Button } from "./ui/button";
import Link from "next/link";

export default function PricingSection() {
  const plans = [
    {
      name: "Creator Plan",
      price: "Free",
      description:
        "Perfect for creators to join campaigns and generate referral links.",
      features: [
        "Join campaigns",
        "Generate unlimited referral links",
        "Track clicks and sales",
        "View basic analytics",
      ],
      isPopular: false,
      href: "/signup",
    },
    {
      name: "Brand Growth Plan",
      price: "₹9,999 / month",
      description:
        "Everything you need to track, analyze, and scale your creator marketing.",
      features: [
        "Unlimited campaigns",
        "Unlimited creators",
        "Unlimited tracking events",
        "Detailed analytics dashboard",
        "Server-side tracking (no pixels)",
        "CPC & CPS commission models",
        "Automated payout calculations",
        "API access",
        "Priority support",
      ],
      isPopular: true,
      href: "/signup",
      hasFreeTrial: true,
    },
  ];

  return (
    <section id="pricing" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="bg-white inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
            Pricing
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight">
            Simple, Transparent Pricing
          </h2>

          <p className="mt-4 text-lg text-muted-foreground">
            No hidden fees. No feature gates. Just straightforward pricing.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl bg-white p-10 shadow-lg flex flex-col justify-between ${
                plan.isPopular
                  ? "border-2 border-primary scale-105"
                  : "border border-gray-200"
              }`}
            >
              {plan.isPopular && (
                <span className="absolute top-4 right-4 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-600">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>

                <div className="text-4xl font-extrabold">{plan.price}</div>

                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-primary font-bold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link href={plan.href}>
                  <Button className="w-full">
                    {plan.price === "Free" ? "Join Free" : "Get Started"}
                  </Button>
                </Link>

                {plan.hasFreeTrial && (
                  <p className="mt-4 text-xs sm:text-sm text-muted-foreground text-center">
                    Want to test it first?{" "}
                    <Link
                      href="https://calendly.com/isonikrish/intro-call"
                      target="_blank"
                      className="font-semibold text-primary underline underline-offset-4"
                    >
                      Start a 14-day free trial
                    </Link>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
