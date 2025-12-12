"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/app/_trpc/trpc";
import {
  SalesOverTimeItem,
  ClicksOverTimeItem,
  OverviewShape,
} from "@/lib/types";

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
  const arr = Array.from(map.entries()).map(([date, sales]) => ({
    date,
    sales,
  }));
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

  const [platformMetric, setPlatformMetric] = useState<"clicks" | "sales">(
    "clicks"
  );

  const [range, setRange] = useState<"7D" | "30D">("7D");

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
    const s = new Set<string>();
    salesByDay.forEach((a) => s.add(a.date));
    clicksByDay.forEach((a) => s.add(a.date));
    return Array.from(s).sort();
  }, [salesByDay, clicksByDay]);

  const combinedSeries = useMemo(
    () =>
      unifiedDates.map((d) => ({
        date: d,
        sales: salesByDay.find((x) => x.date === d)?.sales ?? 0,
        clicks: clicksByDay.find((x) => x.date === d)?.clicks ?? 0,
      })),
    [unifiedDates, salesByDay, clicksByDay]
  );
  const filteredSeries = useMemo(() => {
    const days = range === "7D" ? 7 : 30;
    return combinedSeries.slice(-days); // takes the last N days
  }, [range, combinedSeries]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="rounded-3xl p-4 border">
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

  const creators = overview.topCreators;
  const products = overview.topProducts;
  const topPlatforms = overview.topPlatforms;

  const activePlatformData =
    platformMetric === "clicks" ? topPlatforms.clicks : topPlatforms.sales;

  return (
    <div className="space-y-8">
      {/* TOP STATS */}
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
<Card className="p-4 rounded-3xl">
  {/* Header with filter */}
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold text-gray-900">Sales and Clicks Overtime</h3>
    <div className="flex gap-2">
      <Button
        size="sm"
        variant={range === "7D" ? "default" : "ghost"}
        onClick={() => setRange("7D")}
      >
        7D
      </Button>
      <Button
        size="sm"
        variant={range === "30D" ? "default" : "ghost"}
        onClick={() => setRange("30D")}
      >
        30D
      </Button>
    </div>
  </div>

  {/* Chart wrapper with dynamic but bounded height */}
  <div
    className="w-full"
    style={{
      minHeight: 300,  // chart is visible even for small data
      maxHeight: 500,  // prevents chart from being too tall
      height: Math.min(500, 50 + (Math.max(...filteredSeries.map(d => Math.max(d.sales, d.clicks))) * 5)), // dynamic based on max value
    }}
  >
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={filteredSeries}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#111827" tick={{ fill: "#111827" }} />
        <YAxis
          stroke="#111827"
          tick={{ fill: "#111827" }}
          domain={[0, (dataMax: number) => Math.max(20, dataMax + 5)]}
        />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#4f46e5"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="clicks"
          stroke="#16a34a"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</Card>


      {/* TOP CREATORS + TOP PRODUCTS + TOP PLATFORMS */}
      <div className="space-y-5">
        {/* CREATORS */}
        <Card className="p-4 rounded-3xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Top Creators</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-gray-500 text-sm">Metric:</span>
              <div className="flex gap-1 bg-gray-100 rounded-full p-1">
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
          </div>

          <div className="h-60">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#111827" tick={{ fill: "#111827" }} />
                <YAxis stroke="#111827" tick={{ fill: "#111827" }} />
                <Tooltip />
                <Bar dataKey={creatorsMetric} fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* PRODUCTS */}
        <Card className="p-4 rounded-3xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Top Products</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-gray-500 text-sm">Metric:</span>
              <div className="flex gap-1 bg-gray-100 rounded-full p-1">
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
          </div>

          <div className="h-60">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#111827" tick={{ fill: "#111827" }} />
                <YAxis stroke="#111827" tick={{ fill: "#111827" }} />
                <Tooltip />
                <Bar dataKey={productsMetric} fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* PLATFORMS */}
        <Card className="p-4 rounded-3xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Top Platforms</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-gray-500 text-sm">Metric:</span>
              <div className="flex gap-1 bg-gray-100 rounded-full p-1">
                <Button
                  size="sm"
                  variant={platformMetric === "clicks" ? "default" : "ghost"}
                  onClick={() => setPlatformMetric("clicks")}
                >
                  Clicks
                </Button>
                <Button
                  size="sm"
                  variant={platformMetric === "sales" ? "default" : "ghost"}
                  onClick={() => setPlatformMetric("sales")}
                >
                  Sales
                </Button>
              </div>
            </div>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activePlatformData.map((p) => ({
                  name: p.platform,
                  clicks: "clicks" in p ? p.clicks : 0,
                  sales: "sales" in p ? p.sales : 0,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#111827" tick={{ fill: "#111827" }} />
                <YAxis stroke="#111827" tick={{ fill: "#111827" }} />
                <Tooltip />
                <Bar dataKey={platformMetric} fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

    </div>
  );
}
