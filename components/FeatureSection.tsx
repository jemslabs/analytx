"use client";

import {
  BarChart3,
  Users,
  Target,
  DollarSign,
  Link2,
  ShieldCheck,
} from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features" className="lg:py-32 py-15">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="bg-white inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
            Core features
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight">
            Built for tracking what
            <span className="text-primary"> actually performs</span>
          </h2>

          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to measure campaign performance, creator impact,
            and revenue — without guesswork.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* HERO CARD */}
          <div className="lg:col-span-7 rounded-3xl border bg-card p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Campaign analytics
                </span>
              </div>

              <h3 className="text-2xl font-semibold mb-3">
                Full visibility into campaign performance
              </h3>

              <p className="text-muted-foreground max-w-xl">
                Track clicks, conversions, and revenue across all campaigns —
                broken down by creator, link, and product.
              </p>

              {/* Graph visual */}
              <div className="mt-10 flex items-end gap-2 h-32">
                {[40, 65, 55, 80, 60, 95, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-lg bg-primary/20"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT STACK */}
          <div className="lg:col-span-5 grid gap-6">
            {/* Attribution */}
            <div className="rounded-3xl border bg-card p-8 relative overflow-hidden hover:shadow-lg transition-all">
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-semibold">Accurate attribution</h4>
                  </div>
        
                </div>

                <p className="text-sm text-muted-foreground max-w-sm">
                  Every click and conversion is attributed to the correct
                  campaign and creator using reliable server-side tracking.
                </p>

                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-md border px-2 py-1">Click</span>
                  <span>→</span>
                  <span className="rounded-md border px-2 py-1">Creator</span>
                  <span>→</span>
                  <span className="rounded-md border px-2 py-1">Sale</span>
                </div>
              </div>
            </div>

            {/* Commissions */}
            <div className="rounded-3xl border bg-card p-8 relative overflow-hidden hover:shadow-lg transition-all">
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-semibold">Automated commissions</h4>
                  </div>
                  
                </div>

                <p className="text-sm text-muted-foreground max-w-sm">
                  Sales and clicks are verified automatically, commissions are
                  calculated instantly.
                </p>

                <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-lg border p-3 text-center">
                    <p className="font-semibold">10k</p>
                    <p className="text-muted-foreground">Clicks</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="font-semibold">1k</p>
                    <p className="text-muted-foreground">Sales</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="font-semibold">Auto</p>
                    <p className="text-muted-foreground">Payouts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="lg:col-span-4 rounded-3xl border bg-card p-8 relative overflow-hidden hover:shadow-lg transition-all">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold">Creator insights</h4>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Identify top-performing creators and optimize partnerships using
                actionable insights.
              </p>

              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Top creator</span>
                  <span className="font-medium text-foreground">Creator A</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversion rate</span>
                  <span className="font-medium text-foreground">12.4%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-3xl border bg-card p-8 relative overflow-hidden hover:shadow-lg transition-all">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Link2 className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold">Platform referral links</h4>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Creators can generate multiple referral links per platform for
                precise tracking.
              </p>

              <div className="rounded-lg border p-3 text-xs text-muted-foreground">
                tryanalytx.com/r/creator123
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-3xl border bg-card p-8 relative overflow-hidden hover:shadow-lg transition-all">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold">Server-side tracking</h4>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Reliable tracking that bypasses ad blockers and client-side
                failures.
              </p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-md border px-2 py-1">API</span>
                <span className="rounded-md border px-2 py-1">Secure</span>
                <span className="rounded-md border px-2 py-1">Scalable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
