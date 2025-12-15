import Link from "next/link"
import { Button } from "./ui/button"

function HeroSection() {
    return (
        <section className="relative overflow-hidden">


            <div className="relative mx-auto max-w-7xl px-6 pt-40 pb-32 text-center">
                <div className="mb-8 flex justify-center">
                    <span className="inline-flex items-center gap-1 rounded-full border  bg-linear-to-r from-white/80 to-gray-100/80 px-4 py-1 text-sm font-medium text-gray-700 backdrop-blur transition-all hover:shadow-lg hover:scale-105">
                        Powered by{" "}
                        <Link
                            href="https://instagram.com/jems.labs"
                            target="_blank"
                            className="text-primary font-semibold hover:underline"
                        >
                            Jems Labs
                        </Link>
                    </span>

                </div>

                <h1 className="text-4xl md:text-6xl font-medium tracking-tight leading-tight text-gray-900 dark:text-black">
                    One platform to track <br className="hidden md:block" />
                    <span className="text-primary font-bold">
                        campaigns and performance
                    </span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                    AnalytX helps brands see what truly drives results in creator marketing — with accurate attribution, actionable analytics, and reliable data at scale.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/signup">
                        <Button
                            size="lg"
                            className="rounded-xl px-10 shadow-md"
                        >
                            Get Started
                        </Button>
                    </Link>

                    <Link href="/docs">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="rounded-xl px-10 hover:bg-white"
                        >
                            Read Docs
                        </Button>
                    </Link>
                </div>
                <div className="relative mx-auto mt-20 max-w-5xl">
                    <div className="rounded-2xl border bg-background shadow-xl">

                        <div className="flex items-center gap-2 border-b px-4 py-3">
                            <span className="h-3 w-3 rounded-full bg-red-400" />
                            <span className="h-3 w-3 rounded-full bg-yellow-400" />
                            <span className="h-3 w-3 rounded-full bg-green-400" />
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {[
                                    ["Total Revenue", "₹120k"],
                                    ["Campaign Clicks", "10k"],
                                    ["Campaign Sales", "1k"],
                                    ["Conversion Rate", "10%"],
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="rounded-xl border bg-muted/40 p-4 text-left"
                                    >
                                        <p className="text-xs text-muted-foreground">{label}</p>
                                        <p className="mt-1 text-lg font-semibold">{value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-end gap-2 h-32">
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
    )
}

export default HeroSection