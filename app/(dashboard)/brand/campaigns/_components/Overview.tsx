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
  Play,
  CheckCircle,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { trpc } from "@/app/_trpc/trpc";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
        "shadow-[0_4px_18px_-4px_rgba(0,0,0,0.08)] hover:shadow-xl transition-all duration-200",
        "p-4"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
          {title}
        </p>
        <Icon className="h-5 w-5 text-gray-700" />
      </div>

      <p className="text-3xl font-semibold text-gray-900 leading-snug">
        {value}
      </p>
    </Card>
  );
}

export default function Overview({ campaignId }: { campaignId: number }) {
  const { data, isLoading, refetch } = trpc.campaign.getCampaignOverview.useQuery(
    { campaignId },
    { staleTime: 1000 * 30 }
  );

  const startCampaign = trpc.campaign.startCampaign.useMutation({
    onSuccess: (res) => {
      toast.success(res.message);
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const completeCampaign = trpc.campaign.completeCampaign.useMutation({
    onSuccess: (res) => {
      toast.success(res.message);
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data found.</div>;

  const overview = data.data;
  const campaign = overview.campaign;

  return (
    <div className="space-y-8">
      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard title="Total Clicks" value={overview.clicks} icon={BarChart3} />
        <StatCard title="Total Sales" value={overview.sales} icon={ShoppingCart} />
        <StatCard
          title="Conversion Rate"
          value={`${overview.conversionPercentage}%`}
          icon={Percent}
        />
        <StatCard title="Revenue" value={overview.revenue} icon={IndianRupee} />
        <StatCard title="Active Creators" value={overview.creators} icon={Users} />
        <StatCard
          title="Products Attached"
          value={overview.products}
          icon={Package}
        />
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campaign Details */}
        <Card
          className={cn(
            "rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-xl",
            "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Campaign Details
            </CardTitle>
            <Megaphone className="h-5 w-5 text-gray-800" />
          </CardHeader>

          <CardContent className="text-sm space-y-5 text-gray-700">
            <Detail label="Name" value={campaign.name} />

            <Detail
              label="Redirect URL"
              value={
                <a
                  href={campaign.redirectUrl}
                  target="_blank"
                  className="underline text-blue-600"
                >
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
            "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Timeline
            </CardTitle>
            <CalendarDays className="h-5 w-5 text-gray-800" />
          </CardHeader>

          <CardContent className="text-sm space-y-5 text-gray-700">
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

            {/* ACTION BUTTONS */}
            <div className="pt-4 flex gap-3">
              <Button
                onClick={() => startCampaign.mutate({ campaignId })}
                disabled={Boolean(campaign.startedAt)}
                className={cn("px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2")}
              >
                {startCampaign.isPending ? (
                  "Starting..."
                ) : (
                  <>
                    <Play size={16} />
                    Start Campaign
                  </>
                )}
              </Button>

              {campaign.startedAt && (
                <Button
                  onClick={() => completeCampaign.mutate({ campaignId })}
                  disabled={Boolean(campaign.completedAt)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"
                  )}
                >
                  {completeCampaign.isPending ? (
                    "Completing..."
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Complete Campaign
                    </>
                  )}
                </Button>
              )}

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div className="space-y-1 pb-3 border-b last:border-none">
      <p className="font-semibold text-gray-800">{label}</p>
      <p className="text-gray-600">{value}</p>
    </div>
  );
}
