"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/app/_trpc/trpc";
import {SalesOverTimeItem, ClicksOverTimeItem, OverviewShape} from '@/lib/types'

import {
  BarChart3,
  ShoppingCart,
  Percent,
  IndianRupee,
  Users,
  Package,
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import StatCard from "@/components/StatCard";





function formatDateIsoToDay(iso: string) {
  const d = new Date(iso);
  return d.toISOString().slice(0, 10);
}

function groupSalesByDay(salesOverTime: SalesOverTimeItem[]) {
  const map = new Map<string, number>();
  salesOverTime.forEach((s) => {
    const day = formatDateIsoToDay(s.purchasedAt);
    const count = s._count?.id ?? 0;
    map.set(day, (map.get(day) ?? 0) + count);
  });
  const arr = Array.from(map.entries()).map(([date, sales]) => ({ date, sales }));
  arr.sort((a, b) => a.date.localeCompare(b.date));
  return arr;
}

function normalizeClicksOverTime(clicksOverTime: ClicksOverTimeItem[]) {
  const arr = clicksOverTime.map((c) => ({
    date: formatDateIsoToDay(c.date),
    clicks: c._sum?.count ?? 0,
  }));
  arr.sort((a, b) => a.date.localeCompare(b.date));
  return arr;
}

export default function CampaignOverviewAnalytics({
  campaignId,
}: {
  campaignId: number;
}) {
  const query = trpc.campaign.getCampaignOverview.useQuery(
    { campaignId },
    { staleTime: 1000 * 30 }
  );

  const [creatorsMetric, setCreatorsMetric] = useState<
    "revenue" | "clicks" | "sales"
  >("revenue");
  const [productsMetric, setProductsMetric] = useState<"sales" | "revenue">(
    "sales"
  );

  const isLoading = query.isLoading;
  const overview = query.data?.data as OverviewShape | undefined;

  const salesByDay = useMemo(() => {
    if (!overview) return [] as { date: string; sales: number }[];
    return groupSalesByDay(overview.salesOverTime || []);
  }, [overview]);

  const clicksByDay = useMemo(() => {
    if (!overview) return [] as { date: string; clicks: number }[];
    return normalizeClicksOverTime(overview.clicksOverTime || []);
  }, [overview]);

  const unifiedDates = useMemo(() => {
    if (!overview) return [] as string[];
    const set = new Set<string>();
    salesByDay.forEach((s) => set.add(s.date));
    clicksByDay.forEach((c) => set.add(c.date));
    return Array.from(set).sort();
  }, [salesByDay, clicksByDay]);

  const combinedSeries = useMemo(
    () =>
      unifiedDates.map((date) => ({
        date,
        sales: salesByDay.find((s) => s.date === date)?.sales ?? 0,
        clicks: clicksByDay.find((c) => c.date === date)?.clicks ?? 0,
      })),
    [unifiedDates, salesByDay, clicksByDay]
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="rounded-3xl p-4 border border-gray-200 bg-white/70 backdrop-blur"
            >
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-7 w-16" />
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-4 rounded-3xl">
            <Skeleton className="h-48 w-full" />
          </Card>
          <Card className="p-4 rounded-3xl">
            <Skeleton className="h-48 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (!overview) return <div>No data found.</div>;

  const creators = overview.topCreators || [];
  const products = overview.topProducts || [];

  return (
    <div className="space-y-8">
      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard title="Total Clicks" value={overview.clicks} icon={BarChart3} />
        <StatCard title="Total Sales" value={overview.sales} icon={ShoppingCart} />
        <StatCard
          title="Conversion Rate"
          value={`${overview.conversionPercentage.toFixed(1)}%`}
          icon={Percent}
        />
        <StatCard
          title="Revenue"
          value={`₹${overview.revenue.toLocaleString()}`}
          icon={IndianRupee}
        />
        <StatCard title="Active Creators" value={overview.creators} icon={Users} />
        <StatCard title="Products Attached" value={overview.products} icon={Package} />
      </div>

      {/* SALES + CLICKS CHART */}
      <div className="gap-5">
        <Card className="p-4 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Sales & Clicks Over Time</h3>
            <div className="text-sm text-gray-500">
              Showing {combinedSeries.length} points
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combinedSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  name="Sales"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  name="Clicks"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* TOP CREATORS + TOP PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* TOP CREATORS */}
        <Card className="p-4 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top Creators</h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={creatorsMetric === "revenue" ? "default" : "ghost"}
                onClick={() => setCreatorsMetric("revenue")}
              >
                Revenue
              </Button>
              <Button
                size="sm"
                variant={creatorsMetric === "clicks" ? "default" : "ghost"}
                onClick={() => setCreatorsMetric("clicks")}
              >
                Clicks
              </Button>
              <Button
                size="sm"
                variant={creatorsMetric === "sales" ? "default" : "ghost"}
                onClick={() => setCreatorsMetric("sales")}
              >
                Sales
              </Button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={creators
                  .map((c) => ({
                    name: c.name,
                    revenue: c.revenue,
                    clicks: c.clicks,
                    sales: c.sales,
                  }))
                  .sort((a, b) => b[creatorsMetric] - a[creatorsMetric])}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={creatorsMetric} fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-4">
            {creators.map((c) => (
              <div key={c.creatorId} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-sm text-gray-600">
                    {c.sales} sales • {c.clicks} clicks
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{Number(c.revenue).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* TOP PRODUCTS */}
        <Card className="p-4 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top Products</h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={productsMetric === "sales" ? "default" : "ghost"}
                onClick={() => setProductsMetric("sales")}
              >
                Sales
              </Button>
              <Button
                size="sm"
                variant={productsMetric === "revenue" ? "default" : "ghost"}
                onClick={() => setProductsMetric("revenue")}
              >
                Revenue
              </Button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={products
                  .map((p) => ({
                    name: p.name,
                    sales: p.sales,
                    revenue: p.revenue,
                  }))
                  .sort((a, b) => b[productsMetric] - a[productsMetric])}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={productsMetric} fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-4">
            {products.map((p) => (
              <div key={p.productId} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-600">Sales: {p.sales}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {productsMetric === "revenue"
                      ? `₹${Number(p.revenue).toLocaleString()}`
                      : `Sales: ${p.sales}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
