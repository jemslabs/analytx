"use client";

import { useState } from "react";
import { trpc } from "@/app/_trpc/trpc";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";

import {
  BarChart3,
  ShoppingCart,
  Percent,
  IndianRupee,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Metric = "clicks" | "sales";

export default function Overview({
  campaignMemberId,
}: {
  campaignMemberId: number;
}) {
  const [metric, setMetric] = useState<Metric>("clicks");

  const { data, isLoading } =
    trpc.campaign.getCreatorCampaignAnalytics.useQuery(
      { campaignMemberId },
      { staleTime: 1000 * 30 }
    );

  const analytics = data?.data;

  /* ---------------- LOADING ---------------- */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(5)].map((_, i) => (
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

  if (!analytics) return <div>No analytics available.</div>;

  return (
    <div className="space-y-8">
      {/* GLOBAL KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Total Clicks"
          value={analytics.clicks}
          icon={BarChart3}
        />
        <StatCard
          title="Total Sales"
          value={analytics.sales}
          icon={ShoppingCart}
        />
        <StatCard
          title="Revenue"
          value={`₹${analytics.revenue.toLocaleString()}`}
          icon={IndianRupee}
        />
        <StatCard
          title="Conversion Rate"
          value={`${analytics.conversionRate.toFixed(1)}%`}
          icon={Percent}
        />
        <StatCard
          title="Estimated Payout"
          value={`₹${analytics.payout.toFixed(0)}`}
          icon={IndianRupee}
        />
      </div>

      {/* PLATFORM PERFORMANCE */}
      <Card className="p-4 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Platform Performance</h3>

          {/* FILTER */}
          <div className="flex gap-1 bg-gray-100 rounded-full p-1">
            <Button
              size="sm"
              variant={metric === "clicks" ? "default" : "ghost"}
              onClick={() => setMetric("clicks")}
            >
              Clicks
            </Button>
            <Button
              size="sm"
              variant={metric === "sales" ? "default" : "ghost"}
              onClick={() => setMetric("sales")}
            >
              Sales
            </Button>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.platformPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey={metric}
                name={metric === "clicks" ? "Clicks" : "Sales"}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
