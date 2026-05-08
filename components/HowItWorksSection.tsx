"use client";

import {
  CheckCircle,
  UserPlus,
  BarChart3,
  ArrowUpRight,
  Link2,
} from "lucide-react";
import Link from "next/link";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <CheckCircle className="h-6 w-6 text-black" />,
      title: "Install Tracking Script",
      desc: "Brand installs a lightweight script on their website to start capturing visitor activity and attribution.",
    },
    {
      icon: <UserPlus className="h-6 w-6 text-black" />,
      title: "Create Campaign & Invite Creators",
      desc: "Brands create campaigns and invite creators they want to track and attribute performance to.",
    },
    {
      icon: <Link2 className="h-6 w-6 text-black" />,
      title: "Creators Generate Referral Links",
      desc: "Each creator gets unique referral links that capture attribution when users click through.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-black" />,
      title: "Track Clicks & Sales",
      desc: "Analytx captures clicks and conversion events and maps them back to the original creator.",
    },
    {
      icon: <ArrowUpRight className="h-6 w-6 text-black" />,
      title: "Attribute Revenue & Optimize",
      desc: "Sales are attributed to creators and brands optimize campaigns based on real performance data.",
    },
  ];

  return (
    <section id="how-it-works" className="lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="bg-white inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
            How It Works
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight">
           Get started with influencer marketing
          </h2>

          <p className="mt-4 text-lg text-muted-foreground">
           Follow these five steps to launch, track, and scale your campaigns efficiently.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Big Card */}
          <div className="lg:col-span-7 rounded-3xl border bg-card p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
            <div className="relative z-10 space-y-8">
              {steps.slice(0, 3).map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex-none h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1">
                      {step.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Stack */}
          <div className="lg:col-span-5 grid gap-6">
            {steps.slice(3).map((step, idx) => (
              <div
                key={idx}
                className="rounded-3xl border bg-card p-8 relative overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <h4 className="font-semibold">{step.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/docs"
            className="inline-flex items-center justify-center rounded-full border bg-card px-6 py-3 text-sm font-medium text-primary hover:bg-primary/5 transition"
          >
            View full integration docs →
          </Link>
        </div>

      </div>
    </section>
  );
}