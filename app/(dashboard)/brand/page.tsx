"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/app/_trpc/trpc";
import StatCard from "@/components/StatCard";

import {
    BarChart3,
    ShoppingCart,
    IndianRupee,
    Package,
    Megaphone,
} from "lucide-react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

type CampaignMetric = "revenue" | "sales" | "clicks";
type CampaignStat = {
    name: string;
    revenue: number;
    sales: number;
    clicks: number;
};

export default function BrandDashboard() {
    const query = trpc.profile.getBrandOverview.useQuery(undefined, {
        staleTime: 1000 * 30,
    });

    const [metric, setMetric] = useState<CampaignMetric>("revenue");
    const [range, setRange] = useState<"7D" | "30D">("7D");

    const isLoading = query.isLoading;
    const overview = query.data?.data;

    const campaignData = useMemo<CampaignStat[]>(() => {
        if (!overview) return [];
        return overview.topCampaigns[metric] as CampaignStat[];
    }, [overview, metric]);
    const sortedCampaigns = useMemo(() => {
        return [...campaignData].sort(
            (a, b) => b[metric] - a[metric]
        );
    }, [campaignData, metric]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="p-4 rounded-3xl">
                            <Skeleton className="h-4 w-24 mb-3" />
                            <Skeleton className="h-7 w-16" />
                        </Card>
                    ))}
                </div>
                <Card className="p-4 rounded-3xl">
                    <Skeleton className="h-64 w-full" />
                </Card>
            </div>
        );
    }

    if (!overview) return <div>No data found.</div>;

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-semibold">Overview</h1>
                <p className="text-sm text-gray-500">
                    Your brand performance at a glance.
                </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <StatCard
                    title="Total Campaigns"
                    value={overview.totalCampaigns}
                    icon={Megaphone}
                />
                <StatCard
                    title="Active Campaigns"
                    value={overview.activeCampaigns}
                    icon={Megaphone}
                />
                <StatCard
                    title="Products"
                    value={overview.totalProducts}
                    icon={Package}
                />
                <StatCard
                    title="Total Clicks"
                    value={overview.clicks}
                    icon={BarChart3}
                />
                <StatCard
                    title="Total Sales"
                    value={overview.sales}
                    icon={ShoppingCart}
                />
                <StatCard
                    title="Revenue"
                    value={`₹${overview.revenue.toLocaleString()}`}
                    icon={IndianRupee}
                />
            </div>

            {/* TOP CAMPAIGNS */}
            <Card className="p-4 rounded-3xl">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Top Campaigns</h3>
                    <div className="flex gap-1 bg-gray-100 rounded-full p-1">
                        <Button
                            size="sm"
                            variant={metric === "revenue" ? "default" : "ghost"}
                            onClick={() => setMetric("revenue")}
                        >
                            Revenue
                        </Button>
                        <Button
                            size="sm"
                            variant={metric === "sales" ? "default" : "ghost"}
                            onClick={() => setMetric("sales")}
                        >
                            Sales
                        </Button>
                        <Button
                            size="sm"
                            variant={metric === "clicks" ? "default" : "ghost"}
                            onClick={() => setMetric("clicks")}
                        >
                            Clicks
                        </Button>
                    </div>
                </div>

                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={sortedCampaigns}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey={metric} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
