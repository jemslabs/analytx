import Link from "next/link";
import { Button } from "./ui/button";

function HeroSection() {
  return (
    <section className="relative overflow-hidden my-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-20 sm:pt-28 md:pt-36 pb-16 sm:pb-24 text-center">
        {/* Badge */}
        <div className="mb-4 sm:mb-6 flex justify-center">
          <span className="inline-flex items-center gap-1 rounded-full border bg-white/80 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur">
            Powered by{" "}
            <Link
              href="https://instagram.com/jems.labs"
              target="_blank"
              className="text-primary font-semibold"
            >
              Jems Labs
            </Link>
          </span>
        </div>

        {/* Heading */}
        <h1 className="mx-auto max-w-[820px] text-center text-[2.2rem] font-semibold leading-[1.15] tracking-[-0.04em] text-gray-950 sm:text-5xl sm:leading-[1.1] md:text-6xl lg:text-[4.5rem] lg:leading-[1.02]">
          Manage and track{" "}
          <span className="inline-block rounded-xl bg-primary/10 px-3 py-1 text-primary">
            influencer campaigns
          </span> <br />
          in one dashboard
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-7 text-muted-foreground sm:text-lg md:text-xl">
          AnalytX helps brands manage influencer campaigns, track performance, and
          calculate payouts with simple and reliable tracking.
        </p>

        {/* Actions – unchanged */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3">
          <Link
            href="https://calendly.com/isonikrish/intro-call"
            className="w-full sm:w-auto"
            target="_blank"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-4xl px-10 py-6 text-lg font-semibold shadow-lg"
            >
              Start Trial
            </Button>
          </Link>

          <p className="text-[13px] text-gray-400">
            14-day free trial · No credit card required · Intro call needed
          </p>
        </div>

        {/* Dashboard Preview – same structure, mobile-safe */}
        <div className="mx-auto mt-10 sm:mt-10 max-w-4xl">
          <div className="rounded-xl border bg-background shadow-lg overflow-hidden">
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>

            <div className="p-5 sm:p-7 bg-gray-50/40">
              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ["Total Revenue", "₹1,20,000", "+12%"],
                  ["Campaign Clicks", "10,000", "+8%"],
                  ["Campaign Sales", "1,000", "+5%"],
                  ["Conversion Rate", "10%", "+2%"],
                ].map(([label, value, change]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 text-left shadow-sm"
                  >
                    <p className="text-[11px] font-medium text-gray-400 tracking-wide uppercase">
                      {label}
                    </p>
                    <p className="mt-1 text-[17px] font-semibold text-gray-900 tracking-tight">
                      {value}
                    </p>
                    <p className="mt-0.5 text-[11px] text-emerald-500 font-medium">
                      {change}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chart hidden on mobile */}
              <div className="mt-5 hidden sm:flex items-end gap-2 h-28">
                {[40, 65, 45, 80, 55, 90, 70, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-md bg-linear-to-t from-muted-foreground/80 to-muted"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
