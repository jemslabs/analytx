import {
  AlertCircle,
  Target,
  DollarSign,
  LayoutDashboard,
  TrendingUp,
  Users,
} from "lucide-react";

const ProblemSolutionSection = () => {
  const challenges = [
    {
      icon: AlertCircle,
      title: "Campaign data is scattered",
      description:
        "Clicks, sales, and influencer performance are spread across spreadsheets, DMs, and different tools.",
    },
    {
      icon: Target,
      title: "It’s hard to know what drives sales",
      description:
        "Brands struggle to track which influencers actually convert customers and drive revenue.",
    },
    {
      icon: DollarSign,
      title: "Payouts are still manual",
      description:
        "Teams still calculate influencer commissions manually using spreadsheets and coupon codes.",
    },
  ];

  const fixes = [
    {
      icon: LayoutDashboard,
      title: "Everything in one dashboard",
      description:
        "Track campaigns, clicks, sales, and influencer performance from one place.",
    },
    {
      icon: TrendingUp,
      title: "Track what actually converts",
      description:
        "See which influencers drive clicks, sales, and revenue across every campaign.",
    },
    {
      icon: Users,
      title: "Automate influencer payouts",
      description:
        "Automatically calculate influencer payouts based on campaign performance.",
    },
  ];

  return (
    <section className="relative lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center rounded-full border bg-white px-4 py-1 text-sm font-medium text-black">
            Problem / Solution
          </span>

          <h2 className="mt-6 text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
            Managing influencer campaigns gets messy fast
          </h2>

          <p className="mt-4 text-lg text-muted-foreground">
            Most brands still manage influencer campaigns with spreadsheets,
            coupon codes, and manual payouts.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Challenges */}
          <div>
            <div className="mb-10">
              <span className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
                The Problem
              </span>

              <h3 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                Where influencer campaigns break down
              </h3>
            </div>

            <div className="space-y-6">
              {challenges.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl border border-red-500/40 bg-card p-6 min-h-[120px]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10">
                    <item.icon className="h-5 w-5 text-destructive" />
                  </div>

                  <div>
                    <h3 className="font-medium text-foreground">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fixes */}
          <div>
            <div className="mb-10">
              <span className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-600">
                The Solution
              </span>

              <h3 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                How AnalytX solves it
              </h3>
            </div>

            <div className="space-y-6">
              {fixes.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl border border-green-500/50 bg-card p-6 min-h-[120px]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
                    <item.icon className="h-5 w-5 text-green-600 dark:text-green-500" />
                  </div>

                  <div>
                    <h3 className="font-medium text-foreground">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;