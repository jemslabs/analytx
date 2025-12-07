"use client";

import {
  BarChart3,
  ShoppingCart,
  Percent,
  IndianRupee,
  Users,
  Package,
  CalendarDays,
  Megaphone,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { trpc } from "@/app/_trpc/trpc";
import { cn } from "@/lib/utils";

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: any;
}) {
  return (
    <Card
      className={cn(
        "rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-xl",
        "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all"
      )}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm text-gray-600 font-medium">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-gray-700" />
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
      <div>
        Loading...
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
        <StatCard title="Total Clicks" value={overview.clicks} icon={BarChart3} />
        <StatCard title="Total Sales" value={overview.sales} icon={ShoppingCart} />
        <StatCard
          title="Conversion Rate"
          value={`${overview.conversionPercentage}%`}
          icon={Percent}
        />
        <StatCard title="Revenue" value={overview.revenue} icon={IndianRupee} />
        <StatCard title="Active Creators" value={overview.creators} icon={Users} />
        <StatCard title="Products Attached" value={overview.products} icon={Package} />
      </div>

      {/* MAIN TWO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campaign Details */}
        <Card
          className={cn(
            "rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-xl",
            "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Campaign Details
            </CardTitle>
            <Megaphone className="h-5 w-5 text-gray-800" />
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
              value={(() => {
                const cps =
                  (campaign.payoutModel === "CPS" ||
                    campaign.payoutModel === "BOTH") &&
                  (campaign.cpsCommissionType === "PERCENTAGE"
                    ? `${campaign.cpsValue}% CPS`
                    : `₹${campaign.cpsValue} CPS`);

                const cpc =
                  (campaign.payoutModel === "CPC" ||
                    campaign.payoutModel === "BOTH") &&
                  `₹${campaign.cpcValue} CPC`;

                return cps && cpc ? `${cps} • ${cpc}` : cps || cpc || "--";
              })()}
            />
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card
          className={cn(
            "rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-xl",
            "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Timeline
            </CardTitle>
            <CalendarDays className="h-5 w-5 text-gray-800" />
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
