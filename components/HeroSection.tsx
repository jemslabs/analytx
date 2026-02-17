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

                {/* Heading – original content */}
                <h1 className="mx-auto max-w-3xl text-3xl sm:text-4xl md:text-7xl font-semibold tracking-tight leading-tight text-gray-900">
                    Track which influencers{" "}
                    <span className="text-primary font-extrabold">
                        actually drive sales
                    </span>
                </h1>

                {/* Description – original content */}
                <p className="mx-auto mt-4 max-w-[650px] text-sm sm:text-base md:text-lg text-muted-foreground">
                    AnalytX tracks clicks and sales across every influencer campaign, showing which influencers drive results and calculating payouts based on performance.
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

                    <p className="text-sm text-muted-foreground text-center">
                        14-day free trial for new brands & agencies. Intro call required.
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

                        <div className="p-4 sm:p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    ["Total Revenue", "₹120k"],
                                    ["Campaign Clicks", "10k"],
                                    ["Campaign Sales", "1k"],
                                    ["Conversion Rate", "10%"],
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="rounded-lg border bg-muted/40 p-3 text-left"
                                    >
                                        <p className="text-[11px] text-muted-foreground">
                                            {label}
                                        </p>
                                        <p className="mt-0.5 text-base font-semibold">
                                            {value}
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
