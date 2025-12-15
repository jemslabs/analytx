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
      title: "Disconnected campaign data",
      description:
        "Campaign performance lives across tools, spreadsheets, and dashboards — nothing in one place.",
    },
    {
      icon: Target,
      title: "Unclear attribution",
      description:
        "Brands can’t confidently say which creator or campaign actually drove conversions.",
    },
    {
      icon: DollarSign,
      title: "Manual tracking & payouts",
      description:
        "Teams waste hours calculating commissions, validating sales, and managing payouts.",
    },
  ];

  const fixes = [
    {
      icon: LayoutDashboard,
      title: "Single source of truth",
      description:
        "All campaign, click, and conversion data unified in one real-time dashboard.",
    },
    {
      icon: TrendingUp,
      title: "Reliable performance tracking",
      description:
        "Server-side attribution connects every click to real conversions with accuracy.",
    },
    {
      icon: Users,
      title: "Automatic tracking & payouts",
      description:
        "Sales and clicks are verified, commissions are calculated automatically."


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
            Why brands struggle with creator campaigns
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Running creator campaigns is easy. Tracking what actually works is not.
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
                Where creator campaigns break down
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
                How AnalytX fixes it
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
