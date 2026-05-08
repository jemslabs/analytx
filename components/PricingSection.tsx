"use client";

import { Button } from "./ui/button";
import Link from "next/link";

export default function PricingSection() {
  const plan = {
    name: "Brand Starter Plan",
    price: "₹999 / month",
    description:
      "Everything you need to track, analyze, and scale your influencer marketing.",
    features: [
      "Unlimited campaigns",
      "Unlimited creators",
      "Unlimited referral links",
      "Clicks & sales tracking",
      "Automated payout calculations",
      "Campaign-level performance dashboard",
    ],
    href: "/signup",
    isPopular: true,
    hasFreeTrial: true
  };

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
            Start tracking creator performance in minutes. No setup fees.
          </p>
        </div>

        {/* Single Pricing Card */}
        <div className="flex justify-center">
          <div
            className={`relative w-full max-w-xl rounded-3xl bg-white p-10 shadow-lg border-2 border-primary`}
          >
            {/* Badge */}
            <span className="absolute top-4 right-4 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              Recommended
            </span>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">{plan.name}</h3>

              <div className="text-4xl font-extrabold">{plan.price}</div>

              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>

              <ul className="space-y-3 text-sm text-muted-foreground">
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
                  Get Started
                </Button>
              </Link>

              {plan.hasFreeTrial && ( <p className="mt-4 text-xs sm:text-sm text-muted-foreground text-center"> Want to test it first?{" "} <Link href="https://calendly.com/isonikrish/intro-call" target="_blank" className="font-semibold text-primary underline underline-offset-4" > Start a 14-day free trial </Link> </p> )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}