"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { trpc } from "@/app/_trpc/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
function StatCard({
    title,
    value,
}: {
    title: string;
    value: string | number;
}) {
    return (
        <Card
            className={cn(
                "rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-xl",
                "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:shadow-md"
            )}
        >
            <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600 font-medium">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent>
                <p className="text-3xl font-semibold text-gray-900">{value}</p>
            </CardContent>
        </Card>
    );
}

export default function Overview({ campaignId }: { campaignId: number }) {
    const { data, isLoading } = trpc.campaign.getCampaignOverview.useQuery(
        { campaignId },
        { staleTime: 30_000 }
    );

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="h-28 rounded-3xl bg-gray-200/50 backdrop-blur-xl"
                    />
                ))}
            </div>
        );
    }

    if (!data) return <div>No data found.</div>;

    const overview = data.data;
    const campaign = overview.campaign;

    return (
        <div className="space-y-6">

            {/* TOP STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Clicks" value={overview.clicks} />
                <StatCard title="Total Sales" value={overview.sales} />
                <StatCard
                    title="Conversion Rate"
                    value={`${overview.conversionPercentage}%`}
                />

                <StatCard title="Revenue Generated" value={overview.revenue} />
                <StatCard title="Active Creators" value={overview.creators} />
                <StatCard title="Products Attached" value={overview.products} />
            </div>

            {/* MAIN TWO CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* LEFT: Campaign Details */}
                <Card
                    className={cn(
                        "rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-xl",
                        "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
                    )}
                >
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            Campaign Details
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="text-sm space-y-4 text-gray-700">

                        <Detail label="Name" value={campaign.name} />

                        <Detail
                            label="Redirect URL"
                            value={
                                <a href={campaign.redirectUrl} target="_blank" className="underline">
                                    {campaign.redirectUrl}
                                </a>
                            }
                        />

                        <Detail label="Payout Model" value={campaign.payoutModel} />

                        <Detail
                            label="Commission Structure"
                            value={
                                (() => {
                                    const cpsText =
                                        (campaign.payoutModel === "CPS" ||
                                            campaign.payoutModel === "BOTH")
                                            ? campaign.cpsCommissionType === "PERCENTAGE"
                                                ? `${campaign.cpsValue}% CPS`
                                                : `₹${campaign.cpsValue} CPS`
                                            : null;

                                    const cpcText =
                                        (campaign.payoutModel === "CPC" ||
                                            campaign.payoutModel === "BOTH")
                                            ? `₹${campaign.cpcValue} CPC`
                                            : null;

                                    if (cpsText && cpcText) return `${cpsText} • ${cpcText}`;
                                    if (cpsText) return cpsText;
                                    if (cpcText) return cpcText;

                                    return "--";
                                })()
                            }
                        />

                    </CardContent>
                </Card>

                {/* RIGHT: Timeline */}
                <Card
                    className={cn(
                        "rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-xl",
                        "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
                    )}
                >
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            Timeline
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="text-sm space-y-4 text-gray-700">

                        <Detail
                            label="Created"
                            value={new Date(campaign.createdAt).toLocaleDateString()}
                        />

                        <Detail
                            label="Started"
                            value={
                                campaign.startedAt
                                    ? new Date(campaign.startedAt).toLocaleDateString()
                                    : "Not started"
                            }
                        />

                        <Detail
                            label="Completed"
                            value={
                                campaign.completedAt
                                    ? new Date(campaign.completedAt).toLocaleDateString()
                                    : "Not completed"
                            }
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function Detail({ label, value }: { label: string; value: any }) {
    return (
        <div className="space-y-1">
            <p className="font-semibold text-gray-800">{label}</p>
            <p className="text-gray-600">{value}</p>
        </div>
    );
}
