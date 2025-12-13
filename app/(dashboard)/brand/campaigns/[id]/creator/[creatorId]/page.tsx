"use client";

import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/trpc";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/components/StatCard";

import {
  BarChart3,
  ShoppingCart,
  Percent,
  IndianRupee,
  ArrowLeft,
} from "lucide-react";

export default function CreatorAnalytics() {
  const router = useRouter();
  const { creatorId } = useParams();
  const campaignMemberId = Number(creatorId);

  const { data, isLoading } =
    trpc.campaign.getCreatorAnalytics.useQuery(
      { campaignMemberId },
      { staleTime: 1000 * 30 }
    );

  /* ---------------- loading ---------------- */
  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-5 rounded-3xl">
              <Skeleton className="h-5 w-24 mb-3" />
              <Skeleton className="h-8 w-28" />
            </Card>
          ))}
        </div>

        <Card className="p-6 rounded-3xl">
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-16 w-full" />
        </Card>
      </div>
    );
  }

  if (!data?.data) return <div>No analytics found.</div>;

  const analytics = data.data;

  /* ---------------- derived ---------------- */
  const platforms = Array.from(
    new Set([
      ...analytics.topPlatforms.clicks.map((p) => p.platform),
      ...analytics.topPlatforms.sales.map((p) => p.platform),
    ])
  ).map((platform) => ({
    platform,
    clicks:
      analytics.topPlatforms.clicks.find((p) => p.platform === platform)
        ?.clicks ?? 0,
    sales:
      analytics.topPlatforms.sales.find((p) => p.platform === platform)
        ?.sales ?? 0,
  }));

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="space-y-4">
        <Button
          type="button"
          variant="ghost"
          className="p-0 flex items-center gap-1 text-gray-600"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Campaign
        </Button>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Creator Performance
          </h2>
          <p className="text-sm text-muted-foreground">
            Revenue, engagement and payout overview
          </p>
        </div>
      </div>

      {/* PRIMARY KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenue"
          value={`₹${analytics.revenue.toLocaleString()}`}
          icon={IndianRupee}
        />

        <StatCard
          title="Creator Payout"
          value={`₹${analytics.payout.toLocaleString()}`}
          icon={IndianRupee}
        />

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
      </div>

      {/* SECONDARY KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Conversion Rate"
          value={`${analytics.conversionRate.toFixed(1)}%`}
          icon={Percent}
        />

        <StatCard
          title="Products Sold"
          value={analytics.topProducts.length}
          icon={ShoppingCart}
        />

        <StatCard
          title="Active Platforms"
          value={platforms.length}
          icon={BarChart3}
        />
      </div>

      {/* PRODUCT PERFORMANCE */}
      <Card className="p-6 bg-transparent border-none shadow-none">
        <h3 className="font-semibold text-xl">Product Performance</h3>
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full divide-y divide-gray-200 border-collapse">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics.topProducts.map((p, i) => (
                <tr
                  key={p.productId}
                  className={`border-b hover:bg-gray-50 transition ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-3 font-medium">{p.name}</td>
                  <td className="px-6 py-3 text-right tabular-nums">{p.sales}</td>
                  <td className="px-6 py-3 text-right tabular-nums font-semibold">
                    ₹{p.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
              {analytics.topProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No product sales yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* PLATFORM CONTRIBUTION */}
      <Card className="p-6 bg-transparent border-none shadow-none">
        <h3 className="font-semibold text-xl">Platform Contribution</h3>

        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full divide-y divide-gray-200 border-collapse">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Conversion Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {platforms.map(({ platform, clicks, sales }, i) => (
                <tr
                  key={platform}
                  className={`border-b hover:bg-gray-50 transition ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-3 font-medium capitalize">{platform}</td>
                  <td className="px-6 py-3 text-right tabular-nums">{clicks}</td>
                  <td className="px-6 py-3 text-right tabular-nums">{sales}</td>
                  <td className="px-6 py-3 text-right tabular-nums font-semibold">
                    {clicks > 0 ? ((sales / clicks) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
              {platforms.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-muted-foreground"
                  >
                    No platform data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
